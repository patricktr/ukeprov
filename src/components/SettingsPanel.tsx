import { useEffect, useRef } from 'react'
import { shortChordName, type Chord } from '../lib/types'
import type { Tuning } from '../lib/music'

/**
 * Settings, with the avoid-list as the main event (PRD §5.5).
 *
 * "This is the feature that keeps me actually using the thing instead of
 * hitting a wall on preset #3." So the list is not a buried preference — it is
 * the first thing in the panel, every chord shows what it would be swapped for,
 * and the genuinely awkward shapes are suggested up front.
 */

export interface SettingsPanelProps {
  open: boolean
  onClose: () => void
  chords: Chord[]
  avoid: string[]
  onToggleAvoid: (id: string) => void
  tuning: Tuning
  onTuning: (t: Tuning) => void
  showNoteNames: boolean
  onShowNoteNames: (v: boolean) => void
  metronome: boolean
  onMetronome: (v: boolean) => void
  chordSound: boolean
  onChordSound: (v: boolean) => void
  countIn: boolean
  onCountIn: (v: boolean) => void
  followVamp: boolean
  onFollowVamp: (v: boolean) => void
  lookAhead: boolean
  onLookAhead: (v: boolean) => void
  onReset: () => void
}

function Toggle({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string
  hint?: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <label className="flex cursor-pointer items-start gap-2.5 py-1.5">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-4 w-4 shrink-0 accent-(--color-role-root)"
      />
      <span className="min-w-0">
        <span className="block text-sm text-(--color-text)">{label}</span>
        {hint && <span className="block text-xs leading-snug text-(--color-dim)">{hint}</span>}
      </span>
    </label>
  )
}

