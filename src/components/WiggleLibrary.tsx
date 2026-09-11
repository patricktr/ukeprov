import { useCallback, useRef, useState } from 'react'
import type { Chord, Wiggle } from '../lib/types'
import { parseFrets, type Tuning, identifyShape, pitchClassOf } from '../lib/music'
import { ensureAudio, strum } from '../audio/engine'
import { ChordDiagram } from './ChordDiagram'

/**
 * The wiggle library (PRD §5.3). "The thing I most want to be able to browse
 * idly. It should feel like flipping through a card deck, not reading a table."
 *
 * So: cards, one per wiggle, each one self-contained — the notation, a diagram
 * per position with the moving finger picked out in amber, the sentence, and a
 * play button. Nothing is behind a disclosure triangle.
 */

/** Which strings changed between two steps: the fingers that actually move. */
function movedStrings(from: string | undefined, to: string): boolean[] {
  if (!from) return [false, false, false, false]
  const a = parseFrets(from)
  const b = parseFrets(to)
  return b.map((f, i) => f !== a[i])
}

function useSequencePlayer(tuning: Tuning, bpm: number) {
  const timers = useRef<number[]>([])
  const [playingId, setPlayingId] = useState<string | null>(null)

  const stop = useCallback(() => {
    timers.current.forEach(clearTimeout)
    timers.current = []
    setPlayingId(null)
  }, [])

  const play = useCallback(
    (id: string, sequence: string[]) => {
      stop()
      const ctx = ensureAudio()
      // One step per beat at the current tempo, so a wiggle browsed here feels
      // like the same thing you will play over the vamp.
      const step = Math.max(0.45, 60 / bpm)
      setPlayingId(id)
      sequence.forEach((frets, i) => {
        strum(parseFrets(frets), tuning, { when: ctx.currentTime + 0.05 + i * step })
      })
      timers.current.push(
        window.setTimeout(() => setPlayingId(null), (sequence.length * step + 0.4) * 1000),
      )
    },
    [bpm, stop, tuning],
  )

  return { play, stop, playingId }
}

interface CardProps {
  wiggle: Wiggle
  chord: Chord
  tuning: Tuning
  playing: boolean
  onPlay: () => void
}

function WiggleCard({ wiggle, chord, tuning, playing, onPlay }: CardProps) {
  const preferFlats = chord.root.includes('♭') || chord.root.includes('b')
  const rootPc = pitchClassOf(chord.root)

  const label = (frets: string, i: number) => {
    const override = wiggle.labels?.[i]
    if (override) return override
    // Fall back to naming the shape, with this chord's root preferred so the
    // reading stays in the context you are actually playing in.
    return identifyShape(parseFrets(frets), tuning, rootPc, preferFlats)?.name ?? frets
  }

  return (
    <article className="rounded-lg border border-(--color-line) bg-(--color-panel-2) p-3 transition-colors hover:border-(--color-line-bright)">
      <header className="mb-2 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h4 className="truncate text-sm font-semibold text-(--color-text)">{wiggle.name}</h4>
          <p className="mt-0.5 font-mono text-xs text-(--color-dim)">
            {wiggle.sequence.join(' → ')}
          </p>
        </div>
        <button
          type="button"
          onClick={onPlay}
          aria-label={`Play ${wiggle.name}`}
          className={`shrink-0 rounded-md border px-2.5 py-1.5 text-xs font-semibold transition-colors ${
            playing
              ? 'border-(--color-role-root) bg-(--color-role-root) text-black'
              : 'border-(--color-line-bright) text-(--color-muted) hover:border-(--color-role-root) hover:text-(--color-role-root)'
          }`}
        >
          {playing ? '♪' : '▶'}
        </button>
      </header>

      <div className="flex flex-wrap items-start gap-1">
        {wiggle.sequence.map((frets, i) => (
          <div key={`${frets}-${i}`} className="flex items-start gap-1">
            {i > 0 && <span className="mt-6 text-sm text-(--color-dim)">→</span>}
            <ChordDiagram
              frets={frets}
              label={label(frets, i)}
              moved={movedStrings(wiggle.sequence[i - 1], frets)}
            />
          </div>
        ))}
      </div>

      <p className="mt-2 text-[13px] leading-snug text-(--color-muted)">{wiggle.note}</p>
    </article>
  )
}

export interface WiggleLibraryProps {
  chord: Chord
  tuning: Tuning
  bpm: number
}

export function WiggleLibrary({ chord, tuning, bpm }: WiggleLibraryProps) {
  const { play, playingId } = useSequencePlayer(tuning, bpm)

  return (
    <section aria-labelledby="wiggles-heading" className="flex min-h-0 flex-col">
      <h3
        id="wiggles-heading"
        className="mb-2 shrink-0 text-xs font-semibold tracking-[0.18em] text-(--color-dim) uppercase"
      >
        Wiggles for {chord.name}
      </h3>
      <div className="grid min-h-0 flex-1 gap-2 overflow-y-auto pr-1 sm:grid-cols-2">
        {chord.wiggles.map((w) => (
          <WiggleCard
            key={w.id}
            wiggle={w}
            chord={chord}
            tuning={tuning}
            playing={playingId === w.id}
            onPlay={() => play(w.id, w.sequence)}
          />
        ))}
      </div>
    </section>
  )
}
