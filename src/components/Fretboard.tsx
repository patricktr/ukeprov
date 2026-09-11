import { useCallback, useRef } from 'react'
import {
  FRET_COUNT,
  STRING_LABELS,
  TUNINGS,
  type FretArray,
  type Position,
  type Tuning,
  midiToName,
} from '../lib/music'
import { isAudioReady, playNote } from '../audio/engine'

/**
 * The fretboard (PRD §5.1). Horizontal, first 7 frets, four strings, GCEA
 * top to bottom — the same order as fret-string notation, so "0003" reads
 * straight down the board.
 *
 * Fret spacing follows real scale-length maths rather than being evenly
 * divided, because a board with even frets looks wrong to anyone who has held
 * the instrument.
 */

const NUT_X = 116
const END_X = 1012
const TOP_Y = 58
const STRING_GAP = 58
const VIEW_W = 1040
const VIEW_H = 296

/** Distance from nut to fret n on a scale of length L is L(1 - 2^(-n/12)). */
const RATIO = (n: number) => 1 - Math.pow(2, -n / 12)
const SCALE = (END_X - NUT_X) / RATIO(FRET_COUNT)
const fretX = (n: number) => NUT_X + SCALE * RATIO(n)

const stringY = (s: number) => TOP_Y + s * STRING_GAP
/** Dots sit between frets, where a finger actually goes. Open notes sit left of the nut. */
const dotX = (fret: number) => (fret === 0 ? 64 : (fretX(fret - 1) + fretX(fret)) / 2)

/**
 * String gauges. In high-G the 4th string is a thin reentrant string; in low-G
 * it is a fat wound one. Drawing that difference makes the toggle legible at a
 * glance rather than being a word you have to remember you set.
 */
const GAUGES: Record<Tuning, number[]> = {
  'high-g': [2.1, 3.0, 2.4, 1.7],
  'low-g': [3.6, 3.0, 2.4, 1.7],
}

const ROLE_COLOR: Record<string, string> = {
  R: 'var(--color-role-root)',
  '3': 'var(--color-role-third)',
  '♭3': 'var(--color-role-third)',
  '5': 'var(--color-role-fifth)',
  '♭5': 'var(--color-role-fifth)',
  '♯5': 'var(--color-role-fifth)',
  '♭7': 'var(--color-role-seventh)',
  '7': 'var(--color-role-seventh)',
}

const ROLE_RADIUS: Record<string, number> = {
  R: 18,
  '3': 17,
  '♭3': 17,
  '5': 14,
  '♭5': 14,
  '♯5': 14,
  '♭7': 15.5,
  '7': 15.5,
}

export interface FretboardProps {
  positions: Position[]
  tuning: Tuning
  showNoteNames: boolean
  preferFlats: boolean
  /** Show only this interval among the chord tones (PRD §5.2). */
  isolate: number | null
  /** Ring the notes of the shape currently being held, if any. */
  shape?: FretArray | null
  chordName: string
}

