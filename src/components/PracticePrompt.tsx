import { useCallback, useState } from 'react'
import { PRACTICE_PROMPTS } from '../data/prompts'
import type { PracticePrompt as Prompt } from '../lib/types'

/**
 * The constraint generator (PRD §5.6).
 *
 * Escalating but not gamified: the level selector exists so the button stops
 * handing you "root and 3rd only" in month three, not so there is a score. No
 * streaks, no points, no history — press it again and the last one is gone.
 */
export function PracticePromptCard() {
  const [level, setLevel] = useState(1)
  const [prompt, setPrompt] = useState<Prompt | null>(null)

  const draw = useCallback(() => {
    const pool = PRACTICE_PROMPTS.filter((p) => p.level <= level)
    const candidates = pool.filter((p) => p.id !== prompt?.id)
    const from = candidates.length ? candidates : pool
    setPrompt(from[Math.floor(Math.random() * from.length)]!)
  }, [level, prompt?.id])

  return (
    <section
      aria-labelledby="prompt-heading"
      className="rounded-lg border border-(--color-line) bg-(--color-panel-2) p-3"
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <h3
          id="prompt-heading"
          className="text-xs font-semibold tracking-[0.18em] text-(--color-dim) uppercase"
        >
          Practice prompt
        </h3>
        <div className="flex items-center gap-1" role="group" aria-label="Difficulty">
          {[1, 2, 3].map((l) => (
            <button
              key={l}
              type="button"
              aria-pressed={level === l}
              aria-label={`Difficulty ${l}`}
              onClick={() => setLevel(l)}
              className={`h-6 w-6 rounded-md border text-xs font-semibold transition-colors ${
                level === l
                  ? 'border-(--color-role-root) text-(--color-role-root)'
                  : 'border-(--color-line-bright) text-(--color-dim) hover:text-(--color-muted)'
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      <p
        aria-live="polite"
        className={`min-h-[2.5rem] text-[15px] leading-snug ${
          prompt ? 'text-(--color-text)' : 'text-(--color-dim) italic'
        }`}
      >
        {prompt?.text ?? 'Press for a restriction to play under for the next few minutes.'}
      </p>

      <button
        type="button"
        onClick={draw}
        className="mt-2 rounded-md border border-(--color-line-bright) px-3 py-1.5 text-sm font-medium text-(--color-muted) transition-colors hover:border-(--color-role-root) hover:text-(--color-role-root)"
      >
        {prompt ? 'Another' : 'Give me one'}
      </button>
    </section>
  )
}
