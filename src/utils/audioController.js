class AudioController {
  constructor() {
    this.ctx = null;
  }

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playTone(frequency, type, duration, vol = 0.5) {
    if (!this.ctx) return;
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, this.ctx.currentTime);
    
    gain.gain.setValueAtTime(0, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(vol, this.ctx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  playPlace() {
    this.init();
    this.playTone(300, 'sine', 0.1, 0.3); // Soft thud
    setTimeout(() => this.playTone(450, 'sine', 0.15, 0.2), 50);
  }

  playClear() {
    this.init();
    // Arpeggio
    const freqs = [300, 400, 500, 600, 800];
    freqs.forEach((f, i) => {
      setTimeout(() => this.playTone(f, 'square', 0.1, 0.1), i * 50);
    });
  }

  playGameOver() {
    this.init();
    this.playTone(200, 'sawtooth', 0.3, 0.3);
    setTimeout(() => this.playTone(150, 'sawtooth', 0.4, 0.3), 200);
    setTimeout(() => this.playTone(100, 'sawtooth', 0.5, 0.3), 400);
  }
}

export const audio = new AudioController();
