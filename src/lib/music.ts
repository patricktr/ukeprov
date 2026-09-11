/**
 * Note and fretboard maths.
 *
 * Everything the fretboard draws is computed from a tuning plus fret arithmetic
 * (PRD §7), so the low-G toggle costs nothing: swap one MIDI number and every
 * interval label, ghost dot and playback pitch follows.
 *
 * Conventions used throughout:
 *   - pitch class (pc) is 0-11 with C=0
 *   - strings are indexed 0-3 in GCEA order, i.e. index 0 is the 4th string.
 *     That matches fret-string notation: "0003" is G=0 C=0 E=0 A=3.
 */

export const SHARP_NAMES = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B']
export const FLAT_NAMES = ['C', 'D♭', 'D', 'E♭', 'E', 'F', 'G♭', 'G', 'A♭', 'A', 'B♭', 'B']

export type Tuning = 'high-g' | 'low-g'

/** Open-string MIDI numbers, 4th string first. C4 = 60 = middle C. */
export const TUNINGS: Record<Tuning, readonly [number, number, number, number]> = {
  // Reentrant: the 4th string is the *highest* open string. This is the default.
  'high-g': [67, 60, 64, 69], // G4 C4 E4 A4
  'low-g': [55, 60, 64, 69], // G3 C4 E4 A4
}

export const STRING_LABELS = ['G', 'C', 'E', 'A'] as const

/** PRD §10: "Is 7 frets enough... Start at 7." */
export const FRET_COUNT = 7

export const mod12 = (n: number) => ((n % 12) + 12) % 12

export function noteName(pc: number, preferFlats = false): string {
  return (preferFlats ? FLAT_NAMES : SHARP_NAMES)[mod12(pc)]
}

/** Parse a note name ("C", "F♯", "Bb", "Eb") to a pitch class. */
export function pitchClassOf(name: string): number {
  const letters = 'C.D.EF.G.A.B'
  const base = letters.indexOf(name[0]!.toUpperCase())
  if (base < 0) throw new Error(`bad note name: ${name}`)
  let pc = base
  for (const ch of name.slice(1)) {
    if (ch === '#' || ch === '♯') pc += 1
    else if (ch === 'b' || ch === '♭') pc -= 1
  }
  return mod12(pc)
}

// ---------------------------------------------------------------------------
// Intervals
// ---------------------------------------------------------------------------

/**
 * How an interval is labelled on a dot. The PRD wants interval labels rather
 * than note names (§5.1), because "the 3rd" is the thing you aim at, not "E".
 */
export const INTERVAL_LABELS: Record<number, string> = {
  0: 'R',
  1: '♭9',
  2: '9',
  3: '♭3',
  4: '3',
  5: '11',
  6: '♭5',
  7: '5',
  8: '♯5',
  9: '6',
  10: '♭7',
  11: '7',
}

/** Semitones from `rootPc` up to `pc`. */
export const intervalFrom = (rootPc: number, pc: number) => mod12(pc - rootPc)

// ---------------------------------------------------------------------------
// Chord quality templates
// ---------------------------------------------------------------------------

export type QualityId =
  | 'major'
  | 'minor'
  | 'dominant7'
  | 'major7'
  | 'minor7'
  | 'diminished'
  | 'diminished7'
  | 'half-diminished'
  | 'sus4'
  | 'sus2'
  | 'sixth'
  | 'minor6'
  | 'add9'

export interface Quality {
  id: QualityId
  /** Suffix appended to the root when naming, e.g. "m7" -> "Am7". */
  suffix: string
  /** Semitones above the root, in ascending order. */
  intervals: number[]
  /** Scale used for the grey ghost dots behind the chord tones (PRD §5.1). */
  parentScale: ScaleId
}

export const QUALITIES: Record<QualityId, Quality> = {
  major: { id: 'major', suffix: '', intervals: [0, 4, 7], parentScale: 'major' },
  minor: { id: 'minor', suffix: 'm', intervals: [0, 3, 7], parentScale: 'natural-minor' },
  dominant7: { id: 'dominant7', suffix: '7', intervals: [0, 4, 7, 10], parentScale: 'mixolydian' },
  major7: { id: 'major7', suffix: 'maj7', intervals: [0, 4, 7, 11], parentScale: 'major' },
  minor7: { id: 'minor7', suffix: 'm7', intervals: [0, 3, 7, 10], parentScale: 'dorian' },
  diminished: { id: 'diminished', suffix: 'dim', intervals: [0, 3, 6], parentScale: 'locrian' },
  diminished7: { id: 'diminished7', suffix: 'dim7', intervals: [0, 3, 6, 9], parentScale: 'locrian' },
  'half-diminished': {
    id: 'half-diminished',
    suffix: 'm7♭5',
    intervals: [0, 3, 6, 10],
    parentScale: 'locrian',
  },
  sus4: { id: 'sus4', suffix: 'sus4', intervals: [0, 5, 7], parentScale: 'mixolydian' },
  sus2: { id: 'sus2', suffix: 'sus2', intervals: [0, 2, 7], parentScale: 'major' },
  sixth: { id: 'sixth', suffix: '6', intervals: [0, 4, 7, 9], parentScale: 'major' },
  minor6: { id: 'minor6', suffix: 'm6', intervals: [0, 3, 7, 9], parentScale: 'dorian' },
  add9: { id: 'add9', suffix: 'add9', intervals: [0, 2, 4, 7], parentScale: 'major' },
}

