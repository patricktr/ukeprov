import type { FretArray, Tuning } from '../lib/music'
import { click, ensureAudio, strum } from './engine'

/**
 * The vamp scheduler (PRD §5.4, §8).
 *
 * Two clocks. Web Audio's clock schedules the actual sound, ahead of time and
 * to the sample; a plain timer only decides when to top the queue up. A timer
 * per beat drifts audibly within about thirty seconds, which would make the
 * loop useless to play against — which is the entire point of it.
 *
 * The display is driven from a queue of already-scheduled beats, drained
 * against the audio clock, so a chord is painted when you hear it rather than
 * when it was queued — the scheduler is always working ahead of the sound.
 *
 * That draining happens on the same timer that does the scheduling, not on
 * requestAnimationFrame, which is the conventional choice. rAF is the wrong
 * tool here: it is throttled whenever the page is not being painted normally
 * (a background tab, a low-power display, an offscreen renderer), and measured
 * at 1.4fps in one such context while setInterval kept its full rate. A chord
 * display that silently falls seconds behind the audio is worse than useless
 * when the whole job of NEXT is to tell you what is coming. Beats are discrete
 * events, so the timer's 25ms granularity is inaudible anyway: at the top
 * tempo of 160bpm that is 6% of a beat.
 */

export interface VampStep {
  chordId: string
  frets: FretArray
  beats: number
  /** Displayed name; may differ from chordId when a substitution applied. */
  label: string
}

export interface VampState {
  running: boolean
  /** Index into the steps array. */
  stepIndex: number
  /** Beat within the current chord, from 0. */
  beatInStep: number
  /** Absolute beat since play was pressed, negative during the count-in. */
  beat: number
  countingIn: boolean
}

export interface VampOptions {
  steps: VampStep[]
  bpm: number
  tuning: Tuning
  countInBeats: number
  metronome: boolean
  chordSound: boolean
}

/**
 * How far ahead of the audio clock we schedule, in seconds. Everything already
 * queued keeps sounding after a tempo change or a stop, so this is a trade:
 * long enough to survive a stalled timer, short enough that stopping feels
 * immediate.
 */
const LOOKAHEAD = 0.2
/** How often the top-up timer runs, in milliseconds. */
const TICK_MS = 25

interface ScheduledBeat {
  time: number
  beat: number
  stepIndex: number
  beatInStep: number
  countingIn: boolean
}

export class VampScheduler {
  private options: VampOptions
  private timer: number | null = null
  private nextBeatTime = 0
  private nextBeat = 0
  private queue: ScheduledBeat[] = []
  private listener: (state: VampState) => void = () => {}
  private lastEmitted = -Infinity

  constructor(options: VampOptions) {
    this.options = options
  }

  /** Set separately from the constructor so React can build this in a lazy
   *  `useState` initialiser, before the setter it reports to exists. */
  setListener(listener: (state: VampState) => void) {
    this.listener = listener
  }

  /** Tempo and sound toggles can change mid-loop without restarting it. */
  update(patch: Partial<VampOptions>) {
    const stepsChanged = patch.steps !== undefined && patch.steps !== this.options.steps
    this.options = { ...this.options, ...patch }
    if (stepsChanged && this.timer !== null) this.restart()
  }

  start() {
    if (this.timer !== null) return
    const ctx = ensureAudio()
    this.queue = []
    this.nextBeat = -this.options.countInBeats
    // A beat of headroom so the first click is scheduled, not fired late.
    this.nextBeatTime = ctx.currentTime + 0.12
    this.timer = window.setInterval(this.tick, TICK_MS)
    this.tick()
  }

  stop() {
    if (this.timer !== null) window.clearInterval(this.timer)
    this.timer = null
    this.queue = []
    this.lastEmitted = -Infinity
    this.listener({ running: false, stepIndex: 0, beatInStep: 0, beat: 0, countingIn: false })
  }

  private restart() {
    this.stop()
    this.start()
  }

  private get beatsPerLoop() {
    return this.options.steps.reduce((n, s) => n + s.beats, 0)
  }

  /** Which chord beat `beat` falls in, and how far into it. */
  private locate(beat: number) {
    const total = this.beatsPerLoop
    if (total === 0) return { stepIndex: 0, beatInStep: 0 }
    let b = ((beat % total) + total) % total
    for (let i = 0; i < this.options.steps.length; i++) {
      const len = this.options.steps[i]!.beats
      if (b < len) return { stepIndex: i, beatInStep: b }
      b -= len
    }
    return { stepIndex: 0, beatInStep: 0 }
  }

  private tick = () => {
    // Drain first so the display reflects what has already sounded, then queue
    // whatever is coming up next.
    this.drain()
    this.fill()
  }

  /** Top the queue up with every beat that starts within the lookahead window. */
  private fill() {
    const ctx = ensureAudio()
    const spb = 60 / this.options.bpm

    // If the timer was starved — a background tab clamps it to once a second,
    // and a sleeping laptop stops it altogether — the loop below would queue
    // every missed beat at a time that has already passed, and Web Audio fires
    // those instantly: a burst of clicks all at once. Skip the missed beats and
    // re-anchor to the grid instead, which keeps the loop in phase.
    if (this.nextBeatTime < ctx.currentTime) {
      const missed = Math.ceil((ctx.currentTime - this.nextBeatTime) / spb)
      this.nextBeat += missed
      this.nextBeatTime += missed * spb
    }

    while (this.nextBeatTime < ctx.currentTime + LOOKAHEAD) {
      const beat = this.nextBeat
      const time = this.nextBeatTime
      const countingIn = beat < 0
      const { stepIndex, beatInStep } = countingIn
        ? { stepIndex: 0, beatInStep: 0 }
        : this.locate(beat)

      if (this.options.metronome) {
        // Accent the count-in throughout, then only the first beat of a chord.
        click(time, countingIn || beatInStep === 0)
      }
      if (this.options.chordSound && !countingIn && beatInStep === 0) {
        strum(this.options.steps[stepIndex]!.frets, this.options.tuning, { when: time })
      }

      this.queue.push({ time, beat, stepIndex, beatInStep, countingIn })
      this.nextBeat += 1
      this.nextBeatTime += spb
    }
  }

  /**
   * Drain the queue up to the audio clock. This is what keeps the big chord
   * display honest: a beat is painted when you hear it, not when it was queued.
   * Taking the last beat that has passed rather than the first means a stalled
   * timer catches up to the present instead of replaying history.
   */
  private drain() {
    const ctx = ensureAudio()
    const now = ctx.currentTime
    let current: ScheduledBeat | null = null
    while (this.queue.length && this.queue[0]!.time <= now) current = this.queue.shift()!

    if (current && current.beat !== this.lastEmitted) {
      this.lastEmitted = current.beat
      this.listener({
        running: true,
        stepIndex: current.stepIndex,
        beatInStep: current.beatInStep,
        beat: current.beat,
        countingIn: current.countingIn,
      })
    }
  }
}
