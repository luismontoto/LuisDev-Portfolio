---
title: "OddSmith #1: teaching a die to tell the truth (with TDD)"
description: "Building a probability calculator with TDD, starting from the simplest piece: the probability of beating a threshold on a d6."
pubDate: 2026-09-22
tags: ["typescript", "tdd", "testing", "vitest", "oddsmith"]
---

I'm rewriting **OddSmith**, an expected-value calculator for chained d6 rolls
(hit → wound → save → damage → an additional save). I generated the first
version with AI in one sitting, and it worked... until it didn't: it couldn't
represent "no save available," and the sequence logic depended on comparing
each step's *name* against a string.

This time I'm rebuilding it piece by piece, by hand, with TDD, and writing up
each phase. This first entry covers the smallest piece of all: the
probability of beating a threshold on a six-sided die. It sounds trivial, and
it still taught me a few things.

## The goal

I need a function that, given a threshold like "4+", returns the probability
of beating it with a d6. In the game's rules, a threshold reads as "roll this
number or higher to succeed."

## Starting with a fake

TDD doesn't start with the formula. It starts with a test that fails:

```ts
it('returns 1/2 for a 4+ threshold', () => {
  expect(successProbability(4)).toBeCloseTo(0.5)
})
```

And the minimal implementation to pass it is, literally, a fake:

```ts
export function successProbability(threshold: number): number {
  return 0.5
}
```

Writing this on purpose looks absurd, but it's the *fake it till you make it*
technique: the minimum code that satisfies the test, not one line more. The
real value shows up once a second test breaks the fake and **forces** you to
generalize, instead of writing the formula from memory.

## The second test breaks the fake

```ts
it('returns 1/6 for a 6+ threshold', () => {
  expect(successProbability(6)).toBeCloseTo(1 / 6)
})
```

With `return 0.5` this test fails, as it should:

```
AssertionError: expected 0.5 to be close to 0.16666...,
received difference is 0.3333..., but expected 0.005
```

Here comes the first real stumble, and I'm leaving it in because it's useful:
while deriving the formula, my first attempt was

```ts
return threshold / 7
```

which fails because the probability **increases** with the threshold, when
in the game it's the opposite: the higher the number you need, the less
likely you are to roll it. The second attempt,

```ts
return threshold / 6
```

fixes the denominator but loses the idea of the 7. The correct formula comes
from counting faces: with a threshold of X, the faces that count are `7 - X`
(with 4+ that's 3 faces: 4, 5, and 6; with 6+ it's 1 face: the 6). From
there:

```ts
export function successProbability(threshold: number): number {
  return (7 - threshold) / 6
}
```

With this, both tests pass, and a third one for 2+ (`5/6`) confirms the
formula generalizes without needing a single `if`.

## When the test is lying, not the code

At some point I wrote this test:

```ts
it('returns 0 for a 0 threshold', () => {
  expect(successProbability(0)).toBeCloseTo(0)
})
```

It failed, and my first instinct was "fix the function so it returns 0 for
threshold 0." But the test was the one that was wrong: `threshold = 0` means
"roll 0 or higher," something that **always** succeeds, so the probability
should be 1, not 0. What I actually wanted to express — "this can never
fail" — is probability **0**, and the threshold that produces it is **7**,
not 0.

The lesson: when a test fails, the first question isn't "what do I change in
the code?" but "is the test asking for the right thing?"

## Closing the gap with the type system

Up to this point, `successProbability` accepted any `number`, so
`successProbability(-50)` or `successProbability(3.5)` compiled without any
warning. That's exactly the flaw the AI-generated version had: a threshold
that only allowed `2 | 3 | 4 | 5 | 6`, and therefore couldn't represent
"no save available."

The fix isn't a runtime check (`Math.max`, `if (threshold < 1) throw`), but
narrowing the type so the invalid value **doesn't compile at all**:

```ts
export type Threshold = 1 | 2 | 3 | 4 | 5 | 6 | 7

export function successProbability(threshold: Threshold): number {
  return (7 - threshold) / 6
}
```

On this scale, `1` means "always succeeds" and `7` means "never succeeds"
(no save possible), and the same formula covers both with no special-cased
branch.

To actually verify the type protects against misuse, you need a slightly
different kind of test:

```ts
it('rejects thresholds outside 1-7', () => {
  // @ts-expect-error 0 is not a valid Threshold
  successProbability(0)
})
```

And here's the most useful technical detail from this whole phase:
**`npm test` doesn't catch this.** Vitest runs on `esbuild` under the hood,
which transpiles TypeScript to JavaScript fast without deep type checking.
The real check is done by `tsc`:

```bash
npx tsc --noEmit
```

No output = no errors. I now keep both as separate steps (`npm test` and
`npm run typecheck`), because green tests alone don't guarantee the types
are correct.

## The final result of this phase

```ts
// src/domain/probability.ts
export type Threshold = 1 | 2 | 3 | 4 | 5 | 6 | 7

export function successProbability(threshold: Threshold): number {
  return (7 - threshold) / 6
}
```

Five tests, each named after the actual case it covers (not generic "test 1,"
"test 2"), a clean lint run, and no type errors.

## What the AI had gotten wrong the first time

For anyone coming from the previous project, here's what changes in this
piece:

- The original type (`2 | 3 | 4 | 5 | 6`) couldn't represent "no save
  available" or "always succeeds." Now `1` and `7` cover both with no
  special cases.
- There were no tests at all. The logic "looked" correct because it compiled
  and the UI showed numbers, but no one had checked the edge cases.
- Rounding happened mid-calculation (`toFixed` on intermediate values). The
  rule here is: never round inside the domain logic, only when displaying
  results on screen.

## Next up

With single-threshold probability solved, the next step is chaining several
of them into a sequence (hit → wound → save → damage), without repeating the
previous version's mistake: `if (filtro.nombre === 'Salvación')`. The idea is
that each step is a piece of data, not a name the code has to recognize.
