import { describe, expect, it } from 'vitest';
import { AudioManager, type AudioLike } from '../../src/audio/AudioManager';
import { ambientTrack, audioRegistry } from '../../src/audio/audioRegistry';

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
  it('registra exatamente os 25 cues canônicos e o ambiente separado', () => {
    expect(Object.keys(audioRegistry)).toHaveLength(25);
    const files = [...Object.values(audioRegistry), ambientTrack];
    expect(files).toHaveLength(26);
    expect(new Set(files).size).toBe(26);
    expect(files).not.toContain('22_deolane_leitmotif.old.mp3');
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
    const cue = created[1]!;
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
    }, transitionMs: 0 });
    await manager.unlock();
    manager.request('HOT_TRAIL');
    await Promise.resolve();
    const hot = created[1]!;
    manager.request('COLD_TRAIL');
    await Promise.resolve();
    expect(hot.paused).toBe(true);
    expect(manager.snapshot.currentCue).toBe('COLD_TRAIL');
    expect(created[0]!.paused).toBe(true);
  });
});