export function SettingsPanel(props: SettingsPanelProps) {
  const { open, onClose, chords, avoid, onToggleAvoid } = props
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  const suggested = chords.filter((c) => c.hard)
  const rest = chords.filter((c) => !c.hard)
  const byId = new Map(chords.map((c) => [c.id, c]))

  const row = (c: Chord) => {
    const on = avoid.includes(c.id)
    return (
      <li key={c.id}>
        <label className="flex cursor-pointer items-start gap-2.5 rounded-md px-1.5 py-1.5 hover:bg-(--color-panel-2)">
          <input
            type="checkbox"
            checked={on}
            onChange={() => onToggleAvoid(c.id)}
            className="mt-0.5 h-4 w-4 shrink-0 accent-(--color-role-root)"
          />
          <span className="min-w-0">
            <span className="block text-sm text-(--color-text)">
              {c.name}{' '}
              <span className="font-mono text-xs text-(--color-dim)">{c.shapes[0]!.frets}</span>
            </span>
            {c.substitute ? (
              <span className="block text-xs leading-snug text-(--color-dim)">
                {on ? 'Playing' : 'Would play'}{' '}
                <span className="font-mono text-(--color-role-seventh)">
                  {(() => {
                    const target = byId.get(c.substitute.chordId)
                    return target ? shortChordName(target) : c.substitute.chordId
                  })()}{' '}
                  {c.substitute.frets}
                </span>{' '}
                — {c.substitute.note}
              </span>
            ) : (
              <span className="block text-xs leading-snug text-(--color-dim)">
                No substitute; vamps using it are hidden instead.
              </span>
            )}
          </span>
        </label>
      </li>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
        aria-hidden="true"
        data-testid="settings-scrim"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Settings"
        className="relative flex h-full w-full max-w-md flex-col border-l border-(--color-line) bg-(--color-panel) shadow-2xl"
      >
        <header className="flex shrink-0 items-center justify-between border-b border-(--color-line) px-4 py-3">
          <h2 className="text-sm font-semibold tracking-[0.18em] uppercase">Settings</h2>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="rounded-md border border-(--color-line-bright) px-3 py-1.5 text-sm text-(--color-muted) hover:text-(--color-text)"
          >
            Close
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
          <section>
            <h3 className="text-xs font-semibold tracking-[0.18em] text-(--color-dim) uppercase">
              Chords I&rsquo;m avoiding
            </h3>
            <p className="mt-1 mb-2 text-xs leading-snug text-(--color-dim)">
              Vamps containing these are shown with a substitution, or hidden when there is no
              sensible one.
            </p>
            <ul className="mb-1">{suggested.map(row)}</ul>
            <details className="mt-2">
              <summary className="cursor-pointer text-xs text-(--color-muted) hover:text-(--color-text)">
                Everything else ({rest.length} chords)
              </summary>
              <ul className="mt-1">{rest.map(row)}</ul>
            </details>
          </section>

          <hr className="my-4 border-(--color-line)" />

          <section>
            <h3 className="mb-1 text-xs font-semibold tracking-[0.18em] text-(--color-dim) uppercase">
              Tuning
            </h3>
            <div className="mb-2 flex gap-1.5">
              {(['high-g', 'low-g'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  aria-pressed={props.tuning === t}
                  onClick={() => props.onTuning(t)}
                  className={`flex-1 rounded-md border px-3 py-2 text-sm font-medium transition-colors ${
                    props.tuning === t
                      ? 'border-(--color-role-root) bg-(--color-role-root)/10 text-(--color-role-root)'
                      : 'border-(--color-line-bright) text-(--color-muted) hover:text-(--color-text)'
                  }`}
                >
                  {t === 'high-g' ? 'High-G (reentrant)' : 'Low-G'}
                </button>
              ))}
            </div>
            <p className="text-xs leading-snug text-(--color-dim)">
              Both tunings put the same notes under the same fingers, so the dot map does not move.
              What changes is the register: in low-G the 4th string drops an octave, so the lowest
              note of a shape — and the bass the chord sits on — is often a different note entirely.
            </p>
          </section>

          <hr className="my-4 border-(--color-line)" />

          <section>
            <h3 className="mb-1 text-xs font-semibold tracking-[0.18em] text-(--color-dim) uppercase">
              Display
            </h3>
            <Toggle
              label="Note names instead of intervals"
              hint="Intervals are the default because R, 3 and 5 are what you aim at; C, E and G are just their names today."
              checked={props.showNoteNames}
              onChange={props.onShowNoteNames}
            />
            <Toggle
              label="Fretboard follows the vamp"
              hint="While the loop runs, the board shows whichever chord is currently sounding."
              checked={props.followVamp}
              onChange={props.onFollowVamp}
            />
            <Toggle
              label="Look ahead one beat"
              hint="Switch the board to the next chord on the last beat of the current one. Answers §10's open question by letting you try it; it is genuinely a bit noisy."
              checked={props.lookAhead}
              onChange={props.onLookAhead}
            />
          </section>

          <hr className="my-4 border-(--color-line)" />

          <section>
            <h3 className="mb-1 text-xs font-semibold tracking-[0.18em] text-(--color-dim) uppercase">
              Sound
            </h3>
            <Toggle label="Metronome click" checked={props.metronome} onChange={props.onMetronome} />
            <Toggle
              label="Strum on each chord change"
              hint="So you can hear the harmony, not just the pulse."
              checked={props.chordSound}
              onChange={props.onChordSound}
            />
            <Toggle label="Count in (one bar)" checked={props.countIn} onChange={props.onCountIn} />
          </section>

          <hr className="my-4 border-(--color-line)" />

          <button
            type="button"
            onClick={props.onReset}
            className="rounded-md border border-(--color-line-bright) px-3 py-2 text-sm text-(--color-muted) hover:border-(--color-role-third) hover:text-(--color-role-third)"
          >
            Reset saved settings
          </button>
          <p className="mt-1.5 text-xs leading-snug text-(--color-dim)">
            Only the vamp, tempo, tuning and avoid-list are remembered between sessions. The view
            toggles above start fresh each time on purpose.
          </p>
        </div>
      </div>
    </div>
  )
}
