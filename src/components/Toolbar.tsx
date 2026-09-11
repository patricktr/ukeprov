import type { Chord, Progression } from '../lib/types'
import { KEYS } from '../data/keys'
import type { ResolvedProgression } from '../lib/vamp'

/**
 * The single row of controls (PRD §6): key, chord, vamp, tempo, play, settings.
 * Everything else in the app is a display; this is the only place you change
 * what you are looking at.
 */

export interface ToolbarProps {
  keyId: string
  onKey: (id: string) => void
  chordId: string
  onChord: (id: string) => void
  chordOptions: { inKey: Chord[]; rest: Chord[] }
  progressionId: string
  onProgression: (id: string) => void
  progressions: { playable: ResolvedProgression[]; hidden: Progression[] }
  bpm: number
  onBpm: (n: number) => void
  running: boolean
  onToggle: () => void
  onOpenSettings: () => void
  avoid: string[]
}

const selectClass =
  'rounded-md border border-(--color-line-bright) bg-(--color-panel-2) px-2.5 py-2 text-sm text-(--color-text) transition-colors hover:border-(--color-muted) focus:border-(--color-role-root)'

export function Toolbar({
  keyId,
  onKey,
  chordId,
  onChord,
  chordOptions,
  progressionId,
  onProgression,
  progressions,
  bpm,
  onBpm,
  running,
  onToggle,
  onOpenSettings,
  avoid,
}: ToolbarProps) {
  const mark = (c: Chord) => (avoid.includes(c.id) ? `${c.name} · avoided` : c.name)

  return (
    <header className="flex shrink-0 flex-wrap items-center gap-2 border-b border-(--color-line) bg-(--color-panel) px-3 py-2.5">
      <h1 className="mr-1 flex items-center gap-2 text-sm font-semibold tracking-tight">
        <span
          aria-hidden="true"
          className="inline-block h-3.5 w-3.5 rounded-[3px] bg-(--color-role-root)"
        />
        Wiggle Room
      </h1>

      <label className="flex items-center gap-1.5 text-xs text-(--color-dim)">
        <span className="sr-only sm:not-sr-only tracking-wide uppercase">Key</span>
        <select value={keyId} onChange={(e) => onKey(e.target.value)} className={selectClass}>
          {KEYS.map((k) => (
            <option key={k.id} value={k.id}>
              {k.name}
            </option>
          ))}
        </select>
      </label>

      <label className="flex items-center gap-1.5 text-xs text-(--color-dim)">
        <span className="sr-only sm:not-sr-only tracking-wide uppercase">Chord</span>
        <select value={chordId} onChange={(e) => onChord(e.target.value)} className={selectClass}>
          <optgroup label={`In ${KEYS.find((k) => k.id === keyId)?.name ?? keyId}`}>
            {chordOptions.inKey.map((c) => (
              <option key={c.id} value={c.id}>
                {mark(c)}
              </option>
            ))}
          </optgroup>
          <optgroup label="Everything else">
            {chordOptions.rest.map((c) => (
              <option key={c.id} value={c.id}>
                {mark(c)}
              </option>
            ))}
          </optgroup>
        </select>
      </label>

      <label className="flex items-center gap-1.5 text-xs text-(--color-dim)">
        <span className="sr-only sm:not-sr-only tracking-wide uppercase">Vamp</span>
        <select
          value={progressionId}
          onChange={(e) => onProgression(e.target.value)}
          className={selectClass}
        >
          {(['sunny', 'wistful', 'driving', 'old-time'] as const).map((feel) => {
            const group = progressions.playable.filter((r) => r.progression.feel === feel)
            if (!group.length) return null
            return (
              <optgroup key={feel} label={feel === 'old-time' ? 'Old-time' : feel[0]!.toUpperCase() + feel.slice(1)}>
                {group.map((r) => (
                  <option key={r.progression.id} value={r.progression.id}>
                    {r.progression.name} · {r.chords.map((c) => c.label).join(' ')}
                    {r.clean ? '' : ' ✦'}
                  </option>
                ))}
              </optgroup>
            )
          })}
        </select>
      </label>

      <label className="flex items-center gap-2 text-xs text-(--color-dim)">
        <span className="tracking-wide uppercase">Tempo</span>
        <input
          type="range"
          min={50}
          max={160}
          step={1}
          value={bpm}
          onChange={(e) => onBpm(Number(e.target.value))}
          className="w-28 accent-(--color-role-root)"
          aria-label="Tempo in beats per minute"
        />
        <span className="w-14 font-mono text-sm text-(--color-text) tabular-nums">{bpm} bpm</span>
      </label>

      <div className="ml-auto flex items-center gap-2">
        <button
          type="button"
          onClick={onToggle}
          aria-pressed={running}
          className={`rounded-md px-4 py-2 text-sm font-semibold transition-colors ${
            running
              ? 'bg-(--color-role-root) text-black'
              : 'border border-(--color-line-bright) text-(--color-text) hover:border-(--color-role-root) hover:text-(--color-role-root)'
          }`}
        >
          {running ? '■ Stop' : '▶ Play'}
        </button>
        <button
          type="button"
          onClick={onOpenSettings}
          aria-label="Settings"
          className="rounded-md border border-(--color-line-bright) px-3 py-2 text-sm text-(--color-muted) transition-colors hover:border-(--color-muted) hover:text-(--color-text)"
        >
          ⚙
        </button>
      </div>

      {progressions.hidden.length > 0 && (
        <p className="basis-full text-[11px] text-(--color-dim)">
          {progressions.hidden.length} vamp{progressions.hidden.length === 1 ? '' : 's'} hidden —
          they need a chord on your avoid-list that has no substitute.
        </p>
      )}
    </header>
  )
}
