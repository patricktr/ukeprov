import type { Chord } from '../lib/types'
import { shortChordName } from '../lib/types'

/**
 * Build a vamp from 2-4 chords (PRD §5.4: "Pick a progression from a preset
 * list, or build one from 2–4 chords").
 *
 * The result goes through exactly the same `resolveProgression` path as a
 * preset, so the avoid-list applies identically — pick a chord you are avoiding
 * and you get its substitution, with the same note explaining why.
 */

export interface VampBuilderProps {
  chords: { inKey: Chord[]; rest: Chord[] }
  value: string[]
  onChange: (ids: string[]) => void
  avoid: string[]
  keyName: string
}

const MIN = 2
const MAX = 4

export function VampBuilder({ chords, value, onChange, avoid, keyName }: VampBuilderProps) {
  const setAt = (i: number, id: string) => {
    const next = [...value]
    next[i] = id
    onChange(next)
  }

  const option = (c: Chord) => (
    <option key={c.id} value={c.id}>
      {shortChordName(c)}
      {avoid.includes(c.id) ? ' · avoided' : ''}
    </option>
  )

  return (
    <section
      aria-labelledby="builder-heading"
      className="rounded-lg border border-(--color-line) bg-(--color-panel-2) p-3"
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <h3
          id="builder-heading"
          className="text-xs font-semibold tracking-[0.18em] text-(--color-dim) uppercase"
        >
          Your vamp
        </h3>
        <span className="text-xs text-(--color-dim)">
          {value.length} of {MAX} chords
        </span>
      </div>

      <ol className="flex flex-wrap items-center gap-1.5">
        {value.map((id, i) => (
          <li key={i} className="flex items-center gap-1">
            <select
              value={id}
              aria-label={`Chord ${i + 1} of ${value.length}`}
              onChange={(e) => setAt(i, e.target.value)}
              className="rounded-md border border-(--color-line-bright) bg-(--color-panel) px-2 py-1.5 text-sm text-(--color-text)"
            >
              <optgroup label={`In ${keyName}`}>{chords.inKey.map(option)}</optgroup>
              <optgroup label="Everything else">{chords.rest.map(option)}</optgroup>
            </select>
            {value.length > MIN && (
              <button
                type="button"
                aria-label={`Remove chord ${i + 1}`}
                onClick={() => onChange(value.filter((_, j) => j !== i))}
                className="rounded-md border border-(--color-line-bright) px-1.5 py-1 text-xs text-(--color-dim) transition-colors hover:border-(--color-role-third) hover:text-(--color-role-third)"
              >
                ×
              </button>
            )}
          </li>
        ))}
        {value.length < MAX && (
          <li>
            <button
              type="button"
              // Repeat the last chord rather than guessing: you are about to
              // change it anyway, and a random pick would be a worse default
              // than an obvious placeholder.
              onClick={() => onChange([...value, value[value.length - 1]!])}
              className="rounded-md border border-(--color-line-bright) px-2.5 py-1.5 text-sm text-(--color-muted) transition-colors hover:border-(--color-role-root) hover:text-(--color-role-root)"
            >
              + chord
            </button>
          </li>
        )}
      </ol>

      <p className="mt-2 text-[13px] leading-snug text-(--color-dim)">
        Four beats each, looping. Saved with your settings, so it survives a reload.
      </p>
    </section>
  )
}
