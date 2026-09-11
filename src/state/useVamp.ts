import { useCallback, useEffect, useRef, useState } from 'react'
import { VampScheduler, type VampState, type VampStep } from '../audio/scheduler'
import type { Tuning } from '../lib/music'

const IDLE: VampState = {
  running: false,
  stepIndex: 0,
  beatInStep: 0,
  beat: 0,
  countingIn: false,
}

export interface UseVampOptions {
  steps: VampStep[]
  bpm: number
  tuning: Tuning
  metronome: boolean
  chordSound: boolean
  countIn: boolean
}

/**
 * Owns the scheduler for the life of the page. Tempo and the sound toggles are
 * pushed into the running loop rather than restarting it — you change tempo
 * while playing, and a restart would drop you back into the count-in.
 * Changing the chords themselves does restart, because there is no sensible
 * place to land mid-loop.
 */
export function useVamp(options: UseVampOptions) {
  const [state, setState] = useState<VampState>(IDLE)
  const scheduler = useRef<VampScheduler | null>(null)

  if (!scheduler.current) {
    scheduler.current = new VampScheduler(
      {
        steps: options.steps,
        bpm: options.bpm,
        tuning: options.tuning,
        countInBeats: options.countIn ? 4 : 0,
        metronome: options.metronome,
        chordSound: options.chordSound,
      },
      setState,
    )
  }

  useEffect(() => {
    scheduler.current?.update({
      steps: options.steps,
      bpm: options.bpm,
      tuning: options.tuning,
      countInBeats: options.countIn ? 4 : 0,
      metronome: options.metronome,
      chordSound: options.chordSound,
    })
  }, [
    options.steps,
    options.bpm,
    options.tuning,
    options.countIn,
    options.metronome,
    options.chordSound,
  ])

  useEffect(() => () => scheduler.current?.stop(), [])

  const toggle = useCallback(() => {
    const s = scheduler.current
    if (!s) return
    if (state.running) s.stop()
    else s.start()
  }, [state.running])

  const stop = useCallback(() => scheduler.current?.stop(), [])

  return { state, toggle, stop }
}
