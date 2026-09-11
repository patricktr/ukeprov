import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { ScaleId, Tuning } from '../lib/music'

/**
 * Session memory (PRD §5.8): "Remember last vamp, tempo, tuning, and
 * avoid-list in localStorage. Nothing else persists."
 *
 * Taken literally — the view toggles (note names, interval isolation, scale
 * overlay) deliberately start fresh each session. They are things you reach for
 * inside a practice session, not settings you hold an opinion about between
 * them.
 */
const STORAGE_KEY = 'wiggle-room:v1'

interface Persisted {
  tuning: Tuning
  bpm: number
  progressionId: string
  customChords: string[] | null
  avoid: string[]
  keyId: string
}

const DEFAULTS: Persisted = {
  tuning: 'high-g',
  bpm: 90,
  progressionId: 'fifties-c',
  customChords: null,
  // PRD §5.5: "E goes in it by default."
  avoid: ['E'],
  keyId: 'C',
}

function load(): Persisted {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULTS
    const parsed = JSON.parse(raw) as Partial<Persisted>
    return { ...DEFAULTS, ...parsed }
  } catch {
    // Private browsing, cleared storage, a corrupt value: defaults are fine.
    return DEFAULTS
  }
}

export interface AppState extends Persisted {
  chordId: string
  showNoteNames: boolean
  /** Isolate one interval, e.g. 4 for "show me only the 3rds" (PRD §5.2). */
  isolate: number | null
  scaleOverlay: ScaleId | null
  metronome: boolean
  chordSound: boolean
  countIn: boolean
  /** While the loop runs, the board shows whichever chord is sounding. */
  followVamp: boolean
  /** Switch the board to the next chord on the last beat of the current one. */
  lookAhead: boolean
}

type Setters = {
  set: <K extends keyof AppState>(key: K, value: AppState[K]) => void
  toggleAvoid: (chordId: string) => void
  reset: () => void
}

const Ctx = createContext<(AppState & Setters) | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [persisted, setPersisted] = useState<Persisted>(load)
  const [session, setSession] = useState<Omit<AppState, keyof Persisted>>({
    chordId: 'C',
    showNoteNames: false,
    isolate: null,
    scaleOverlay: null,
    metronome: true,
    chordSound: true,
    countIn: true,
    followVamp: true,
    lookAhead: false,
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(persisted))
    } catch {
      // Nothing to do; the app works fine without persistence.
    }
  }, [persisted])

  const set = useCallback(<K extends keyof AppState>(key: K, value: AppState[K]) => {
    if (key in DEFAULTS) setPersisted((p) => ({ ...p, [key]: value }))
    else setSession((s) => ({ ...s, [key]: value }))
  }, [])

  const toggleAvoid = useCallback((chordId: string) => {
    setPersisted((p) => ({
      ...p,
      avoid: p.avoid.includes(chordId)
        ? p.avoid.filter((id) => id !== chordId)
        : [...p.avoid, chordId],
    }))
  }, [])

  const reset = useCallback(() => setPersisted(DEFAULTS), [])

  const value = useMemo(
    () => ({ ...persisted, ...session, set, toggleAvoid, reset }),
    [persisted, session, set, toggleAvoid, reset],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useStore() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useStore must be used inside StoreProvider')
  return ctx
}
