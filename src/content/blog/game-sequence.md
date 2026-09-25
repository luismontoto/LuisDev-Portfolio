---

title: "OddSmith #2: chaining dice rolls without comparing names"
description: "Chaining several dice thresholds into a full attack sequence, without comparing step names."
pubDate: 2026-09-23
tags: [typescript, tdd, testing, vitest, oddsmith]

---

In [the previous entry](/blog/oddsmith-1-probability), I built
`successProbability`, a small pure function that answers one question: what's
the chance of beating a given threshold on a d6? This time I'm building on
top of it to solve the actual problem OddSmith exists for: chaining several
rolls together into a full attack sequence (hit → wound → save → damage → an
additional save).

This is also where the previous, AI-generated version broke down the hardest.
It decided what to do with each step by comparing a string:

```ts
if (filtro.nombre === 'Salvación') { /* ... */ }
```

If you renamed that step, damage silently stopped applying. This entry is
about designing the sequence so nothing depends on a name at all.

## Two kinds of step, not one

The first design question wasn't "how do I loop over steps," it was: **do all
steps behave the same way?** Looking at hit, wound, save, and feel-no-pain
side by side:

- **Hit and wound** keep whatever *succeeds* against the threshold. Roll a
  4+ to hit, and the dice that land on 4, 5, or 6 move on.
- **Save and feel-no-pain** keep the opposite: the defender rolls, and what
  moves on to you is whatever they *failed* to stop.

Same underlying die roll, same `successProbability` formula, but the
direction you care about flips. That's the whole reason a `Step` needs an
explicit field for it, instead of inferring direction from a name:

```ts
type Step = {
  threshold: Threshold
  countsAs: 'success' | 'failure'
}
```

`'success' | 'failure'` is a union of two string literals — the same trick I
used for `Threshold` in the previous entry, just with text instead of
numbers. Write `'succes'` by mistake and TypeScript rejects it before you
ever run a test.

## Fake it again

Same TDD rhythm as before. First test, first fake:

```ts
it('applies a single success step to the initial count', () => {
  const result = resolveSequence(10, [{ threshold: 4, countsAs: 'success' }])
  expect(result).toBeCloseTo(5)
})
```

```ts
export function resolveSequence(initialCount: number, steps: Step[]): number {
  return 5
}
```

And the second test, designed specifically to break it — using `'failure'`
this time, because that's the branch a hardcoded `5` can't fake its way
through:

```ts
it('applies a failure-counted step (e.g. a save)', () => {
  const result = resolveSequence(12, [{ threshold: 5, countsAs: 'failure' }])
  expect(result).toBeCloseTo(8) // 12 saved-fails at 5+: 12 * (1 - 2/6)
})
```

## Green, with an if — and a subtle bug in getting there

The first real implementation looked like this:

```ts
export function resolveSequence(initialCount: number, steps: Step[]): number {
  let count = initialCount
  for (const step of steps) {
    const p = successProbability(step.threshold)
    if (step.countsAs === 'success') {
      count = count * p
    } else {
      count = count * (1 - p)
    }
  }
  return count
}
```

Getting here wasn't as clean as it looks now. Along the way I hit two
familiar-shaped bugs worth naming, because they're the kind that generated
code tends to hide instead of surface:

- **A plain typo** (`successProbavility`) that JavaScript happily let through
  as `undefined` until the test actually ran — `tsc --noEmit` would have
  caught it earlier, which is exactly why I run it as a separate step from
  `vitest`.
- **A refactor that silently did nothing.** I introduced a lookup object to
  replace the `if`, but forgot to actually multiply `count` by its result.
  The test failed with `expected 5 to be close to 8` — but the real tell was
  that the returned value was just the *unchanged input* (12), a strong hint
  that a branch of the code was computing something and then throwing it
  away.

Neither bug was subtle once caught by a failing test — which is the whole
point of writing the test before trusting the implementation.

## Refactor: swapping the `if` for a lookup table

With both tests green, the `if/else` came out in favor of a small dictionary
of functions, keyed by the same values `countsAs` can hold:

```ts
const applyStep: Record<Step['countsAs'], (p: number) => number> = {
  success: (p) => p,
  failure: (p) => 1 - p,
}

export function resolveSequence(initialCount: number, steps: Step[]): number {
  let count = initialCount
  for (const step of steps) {
    const p = successProbability(step.threshold)
    count = count * applyStep[step.countsAs](p)
  }
  return count
}
```

`applyStep[step.countsAs]` looks up the right transformation using
`countsAs` itself as the key, then calls it immediately with `p`. The
decision that used to live in an `if` now lives in the shape of the data —
there's no branch to accidentally forget a case for.

A nice side effect showed up here for free: because the loop just keeps
multiplying `count` by whatever each step produces, chaining *two* steps
required no new code at all. A test with a hit-then-wound sequence
(`{threshold: 3, countsAs: 'success'}, {threshold: 4, countsAs: 'success'}`)
passed on the first try. That's a good signal — a test passing without
touching the implementation means the design already generalized, not that
nothing needed doing.

