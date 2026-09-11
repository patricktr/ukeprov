import type { Chord } from '../lib/types'

/**
 * The chord dataset: every chord in the keys of C, F, G, D, A minor, E minor
 * and D minor (PRD §7).
 *
 * Hand-authored on purpose. The fret shapes could be generated; the sentence
 * under each wiggle could not, and that sentence is the whole point — it is the
 * difference between a chord dictionary and something that tells you when to
 * reach for the thing.
 *
 * Edit freely. `pnpm test` checks that every shape actually spells the chord it
 * claims, that every wiggle stays inside the first 7 frets, and that no wiggle
 * step moves more than two strings (or it isn't a wiggle, it's a chord change).
 */
export const CHORDS: Chord[] = [
  // -------------------------------------------------------------------------
  // C
  // -------------------------------------------------------------------------
  {
    id: 'C',
    name: 'C major',
    root: 'C',
    quality: 'major',
    shapes: [
      { frets: '0003', difficulty: 1, note: 'One finger. The reason everyone starts here.' },
      { frets: '5433', difficulty: 3, note: 'Same chord up the neck, with E on the bottom.' },
    ],
    wiggles: [
      {
        id: 'C-maj7-descent',
        name: 'Descending maj7',
        sequence: ['0003', '0002', '0001', '0003'],
        note: 'Classic turnaround feel. Let each one ring.',
      },
      {
        id: 'C-open-drop',
        name: 'Open drop',
        sequence: ['0003', '0000'],
        note: 'Lift the pinky. Suddenly it’s airy.',
      },
      {
        id: 'C-sus4-lean',
        name: 'Sus4 lean',
        sequence: ['0003', '0013', '0003'],
        note: 'Index onto the 2nd string and off again — the F leans on the E and falls back.',
      },
      {
        id: 'C-add9-reach',
        name: 'Add9 reach',
        sequence: ['0003', '0203', '0003'],
        note: 'Middle finger to the 3rd string. Opens the chord out without leaving it.',
      },
      {
        id: 'C-staircase',
        name: 'Staircase down',
        sequence: ['0003', '0002', '0000'],
        note: 'The top note walks C, B, A. Every film about a beach.',
      },
    ],
  },
  {
    id: 'C7',
    name: 'C7',
    root: 'C',
    quality: 'dominant7',
    shapes: [
      { frets: '0001', difficulty: 1 },
      { frets: '3433', difficulty: 4, note: 'Up the neck, with B♭ in the bass.' },
    ],
    wiggles: [
      {
        id: 'C7-ninth',
        name: 'Ninth lift',
        sequence: ['0001', '0201', '0001'],
        labels: ['C7', 'C9', 'C7'],
        note: 'One finger onto the 3rd string and it goes from blues to soul.',
      },
      {
        id: 'C7-sus',
        name: 'Seven sus',
        sequence: ['0001', '0011', '0001'],
        note: 'Suspend the 3rd, then let it fall back. The oldest trick there is.',
      },
      {
        id: 'C7-sixth-swap',
        name: 'Sixth swap',
        sequence: ['0001', '0000', '0001'],
        labels: ['C7', 'C6', 'C7'],
        note: 'Trade the ♭7 for the 6th. The chord stops pushing and just sits.',
      },
    ],
  },
  {
    id: 'Cmaj7',
    name: 'C major 7',
    root: 'C',
    quality: 'major7',
    shapes: [
      { frets: '0002', difficulty: 1 },
      { frets: '5432', difficulty: 4 },
    ],
    wiggles: [
      {
        id: 'Cmaj7-to-6',
        name: 'Maj7 to 6',
        sequence: ['0002', '0000', '0002'],
        labels: ['Cmaj7', 'C6', 'Cmaj7'],
        note: 'B down to A. The tension lets go without the chord changing underneath.',
      },
      {
        id: 'Cmaj7-ninth',
        name: 'Add the 9th',
        sequence: ['0002', '0202', '0002'],
        labels: ['Cmaj7', 'Cmaj9', 'Cmaj7'],
        note: 'This is Em7 wearing a different hat — the top of Cmaj7 plus a D.',
      },
    ],
  },

  // -------------------------------------------------------------------------
  // D
  // -------------------------------------------------------------------------
  {
    id: 'D',
    name: 'D major',
    root: 'D',
    quality: 'major',
    shapes: [
      { frets: '2220', difficulty: 3, note: 'Three fingers stacked in one fret. Awkward for everyone.' },
      { frets: '2225', difficulty: 3, note: 'Spread across the hand instead. Often the kinder option.' },
    ],
    substitute: {
      chordId: 'D',
      frets: '2225',
      note: 'Same chord, spread over the hand instead of crammed into one fret.',
    },
    wiggles: [
      {
        id: 'D-sus4-push',
        name: 'Sus4 push',
        sequence: ['2220', '2230', '2220'],
        note: 'Ring finger down a string. Push and release — the G wants to fall to F♯.',
      },
      {
        id: 'D-sus2-lift',
        name: 'Sus2 lift',
        sequence: ['2220', '2200', '2220'],
        note: 'Lift the 2nd string. Open and unresolved; good for hanging on.',
      },
      {
        id: 'D-sixth',
        name: 'Flatten to D6',
        sequence: ['2220', '2222', '2220'],
        labels: ['D', 'D6', 'D'],
        note: 'Flatten the barre across all four. D6 — or Bm7, depending on where you go next.',
      },
    ],
  },
  {
    id: 'D7',
    name: 'D7',
    root: 'D',
    quality: 'dominant7',
    shapes: [
      { frets: '2223', difficulty: 3 },
      {
        frets: '2020',
        difficulty: 1,
        omits: ['R'],
        note: 'No D in it — that is why it is easy. Fine when the vamp supplies the root.',
      },
    ],
    wiggles: [
      {
        id: 'D7-rootless',
        name: 'Rootless drop',
        sequence: ['2223', '2020'],
        labels: ['D7', 'D7 (no root)'],
        note: 'Drop to the easy shape. Nobody misses the D once the loop is running.',
      },
      {
        id: 'D7-sus-hammer',
        name: 'Sus4 hammer',
        sequence: ['2223', '2233', '2223'],
        note: 'Hammer the 2nd string. D7sus4 to D7 is the most satisfying inch on the instrument.',
      },
      {
        id: 'D7-top-walk',
        name: 'Top walk',
        sequence: ['2223', '2222', '2220'],
        labels: ['D7', 'D6', 'D'],
        note: 'C, B, A down the 1st string. The chord un-tenses in slow motion.',
      },
    ],
  },
  {
    id: 'Dm',
    name: 'D minor',
    root: 'D',
    quality: 'minor',
    shapes: [
      { frets: '2210', difficulty: 2 },
      { frets: 'x210', difficulty: 2, note: 'Mute the 4th string for a bare triad — no doubled A.' },
    ],
    wiggles: [
      {
        id: 'Dm-seventh',
        name: 'Minor seventh drop',
        sequence: ['2210', '2213', '2210'],
        note: 'Pinky on the 1st string. The chord goes wistful instead of sad.',
      },
      {
        id: 'Dm-sus4',
        name: 'Sus4 lift',
        sequence: ['2210', '2230', '2210'],
        labels: ['Dm', 'Dsus4', 'Dm'],
        note: 'Ring finger down. Neither major nor minor for a moment.',
      },
      {
        id: 'Dm-sixth',
        name: 'Dorian 6th',
        sequence: ['2210', '2212', '2210'],
        labels: ['Dm', 'Dm6', 'Dm'],
        note: 'The B is borrowed from D dorian. Brightens the minor without fixing it.',
      },
    ],
  },
  {
    id: 'Dm7',
    name: 'D minor 7',
    root: 'D',
    quality: 'minor7',
    shapes: [{ frets: '2213', difficulty: 3 }],
    wiggles: [
      {
        id: 'Dm7-to-dm',
        name: 'Drop the 7th',
        sequence: ['2213', '2210', '2213'],
        note: 'Pinky off. The 7th disappears and the chord gets heavier.',
      },
      {
        id: 'Dm7-to-f',
        name: 'Slide to F',
        sequence: ['2213', '2010'],
        labels: ['Dm7', 'F'],
        note: 'Dm7 and F share three notes. Which one you are playing is decided underneath.',
      },
    ],
  },

  // -------------------------------------------------------------------------
  // E — on the avoid-list by default (PRD §5.5)
  // -------------------------------------------------------------------------
  {
    id: 'E',
    name: 'E major',
    root: 'E',
    quality: 'major',
    hard: true,
    note: 'The wall. Four fingers, three of them in the same fret, and it still buzzes.',
    shapes: [
      { frets: '4442', difficulty: 5 },
      { frets: '1402', difficulty: 4, note: 'The other standard shape. Easier for some hands, worse for others.' },
    ],
    substitute: {
      chordId: 'E7',
      frets: '1202',
      note: 'E7 does the same job in the key of A minor, with two fingers and no barre.',
    },
    wiggles: [
      {
        id: 'E-sus4',
        name: 'Sus4 escape',
        sequence: ['4442', '4452', '4442'],
        note: 'If you are already holding the barre, this is the one move that is free.',
      },
      {
        id: 'E-seventh',
        name: 'Reach for the 7th',
        sequence: ['4442', '4445', '4442'],
        labels: ['E', 'E7', 'E'],
        note: 'Pinky out to the D. Hard — and the reason E7 at 1202 exists.',
      },
    ],
  },
  {
    id: 'E7',
    name: 'E7',
    root: 'E',
    quality: 'dominant7',
    shapes: [
      { frets: '1202', difficulty: 2, note: 'The chord that makes the key of A minor playable.' },
      { frets: '4445', difficulty: 5 },
    ],
    wiggles: [
      {
        id: 'E7-flat9',
        name: 'The ♭9',
        sequence: ['1202', '1212', '1202'],
        labels: ['E7', 'E7♭9', 'E7'],
        note: 'One finger, and suddenly it is a gypsy jazz record. Do not linger.',
      },
      {
        id: 'E7-sus',
        name: 'Suspend it',
        sequence: ['1202', '2202', '1202'],
        labels: ['E7', 'E7sus4', 'E7'],
        note: 'Index up one fret: G♯ becomes A, the chord suspends, and it resolves itself.',
      },
      {
        id: 'E7-thirteen',
        name: 'The 13th',
        sequence: ['1202', '1204', '1202'],
        labels: ['E7', 'E13', 'E7'],
        note: 'Pinky up two on the 1st string. Warmer, less urgent than the plain 7.',
      },
    ],
  },
  {
    id: 'Em',
    name: 'E minor',
    root: 'E',
    quality: 'minor',
    shapes: [
      { frets: '0432', difficulty: 3 },
      { frets: '0402', difficulty: 2, note: 'Two fingers instead of three — an E on top where 0432 has a G.' },
    ],
    wiggles: [
      {
        id: 'Em-to-em7',
        name: 'Open to Em7',
        sequence: ['0432', '0202', '0432'],
        note: 'Two fingers off and the chord opens out into Em7.',
      },
      {
        id: 'Em-one-finger-c',
        name: 'One finger to C',
        sequence: ['0432', '0433', '0432'],
        labels: ['Em', 'C', 'Em'],
        note: 'Pinky up a fret and you are in C. The cheapest chord change on the instrument.',
      },
      {
        id: 'Em-open-top',
        name: 'Open the top',
        sequence: ['0432', '0435', '0432'],
        labels: ['Em', 'Em7', 'Em'],
        note: 'Pinky up to D. The chord thins out and hangs there.',
      },
    ],
  },
  {
    id: 'Em7',
    name: 'E minor 7',
    root: 'E',
    quality: 'minor7',
    shapes: [{ frets: '0202', difficulty: 2 }],
    wiggles: [
      {
        id: 'Em7-to-em',
        name: 'Firm it up',
        sequence: ['0202', '0432', '0202'],
        note: 'The full Em, for when the 7th is too soft.',
      },
      {
        id: 'Em7-ninth',
        name: 'Add the 9th',
        sequence: ['0202', '0222', '0202'],
        labels: ['Em7', 'Em9', 'Em7'],
        note: 'One finger on the 2nd string. Em9 — or Gmaj7, if you would rather think of it that way.',
      },
    ],
  },

  // -------------------------------------------------------------------------
  // F
  // -------------------------------------------------------------------------
  {
    id: 'F',
    name: 'F major',
    root: 'F',
    quality: 'major',
    shapes: [{ frets: '2010', difficulty: 1 }],
    wiggles: [
      {
        id: 'F-maj7-lift',
        name: 'Lift to Fmaj7',
        sequence: ['2010', '2410', '2010'],
        labels: ['F', 'Fmaj7', 'F'],
        note: 'Middle finger up the 3rd string. F stops being a wall and starts being a mood.',
      },
      {
        id: 'F-sixth',
        name: 'Reach for the 6th',
        sequence: ['2010', '2015', '2010'],
        labels: ['F', 'F6', 'F'],
        note: 'Pinky a long way up the 1st string. Sunny, and a bit 1950s.',
      },
      {
        id: 'F-to-dm',
        name: 'One finger to Dm',
        sequence: ['2010', '2210', '2010'],
        labels: ['F', 'Dm', 'F'],
        note: 'They share F and A. Only the bottom of the chord really moves.',
      },
      {
        id: 'F-seventh',
        name: 'Make it F7',
        sequence: ['2010', '2310', '2010'],
        labels: ['F', 'F7', 'F'],
        note: 'Points hard at B♭ — which is where the key of F was going anyway.',
      },
    ],
  },
  {
    id: 'Fmaj7',
    name: 'F major 7',
    root: 'F',
    quality: 'major7',
    shapes: [
      { frets: '2413', difficulty: 3 },
      { frets: '5557', difficulty: 4, note: 'Up the neck, C in the bass.' },
    ],
    substitute: {
      chordId: 'F',
      frets: '2010',
      note: 'Plain F. Drops the maj7 colour but keeps the function and costs one finger.',
    },
    wiggles: [
      {
        id: 'Fmaj7-to-f',
        name: 'Settle into F',
        sequence: ['2413', '2010'],
        labels: ['Fmaj7', 'F'],
        note: 'Let the two fretted notes go. Fmaj7 resolving into plain F.',
      },
      {
        id: 'Fmaj7-to-6',
        name: 'Maj7 to 6',
        sequence: ['2413', '2415', '2413'],
        labels: ['Fmaj7', 'F6', 'Fmaj7'],
        note: 'E up to D. The maj7 sheen turns into a 6th and the chord relaxes.',
      },
    ],
  },

  // -------------------------------------------------------------------------
  // G
  // -------------------------------------------------------------------------
  {
    id: 'G',
    name: 'G major',
    root: 'G',
    quality: 'major',
    shapes: [{ frets: '0232', difficulty: 2 }],
    wiggles: [
      {
        id: 'G-maj7-lift',
        name: 'Lift to Gmaj7',
        sequence: ['0232', '0222', '0232'],
        note: 'One finger off the 2nd string. The top note walks G, F♯, G.',
      },
      {
        id: 'G-seventh',
        name: 'Drop to G7',
        sequence: ['0232', '0212', '0232'],
        note: 'The F pulls straight at C. Do not sit on it.',
      },
      {
        id: 'G-sus4',
        name: 'Sus4 push',
        sequence: ['0232', '0233', '0232'],
        note: 'Pinky down a fret. Push and release.',
      },
      {
        id: 'G-sus2',
        name: 'Open the 1st string',
        sequence: ['0232', '0230', '0232'],
        labels: ['G', 'Gsus2', 'G'],
        note: 'No 3rd at all, so it sits between major and minor. Good under a melody.',
      },
    ],
  },
  {
    id: 'G7',
    name: 'G7',
    root: 'G',
    quality: 'dominant7',
    shapes: [{ frets: '0212', difficulty: 2 }],
    wiggles: [
      {
        id: 'G7-sus',
        name: 'G7sus4',
        sequence: ['0212', '0213', '0212'],
        labels: ['G7', 'G7sus4', 'G7'],
        note: 'Hold it a beat longer than feels right, then let the B come back.',
      },
      {
        id: 'G7-to-g',
        name: 'Release to G',
        sequence: ['0212', '0232', '0212'],
        note: 'Ring finger up one fret and the F becomes G. Tension gone.',
      },
      {
        id: 'G7-ninth',
        name: 'Open to G9',
        sequence: ['0212', '0210', '0212'],
        labels: ['G7', 'G9', 'G7'],
        note: 'Lift the 1st string. The B goes missing and the chord turns slinky.',
      },
    ],
  },
  {
    id: 'Gmaj7',
    name: 'G major 7',
    root: 'G',
    quality: 'major7',
    shapes: [{ frets: '0222', difficulty: 2 }],
    wiggles: [
      {
        id: 'Gmaj7-to-g',
        name: 'Resolve to G',
        sequence: ['0222', '0232', '0222'],
        note: 'The F♯ up to G. Resolution, one finger.',
      },
      {
        id: 'Gmaj7-ninth',
        name: 'Float on Gmaj9',
        sequence: ['0222', '0220', '0222'],
        labels: ['Gmaj7', 'Gmaj9', 'Gmaj7'],
        note: 'Lift the 1st string. No 3rd left, so it hangs in the air.',
      },
    ],
  },
  {
    id: 'Gm',
    name: 'G minor',
    root: 'G',
    quality: 'minor',
    shapes: [{ frets: '0231', difficulty: 3 }],
    substitute: {
      chordId: 'Gm7',
      frets: '0211',
      note: 'Gm7 is one finger easier and sits better under almost everything in F.',
    },
    wiggles: [
      {
        id: 'Gm-to-gm7',
        name: 'Open to Gm7',
        sequence: ['0231', '0211', '0231'],
        note: 'One finger off. Gm7 is easier and usually the better sound.',
      },
      {
        id: 'Gm-to-bb',
        name: 'Out to B♭',
        sequence: ['0231', '3211'],
        labels: ['Gm', 'B♭'],
        note: 'The relative major. They share two notes; this is the cheapest way out of the minor.',
      },
    ],
  },
  {
    id: 'Gm7',
    name: 'G minor 7',
    root: 'G',
    quality: 'minor7',
    shapes: [{ frets: '0211', difficulty: 2 }],
    wiggles: [
      {
        id: 'Gm7-to-gm',
        name: 'Firm it up',
        sequence: ['0211', '0231', '0211'],
        note: 'Ring finger onto the 2nd string for the full minor.',
      },
      {
        id: 'Gm7-to-bb',
        name: 'Barre to B♭',
        sequence: ['0211', '3211'],
        labels: ['Gm7', 'B♭'],
        note: 'Barre the 4th string and the G becomes B♭. Three notes in common.',
      },
    ],
  },

  // -------------------------------------------------------------------------
  // A
  // -------------------------------------------------------------------------
  {
    id: 'A',
    name: 'A major',
    root: 'A',
    quality: 'major',
    shapes: [{ frets: '2100', difficulty: 2 }],
    wiggles: [
      {
        id: 'A-sus4',
        name: 'Asus4 and back',
        sequence: ['2100', '2200', '2100'],
        labels: ['A', 'Asus4', 'A'],
        note: 'Middle finger across to the 3rd string, then let it drop back.',
      },
      {
        id: 'A-seventh',
        name: 'Lift to A7',
        sequence: ['2100', '0100', '2100'],
        note: 'Lift the 4th string. The G appears from nowhere and points at D.',
      },
      {
        id: 'A-add9',
        name: 'Aadd9',
        sequence: ['2100', '2102', '2100'],
        labels: ['A', 'Aadd9', 'A'],
        note: 'Pinky on the 1st string. The B rubs against the A just enough.',
      },
    ],
  },
  {
    id: 'A7',
    name: 'A7',
    root: 'A',
    quality: 'dominant7',
    shapes: [{ frets: '0100', difficulty: 1 }],
    wiggles: [
      {
        id: 'A7-to-a',
        name: 'Resolve to A',
        sequence: ['0100', '2100', '0100'],
        note: 'The G climbs back to A and the tension goes.',
      },
      {
        id: 'A7-ninth',
        name: 'Smooth it to A9',
        sequence: ['0100', '0102', '0100'],
        labels: ['A7', 'A9', 'A7'],
        note: 'Pinky on the 1st string. Smoother than A7, less of a shove.',
      },
    ],
  },
  {
    id: 'Am',
    name: 'A minor',
    root: 'A',
    quality: 'minor',
    shapes: [{ frets: '2000', difficulty: 1 }],
    wiggles: [
      {
        id: 'Am-to-am7',
        name: 'Lift to Am7',
        sequence: ['2000', '0000', '2000'],
        note: 'Lift the one finger you are using. The whole chord relaxes.',
      },
      {
        id: 'Am-dorian6',
        name: 'Dorian 6th',
        sequence: ['2000', '2020', '2000'],
        labels: ['Am', 'Am6', 'Am'],
        note: 'Borrowed from A dorian. Brighter, slightly unsettled — good over a vamp.',
      },
      {
        id: 'Am-sus4',
        name: 'Suspend it',
        sequence: ['2000', '2200', '2000'],
        labels: ['Am', 'Asus4', 'Am'],
        note: 'Neither major nor minor for a bar. Lands harder when you come back.',
      },
      {
        id: 'Am-to-c',
        name: 'Hinge to C',
        sequence: ['2000', '0003'],
        labels: ['Am', 'C'],
        note: 'Two fingers move and the key turns over. Am and C share C and E.',
      },
    ],
  },
  {
    id: 'Am7',
    name: 'A minor 7',
    root: 'A',
    quality: 'minor7',
    shapes: [{ frets: '0000', difficulty: 1, note: 'All four strings open. Free.' }],
    wiggles: [
      {
        id: 'Am7-to-am',
        name: 'Firm it up',
        sequence: ['0000', '2000', '0000'],
        note: 'One finger and it stops drifting.',
      },
      {
        id: 'Am7-to-c',
        name: 'The pinky decides',
        sequence: ['0000', '0003', '0000'],
        labels: ['Am7', 'C', 'Am7'],
        note: 'Am7 and C6 are the same four notes. This pinky is the only thing that says which.',
      },
    ],
  },

  // -------------------------------------------------------------------------
  // B♭ and B
  // -------------------------------------------------------------------------
  {
    id: 'Bb',
    name: 'B♭ major',
    root: 'B♭',
    quality: 'major',
    hard: true,
    shapes: [{ frets: '3211', difficulty: 4, note: 'Half barre with the index across two strings.' }],
    substitute: {
      chordId: 'Bbmaj7',
      frets: '3210',
      note: 'B♭maj7 loses the half barre. In the key of F it will pass for B♭ nearly always.',
    },
    wiggles: [
      {
        id: 'Bb-maj7',
        name: 'Lift to B♭maj7',
        sequence: ['3211', '3210', '3211'],
        labels: ['B♭', 'B♭maj7', 'B♭'],
        note: 'Lift the 1st string — one less finger, which matters a lot on this one.',
      },
      {
        id: 'Bb-to-gm7',
        name: 'Off to Gm7',
        sequence: ['3211', '0211'],
        labels: ['B♭', 'Gm7'],
        note: 'Let the barre finger off the 4th string. In the key of F these two trade places.',
      },
    ],
  },
  {
    id: 'Bbmaj7',
    name: 'B♭ major 7',
    root: 'B♭',
    quality: 'major7',
    shapes: [{ frets: '3210', difficulty: 3 }],
    wiggles: [
      {
        id: 'Bbmaj7-to-bb',
        name: 'Down to B♭',
        sequence: ['3210', '3211', '3210'],
        labels: ['B♭maj7', 'B♭', 'B♭maj7'],
        note: 'The A falls to B♭. Adds a finger, removes the shimmer.',
      },
    ],
  },
  {
    id: 'B7',
    name: 'B7',
    root: 'B',
    quality: 'dominant7',
    shapes: [
      { frets: '2322', difficulty: 3 },
      { frets: '2320', difficulty: 2, omits: ['R'], note: 'No B left, but it still pulls at E.' },
    ],
    wiggles: [
      {
        id: 'B7-rootless',
        name: 'Lose the root',
        sequence: ['2322', '2320', '2322'],
        labels: ['B7', 'B7 (no root)', 'B7'],
        note: 'Lift the 1st string. Lighter, and it still leans on E minor.',
      },
      {
        id: 'B7-to-bm7',
        name: 'Turn it inward',
        sequence: ['2322', '2222'],
        labels: ['B7', 'Bm7'],
        note: 'D♯ down to D. The chord stops pushing and turns inward.',
      },
    ],
  },
  {
    id: 'Bm',
    name: 'B minor',
    root: 'B',
    quality: 'minor',
    hard: true,
    shapes: [{ frets: '4222', difficulty: 4, note: 'Barre at 2 with the pinky reaching to 4.' }],
    substitute: {
      chordId: 'Bm7',
      frets: '2222',
      note: 'Bm7 is a flat barre at the 2nd fret. Easier, and often the better sound anyway.',
    },
    wiggles: [
      {
        id: 'Bm-to-bm7',
        name: 'Flatten to Bm7',
        sequence: ['4222', '2222', '4222'],
        note: 'Drop the pinky and it is a plain barre. Easier and usually better.',
      },
      {
        id: 'Bm-to-d',
        name: 'Out to D',
        sequence: ['4222', '2220'],
        labels: ['Bm', 'D'],
        note: 'Relative major. In the key of D these two trade places constantly.',
      },
    ],
  },
  {
    id: 'Bm7',
    name: 'B minor 7',
    root: 'B',
    quality: 'minor7',
    shapes: [{ frets: '2222', difficulty: 2, note: 'One flat barre. The most generous chord on the uke.' }],
    wiggles: [
      {
        id: 'Bm7-to-d',
        name: 'Read it as D',
        sequence: ['2222', '2220', '2222'],
        labels: ['Bm7', 'D', 'Bm7'],
        note: 'One finger off and the same barre reads as D. Different centre of gravity.',
      },
      {
        id: 'Bm7-to-bm',
        name: 'Reach for Bm',
        sequence: ['2222', '4222', '2222'],
        note: 'Pinky to the 4th string for the full minor.',
      },
    ],
  },
  {
    id: 'F#m',
    name: 'F♯ minor',
    root: 'F♯',
    quality: 'minor',
    hard: true,
    shapes: [{ frets: '2120', difficulty: 3 }],
    substitute: {
      chordId: 'A',
      frets: '2100',
      note: 'The relative major. Loses the minor colour, keeps you in the key of D.',
    },
    wiggles: [
      {
        id: 'F#m-seventh',
        name: 'Up to F♯m7',
        sequence: ['2120', '2420', '2120'],
        labels: ['F♯m', 'F♯m7', 'F♯m'],
        note: 'Trades the C♯ for an E — which is the note you wanted anyway.',
      },
      {
        id: 'F#m-to-a',
        name: 'One finger to A',
        sequence: ['2120', '2100'],
        labels: ['F♯m', 'A'],
        note: 'Lift the 2nd string and it is A. The relative major, one finger away.',
      },
    ],
  },

  // -------------------------------------------------------------------------
  // The diminished chords — the vii° of each key. Mostly passing chords.
  // -------------------------------------------------------------------------
  {
    id: 'Bdim',
    name: 'B diminished',
    root: 'B',
    quality: 'diminished',
    hard: true,
    note: 'The vii° of C and of A minor. You will almost always play G7 instead, and you should.',
    shapes: [{ frets: '4212', difficulty: 4 }],
    substitute: {
      chordId: 'G7',
      frets: '0212',
      note: 'vii° is V7 without its root. G7 does the identical job with one easier finger.',
    },
    wiggles: [
      {
        id: 'Bdim-to-g7',
        name: 'Lift to G7',
        sequence: ['4212', '0212'],
        labels: ['Bdim', 'G7'],
        note: 'Lift the 4th string. That is the whole secret: vii° is V7 minus its root.',
      },
      {
        id: 'Bdim-to-dim7',
        name: 'Slide to Bdim7',
        sequence: ['4212', '1212'],
        labels: ['Bdim', 'Bdim7'],
        note: 'Index barre at 1. This is the shape people mean when they write Bdim.',
      },
    ],
  },
  {
    id: 'Edim',
    name: 'E diminished',
    root: 'E',
    quality: 'diminished',
    hard: true,
    note: 'The vii° of F and of D minor.',
    shapes: [{ frets: '0401', difficulty: 3 }],
    substitute: {
      chordId: 'C7',
      frets: '0001',
      note: 'C7 contains all three notes of Edim and is one finger. Same function, no fuss.',
    },
    wiggles: [
      {
        id: 'Edim-to-c7',
        name: 'Lift to C7',
        sequence: ['0401', '0001'],
        labels: ['Edim', 'C7'],
        note: 'Lift the middle finger. C7 — same job, and you can actually play it.',
      },
      {
        id: 'Edim-to-dim7',
        name: 'Edim7',
        sequence: ['0401', '0101'],
        labels: ['Edim', 'Edim7'],
        note: 'Index on the 3rd string. The shape repeats itself every three frets.',
      },
    ],
  },
  {
    id: 'F#dim',
    name: 'F♯ diminished',
    root: 'F♯',
    quality: 'diminished',
    note: 'The vii° of G and of E minor — and the easiest diminished chord on the instrument.',
    shapes: [{ frets: '2020', difficulty: 1 }],
    substitute: {
      chordId: 'D7',
      frets: '2223',
      note: 'D7 contains F♯dim whole. Use it whenever the bass wants a root.',
    },
    wiggles: [
      {
        id: 'F#dim-to-d7',
        name: 'Add the root',
        sequence: ['2020', '2223'],
        labels: ['F♯dim', 'D7'],
        note: 'Put the D back and it is D7. F♯dim is D7 with the root knocked out.',
      },
      {
        id: 'F#dim-to-dim7',
        name: 'Symmetrical slide',
        sequence: ['2020', '2323'],
        labels: ['F♯dim', 'F♯dim7'],
        note: 'Slide it three frets in any direction and it is the same chord again.',
      },
    ],
  },

  {
    id: 'C#dim',
    name: 'C♯ diminished',
    root: 'C♯',
    quality: 'diminished',
    note: 'The vii° of D. In practice you reach for A7 and never think about it again.',
    shapes: [{ frets: '0104', difficulty: 2 }],
    substitute: {
      chordId: 'A7',
      frets: '0100',
      note: 'A7 contains C♯dim whole, and it is the easiest chord on the instrument.',
    },
    wiggles: [
      {
        id: 'C#dim-to-a7',
        name: 'Lift to A7',
        sequence: ['0104', '0100'],
        labels: ['C♯dim', 'A7'],
        note: 'Lift the 1st string. C♯dim is A7 with the root knocked out.',
      },
      {
        id: 'C#dim-to-dim7',
        name: 'C♯dim7',
        sequence: ['0104', '0101'],
        labels: ['C♯dim', 'C♯dim7'],
        note: 'The same grip as Edim7. Diminished sevenths only have three faces between them.',
      },
    ],
  },
]
