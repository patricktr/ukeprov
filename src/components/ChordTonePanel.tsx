import type { Chord } from '../lib/types'
import {
  INTERVAL_LABELS,
  OVERLAY_SCALES,
  QUALITIES,
  SCALES,
  type Position,
  type ScaleId,
  type Tuning,
  bassPitchClass,
  midiToName,
  mod12,
  noteName,
  parseFrets,
  pitchClassOf,
  shapeMidi,
} from '../lib/music'
import { ensureAudio, strum } from '../audio/engine'

/**
 * The chord tone browser (PRD §5.2). Plain text first — "C major: C E G — six
 * places in the first seven frets" — then the interval isolation buttons,
 * because "show me only the 3rds" is how the drilling actually happens.
 */

const ROLE_VAR: Record<string, string> = {
  R: 'var(--color-role-root)',
  '3': 'var(--color-role-third)',
  '♭3': 'var(--color-role-third)',
  '5': 'var(--color-role-fifth)',
  '♭5': 'var(--color-role-fifth)',
  '♭7': 'var(--color-role-seventh)',
  '7': 'var(--color-role-seventh)',
}

const NUMBER_WORDS = [
  'no',
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
  'ten',
  'eleven',
  'twelve',
]
const count = (n: number) => NUMBER_WORDS[n] ?? String(n)

export interface ChordTonePanelProps {
  chord: Chord
  positions: Position[]
  tuning: Tuning
  isolate: number | null
  onIsolate: (interval: number | null) => void
  scaleOverlay: ScaleId | null
  onScaleOverlay: (scale: ScaleId | null) => void
  shapeIndex: number
  onShapeIndex: (i: number) => void
}

export function ChordTonePanel({
  chord,
  positions,
  tuning,
  isolate,
  onIsolate,
  scaleOverlay,
  onScaleOverlay,
  shapeIndex,
  onShapeIndex,
}: ChordTonePanelProps) {
  const preferFlats = chord.root.includes('♭')
  const rootPc = pitchClassOf(chord.root)
  const intervals = QUALITIES[chord.quality].intervals
  const toneNames = intervals.map((i) => noteName(mod12(rootPc + i), preferFlats))
  const chordTones = positions.filter((p) => p.isChordTone)

  const shape = chord.shapes[Math.min(shapeIndex, chord.shapes.length - 1)]!
  const bass = bassPitchClass(parseFrets(shape.frets), tuning)

  return (
    <section aria-labelledby="tones-heading" className="flex flex-col gap-3">
      <h3
        id="tones-heading"
        className="text-xs font-semibold tracking-[0.18em] text-(--color-dim) uppercase"
      >
        Chord tones
      </h3>

      <p className="text-[15px] leading-snug text-(--color-text)">
        <span className="font-semibold">{chord.name}:</span>{' '}
        <span className="font-mono">{toneNames.join(' ')}</span>
        <span className="text-(--color-muted)">
          {' '}
          — {count(chordTones.length)} place{chordTones.length === 1 ? '' : 's'} in the first seven
          frets.
        </span>
      </p>

      {/* Interval isolation. The counts sit on the buttons because "there are
          only two 3rds down here" is itself the useful fact. */}
      <div className="flex flex-wrap gap-1.5">
        {intervals.map((iv) => {
          const label = INTERVAL_LABELS[iv]!
          const n = chordTones.filter((p) => p.interval === iv).length
          const active = isolate === iv
          return (
            <button
              key={iv}
              type="button"
              aria-pressed={active}
              onClick={() => onIsolate(active ? null : iv)}
              className="rounded-md border px-3 py-1.5 text-sm font-semibold transition-colors"
              style={{
                borderColor: active ? ROLE_VAR[label] : 'var(--color-line-bright)',
                background: active ? ROLE_VAR[label] : 'transparent',
                color: active ? '#14171d' : ROLE_VAR[label],
              }}
            >
              {label}
              <span className={`ml-1.5 text-xs ${active ? 'opacity-60' : 'opacity-50'}`}>{n}</span>
            </button>
          )
        })}
        {isolate !== null && (
          <button
            type="button"
            onClick={() => onIsolate(null)}
            className="rounded-md border border-(--color-line-bright) px-3 py-1.5 text-sm text-(--color-muted) hover:text-(--color-text)"
          >
            Show all
          </button>
        )}
      </div>

      {/* Scale overlay (PRD §5.7): secondary to chord tones by design. */}
      <label className="flex items-center gap-2 text-xs text-(--color-muted)">
        <span className="tracking-wide uppercase">Scale</span>
        <select
          value={scaleOverlay ?? ''}
          onChange={(e) => onScaleOverlay((e.target.value || null) as ScaleId | null)}
          className="flex-1 rounded-md border border-(--color-line-bright) bg-(--color-panel-2) px-2 py-1.5 text-sm text-(--color-text)"
        >
          <option value="">
            Parent scale ({SCALES[QUALITIES[chord.quality].parentScale].name.toLowerCase()})
          </option>
          {OVERLAY_SCALES.map((id) => (
            <option key={id} value={id}>
              {SCALES[id].name}
            </option>
          ))}
        </select>
      </label>

      {/* Voicings. Selecting one rings it on the big fretboard, which is the
          bridge between "the shape I am holding" and "the notes I am aiming at". */}
      <div>
        <h4 className="mb-1.5 text-xs font-semibold tracking-[0.18em] text-(--color-dim) uppercase">
          Shapes
        </h4>
        <div className="flex flex-wrap items-center gap-1.5">
          {chord.shapes.map((s, i) => (
            <button
              key={s.frets}
              type="button"
              aria-pressed={i === shapeIndex}
              onClick={() => {
                onShapeIndex(i)
                const ctx = ensureAudio()
                strum(parseFrets(s.frets), tuning, { when: ctx.currentTime + 0.02 })
              }}
              className={`rounded-md border px-2.5 py-1.5 font-mono text-sm transition-colors ${
                i === shapeIndex
                  ? 'border-(--color-role-root) bg-(--color-role-root)/10 text-(--color-role-root)'
                  : 'border-(--color-line-bright) text-(--color-muted) hover:text-(--color-text)'
              }`}
            >
              {s.frets}
              <span className="ml-1.5 text-[10px] opacity-60">{'●'.repeat(s.difficulty)}</span>
            </button>
          ))}
        </div>
        {shape.note && (
          <p className="mt-1.5 text-[13px] leading-snug text-(--color-muted)">{shape.note}</p>
        )}
        {shape.omits?.length ? (
          <p className="mt-1 text-[13px] leading-snug text-(--color-role-seventh)">
            Leaves out the {shape.omits.join(' and ')}.
          </p>
        ) : null}
        {bass !== null && (
          <p className="mt-1 text-[13px] text-(--color-dim)">
            Lowest note{' '}
            <span className="font-mono text-(--color-muted)">
              {midiToName(shapeMidi(parseFrets(shape.frets), tuning)[0]!, preferFlats)}
            </span>
            {' · '}
            {INTERVAL_LABELS[mod12(bass - rootPc)]} of the chord
          </p>
        )}
      </div>

      {chord.note && (
        <p className="border-l-2 border-(--color-line-bright) pl-3 text-[13px] leading-snug text-(--color-muted) italic">
          {chord.note}
        </p>
      )}
    </section>
  )
}
