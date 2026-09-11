import { shortChordName, type Chord, type Progression, type Substitution } from './types'
import { parseFrets } from './music'
import type { VampStep } from '../audio/scheduler'

/**
 * Applying the avoid-list to a progression (PRD §5.5).
 *
 * "Any progression, preset, or key suggestion containing an avoided chord is
 * either hidden or shown with a suggested substitution." So the rule is: if a
 * substitution exists, substitute and say so; if it does not, hide the whole
 * progression. Silently dropping a chord from a four-chord loop would be worse
 * than either.
 */

export interface ResolvedChord {
  chordId: string
  label: string
  frets: string
  /** The chord that was avoided, when this slot is standing in for one. */
  substitutedFor?: string
  substitution?: Substitution
}

export interface ResolvedProgression {
  progression: Progression
  chords: ResolvedChord[]
  /** True when nothing in it is on the avoid-list. */
  clean: boolean
  /** True when an avoided chord had no substitute, so it cannot be played. */
  blocked: boolean
  blockedBy: string[]
}

export function resolveProgression(
  progression: Progression,
  chordsById: Map<string, Chord>,
  avoid: string[],
): ResolvedProgression {
  const avoidSet = new Set(avoid)
  const blockedBy: string[] = []
  let clean = true

  const chords = progression.chords.map<ResolvedChord>((id) => {
    const chord = chordsById.get(id)!
    if (!avoidSet.has(id)) {
      return { chordId: id, label: shortChordName(chord), frets: chord.shapes[0]!.frets }
    }

    clean = false
    const sub = chord.substitute
    if (!sub) {
      blockedBy.push(id)
      return {
        chordId: id,
        label: shortChordName(chord),
        frets: chord.shapes[0]!.frets,
        substitutedFor: id,
      }
    }

    const target = chordsById.get(sub.chordId)
    return {
      chordId: sub.chordId,
      label: target ? shortChordName(target) : sub.chordId,
      frets: sub.frets,
      substitutedFor: id,
      substitution: sub,
    }
  })

  return { progression, chords, clean, blocked: blockedBy.length > 0, blockedBy }
}

/** Turn a resolved progression into something the scheduler can loop. */
export function toSteps(resolved: ResolvedProgression): VampStep[] {
  const beats = resolved.progression.beatsPerChord ?? 4
  return resolved.chords.map((c) => ({
    chordId: c.chordId,
    label: c.label,
    frets: parseFrets(c.frets),
    beats,
  }))
}
