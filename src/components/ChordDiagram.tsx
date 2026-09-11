import { parseFrets } from '../lib/music'

/**
 * A mini chord diagram, one per position in a wiggle (PRD §5.3).
 *
 * Drawn the conventional way round — strings vertical, GCEA left to right, nut
 * at the top — because that is what every chord chart you have ever seen looks
 * like, even though the main fretboard is horizontal. Switching orientation
 * between the two is not a mistake; it is the difference between "where this
 * note lives on the neck" and "what my hand does".
 */

const FRETS_SHOWN = 4

export interface ChordDiagramProps {
  frets: string
  size?: number
  label?: string
  /** Dots that changed from the previous diagram, highlighted as the movement. */
  moved?: boolean[]
}

export function ChordDiagram({ frets, size = 1, label, moved }: ChordDiagramProps) {
  const parsed = parseFrets(frets)
  const fretted = parsed.filter((f): f is number => f !== null && f > 0)
  const highest = fretted.length ? Math.max(...fretted) : 0
  const lowest = fretted.length ? Math.min(...fretted) : 1

  // Slide the window up the neck only when the shape genuinely needs it.
  const start = highest <= FRETS_SHOWN ? 1 : lowest
  const openNut = start === 1

  const sx = 13 * size
  const sy = 15 * size
  const padX = 9 * size
  const padTop = 16 * size
  const w = padX * 2 + sx * 3
  const h = padTop + sy * FRETS_SHOWN + 6 * size

  const x = (s: number) => padX + s * sx
  const y = (row: number) => padTop + row * sy

  return (
    <figure className="flex flex-col items-center gap-1">
      <svg
        width={w}
        height={h}
        viewBox={`0 0 ${w} ${h}`}
        role="img"
        aria-label={`${label ?? frets}: frets ${frets}`}
      >
        {/* Nut, or the fret number when the shape sits up the neck */}
        {openNut ? (
          <rect x={x(0) - 1} y={y(0) - 3} width={sx * 3 + 2} height={3.5 * size} fill="#cfd6e0" />
        ) : (
          <text
            x={x(0) - 5 * size}
            y={y(0) + sy * 0.75}
            textAnchor="end"
            fontSize={9 * size}
            fill="var(--color-dim)"
            fontFamily="var(--font-mono)"
          >
            {start}
          </text>
        )}

        {/* Frets */}
        {Array.from({ length: FRETS_SHOWN + 1 }, (_, r) => (
          <line
            key={r}
            x1={x(0)}
            y1={y(r)}
            x2={x(3)}
            y2={y(r)}
            stroke="var(--color-line-bright)"
            strokeWidth={1 * size}
          />
        ))}

        {/* Strings */}
        {[0, 1, 2, 3].map((s) => (
          <line
            key={s}
            x1={x(s)}
            y1={y(0)}
            x2={x(s)}
            y2={y(FRETS_SHOWN)}
            stroke="var(--color-line-bright)"
            strokeWidth={1 * size}
          />
        ))}

        {/* Fingers, open circles and mutes */}
        {parsed.map((f, s) => {
          const changed = moved?.[s] ?? false
          const fill = changed ? 'var(--color-role-root)' : '#dfe5ee'
          if (f === null) {
            return (
              <text
                key={s}
                x={x(s)}
                y={y(0) - 5 * size}
                textAnchor="middle"
                fontSize={9 * size}
                fill="var(--color-dim)"
              >
                ×
              </text>
            )
          }
          if (f === 0) {
            return (
              <circle
                key={s}
                cx={x(s)}
                cy={y(0) - 8 * size}
                r={3.2 * size}
                fill="none"
                stroke={changed ? 'var(--color-role-root)' : 'var(--color-muted)'}
                strokeWidth={1.4 * size}
              />
            )
          }
          const row = f - start
          if (row < 0 || row >= FRETS_SHOWN) return null
          return (
            <circle
              key={s}
              cx={x(s)}
              cy={y(row) + sy / 2}
              r={4.6 * size}
              fill={fill}
            />
          )
        })}
      </svg>
      {label && (
        <figcaption className="text-[11px] leading-none font-medium text-(--color-muted)">
          {label}
        </figcaption>
      )}
    </figure>
  )
}
