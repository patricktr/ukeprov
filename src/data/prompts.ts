import type { PracticePrompt } from '../lib/types'

/**
 * Constraint generator (PRD §5.6). Press a button, get a restriction to play
 * under for the next few minutes.
 *
 * Escalating, but deliberately not gamified: no streaks, no points, no record
 * of which ones you have had. The difficulty levels are there so the button can
 * stop handing you "root and 3rd only" in month three, not so you can beat them.
 */
export const PRACTICE_PROMPTS: PracticePrompt[] = [
  { id: 'one-note-bar', text: 'One note per bar. Chord tones only.', level: 1 },
  { id: 'root-third', text: 'Root and 3rd only.', level: 1 },
  { id: 'top-two', text: 'Stay on the top two strings.', level: 1 },
  { id: 'no-open', text: 'No open strings.', level: 1 },
  { id: 'end-on-root', text: 'Every phrase ends on the root.', level: 2 },
  { id: 'wiggles-only', text: 'Only wiggles, no single notes.', level: 2 },
  { id: 'below-third', text: 'Nothing above the 3rd fret.', level: 2 },
  { id: 'change-string', text: 'Change strings on every chord change.', level: 2 },
  { id: 'two-notes', text: 'Two notes per chord. Make them both count.', level: 2 },
  { id: 'land-on-third', text: 'Land on the 3rd of every chord, on beat one.', level: 3 },
  { id: 'never-root', text: 'Never play the root.', level: 3 },
  { id: 'offbeat', text: 'Start every phrase on an off-beat.', level: 3 },
  { id: 'one-wiggle-each', text: 'One wiggle per chord — a different one each time round.', level: 3 },
  { id: 'sing-it', text: 'Sing the note before you play it.', level: 3 },
]