export function Fretboard({
  positions,
  tuning,
  showNoteNames,
  preferFlats,
  isolate,
  shape,
  chordName,
}: FretboardProps) {
  // Hovering a dot plays it, but only once you have already made a gesture
  // somewhere — browsers will not open an AudioContext on hover alone, and a
  // silent no-op is better than a dot that sometimes works.
  const lastHover = useRef<{ key: string; at: number }>({ key: '', at: 0 })

  const inShape = (p: Position) => shape?.[p.string] === p.fret

  const hover = useCallback((p: Position) => {
    if (!isAudioReady()) return
    const key = `${p.string}:${p.fret}`
    const now = performance.now()
    if (lastHover.current.key === key && now - lastHover.current.at < 140) return
    lastHover.current = { key, at: now }
    playNote(p.midi, { gain: 0.36 })
  }, [])

  return (
    <div className="scroll-x w-full">
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        className="block h-auto w-full min-w-[760px]"
        role="img"
        aria-label={`Fretboard showing the chord tones of ${chordName} in ${
          tuning === 'high-g' ? 'high-G reentrant' : 'low-G'
        } tuning, first ${FRET_COUNT} frets`}
      >
        {/* Board */}
        <rect
          x={NUT_X}
          y={TOP_Y - 30}
          width={END_X - NUT_X}
          height={STRING_GAP * 3 + 60}
          rx="4"
          fill="#1a1d24"
        />

        {/* Inlay markers. A ukulele has them at 5, 7 and 10. */}
        {[5, 7].map((n) => (
          <circle
            key={n}
            cx={dotX(n)}
            cy={TOP_Y + STRING_GAP * 1.5}
            r="7"
            fill="var(--color-line-bright)"
            opacity="0.5"
          />
        ))}

        {/* Frets */}
        {Array.from({ length: FRET_COUNT }, (_, i) => i + 1).map((n) => (
          <line
            key={n}
            x1={fretX(n)}
            y1={TOP_Y - 30}
            x2={fretX(n)}
            y2={TOP_Y + STRING_GAP * 3 + 30}
            stroke="var(--color-line-bright)"
            strokeWidth="2.5"
          />
        ))}

        {/* Nut */}
        <rect
          x={NUT_X - 7}
          y={TOP_Y - 32}
          width="8"
          height={STRING_GAP * 3 + 64}
          rx="2"
          fill="#cfd6e0"
        />

        {/* Strings, with the open-string name at the left */}
        {STRING_LABELS.map((label, s) => (
          <g key={label}>
            <line
              x1={NUT_X - 7}
              y1={stringY(s)}
              x2={END_X}
              y2={stringY(s)}
              stroke="#98a3b4"
              strokeWidth={GAUGES[tuning][s]}
              opacity="0.75"
            />
            <text
              x="22"
              y={stringY(s) + 6}
              fill="var(--color-muted)"
              fontSize="19"
              fontWeight="600"
              fontFamily="var(--font-mono)"
            >
              {label}
            </text>
          </g>
        ))}

        {/* Fret numbers */}
        {Array.from({ length: FRET_COUNT }, (_, i) => i + 1).map((n) => (
          <text
            key={n}
            x={dotX(n)}
            y={VIEW_H - 6}
            textAnchor="middle"
            fill="var(--color-dim)"
            fontSize="16"
            fontFamily="var(--font-mono)"
          >
            {n}
          </text>
        ))}

        {/* Ghost dots first, so chord tones always paint over them */}
        {positions
          .filter((p) => !p.isChordTone)
          .map((p) => {
            if (isolate !== null) return null
            return (
              <circle
                key={`g${p.string}-${p.fret}`}
                cx={dotX(p.fret)}
                cy={stringY(p.string)}
                r="8"
                fill="var(--color-ghost)"
                onPointerEnter={() => hover(p)}
                onPointerDown={() => playNote(p.midi, { gain: 0.3 })}
                className="cursor-pointer"
              >
                <title>{`${midiToName(p.midi, preferFlats)} — ${p.label} (scale)`}</title>
              </circle>
            )
          })}

        {/* Chord tones */}
        {positions
          .filter((p) => p.isChordTone)
          .map((p) => {
            const dimmed = isolate !== null && p.interval !== isolate
            const color = ROLE_COLOR[p.label] ?? 'var(--color-role-other)'
            const r = ROLE_RADIUS[p.label] ?? 15
            const held = inShape(p)
            const name = midiToName(p.midi, preferFlats)
            return (
              <g
                key={`${p.string}-${p.fret}`}
                opacity={dimmed ? 0.16 : 1}
                tabIndex={dimmed ? -1 : 0}
                role="button"
                aria-label={`${name}, the ${p.label} of ${chordName}, string ${
                  STRING_LABELS[p.string]
                } fret ${p.fret}`}
                className="cursor-pointer focus:outline-none"
                onPointerEnter={() => !dimmed && hover(p)}
                onPointerDown={() => playNote(p.midi, { gain: 0.5 })}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    playNote(p.midi, { gain: 0.5 })
                  }
                }}
              >
                {held && (
                  <circle
                    cx={dotX(p.fret)}
                    cy={stringY(p.string)}
                    r={r + 6}
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="2"
                    opacity="0.55"
                  />
                )}
                <circle cx={dotX(p.fret)} cy={stringY(p.string)} r={r} fill={color} />
                <text
                  x={dotX(p.fret)}
                  y={stringY(p.string) + (showNoteNames ? 5 : 6)}
                  textAnchor="middle"
                  fontSize={showNoteNames ? 14 : 16}
                  fontWeight="700"
                  fill="#14171d"
                  fontFamily="var(--font-mono)"
                  pointerEvents="none"
                >
                  {showNoteNames ? name.replace(/\d/, '') : p.label}
                </text>
                <title>{`${name} — ${p.label} of ${chordName}`}</title>
              </g>
            )
          })}
      </svg>

      {/* The register only changes in low-G, so say so rather than leaving the
          identical dot map to imply the toggle did nothing. */}
      <p className="mt-1 px-1 text-center text-xs text-(--color-dim)">
        Open strings:{' '}
        <span className="font-mono text-(--color-muted)">
          {TUNINGS[tuning].map((m) => midiToName(m, preferFlats)).join('  ')}
        </span>
      </p>
    </div>
  )
}
