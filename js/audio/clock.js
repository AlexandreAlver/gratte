// Horloge précise (planification Web Audio avec anticipation) : métronome + déclencheurs
import { audio, click, outputLatency } from './engine.js';

export class Clock {
  /**
   * @param {object} o
   *  bpm, beats (temps par mesure), steps (subdivisions par temps),
   *  click (bool), subClick (bool), countIn (bool),
   *  onSchedule(ev) : appelé en avance avec l'heure audio exacte (pour jouer des sons)
   *  onStep(ev) : appelé au moment où le son est entendu (pour l'affichage)
   */
  constructor(o = {}) {
    Object.assign(this, { bpm: 70, beats: 4, steps: 2, click: true, subClick: false, countIn: true, onSchedule: null, onStep: null, onStop: null }, o);
    this.running = false; this.queue = []; this.timer = null; this.raf = null;
  }
  get stepDur() { return 60 / this.bpm / this.steps; }
  get stepsPerBar() { return this.beats * this.steps; }
  start() {
    if (this.running) return;
    const c = audio();
    this.running = true;
    this.step = this.countIn ? -this.stepsPerBar : 0;
    this.nextTime = c.currentTime + 0.15;
    this.startTime = this.nextTime;
    this.queue = [];
    this.timer = setInterval(() => this.schedule(), 25);
    this.schedule();
    const loop = () => { this.draw(); if (this.running) this.raf = requestAnimationFrame(loop); };
    this.raf = requestAnimationFrame(loop);
  }
  stop() {
    if (!this.running) return;
    this.running = false;
    clearInterval(this.timer); cancelAnimationFrame(this.raf);
    this.queue = [];
    this.onStop && this.onStop();
  }
  schedule() {
    const c = audio();
    while (this.nextTime < c.currentTime + 0.12) {
      const s = this.step, spb = this.stepsPerBar;
      const inBar = ((s % spb) + spb) % spb;
      const bar = Math.floor(s / spb);
      const isBeat = inBar % this.steps === 0;
      const ev = { step: s, time: this.nextTime, inBar, bar, isBeat, beat: Math.floor(inBar / this.steps), countIn: s < 0, dur: this.stepDur };
      if (isBeat && (this.click || ev.countIn)) click(ev.time, inBar === 0 ? 'accent' : 'beat');
      else if (!isBeat && this.subClick) click(ev.time, 'sub');
      if (this.onSchedule) this.onSchedule(ev);
      this.queue.push(ev);
      this.nextTime += this.stepDur;
      this.step++;
    }
  }
  draw() {
    const c = audio();
    const now = c.currentTime - outputLatency();
    let last = null;
    while (this.queue.length && this.queue[0].time <= now) last = this.queue.shift();
    if (last && this.onStep) this.onStep(last);
  }
  setBpm(b) { this.bpm = b; }
}

export function tempoName(bpm) {
  if (bpm < 60) return 'Largo — très lent';
  if (bpm < 76) return 'Adagio — lent';
  if (bpm < 100) return 'Andante — modéré';
  if (bpm < 120) return 'Moderato — allant';
  if (bpm < 156) return 'Allegro — rapide';
  return 'Presto — très rapide';
}
