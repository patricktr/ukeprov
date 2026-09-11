import { QUALITIES, type QualityId } from './music'

/**
 * A voicing of a chord.
 *
 * Note there is no `tones` field, unlike the sketch in PRD §7: the chord tones
 * are derived from root + quality, for the same reason §7 gives for deriving
 * fretboard positions. Storing them twice is just somewhere for them to drift.
 */
export interface ChordShape {
  /** Fret-string notation, 4th string first: "0003", "1202", "x210". */
  frets: string
  /** 1 = one finger or open, 5 = a barre plus a stretch. */
  difficulty: 1 | 2 | 3 | 4 | 5
  /**
   * Chord tones this voicing deliberately leaves out, as interval labels
   * ("R", "5"). Four strings can't always hold a four-note chord, and the
   * honest thing is to say which note went missing rather than pretend.
   */
  omits?: string[]
  note?: string
}

/**
 * A small alteration to a held shape — add a finger, lift a finger, hammer on,
 * pull off (PRD §4). The invariant that makes it a wiggle rather than a chord
 * change is that no step moves more than two strings; the test suite enforces it.
 */
export interface Wiggle {
  id: string
  name: string
  /** Fret specs, in order. The first is normally the chord's home shape. */
  sequence: string[]
  /**
   * Optional per-step names, parallel to `sequence`. `null` means "work it out".
   * Needed where the automatic reading is right but useless: over E7, the shape
   * 1212 is honestly Bdim7, and calling it E7♭9 is the only way it teaches
   * you anything.
   */
  labels?: (string | null)[]
  /** One sentence on the feel of it. This is the part worth getting right. */
  note: string
}

/** What to play instead when this chord is on the avoid-list (PRD §5.5). */
export interface Substitution {
  /** The chord to play instead. Equal to the chord's own id for a shape swap. */
  chordId: string
  frets: string
  note: string
}

export interface Chord {
  id: string
  name: string
  /** Root note name; the spelling here decides sharps vs flats in the UI. */
  root: string
  quality: QualityId
  shapes: ChordShape[]
  wiggles: Wiggle[]
  /** Pre-suggested for the avoid-list because the shape is genuinely awkward. */
  hard?: boolean
  substitute?: Substitution
  note?: string
}

export interface Progression {
  id: string
  name: string
  /** PRD §10: organised by feel rather than by key. */
  feel: 'sunny' | 'wistful' | 'driving' | 'old-time'
  key: string
  /** Roman numerals, for the people who think that way. */
  numerals: string
  /** 2-4 chord ids. */
  chords: string[]
  /** Beats each chord is held for. Defaults to 4. */
  beatsPerChord?: number
  note: string
}

export interface PracticePrompt {
  id: string
  text: string
  /** Escalating, but not gamified: no streaks, no points (PRD §5.6). */
  level: 1 | 2 | 3
}

/**
 * The compact name: "C", "Am", "Cmaj7", "B♭". Built from the root spelling plus
 * the quality suffix, so it stays in sync with the dataset automatically.
 *
 * This is what belongs on the big display and in the vamp list — at arm's length
 * from a music stand "Am" reads instantly and "A minor" does not, and the sketch
 * in PRD §6 uses exactly this form.
 */
export const shortChordName = (chord: Pick<Chord, 'root' | 'quality'>) =>
  chord.root + QUALITIES[chord.quality].suffix
