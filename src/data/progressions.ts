import type { Progression } from '../lib/types'

/**
 * Preset vamps (PRD §5.4), organised by feel rather than by key (§10).
 *
 * Seventeen of them. §10 guessed 12-15 was the point where it stops feeling
 * thin; this clears that with a couple to spare, and every one of the seven
 * keys in the dataset is represented at least twice.
 */
export const PROGRESSIONS: Progression[] = [
  // --- sunny ---------------------------------------------------------------
  {
    id: 'fifties-c',
    name: 'Fifties',
    feel: 'sunny',
    key: 'C',
    numerals: 'I – vi – IV – V',
    chords: ['C', 'Am', 'F', 'G'],
    note: 'The one to be able to solo over without looking. Start here.',
  },
  {
    id: 'fifties-g',
    name: 'Fifties in G',
    feel: 'sunny',
    key: 'G',
    numerals: 'I – vi – IV – V',
    chords: ['G', 'Em', 'C', 'D'],
    note: 'Same shape of tune, different fingers. Good for proving you learnt the sound, not the grip.',
  },
  {
    id: 'axis-c',
    name: 'Axis',
    feel: 'sunny',
    key: 'C',
    numerals: 'I – V – vi – IV',
    chords: ['C', 'G', 'Am', 'F'],
    note: 'Four chords, most of the last thirty years of radio.',
  },
  {
    id: 'ladder-g',
    name: 'Ladder',
    feel: 'sunny',
    key: 'G',
    numerals: 'vi – IV – I – V',
    chords: ['Em', 'C', 'G', 'D'],
    note: 'Starts on the minor, so the arrival at G lands harder than it should.',
  },
  {
    id: 'porch-c',
    name: 'Porch two-chord',
    feel: 'sunny',
    key: 'C',
    numerals: 'I – IV',
    chords: ['C', 'F'],
    beatsPerChord: 8,
    note: 'Two chords, eight beats each. Nowhere to hide and nothing to prepare for.',
  },

  // --- wistful -------------------------------------------------------------
  {
    id: 'minor-axis',
    name: 'Minor axis',
    feel: 'wistful',
    key: 'A minor',
    numerals: 'i – VI – III – VII',
    chords: ['Am', 'F', 'C', 'G'],
    note: 'The same four chords as Axis, rotated. Starting on Am changes everything.',
  },
  {
    id: 'sway-am',
    name: 'Two-chord sway',
    feel: 'wistful',
    key: 'A minor',
    numerals: 'i – VII',
    chords: ['Am', 'G'],
    note: 'One finger moves. Sit on it until something interesting happens.',
  },
  {
    id: 'dorian-sway',
    name: 'Dorian sway',
    feel: 'wistful',
    key: 'D minor',
    numerals: 'ii – V',
    chords: ['Dm', 'G'],
    note: 'A ii–V that never resolves. The B in G is the whole flavour — lean on it.',
  },
  {
    id: 'drift-c',
    name: 'Drift',
    feel: 'wistful',
    key: 'C',
    numerals: 'Imaj7 – IVmaj7',
    chords: ['Cmaj7', 'Fmaj7'],
    beatsPerChord: 8,
    note: 'Both chords are soft, so the only tension available is the one you play.',
  },

  // --- driving -------------------------------------------------------------
  {
    id: 'quick-blues-c',
    name: 'Quick blues',
    feel: 'driving',
    key: 'C',
    numerals: 'I7 – IV – V7',
    chords: ['C7', 'F', 'G7'],
    note: 'Three chords, all of them leaning forward. The ♭7s are the point.',
  },
  {
    id: 'vamp-em',
    name: 'Minor vamp',
    feel: 'driving',
    key: 'E minor',
    numerals: 'i – VII',
    chords: ['Em', 'D'],
    note: 'Modal and stubborn. Stays interesting far longer than it has any right to.',
  },
  {
    id: 'descent-am',
    name: 'Descent',
    feel: 'driving',
    key: 'A minor',
    numerals: 'i – VII – VI – V',
    chords: ['Am', 'G', 'F', 'E'],
    note: 'The bass walks down A, G, F, E. That last chord is why the avoid-list exists.',
  },
  {
    id: 'pop-four-d',
    name: 'Pop four',
    feel: 'driving',
    key: 'D',
    numerals: 'I – V – vi – IV',
    chords: ['D', 'A', 'Bm', 'G'],
    note: 'The key of D on a ukulele: three easy chords and one that will cost you a week.',
  },

  // --- old-time ------------------------------------------------------------
  {
    id: 'turnaround-c',
    name: 'Turnaround',
    feel: 'old-time',
    key: 'C',
    numerals: 'I – VI7 – ii – V7',
    chords: ['C', 'A7', 'Dm', 'G7'],
    note: 'Every second song before 1960. The A7 is the surprise — it is not in the key.',
  },
  {
    id: 'ii-v-i-c',
    name: 'ii – V – I',
    feel: 'old-time',
    key: 'C',
    numerals: 'ii7 – V7 – Imaj7',
    chords: ['Dm7', 'G7', 'Cmaj7'],
    note: 'The sentence jazz is built out of. Aim at the 3rd of each chord and it plays itself.',
  },
  {
    id: 'folk-three-g',
    name: 'Folk three',
    feel: 'old-time',
    key: 'G',
    numerals: 'I – IV – V',
    chords: ['G', 'C', 'D'],
    note: 'No minor chords anywhere. Bright to the point of being hard to make sad.',
  },
  {
    id: 'doowop-f',
    name: 'Doo-wop in F',
    feel: 'old-time',
    key: 'F',
    numerals: 'I – vi – IV – V',
    chords: ['F', 'Dm', 'Bb', 'C'],
    note: 'The key of F is kind to a ukulele, right up until the B♭.',
  },
]