// ---------------------------------------------------------------------------
// Scales
// ---------------------------------------------------------------------------

export type ScaleId =
  | 'major'
  | 'natural-minor'
  | 'major-pentatonic'
  | 'minor-pentatonic'
  | 'mixolydian'
  | 'dorian'
  | 'locrian'
  | 'blues'

export interface Scale {
  id: ScaleId
  name: string
  intervals: number[]
}

export const SCALES: Record<ScaleId, Scale> = {
  major: { id: 'major', name: 'Major', intervals: [0, 2, 4, 5, 7, 9, 11] },
  'natural-minor': { id: 'natural-minor', name: 'Natural minor', intervals: [0, 2, 3, 5, 7, 8, 10] },
  'major-pentatonic': { id: 'major-pentatonic', name: 'Major pentatonic', intervals: [0, 2, 4, 7, 9] },
  'minor-pentatonic': { id: 'minor-pentatonic', name: 'Minor pentatonic', intervals: [0, 3, 5, 7, 10] },
  mixolydian: { id: 'mixolydian', name: 'Mixolydian', intervals: [0, 2, 4, 5, 7, 9, 10] },
  dorian: { id: 'dorian', name: 'Dorian', intervals: [0, 2, 3, 5, 7, 9, 10] },
  locrian: { id: 'locrian', name: 'Locrian', intervals: [0, 1, 3, 5, 6, 8, 10] },
  blues: { id: 'blues', name: 'Blues', intervals: [0, 3, 5, 6, 7, 10] },
}

/** Scales offered in the overlay toggle (PRD §5.7). */
export const OVERLAY_SCALES: ScaleId[] = [
  'major',
  'natural-minor',
  'major-pentatonic',
  'minor-pentatonic',
  'mixolydian',
  'blues',
]

// ---------------------------------------------------------------------------
// Fret shapes
// ---------------------------------------------------------------------------

/** A fretted position per string, 4th string first. `null` means muted. */
export type FretArray = [number | null, number | null, number | null, number | null]

/**
 * Parse fret-string notation. One character per string in GCEA order:
 * "0003" -> [0,0,0,3]. "x" (or "X") mutes a string. Frets above 9 are written
 * in brackets, e.g. "(10)232".
 */
export function parseFrets(spec: string): FretArray {
  const out: (number | null)[] = []
  for (let i = 0; i < spec.length; i++) {
    const ch = spec[i]!
    if (ch === 'x' || ch === 'X') {
      out.push(null)
    } else if (ch === '(') {
      const end = spec.indexOf(')', i)
      if (end < 0) throw new Error(`unclosed bracket in fret spec: ${spec}`)
      out.push(Number(spec.slice(i + 1, end)))
      i = end
    } else if (ch >= '0' && ch <= '9') {
      out.push(Number(ch))
    } else {
      throw new Error(`bad character ${JSON.stringify(ch)} in fret spec: ${spec}`)
    }
  }
  if (out.length !== 4) throw new Error(`fret spec must cover 4 strings: ${spec}`)
  return out as FretArray
}

export const formatFrets = (frets: FretArray) =>
  frets.map((f) => (f === null ? 'x' : f > 9 ? `(${f})` : String(f))).join('')

/** MIDI numbers a shape sounds, low to high, in the given tuning. */
export function shapeMidi(frets: FretArray, tuning: Tuning): number[] {
  const open = TUNINGS[tuning]
  const notes: number[] = []
  frets.forEach((f, s) => {
    if (f !== null) notes.push(open[s]! + f)
  })
  return notes.sort((a, b) => a - b)
}

export const shapePitchClasses = (frets: FretArray, tuning: Tuning): number[] =>
  [...new Set(shapeMidi(frets, tuning).map(mod12))].sort((a, b) => a - b)

/**
 * The lowest-sounding note of a shape. This is exactly why the high-G toggle
 * matters (PRD §5.1): "0003" has G on the bottom in low-G and C in high-G.
 */
export function bassPitchClass(frets: FretArray, tuning: Tuning): number | null {
  const notes = shapeMidi(frets, tuning)
  return notes.length ? mod12(notes[0]!) : null
}