## A test that passed for the wrong reason

Worth calling out on its own: an early version of that chained test had a
copy-paste mistake — `countsAs: 'failure'` on a threshold-4 step that was
supposed to be `'success'` (hit and wound are both success-counted steps).
The test still passed, with the exact same expected value.

That's not a coincidence — it's a property of the number 4. At `threshold: 4`,
`successProbability(4) = 3/6 = 0.5`, and `1 - 0.5` is also `0.5`. Right at the
midpoint of the die, `success` and `failure` behave identically, so a test
built around that threshold can't tell the two apart. If `resolveSequence`
ever handled `success` and `failure` asymmetrically in some edge case, this
test would stay green while missing the bug entirely. The fix was simply to
name the intent correctly (`'success'` on both) — same expected result, but
now the test actually verifies what its name claims.

## Damage: a third thing that isn't a `Step`

The previous version's other big flaw was how damage got applied — the
patch-like `if (i < filtros.length - 1)`, trying to guess whether the
current step was the last one before deciding to multiply. Damage isn't a
dice roll at all: it doesn't have a threshold, and it doesn't check success
or failure. Forcing it into the `Step` shape would mean stuffing a
meaningless `threshold` into something that's really just "multiply by a
fixed number."

Instead, damage sits outside the `Step[]` list entirely, as its own
parameter, splitting the full attack into two independent sequences:

```ts
export function resolveAttack(
  initialCount: number,
  preDamageSteps: Step[],
  damage: number,
  postDamageSteps: Step[]
): number {
  const notSaved = resolveSequence(initialCount, preDamageSteps)
  const damagePoints = notSaved * damage
  return resolveSequence(damagePoints, postDamageSteps)
}
```

Three lines, and the two calls to `resolveSequence` are the exact same
function used everywhere else — no duplicated logic, no special case for
"no feel-no-pain." An empty `postDamageSteps` array just means the loop
inside `resolveSequence` runs zero times and returns `damagePoints`
untouched, with no `if` needed to express "this defense doesn't apply."

The full attack modeled end to end:

```
dice → [hit: success] → [wound: success] → [save: failure] → × damage → [fnp: failure] → result
                                                                 ↑
                                                         not a Step at all
```

## Where "no defense" lives — again

The same trick from the probability phase carries over cleanly here: "no
feel-no-pain" isn't a special case, it's a `Step` with `threshold: 7`. Since
`successProbability(7) = 0`, and the step is `countsAs: 'failure'`, what
passes through is `1 - 0 = 1` — everything gets through unfiltered. No
branch, no `null`, just the same formula behaving correctly at its edge:

```ts
it('resolves a full attack with an active FNP', () => {
  const result = resolveAttack(
    10,
    [
      { threshold: 3, countsAs: 'success' },
      { threshold: 4, countsAs: 'success' },
      { threshold: 5, countsAs: 'failure' },
    ],
    2,
    [{ threshold: 5, countsAs: 'failure' }] // an active 5+ FNP this time
  )
  expect(result).toBeCloseTo(80 / 27)
})
```

This test passed on the first run too, with no changes to `resolveAttack` —
confirmation that splitting the sequence into two sub-sequences, connected
only by a plain multiplication, handles both "defense present" and "defense
absent" the same way.

## Where things stand

```ts
// src/domain/types.ts
export type Step = {
  threshold: Threshold
  countsAs: 'success' | 'failure'
}

// src/domain/game.ts
const applyStep: Record<Step['countsAs'], (p: number) => number> = {
  success: (p) => p,
  failure: (p) => 1 - p,
}

export function resolveSequence(initialCount: number, steps: Step[]): number {
  let count = initialCount
  for (const step of steps) {
    count = count * applyStep[step.countsAs](successProbability(step.threshold))
  }
  return count
}

export function resolveAttack(
  initialCount: number,
  preDamageSteps: Step[],
  damage: number,
  postDamageSteps: Step[]
): number {
  const notSaved = resolveSequence(initialCount, preDamageSteps)
  const damagePoints = notSaved * damage
  return resolveSequence(damagePoints, postDamageSteps)
}
```

Ten tests total across `probability.test.ts` and `game.test.ts`, clean lint,
clean typecheck.

## What the AI had gotten wrong the first time

- Step type resolved through **string comparison** (`filtro.nombre ===
  'Salvación'`); here it's resolved through **data shape** (`countsAs`), so
  renaming a step in the UI can never silently break the damage calculation.
- Damage placement was a fragile index check (`i < filtros.length - 1`);
  here it's expressed directly in the function signature —
  `preDamageSteps` and `postDamageSteps` — so there's no position to get
  wrong.
- No test ever caught the original's inability to represent "no save
  available." Here, that exact case is one of the first things a test
  exercises, and it works by construction rather than by a special branch.

## Next up

With the domain logic (`probability.ts` + `game.ts`) fully tested, the next
phase moves into the UI: a form that builds a `Step[]` from user input and
calls `resolveAttack`, with the result computed directly from state instead
of stored separately — fixing another real bug from the original version,
where changing an input left a stale result on screen.