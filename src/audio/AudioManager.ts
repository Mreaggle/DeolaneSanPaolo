import { ambientTrack, audioRegistry, audioUrl, hardCutCues, type AudioCueId } from './audioRegistry';

const SETTINGS_KEY = 'deolane-san-paolo.audio';

export interface AudioSettings {
  enabled: boolean;
  volume: number;
}

export interface AudioSnapshot extends AudioSettings {
  unlocked: boolean;
  currentCue?: AudioCueId;
  ambientPlaying: boolean;
}

export interface AudioLike {
  src: string;
  currentTime: number;
  loop: boolean;
  volume: number;
  paused: boolean;
  preload: string;
  play(): Promise<void>;
  pause(): void;
  load?(): void;
  addEventListener(type: 'ended', listener: () => void): void;
  removeEventListener(type: 'ended', listener: () => void): void;
}

interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

interface ManagerOptions {
  createAudio?: (src: string) => AudioLike;
  storage?: StorageLike;
  transitionMs?: number;
}

const clampVolume = (value: number): number => Math.max(0, Math.min(1, value));

export class AudioManager {
  private readonly createAudio: (src: string) => AudioLike;
  private readonly storage: StorageLike | undefined;
  private readonly transitionMs: number;
  private readonly ambient: AudioLike;
  private current: { cue: AudioCueId; audio: AudioLike; ended: () => void } | undefined;
  private pendingCue: AudioCueId | undefined;
  private unlocked = false;
  private transitionToken = 0;
  private preloaded = new Map<AudioCueId, AudioLike>();
  private listeners = new Set<(snapshot: AudioSnapshot) => void>();
  private settings: AudioSettings;

  constructor(options: ManagerOptions = {}) {
    this.createAudio = options.createAudio ?? ((src) => new Audio(src) as unknown as AudioLike);
    this.storage = options.storage ?? (typeof localStorage === 'undefined' ? undefined : localStorage);
    this.transitionMs = options.transitionMs ?? 110;
    this.settings = this.loadSettings();
    this.ambient = this.createAudio(audioUrl(ambientTrack));
    this.ambient.loop = true;
    this.ambient.preload = 'auto';
    this.ambient.volume = this.settings.volume * 0.28;
  }

  get snapshot(): AudioSnapshot {
    const currentCue = this.current?.cue;
    return {
      ...this.settings,
      unlocked: this.unlocked,
      ...(currentCue ? { currentCue } : {}),
      ambientPlaying: this.unlocked && this.settings.enabled && !this.current && !this.ambient.paused
    };
  }

  subscribe(listener: (snapshot: AudioSnapshot) => void): () => void {
    this.listeners.add(listener);
    listener(this.snapshot);
    return () => this.listeners.delete(listener);
  }

  async unlock(): Promise<void> {
    if (this.unlocked) return;
    this.unlocked = true;
    if (this.settings.enabled) {
      if (this.pendingCue) await this.startCue(this.pendingCue);
      else await this.resumeAmbient();
    }
    this.emit();
  }

  request(cue: AudioCueId): void {
    this.pendingCue = cue;
    if (this.current?.cue === cue) return;
    if (!this.unlocked || !this.settings.enabled) {
      this.emit();
      return;
    }
    void this.startCue(cue);
  }

  preload(cues: readonly AudioCueId[]): void {
    for (const cue of cues) {
      if (this.preloaded.has(cue) || this.current?.cue === cue) continue;
      const audio = this.createAudio(audioUrl(audioRegistry[cue]));
      audio.preload = 'auto';
      audio.load?.();
      this.preloaded.set(cue, audio);
    }
  }

  setEnabled(enabled: boolean): void {
    if (this.settings.enabled === enabled) return;
    this.settings.enabled = enabled;
    this.persist();
    if (!enabled) {
      this.transitionToken += 1;
      this.current?.audio.pause();
      this.ambient.pause();
    } else if (this.unlocked) {
      if (this.current) void this.current.audio.play().catch(() => undefined);
      else if (this.pendingCue) void this.startCue(this.pendingCue);
      else void this.resumeAmbient();
    }
    this.emit();
  }

  setVolume(volume: number): void {
    this.settings.volume = clampVolume(volume);
    if (this.current) this.current.audio.volume = this.settings.volume;
    this.ambient.volume = this.settings.volume * 0.28;
    this.persist();
    this.emit();
  }

  dispose(): void {
    this.transitionToken += 1;
    this.stopCurrent();
    this.ambient.pause();
    for (const audio of this.preloaded.values()) audio.pause();
    this.preloaded.clear();
    this.listeners.clear();
  }

  private async startCue(cue: AudioCueId): Promise<void> {
    if (this.current?.cue === cue || !this.settings.enabled || !this.unlocked) return;
    const token = ++this.transitionToken;
    this.ambient.pause();
    const previous = this.current;
    if (previous) {
      previous.audio.removeEventListener('ended', previous.ended);
      if (!hardCutCues.has(cue) && this.transitionMs > 0) await this.fadeOut(previous.audio, token);
      previous.audio.pause();
      previous.audio.currentTime = 0;
      if (this.current === previous) this.current = undefined;
    }
    if (token !== this.transitionToken || !this.settings.enabled) return;
    const audio = this.preloaded.get(cue) ?? this.createAudio(audioUrl(audioRegistry[cue]));
    this.preloaded.delete(cue);
    audio.loop = false;
    audio.preload = 'auto';
    audio.volume = this.settings.volume;
    const ended = () => {
      if (this.current?.audio !== audio) return;
      audio.removeEventListener('ended', ended);
      this.current = undefined;
      this.pendingCue = undefined;
      void this.resumeAmbient();
      this.emit();
    };
    audio.addEventListener('ended', ended);
    this.current = { cue, audio, ended };
    this.emit();
    await audio.play().catch(() => undefined);
  }

  private async fadeOut(audio: AudioLike, token: number): Promise<void> {
    const start = audio.volume;
    const steps = 4;
    for (let step = 1; step <= steps; step += 1) {
      await new Promise((resolve) => setTimeout(resolve, this.transitionMs / steps));
      if (token !== this.transitionToken) return;
      audio.volume = Math.max(0, start * (1 - step / steps));
    }
  }

  private stopCurrent(): void {
    if (!this.current) return;
    this.current.audio.removeEventListener('ended', this.current.ended);
    this.current.audio.pause();
    this.current.audio.currentTime = 0;
    this.current = undefined;
  }

  private async resumeAmbient(): Promise<void> {
    if (!this.unlocked || !this.settings.enabled || this.current) return;
    this.ambient.volume = this.settings.volume * 0.28;
    await this.ambient.play().catch(() => undefined);
    this.emit();
  }

  private loadSettings(): AudioSettings {
    try {
      const parsed = JSON.parse(this.storage?.getItem(SETTINGS_KEY) ?? '') as Partial<AudioSettings>;
      return { enabled: parsed.enabled ?? true, volume: clampVolume(parsed.volume ?? 0.75) };
    } catch {
      return { enabled: true, volume: 0.75 };
    }
  }

  private persist(): void {
    this.storage?.setItem(SETTINGS_KEY, JSON.stringify(this.settings));
  }

  private emit(): void {
    const snapshot = this.snapshot;
    for (const listener of this.listeners) listener(snapshot);
  }
}
