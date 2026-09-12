/**
 * What each interval role looks like and what it does.
 *
 * The colours were duplicated in the fretboard and the sidebar, which is an
 * invitation for a palette change to land in one and not the other. One map.
 */

/** PRD §5.1: root strongest, 3rd next, 5th muted, 7th distinct. */
export const ROLE_COLOR: Record<string, string> = {
  R: 'var(--color-role-root)',
  '3': 'var(--color-role-third)',
  '♭3': 'var(--color-role-third)',
  '5': 'var(--color-role-fifth)',
  '♭5': 'var(--color-role-fifth)',
  '♯5': 'var(--color-role-fifth)',
  '6': 'var(--color-role-seventh)',
  '♭7': 'var(--color-role-seventh)',
  '7': 'var(--color-role-seventh)',
}

export const roleColor = (label: string) => ROLE_COLOR[label] ?? 'var(--color-role-other)'

/**
 * One line on what each role sounds like. Written to be read while holding the
 * instrument, so each says what to *do* with the note rather than what it is.
 */
export const ROLE_MEANING: Record<string, string> = {
  R: 'Home. Landing here sounds settled — and dull if it is the only place you ever land.',
  '3': 'The mood. This single note is what makes the chord major. The best note to hit on a chord change.',
  '♭3': 'The mood. One fret below the major 3rd, and that fret is the whole difference between bright and sad.',
  '5': 'Neutral glue. Agrees with everything and commits to nothing. Fine passing through, weak to stop on.',
  '♭5': 'Unstable by design. The chord sounds mid-fall and wants to resolve almost immediately.',
  '♯5': 'Stretched upward. Refuses to settle, so treat it as a step rather than a destination.',
  '6': 'Gentle colour. Softens the chord without making it lean anywhere.',
  '♭7': 'Restless. Leans somewhere else — this is the blues sound. Do not sit on it.',
  '7': 'Shimmer. One fret under the root, which is what gives a maj7 its soft unresolved glow.',
}
