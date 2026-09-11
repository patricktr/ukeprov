import { TUNINGS, type FretArray, type Tuning, midiToFreq } from '../lib/music'

/**
 * Web Audio, kept deliberately small (PRD §5.4): "good enough to play along
 * with, not good enough to record".
 *
 * The string is Karplus-Strong — a burst of filtered noise fed through a delay
 * line as long as one period of the note, averaged with itself each time round.
 * It is four lines of arithmetic and sounds far more like a plucked nylon
 * string than any oscillator does. Buffers are rendered once per pitch and
 * cached; a two-second buffer takes about a millisecond to fill.
 */

let ctx: AudioContext | null = null
let master: GainNode | null = null

/**
 * Browsers will not start an AudioContext outside a user gesture, so every
 * sound-making path calls this from inside a click or keypress handler. The
 * whole reference half of the app works without ever calling it.
 */
export function ensureAudio(): AudioContext {
  if (!ctx) {
    ctx = new AudioContext()
    master = ctx.createGain()
    master.gain.value = 0.9
    master.connect(ctx.destination)
  }
  if (ctx.state === 'suspended') void ctx.resume()
  return ctx
}

export const audioContext = () => ctx
export const isAudioReady = () => ctx !== null && ctx.state === 'running'

export function setMasterVolume(v: number) {
  if (master && ctx) master.gain.setTargetAtTime(v, ctx.currentTime, 0.01)
}

// ---------------------------------------------------------------------------
// Karplus-Strong string
// ---------------------------------------------------------------------------

const bufferCache = new Map<string, AudioBuffer>()

function pluckBuffer(context: AudioContext, freq: number, seconds: number): AudioBuffer {
  const key = `${freq.toFixed(2)}:${seconds}`
  const cached = bufferCache.get(key)
  if (cached) return cached

  const rate = context.sampleRate
  const length = Math.floor(rate * seconds)
  const buffer = context.createBuffer(1, length, rate)
  const out = buffer.getChannelData(0)

  const period = Math.max(2, Math.round(rate / freq))

  // Excitation: white noise through a one-pole lowpass. Raw noise gives a
  // harpsichord-ish zing; rolling the top off makes it read as nylon.
  let last = 0
  for (let i = 0; i < period; i++) {
    const noise = Math.random() * 2 - 1
    last = last * 0.5 + noise * 0.5
    out[i] = last
  }

  // The delay line. 0.5 * (x[n-N] + x[n-N-1]) is a two-point average, which is
  // a lowpass — so high harmonics die away faster than low ones, exactly as
  // they do on a real string.
  const decay = 0.996
  for (let i = period; i < length; i++) {
    out[i] = decay * 0.5 * (out[i - period]! + out[i - period - 1]!)
  }

  // Fade the tail so buffers never end on a click.
  const fade = Math.min(2000, Math.floor(length * 0.1))
  for (let i = 0; i < fade; i++) {
    out[length - 1 - i] = out[length - 1 - i]! * (i / fade)
  }

  bufferCache.set(key, buffer)
  return buffer
}

export interface NoteOptions {
  /** AudioContext time to start at. Defaults to now. */
  when?: number
  gain?: number
  /** How long the string rings, in seconds. */
  duration?: number
}

/** Pluck a single MIDI note. Used by the fretboard dots (PRD §5.1). */
export function playNote(midi: number, options: NoteOptions = {}) {
  const context = ensureAudio()
  if (!master) return
  const { when = context.currentTime, gain = 0.5, duration = 2.2 } = options

  const source = context.createBufferSource()
  source.buffer = pluckBuffer(context, midiToFreq(midi), duration)

  const env = context.createGain()
  env.gain.setValueAtTime(gain, when)
  // A gentle release so overlapping notes do not pile up into mush.
  env.gain.setTargetAtTime(0.0001, when + duration * 0.55, duration * 0.2)

  source.connect(env).connect(master)
  source.start(when)
  source.stop(when + duration)
}

// ---------------------------------------------------------------------------
// Strum
// ---------------------------------------------------------------------------

export interface StrumOptions extends NoteOptions {
  /** 'down' runs 4th string to 1st, which is how a down-strum actually lands. */
  direction?: 'down' | 'up'
  /** Seconds between adjacent strings. Zero would be a chord stab, not a strum. */
  spread?: number
}

/** Strum a fret shape. Used by wiggle play buttons and by the vamp. */
export function strum(frets: FretArray, tuning: Tuning, options: StrumOptions = {}) {
  const context = ensureAudio()
  const {
    when = context.currentTime,
    gain = 0.42,
    duration = 2.4,
    direction = 'down',
    spread = 0.016,
  } = options

  const open = TUNINGS[tuning]
  const order = direction === 'down' ? [0, 1, 2, 3] : [3, 2, 1, 0]

  let i = 0
  for (const string of order) {
    const fret = frets[string]
    if (fret === null) continue
    playNote(open[string]! + fret, {
      when: when + i * spread,
      // Trailing strings a touch quieter; a real strum is not four equal notes.
      gain: gain * (1 - i * 0.05),
      duration,
    })
    i++
  }
}

// ---------------------------------------------------------------------------
// Metronome
// ---------------------------------------------------------------------------

/** A short click. `accent` marks beat one of the bar. */
export function click(when: number, accent = false) {
  const context = ensureAudio()
  if (!master) return

  const osc = context.createOscillator()
  osc.type = 'triangle'
  osc.frequency.value = accent ? 1560 : 940

  const env = context.createGain()
  env.gain.setValueAtTime(0, when)
  env.gain.linearRampToValueAtTime(accent ? 0.34 : 0.18, when + 0.001)
  env.gain.exponentialRampToValueAtTime(0.0001, when + 0.06)

  osc.connect(env).connect(master)
  osc.start(when)
  osc.stop(when + 0.08)
}
