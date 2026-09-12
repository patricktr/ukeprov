import type { Chord } from '../lib/types'
import {
  INTERVAL_LABELS,
  QUALITIES,
  SCALES,
  degreeLabel,
  mod12,
  spellNote,
  spellWithDegree,
} from '../lib/music'
import { ROLE_MEANING, roleColor } from '../lib/roles'

/**
 * A legend for what is currently on the board.
 *
 * PRD §3 rules out "lessons, text instruction, or a curriculum", and this
 * deliberately is not one — there is no sequence, no progress, nothing to
 * finish. It answers one question, "what am I looking at", about the chord you
 * have open right now.
 *
 * That is why the degree strip is built from the live chord rather than being a
 * picture of C major. Reading "count up from the chord's letter" and then
 * seeing your own chord counted out underneath it is the entire difference
 * between a rule you have been told and one you can check.
 */
export function WhatAmILookingAt({ chord }: { chord: Chord }) {
  const quality = QUALITIES[chord.quality]
  const chordIntervals = new Set(quality.intervals.map(mod12))
  const scale = SCALES[quality.parentScale].intervals

  // Degrees come from position in the scale, not from the interval: every
  // parent scale here has one note per letter, so the nth note is the nth
  // degree. Deriving it from the interval instead would call both notes of
  // locrian's ♭5 and ♭6 a fifth.
  const steps = scale.map((interval, i) => {
    const degree = i + 1
    return {
      degree,
      interval,
      name: spellWithDegree(chord.root, interval, degree),
      label: degreeLabel(interval, degree),
      inChord: chordIntervals.has(mod12(interval)),
    }
  })

  return (
    <div className="text-[13px] leading-snug text-(--color-muted)">
      <p>
        A chord is a handful of specific notes — <b className="text-(--color-text)">{chord.name}</b>{' '}
        is{' '}
        <span className="font-mono text-(--color-text)">
          {quality.intervals.map((i) => spellNote(chord.root, i)).join(' ')}
        </span>
        , and nothing else. Those notes turn up all over the neck, not just under the shape you are
        holding. The coloured dots are every place they appear in the first seven frets. Play one
        while this chord is sounding and it sounds like you meant it.
      </p>

      <h4 className="mt-3 mb-1.5 text-xs font-semibold tracking-[0.18em] text-(--color-dim) uppercase">
        Where the numbers come from
      </h4>
      <p className="mb-2">
        Count up the alphabet from the chord&rsquo;s own letter. {chord.name} takes the ones in
        colour:
      </p>
      <ol className="flex gap-1 overflow-x-auto pb-1">
        {steps.map((s) => (
          <li
            key={s.degree}
            className="flex min-w-[42px] flex-1 flex-col items-center rounded-md border px-1 py-1.5"
            style={{
              borderColor: s.inChord ? roleColor(INTERVAL_LABELS[mod12(s.interval)]!) : 'var(--color-line)',
              background: s.inChord
                ? `color-mix(in srgb, ${roleColor(INTERVAL_LABELS[mod12(s.interval)]!)} 14%, transparent)`
                : 'transparent',
            }}
          >
            <span
              className="font-mono text-sm font-semibold"
              style={{
                color: s.inChord
                  ? roleColor(INTERVAL_LABELS[mod12(s.interval)]!)
                  : 'var(--color-dim)',
              }}
            >
              {s.name}
            </span>
            <span className="mt-0.5 font-mono text-[10px] text-(--color-dim)">{s.label}</span>
          </li>
        ))}
      </ol>
      <p className="mt-1.5">
        That is all &ldquo;root, 3rd, 5th&rdquo; means: the 1st, 3rd and 5th notes counting up from{' '}
        {chord.root}.
      </p>

      <h4 className="mt-3 mb-1.5 text-xs font-semibold tracking-[0.18em] text-(--color-dim) uppercase">
        What each one does
      </h4>
      <ul className="flex flex-col gap-1.5">
        {quality.intervals.map((i) => {
          const label = INTERVAL_LABELS[mod12(i)]!
          return (
            <li key={i} className="flex items-start gap-2">
              <span
                className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full font-mono text-[11px] font-bold"
                style={{ background: roleColor(label), color: '#14171d' }}
              >
                {label}
              </span>
              <span>{ROLE_MEANING[label] ?? 'A note of the chord.'}</span>
            </li>
          )
        })}
      </ul>

      <p className="mt-3">
        <b className="text-(--color-text)">The grey dots</b> are the rest of the scale. They fit, but
        they say nothing — use them to travel between the coloured ones.
      </p>
      <p className="mt-2">
        <b className="text-(--color-text)">The labels are numbers, not letters, on purpose.</b> The
        3rd of C is E and the 3rd of G is B — different names, identical job, identical feeling.
        Learn &ldquo;aim for the 3rd&rdquo; and it works in every key; learn &ldquo;aim for E&rdquo;
        and you have learned one chord.
      </p>

      <h4 className="mt-3 mb-1.5 text-xs font-semibold tracking-[0.18em] text-(--color-dim) uppercase">
        Try this first
      </h4>
      <ol className="ml-4 flex list-decimal flex-col gap-1">
        <li>
          Press the <b className="text-(--color-text)">3</b> button in the sidebar. It hides
          everything but the 3rds — learn where those few are.
        </li>
        <li>Start a vamp and play nothing for one loop, just watching NOW and NEXT.</li>
        <li>
          Next loop, play one note per bar: the root of whatever NOW says. Then roots and 3rds only.
        </li>
      </ol>
    </div>
  )
}

