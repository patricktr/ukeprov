import { useCallback, useEffect, useState } from 'react'
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

  // Lazy initialiser rather than a ref written during render: it runs exactly
  // once, and the options below are immediately superseded by the effect.
  const [scheduler] = useState(
    () =>
      new VampScheduler({
        steps: options.steps,
        bpm: options.bpm,
        tuning: options.tuning,
        countInBeats: options.countIn ? 4 : 0,
        metronome: options.metronome,
        chordSound: options.chordSound,
      }),
  )

  useEffect(() => {
    scheduler.setListener(setState)
  }, [scheduler])

  useEffect(() => {
    scheduler.update({
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
    scheduler,
  ])

  useEffect(() => () => scheduler.stop(), [scheduler])

  const toggle = useCallback(() => {
    if (state.running) scheduler.stop()
    else scheduler.start()
  }, [state.running, scheduler])

  const stop = useCallback(() => scheduler.stop(), [scheduler])

  return { state, toggle, stop }
}
