import { describe, expect, it } from 'vitest'
import { CHORDS } from './chords'
import { PROGRESSIONS } from './progressions'
import {
  FRET_COUNT,
  INTERVAL_LABELS,
  QUALITIES,
  fretSpan,
  intervalFrom,
  mod12,
  parseFrets,
  pitchClassOf,
  shapePitchClasses,
  spellNote,
} from '../lib/music'

const byId = new Map(CHORDS.map((c) => [c.id, c]))

/** The pitch classes a chord is made of, derived from root + quality. */
const tonesOf = (chordId: string) => {
  const chord = byId.get(chordId)!
  const root = pitchClassOf(chord.root)
  return QUALITIES[chord.quality].intervals.map((i) => mod12(root + i))
}

describe('chord dataset', () => {
  it('has unique ids', () => {
    expect(new Set(CHORDS.map((c) => c.id)).size).toBe(CHORDS.length)
  })

  it('covers every chord in the seven keys of PRD §7', () => {
    // Each key's diatonic set, plus the dominant that makes each minor key work.
    const required: Record<string, string[]> = {
      C: ['C', 'Dm', 'Em', 'F', 'G', 'Am', 'Bdim'],
      F: ['F', 'Gm', 'Am', 'Bb', 'C', 'Dm', 'Edim'],
      G: ['G', 'Am', 'Bm', 'C', 'D', 'Em', 'F#dim'],
      D: ['D', 'Em', 'F#m', 'G', 'A', 'Bm', 'C#dim'],
      Am: ['Am', 'Bdim', 'C', 'Dm', 'Em', 'F', 'G', 'E7'],
      Em: ['Em', 'F#dim', 'G', 'Am', 'Bm', 'C', 'D', 'B7'],
      Dm: ['Dm', 'Edim', 'F', 'Gm', 'Am', 'Bb', 'C', 'A7'],
    }
    const missing: string[] = []
    for (const [key, ids] of Object.entries(required)) {
      for (const id of ids) if (!byId.has(id)) missing.push(`${key}: ${id}`)
    }
    expect(missing).toEqual([])
  })

  describe.each(CHORDS)('$id ($name)', (chord) => {
    const tones = new Set(tonesOf(chord.id))
    const root = pitchClassOf(chord.root)

    it('has at least one shape and one wiggle', () => {
      expect(chord.shapes.length).toBeGreaterThan(0)
      expect(chord.wiggles.length).toBeGreaterThan(0)
    })

    it.each(chord.shapes)('shape $frets spells the chord', (shape) => {
      const frets = parseFrets(shape.frets)
      for (const f of frets) {
        if (f === null) continue
        expect(f, `${shape.frets} reaches past fret ${FRET_COUNT}`).toBeLessThanOrEqual(FRET_COUNT)
        expect(f).toBeGreaterThanOrEqual(0)
      }

      // Pitch classes are tuning-independent (high-G and low-G differ by an
      // octave), so checking one tuning checks both.
      const pcs = shapePitchClasses(frets, 'high-g')
      const foreign = pcs
        .filter((pc) => !tones.has(pc))
        .map((pc) => INTERVAL_LABELS[intervalFrom(root, pc)])
      expect(foreign, `${shape.frets} contains notes that are not in ${chord.name}`).toEqual([])

      // Every chord tone is present unless the shape says it omits it.
      const omits = new Set(shape.omits ?? [])
      const present = new Set(pcs)
      const missing = [...tones]
        .filter((pc) => !present.has(pc))
        .map((pc) => INTERVAL_LABELS[intervalFrom(root, pc)]!)
        .filter((label) => !omits.has(label))
      expect(missing, `${shape.frets} is missing chord tones and does not declare them`).toEqual([])

      // Anything declared omitted really must be absent, or the note is a lie.
      const spurious = [...omits].filter((label) =>
        pcs.some((pc) => INTERVAL_LABELS[intervalFrom(root, pc)] === label),
      )
      expect(spurious, `${shape.frets} declares omits it does not actually omit`).toEqual([])
    })

    it.each(chord.wiggles)('wiggle "$name" stays a wiggle', (wiggle) => {
      expect(wiggle.sequence.length).toBeGreaterThanOrEqual(2)
      if (wiggle.labels) expect(wiggle.labels.length).toBe(wiggle.sequence.length)

      const steps = wiggle.sequence.map(parseFrets)
      steps.forEach((frets, i) => {
        for (const f of frets) {
          if (f === null) continue
          expect(f, `${wiggle.sequence[i]} reaches past fret ${FRET_COUNT}`).toBeLessThanOrEqual(
            FRET_COUNT,
          )
        }
        expect(fretSpan(frets), `${wiggle.sequence[i]} is too wide a stretch`).toBeLessThanOrEqual(4)
      })

      // The defining property (PRD §4): a wiggle alters a held shape. Move more
      // than two strings at once and it is a chord change, not a wiggle.
      for (let i = 1; i < steps.length; i++) {
        const changed = steps[i]!.filter((f, s) => f !== steps[i - 1]![s]).length
        expect(
          changed,
          `${wiggle.sequence[i - 1]} -> ${wiggle.sequence[i]} moves ${changed} strings`,
        ).toBeLessThanOrEqual(2)
      }
    })

    it('has a substitution that points somewhere real', () => {
      const sub = chord.substitute
      if (!sub) {
        // Hard chords must offer a way out; that is the point of §5.5.
        expect(chord.hard ?? false, `${chord.id} is marked hard with no substitution`).toBe(false)
        return
      }
      const target = byId.get(sub.chordId)
      expect(target, `${chord.id} substitutes an unknown chord ${sub.chordId}`).toBeDefined()

      // The substitute shape must genuinely spell the chord it names.
      const pcs = shapePitchClasses(parseFrets(sub.frets), 'high-g')
      const subTones = new Set(tonesOf(sub.chordId))
      expect(
        pcs.filter((pc) => !subTones.has(pc)),
        `${chord.id}'s substitute ${sub.frets} is not a ${sub.chordId}`,
      ).toEqual([])
    })
  })
})

