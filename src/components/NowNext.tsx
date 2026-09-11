import type { VampState, VampStep } from '../audio/scheduler'
import type { ResolvedProgression } from '../lib/vamp'

/**
 * The big chord display (PRD §5.4, §6).
 *
 * NEXT is the load-bearing half: the whole reason to look up from the strings
 * is to know what is coming, and a chord you find out about on the beat it
 * arrives is a chord you fluff. So it gets the same weight as NOW, in a colour
 * that says "prepare" rather than "play".
 */

export interface NowNextProps {
  steps: VampStep[]
  state: VampState
  resolved: ResolvedProgression | null
}

export function NowNext({ steps, state, resolved }: NowNextProps) {
  const now = steps[state.stepIndex]
  const next = steps[(state.stepIndex + 1) % Math.max(steps.length, 1)]
  const beats = now?.beats ?? 4
  const slot = resolved?.chords[state.stepIndex]
  const substitution = slot?.substitutedFor

  return (
    // While stopped this is a preview of the loop, not what the fretboard is
    // showing — which is whichever chord you picked to browse. Dimming it keeps
    // two different chord names from competing at the same weight on screen.
    <section
      aria-label="Current and next chord"
      className={`flex flex-col gap-2 transition-opacity ${state.running ? '' : 'opacity-55'}`}
    >
      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.2em] text-(--color-dim) uppercase">
            {state.countingIn ? 'Count in' : 'Now'}
          </p>
          <p
            className="font-semibold tracking-tight text-(--color-text) tabular-nums"
            style={{ fontSize: 'clamp(2.2rem, 5.5vw, 3.75rem)', lineHeight: 1.05 }}
          >
            {state.countingIn ? 4 + state.beat + 1 : (now?.label ?? '—')}
          </p>
        </div>
        <div>
          <p className="text-[11px] font-semibold tracking-[0.2em] text-(--color-dim) uppercase">
            Next
          </p>
          <p
            className="font-semibold tracking-tight text-(--color-role-root) tabular-nums"
            style={{ fontSize: 'clamp(2.2rem, 5.5vw, 3.75rem)', lineHeight: 1.05 }}
          >
            {next?.label ?? '—'}
          </p>
        </div>
      </div>

      {/* Beat position within the current chord. */}
      <div className="flex items-center gap-1.5" aria-hidden="true">
        {Array.from({ length: beats }, (_, i) => {
          const on = state.running && !state.countingIn && i === state.beatInStep
          return (
            <span
              key={i}
              className="h-2 rounded-full transition-colors"
              style={{
                width: i === 0 ? 22 : 14,
                background: on
                  ? 'var(--color-role-root)'
                  : i === 0
                    ? 'var(--color-line-bright)'
                    : 'var(--color-line)',
              }}
            />
          )
        })}
        <span className="ml-2 text-xs text-(--color-dim)">
          {state.running ? `beat ${state.beatInStep + 1} of ${beats}` : 'the loop, when you press play'}
        </span>
      </div>

      {substitution && (
        <p className="text-[13px] text-(--color-role-seventh)">
          Playing {now?.label} in place of {substitution} — it is on your avoid-list.
        </p>
      )}
    </section>
  )
}
