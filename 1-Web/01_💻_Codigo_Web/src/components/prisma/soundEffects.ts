// Web Audio API Procedural Sound Engine
// Zero external files, zero latency, ultra-lightweight luxury cinematic feedback

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = true; // muted by default until user activates
  private ambientOsc1: OscillatorNode | null = null;
  private ambientOsc2: OscillatorNode | null = null;
  private ambientGain: GainNode | null = null;
  private isAmbientPlaying: boolean = false;

  private initContext() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted && this.isAmbientPlaying) {
      this.stopAmbientSoundscape();
    }
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public getIsAmbientPlaying(): boolean {
    return this.isAmbientPlaying;
  }

  // Silky-soft mechanical micro-click (50ms)
  public playClick() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(1400, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.045);
    } catch {
      // AudioContext policy fallback
    }
  }

  // Ultra-subtle hover blip (15ms, almost imperceptible haptic feel)
  public playHover() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(820, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(620, this.ctx.currentTime + 0.02);

      gain.gain.setValueAtTime(0.015, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.02);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.025);
    } catch {
      // AudioContext policy fallback
    }
  }

  // Deep low-frequency cinematic swoosh for tab switches
  public playSwoosh() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(120, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(45, this.ctx.currentTime + 0.15);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(300, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.15);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.16);
    } catch {
      // AudioContext policy fallback
    }
  }

  // Hypnotic 432Hz cinematic generative ambient soundscape
  public toggleAmbientSoundscape(): boolean {
    this.initContext();
    if (!this.ctx) return false;

    if (this.isAmbientPlaying) {
      this.stopAmbientSoundscape();
      return false;
    } else {
      this.startAmbientSoundscape();
      return true;
    }
  }

  private startAmbientSoundscape() {
    if (!this.ctx) return;
    try {
      this.isMuted = false;

      // Dual warm detuned sine oscillators
      this.ambientOsc1 = this.ctx.createOscillator();
      this.ambientOsc2 = this.ctx.createOscillator();
      this.ambientGain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      this.ambientOsc1.type = "sine";
      this.ambientOsc1.frequency.setValueAtTime(108, this.ctx.currentTime); // 432Hz base sub-octave

      this.ambientOsc2.type = "sine";
      this.ambientOsc2.frequency.setValueAtTime(162, this.ctx.currentTime); // Perfect fifth harmony

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(240, this.ctx.currentTime);

      // Smooth fade in
      this.ambientGain.gain.setValueAtTime(0.0001, this.ctx.currentTime);
      this.ambientGain.gain.exponentialRampToValueAtTime(0.025, this.ctx.currentTime + 2.5);

      this.ambientOsc1.connect(filter);
      this.ambientOsc2.connect(filter);
      filter.connect(this.ambientGain);
      this.ambientGain.connect(this.ctx.destination);

      this.ambientOsc1.start();
      this.ambientOsc2.start();
      this.isAmbientPlaying = true;
    } catch {
      this.isAmbientPlaying = false;
    }
  }

  private stopAmbientSoundscape() {
    if (!this.ctx || !this.ambientGain) return;
    try {
      this.ambientGain.gain.setValueAtTime(this.ambientGain.gain.value, this.ctx.currentTime);
      this.ambientGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 1.2);

      setTimeout(() => {
        try {
          this.ambientOsc1?.stop();
          this.ambientOsc2?.stop();
          this.ambientOsc1?.disconnect();
          this.ambientOsc2?.disconnect();
        } catch {
          // Ignore stop errors if oscillator already stopped
        }
        this.ambientOsc1 = null;
        this.ambientOsc2 = null;
        this.ambientGain = null;
        this.isAmbientPlaying = false;
      }, 1250);
    } catch {
      this.isAmbientPlaying = false;
    }
  }
}

export const sounds = new SoundEngine();
export default sounds;