describe('progressions', () => {
  it('reference chords that exist', () => {
    const missing = PROGRESSIONS.flatMap((p) =>
      p.chords.filter((id) => !byId.has(id)).map((id) => `${p.id}: ${id}`),
    )
    expect(missing).toEqual([])
  })

  it('are 2-4 chords long (PRD §5.4)', () => {
    for (const p of PROGRESSIONS) {
      expect(p.chords.length, p.id).toBeGreaterThanOrEqual(2)
      expect(p.chords.length, p.id).toBeLessThanOrEqual(4)
    }
  })

  it('have unique ids', () => {
    expect(new Set(PROGRESSIONS.map((p) => p.id)).size).toBe(PROGRESSIONS.length)
  })
})

describe('note spelling', () => {
  /**
   * Written out by hand from the degrees, not read off the implementation: the
   * letter is fixed by the degree, so the ♭7 of C has to be a kind of B.
   * Picking accidentals by looking at the root's own name got C7, Gm, Gm7 and
   * Edim wrong, and each showed A♯ where the note is B♭.
   */
  const EXPECTED: Record<string, string[]> = {
    C: ['C', 'E', 'G'],
    C7: ['C', 'E', 'G', 'B♭'],
    Cmaj7: ['C', 'E', 'G', 'B'],
    D: ['D', 'F♯', 'A'],
    D7: ['D', 'F♯', 'A', 'C'],
    Dm: ['D', 'F', 'A'],
    Dm7: ['D', 'F', 'A', 'C'],
    E: ['E', 'G♯', 'B'],
    E7: ['E', 'G♯', 'B', 'D'],
    Em: ['E', 'G', 'B'],
    F: ['F', 'A', 'C'],
    Fmaj7: ['F', 'A', 'C', 'E'],
    G: ['G', 'B', 'D'],
    G7: ['G', 'B', 'D', 'F'],
    Gm: ['G', 'B♭', 'D'],
    Gm7: ['G', 'B♭', 'D', 'F'],
    A: ['A', 'C♯', 'E'],
    A7: ['A', 'C♯', 'E', 'G'],
    Am: ['A', 'C', 'E'],
    Bb: ['B♭', 'D', 'F'],
    B7: ['B', 'D♯', 'F♯', 'A'],
    Bm: ['B', 'D', 'F♯'],
    'F#m': ['F♯', 'A', 'C♯'],
    Bdim: ['B', 'D', 'F'],
    Edim: ['E', 'G', 'B♭'],
    'F#dim': ['F♯', 'A', 'C'],
    'C#dim': ['C♯', 'E', 'G'],
  }

  it.each(Object.entries(EXPECTED))('%s spells its tones correctly', (id, expected) => {
    const chord = byId.get(id)!
    const spelled = QUALITIES[chord.quality].intervals.map((i) => spellNote(chord.root, i))
    expect(spelled).toEqual(expected)
  })

  it('never changes the pitch it names', () => {
    // Independent of which letter was chosen: whatever the spelling, it has to
    // sound the note the interval actually is.
    for (const chord of CHORDS) {
      const root = pitchClassOf(chord.root)
      for (const i of QUALITIES[chord.quality].intervals) {
        expect(pitchClassOf(spellNote(chord.root, i)), `${chord.id} at interval ${i}`).toBe(
          mod12(root + i),
        )
      }
    }
  })

  it('uses a different letter for each tone of a chord', () => {
    // Two tones sharing a letter (C and C♯, say) means a degree was skipped or
    // doubled, which is the shape a spelling bug takes.
    for (const chord of CHORDS) {
      const letters = QUALITIES[chord.quality].intervals.map((i) => spellNote(chord.root, i)[0])
      expect(new Set(letters).size, chord.id).toBe(letters.length)
    }
  })
})
