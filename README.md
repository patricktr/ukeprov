# Wiggle Room

A ukulele improv trainer. Chord tones, wiggles, and a loop to play them over — on
one screen, no login, no course, no video.

The gap this is built for: you can play a lot of chords and read chord tabs, but
everything comes out as a strummed block. That gap has three parts — you don't
know where the notes inside a chord live on the fretboard, you don't know the
small one-finger variations that add motion without leaving the shape, and you
have nothing to play against. Chord dictionaries, scale diagrams and backing
track channels each solve one of them in isolation. This connects all three.

## What's in it

- **Fretboard** — first 7 frets, GCEA, dots labelled by interval rather than note
  name, coloured by role. Grey ghost dots for the rest of the parent scale.
  High-G and low-G toggle; everything is computed from the tuning, so switching
  re-labels the whole board.
- **Chord tones** — pick a chord, see where its root, 3rd, 5th and 7th live.
  Isolate one interval at a time, because that's how you actually drill it.
- **Wiggles** — small alterations to a held shape: add a finger, lift a finger,
  hammer on, pull off. Each one has fret notation, a diagram per position, and a
  sentence on when it sounds good.
- **Vamp player** — 2-4 chord loops on a click, 50-160 BPM, with the next chord
  shown large so you can prepare for it.
- **Avoid-list** — chords you're not playing yet. Anything containing one is
  hidden or offered with a substitution. E is on it by default.
- **Practice prompts** — a constraint to play under for a few minutes.
- **Scale overlay** — secondary to chord tones by design.

## Running it

```sh
pnpm install
pnpm dev      # binds to a free port and prints the URL
pnpm test     # verifies the chord dataset
pnpm build
```

## The dataset

`src/data/chords.ts` holds every chord in the keys of C, F, G, D, A minor,
E minor and D minor — 32 chords with 2-5 wiggles each. It is hand-authored and
meant to be edited: the fret shapes could be generated, but the sentence under
each wiggle is the whole value.

`pnpm test` checks every shape actually spells the chord it claims, that nothing
reaches past the 7th fret, that declared omissions are real, and that no wiggle
step moves more than two strings — past that it is a chord change, not a wiggle.
It has already caught one wrong note in this file, so run it after editing.

## Stack

React + Vite + Tailwind, deployed on Vercel. Fretboard is SVG drawn from the
tuning. Audio is the Web Audio API with a Karplus-Strong plucked string, driven
by a lookahead scheduler rather than a timer per beat. No backend, no auth, no
database; settings live in localStorage.
