import { useEffect, useMemo, useState } from 'react'
import { CHORDS } from './data/chords'
import { PROGRESSIONS } from './data/progressions'
import { KEYS, KEY_EXTRAS } from './data/keys'
import {
  QUALITIES,
  SCALES,
  fretboardPositions,
  parseFrets,
  pitchClassOf,
} from './lib/music'
import { resolveProgression, toSteps } from './lib/vamp'
import { useStore } from './state/store'
import { useVamp } from './state/useVamp'
import { Fretboard } from './components/Fretboard'
import { Toolbar } from './components/Toolbar'
import { NowNext } from './components/NowNext'
import { ChordTonePanel } from './components/ChordTonePanel'
import { WiggleLibrary } from './components/WiggleLibrary'
import { PracticePromptCard } from './components/PracticePrompt'
import { SettingsPanel } from './components/SettingsPanel'

const CHORDS_BY_ID = new Map(CHORDS.map((c) => [c.id, c]))

export default function App() {
  const store = useStore()
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [shapeIndex, setShapeIndex] = useState(0)

  // --- the vamp ------------------------------------------------------------
  const resolvedAll = useMemo(
    () => PROGRESSIONS.map((p) => resolveProgression(p, CHORDS_BY_ID, store.avoid)),
    [store.avoid],
  )
  const playable = useMemo(() => resolvedAll.filter((r) => !r.blocked), [resolvedAll])
  const hidden = useMemo(
    () => resolvedAll.filter((r) => r.blocked).map((r) => r.progression),
    [resolvedAll],
  )

  const resolved =
    playable.find((r) => r.progression.id === store.progressionId) ?? playable[0] ?? null

  const steps = useMemo(() => (resolved ? toSteps(resolved) : []), [resolved])

  const vamp = useVamp({
    steps,
    bpm: store.bpm,
    tuning: store.tuning,
    metronome: store.metronome,
    chordSound: store.chordSound,
    countIn: store.countIn,
  })

  // When the avoid-list hides the vamp you were on we fall back to a playable
  // one for display and playback, but deliberately do not write that back to
  // the store: `progressionId` stays your choice, so un-avoiding the chord
  // brings your vamp back rather than stranding you on the substitute.

  // --- which chord the board is showing -------------------------------------
  const current = steps[vamp.state.stepIndex]
  const nextStep = steps[(vamp.state.stepIndex + 1) % Math.max(steps.length, 1)]
  const onLastBeat = current ? vamp.state.beatInStep === current.beats - 1 : false

  const displayedChordId =
    vamp.state.running && !vamp.state.countingIn && store.followVamp
      ? ((store.lookAhead && onLastBeat ? nextStep?.chordId : current?.chordId) ?? store.chordId)
      : store.chordId

  const chord = CHORDS_BY_ID.get(displayedChordId) ?? CHORDS_BY_ID.get('C')!

  useEffect(() => setShapeIndex(0), [displayedChordId])

  const positions = useMemo(() => {
    const rootPc = pitchClassOf(chord.root)
    const quality = QUALITIES[chord.quality]
    const scaleId = store.scaleOverlay ?? quality.parentScale
    return fretboardPositions(
      rootPc,
      quality.intervals,
      SCALES[scaleId].intervals,
      store.tuning,
    )
  }, [chord, store.scaleOverlay, store.tuning])

  const shape = chord.shapes[Math.min(shapeIndex, chord.shapes.length - 1)]!

  // --- chord picker groups --------------------------------------------------
  const chordOptions = useMemo(() => {
    const key = KEYS.find((k) => k.id === store.keyId)
    const ids = new Set([...(key?.chords ?? []), ...(KEY_EXTRAS[store.keyId] ?? [])])
    return {
      inKey: CHORDS.filter((c) => ids.has(c.id)),
      rest: CHORDS.filter((c) => !ids.has(c.id)),
    }
  }, [store.keyId])

  /** Changing key moves you to its tonic and the first vamp that lives there. */
  const changeKey = (id: string) => {
    store.set('keyId', id)
    const key = KEYS.find((k) => k.id === id)
    if (key) {
      store.set('chordId', key.chords[0]!)
      const inKey = playable.find((r) => r.progression.key.replace(' minor', 'm') === id)
      if (inKey) store.set('progressionId', inKey.progression.id)
    }
  }

  // Space bar starts and stops the loop — you are holding an instrument.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code !== 'Space' || e.repeat) return
      const el = e.target as HTMLElement | null
      if (el && /^(INPUT|SELECT|TEXTAREA|BUTTON)$/.test(el.tagName)) return
      e.preventDefault()
      vamp.toggle()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [vamp])

  return (
    <div className="flex h-full flex-col">
      <Toolbar
        keyId={store.keyId}
        onKey={changeKey}
        chordId={store.chordId}
        onChord={(id) => store.set('chordId', id)}
        chordOptions={chordOptions}
        progressionId={resolved?.progression.id ?? ''}
        onProgression={(id) => store.set('progressionId', id)}
        progressions={{ playable, hidden }}
        bpm={store.bpm}
        onBpm={(n) => store.set('bpm', n)}
        running={vamp.state.running}
        onToggle={vamp.toggle}
        onOpenSettings={() => setSettingsOpen(true)}
        avoid={store.avoid}
      />

      <main className="flex min-h-0 flex-1 flex-col gap-3 px-3 pt-3 pb-3">
        <div className="shrink-0">
          <Fretboard
            positions={positions}
            tuning={store.tuning}
            showNoteNames={store.showNoteNames}
            preferFlats={chord.root.includes('♭')}
            isolate={store.isolate}
            shape={parseFrets(shape.frets)}
            chordName={chord.name}
          />
        </div>

        <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-2">
          <div className="flex min-h-0 flex-col gap-4 overflow-y-auto pr-1">
            <NowNext steps={steps} state={vamp.state} resolved={resolved} />
            <ChordTonePanel
              chord={chord}
              positions={positions}
              tuning={store.tuning}
              isolate={store.isolate}
              onIsolate={(iv) => store.set('isolate', iv)}
              scaleOverlay={store.scaleOverlay}
              onScaleOverlay={(s) => store.set('scaleOverlay', s)}
              shapeIndex={shapeIndex}
              onShapeIndex={setShapeIndex}
            />
            <PracticePromptCard />
          </div>

          <WiggleLibrary chord={chord} tuning={store.tuning} bpm={store.bpm} />
        </div>
      </main>

      <SettingsPanel
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        chords={CHORDS}
        avoid={store.avoid}
        onToggleAvoid={store.toggleAvoid}
        tuning={store.tuning}
        onTuning={(t) => store.set('tuning', t)}
        showNoteNames={store.showNoteNames}
        onShowNoteNames={(v) => store.set('showNoteNames', v)}
        metronome={store.metronome}
        onMetronome={(v) => store.set('metronome', v)}
        chordSound={store.chordSound}
        onChordSound={(v) => store.set('chordSound', v)}
        countIn={store.countIn}
        onCountIn={(v) => store.set('countIn', v)}
        followVamp={store.followVamp}
        onFollowVamp={(v) => store.set('followVamp', v)}
        lookAhead={store.lookAhead}
        onLookAhead={(v) => store.set('lookAhead', v)}
        onReset={store.reset}
      />
    </div>
  )
}
