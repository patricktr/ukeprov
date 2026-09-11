/**
 * The store's shape and its context object, kept apart from the provider.
 *
 * Not an arbitrary split: a module that exports both a component and other
 * values loses React Fast Refresh for that component, so the provider lives
 * alone in store.tsx and the hook alone in useStore.ts.
 */
import { createContext } from 'react'
import type { ScaleId, Tuning } from '../lib/music'

export interface Persisted {
  tuning: Tuning
  bpm: number
  progressionId: string
  customChords: string[] | null
  avoid: string[]
  keyId: string
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

export type Setters = {
  set: <K extends keyof AppState>(key: K, value: AppState[K]) => void
  toggleAvoid: (chordId: string) => void
  reset: () => void
}

export const StoreCtx = createContext<(AppState & Setters) | null>(null)
