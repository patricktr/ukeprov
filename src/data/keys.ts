/**
 * The seven keys the dataset covers (PRD §7). The chord lists are diatonic,
 * plus the borrowed dominant that makes each minor key actually work — you do
 * not play a minor v, you play E7 in A minor and mean it.
 */
export interface KeyDef {
  id: string
  name: string
  /** Tonic note name, used to spell the scale overlay. */
  tonic: string
  mode: 'major' | 'minor'
  chords: string[]
}

export const KEYS: KeyDef[] = [
  { id: 'C', name: 'C major', tonic: 'C', mode: 'major', chords: ['C', 'Dm', 'Em', 'F', 'G', 'Am', 'Bdim'] },
  { id: 'F', name: 'F major', tonic: 'F', mode: 'major', chords: ['F', 'Gm', 'Am', 'Bb', 'C', 'Dm', 'Edim'] },
  { id: 'G', name: 'G major', tonic: 'G', mode: 'major', chords: ['G', 'Am', 'Bm', 'C', 'D', 'Em', 'F#dim'] },
  { id: 'D', name: 'D major', tonic: 'D', mode: 'major', chords: ['D', 'Em', 'F#m', 'G', 'A', 'Bm', 'C#dim'] },
  { id: 'Am', name: 'A minor', tonic: 'A', mode: 'minor', chords: ['Am', 'Bdim', 'C', 'Dm', 'Em', 'E7', 'F', 'G'] },
  { id: 'Em', name: 'E minor', tonic: 'E', mode: 'minor', chords: ['Em', 'F#dim', 'G', 'Am', 'Bm', 'B7', 'C', 'D'] },
  { id: 'Dm', name: 'D minor', tonic: 'D', mode: 'minor', chords: ['Dm', 'Edim', 'F', 'Gm', 'Am', 'A7', 'Bb', 'C'] },
]

/** Sevenths and colour chords that belong to a key without being diatonic triads. */
export const KEY_EXTRAS: Record<string, string[]> = {
  C: ['Cmaj7', 'C7', 'Dm7', 'Em7', 'Fmaj7', 'G7', 'Am7', 'A7'],
  F: ['Fmaj7', 'Gm7', 'Am7', 'Bbmaj7', 'C7', 'Dm7'],
  G: ['Gmaj7', 'Am7', 'Bm7', 'Cmaj7', 'D7', 'Em7'],
  D: ['D7', 'Em7', 'Gmaj7', 'A7', 'Bm7'],
  Am: ['Am7', 'Cmaj7', 'Dm7', 'Em7', 'Fmaj7', 'G7'],
  Em: ['Em7', 'Gmaj7', 'Am7', 'Bm7', 'Cmaj7', 'D7'],
  Dm: ['Dm7', 'Fmaj7', 'Gm7', 'Am7', 'Bbmaj7', 'C7'],
}
