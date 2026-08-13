import { describe, expect, it } from 'vitest';
import { AudioManager, type AudioLike } from '../../src/audio/AudioManager';
import { ambientTrack, audioRegistry, publisherStingUrl, uiSoundRegistry } from '../../src/audio/audioRegistry';

class FakeAudio implements AudioLike {
  currentTime = 0;
  loop = false;
  volume = 1;
  paused = true;
  preload = '';
  plays = 0;
  private ended = new Set<() => void>();

  constructor(public src: string) {}
  async play(): Promise<void> { this.paused = false; this.plays += 1; }
  pause(): void { this.paused = true; }
  addEventListener(_type: 'ended', listener: () => void): void { this.ended.add(listener); }
  removeEventListener(_type: 'ended', listener: () => void): void { this.ended.delete(listener); }
  finish(): void { for (const listener of this.ended) listener(); }
}

describe('trilha sonora', () => {
  it('registra o sting de abertura fora dos 26 cues musicais', () => {
    expect(publisherStingUrl).toContain('/audio/sfx/mreaggle_software_sting.mp3');
    expect(Object.values(audioRegistry)).not.toContain('mreaggle_software_sting.mp3');
  });

  it('registra exatamente os 26 cues canônicos e o ambiente separado', () => {
    expect(Object.keys(audioRegistry)).toHaveLength(26);
    const files = [...Object.values(audioRegistry), ambientTrack];
    expect(files).toHaveLength(27);
    expect(new Set(files).size).toBe(27);
    expect(files).not.toContain('22_deolane_leitmotif.old.mp3');
    expect(audioRegistry.DOSSIERS).toBe('27_dossiers.mp3');
  });

  it('autoriza o tema após o sting sem iniciar ambiente durante a vinheta', async () => {
    const created: FakeAudio[] = [];
    const manager = new AudioManager({ createAudio: (src) => {
      const audio = new FakeAudio(src);
      created.push(audio);
      return audio;
    } });
    const ambient = created[0]!;

    manager.unlockWithoutPlayback();
    expect(manager.snapshot.unlocked).toBe(true);
    expect(ambient.paused).toBe(true);

    manager.request('TITLE_THEME');
    await Promise.resolve();

    const title = created.find((audio) => audio.src.endsWith('/1_title_theme.mp3'))!;
    expect(title.plays).toBe(1);
    expect(manager.snapshot.currentCue).toBe('TITLE_THEME');
    expect(ambient.paused).toBe(true);
  });

  it('pausa o ambiente durante um cue e o retoma do mesmo ponto no término', async () => {
    const created: FakeAudio[] = [];
    const manager = new AudioManager({ createAudio: (src) => {
      const audio = new FakeAudio(src);
      created.push(audio);
      return audio;
    }, transitionMs: 0 });
    const ambient = created[0]!;
    ambient.currentTime = 37;
    manager.request('NEWS_FLASH');
    await manager.unlock();
    expect(ambient.paused).toBe(true);
    expect(manager.snapshot.currentCue).toBe('NEWS_FLASH');
    const cue = created.find((audio) => audio.src.endsWith('/5_news_flash.mp3'))!;
    expect(cue.paused).toBe(false);
    cue.finish();
    await Promise.resolve();
    expect(ambient.currentTime).toBe(37);
    expect(ambient.paused).toBe(false);
    expect(manager.snapshot.ambientPlaying).toBe(true);
  });

  it('substitui cues sem fila nem sobreposição', async () => {
    const created: FakeAudio[] = [];
    const manager = new AudioManager({ createAudio: (src) => {
      const audio = new FakeAudio(src);
      created.push(audio);
      return audio;
    } });
    await manager.unlock();
    manager.request('HOT_TRAIL');
    await Promise.resolve();
    const hot = created.find((audio) => audio.src.endsWith('/8_hot_trail.mp3'))!;
    manager.request('COLD_TRAIL');
    expect(hot.paused).toBe(true);
    expect(manager.snapshot.currentCue).toBe('COLD_TRAIL');
    expect(created[0]!.paused).toBe(true);
  });

  it('mantém o tema da tela inicial em loop somente até ela ser encerrada', async () => {
    const created: FakeAudio[] = [];
    const manager = new AudioManager({ createAudio: (src) => {
      const audio = new FakeAudio(src);
      created.push(audio);
      return audio;
    } });
    manager.request('TITLE_THEME');
    await manager.unlock();
    const title = created.find((audio) => audio.src.endsWith('/1_title_theme.mp3'))!;

    expect(title.loop).toBe(true);
    expect(title.paused).toBe(false);

    manager.stop('TITLE_THEME');
    await Promise.resolve();

    expect(title.paused).toBe(true);
    expect(manager.snapshot.currentCue).toBeUndefined();
  });

  it('toca a máquina de escrever sobre o cue atual sem interrompê-lo', async () => {
    const created: FakeAudio[] = [];
    const manager = new AudioManager({ createAudio: (src) => {
      const audio = new FakeAudio(src);
      created.push(audio);
      return audio;
    } });
    await manager.unlock();
    manager.request('DETECTIVE_UNKNOWN');
    await Promise.resolve();
    const cue = created.find((audio) => audio.src.endsWith('/4_detective_unknown.mp3'))!;

    manager.playUiSound('TYPEWRITER');
    const typewriter = created.find((audio) => audio.src.endsWith(`/${uiSoundRegistry.TYPEWRITER}`))!;

    expect(typewriter.src).toContain(`/audio/sfx/${uiSoundRegistry.TYPEWRITER}`);
    expect(typewriter.paused).toBe(false);
    expect(cue.paused).toBe(false);
    expect(manager.snapshot.currentCue).toBe('DETECTIVE_UNKNOWN');
  });

  it('pré-carrega e toca o clique sem interromper o typewriter ou o cue', async () => {
    const created: FakeAudio[] = [];
    const manager = new AudioManager({ createAudio: (src) => {
      const audio = new FakeAudio(src);
      created.push(audio);
      return audio;
    } });
    const typewriter = created.find((audio) => audio.src.endsWith(`/${uiSoundRegistry.TYPEWRITER}`))!;
    const click = created.find((audio) => audio.src.endsWith(`/${uiSoundRegistry.MOUSE_CLICK}`))!;
    await manager.unlock();
    manager.request('HEADQUARTERS_AGENCY');
    await Promise.resolve();
    const cue = created.find((audio) => audio.src.endsWith('/2_headquarters_agency.mp3'))!;

    manager.playUiSound('TYPEWRITER');
    manager.playUiSound('MOUSE_CLICK');

    expect(typewriter.plays).toBe(1);
    expect(click.plays).toBe(1);
    expect(typewriter.paused).toBe(false);
    expect(cue.paused).toBe(false);
  });

  it('registra o tick horário como SFX e permite apresentá-lo sequencialmente', async () => {
    const created: FakeAudio[] = [];
    const manager = new AudioManager({ createAudio: (src) => {
      const audio = new FakeAudio(src);
      created.push(audio);
      return audio;
    } });
    await manager.unlock();
    const tick = created.find((audio) => audio.src.endsWith(`/${uiSoundRegistry.CLOCK_TICK}`))!;

    manager.playUiSound('CLOCK_TICK');
    manager.playUiSound('CLOCK_TICK');

    expect(tick.src).toContain('/audio/sfx/clock_tick.mp3');
    expect(tick.plays).toBe(2);
  });

  it('registra os passos como SFX sem interromper a música', async () => {
    const created: FakeAudio[] = [];
    const manager = new AudioManager({ createAudio: (src) => {
      const audio = new FakeAudio(src);
      created.push(audio);
      return audio;
    } });
    await manager.unlock();
    manager.request('HOT_TRAIL');
    await Promise.resolve();
    const cue = created.find((audio) => audio.src.endsWith('/8_hot_trail.mp3'))!;
    const footsteps = created.find((audio) => audio.src.endsWith(`/${uiSoundRegistry.FOOTSTEPS}`))!;

    manager.playUiSound('FOOTSTEPS');

    expect(footsteps.src).toContain('/audio/sfx/footsteps.mp3');
    expect(footsteps.plays).toBe(1);
    expect(cue.paused).toBe(false);
  });
});