/** The span a shape asks the fretting hand to cover; 0 for all-open shapes. */
export function fretSpan(frets: FretArray): number {
  const fretted = frets.filter((f): f is number => f !== null && f > 0)
  if (!fretted.length) return 0
  return Math.max(...fretted) - Math.min(...fretted)
}

// ---------------------------------------------------------------------------
// Chord identification
// ---------------------------------------------------------------------------

/** Templates tried when naming an arbitrary shape, best-fit first. */
const ID_ORDER: QualityId[] = [
  'major',
  'minor',
  'dominant7',
  'major7',
  'minor7',
  'sixth',
  'minor6',
  'sus4',
  'sus2',
  'add9',
  'diminished',
  'diminished7',
  'half-diminished',
]

export interface ChordIdentity {
  rootPc: number
  quality: QualityId
  name: string
  /** True when the shape spells the template exactly, with nothing missing or extra. */
  exact: boolean
}

/**
 * Name the chord a set of pitch classes spells.
 *
 * `preferRoot` breaks the ties that four-string voicings constantly produce:
 * the open shape "0000" is both C6 and Am7, and which one is the useful reading
 * depends entirely on the chord you were holding when you got there. Passing the
 * parent chord's root makes it read "C6" inside C's wiggles and "Am7" inside
 * Am's, which is what you actually want to see.
 */
export function identifyChord(
  pcs: number[],
  bass: number | null,
  preferRoot?: number,
  preferFlats = false,
): ChordIdentity | null {
  const set = new Set(pcs.map(mod12))
  if (set.size < 2) return null

  const roots: number[] = []
  const push = (pc: number | null | undefined) => {
    if (pc != null && !roots.includes(mod12(pc))) roots.push(mod12(pc))
  }
  push(preferRoot)
  push(bass)
  for (let pc = 0; pc < 12; pc++) push(pc)

  let fallback: ChordIdentity | null = null

  for (const rootPc of roots) {
    for (const id of ID_ORDER) {
      const q = QUALITIES[id]
      const want = new Set(q.intervals.map((i) => mod12(rootPc + i)))
      const covered = [...set].every((pc) => want.has(pc))
      if (!covered) continue
      const name = noteName(rootPc, preferFlats) + q.suffix
      // Every note of the template present and nothing foreign: an exact spelling.
      if (set.size === want.size) return { rootPc, quality: id, name, exact: true }
      // A partial voicing (a 3-note reading of a 4-note chord, say). Hold the
      // first one found in case nothing exact turns up.
      fallback ??= { rootPc, quality: id, name, exact: false }
    }
  }
  return fallback
}

/** Convenience: name the chord a fret shape sounds in a given tuning. */
export function identifyShape(
  frets: FretArray,
  tuning: Tuning,
  preferRoot?: number,
  preferFlats = false,
): ChordIdentity | null {
  return identifyChord(
    shapePitchClasses(frets, tuning),
    bassPitchClass(frets, tuning),
    preferRoot,
    preferFlats,
  )
}

// ---------------------------------------------------------------------------
// Fretboard maps
// ---------------------------------------------------------------------------

export interface Position {
  string: number
  fret: number
  midi: number
  pc: number
  /** Semitones above the chord root. */
  interval: number
  /** "R", "3", "♭7"... */
  label: string
  /** A chord tone, as opposed to a ghost note from the parent scale. */
  isChordTone: boolean
}

/**
 * Every position on the first `fretCount` frets, annotated against a root.
 * `chordIntervals` decides which dots are targets and which are ghosts.
 */
export function fretboardPositions(
  rootPc: number,
  chordIntervals: number[],
  scaleIntervals: number[],
  tuning: Tuning,
  fretCount = FRET_COUNT,
): Position[] {
  const open = TUNINGS[tuning]
  const chord = new Set(chordIntervals.map(mod12))
  const scale = new Set(scaleIntervals.map(mod12))
  const out: Position[] = []

  for (let string = 0; string < 4; string++) {
    for (let fret = 0; fret <= fretCount; fret++) {
      const midi = open[string]! + fret
      const pc = mod12(midi)
      const interval = intervalFrom(rootPc, pc)
      const isChordTone = chord.has(interval)
      if (!isChordTone && !scale.has(interval)) continue
      out.push({
        string,
        fret,
        midi,
        pc,
        interval,
        label: INTERVAL_LABELS[interval] ?? String(interval),
        isChordTone,
      })
    }
  }
  return out
}

/** Equal-temperament frequency for a MIDI note. A4 = 440Hz = MIDI 69. */
export const midiToFreq = (midi: number) => 440 * Math.pow(2, (midi - 69) / 12)

/** "C4", "G♯3" — used in the note-name toggle and dot tooltips. */
export function midiToName(midi: number, preferFlats = false): string {
  const octave = Math.floor(midi / 12) - 1
  return `${noteName(mod12(midi), preferFlats)}${octave}`
}
