# ADR-0002: totalParts invariant for partial arcs

**Status:** Accepted

## Decision

`totalParts = components.length` for full circles (`sweepAngle === 2π`), but `components.length - 1` for partial arcs (`sweepAngle !== 2π`).

## Rationale

Each component is placed at angle `startAngle + sweepAngle * (index / totalParts)`.

**Full circle case:** The last component at `index = n-1` must NOT land on the same position as the first component at `index = 0`. Using `totalParts = n` spaces them evenly and the gap between the last and first component closes the circle naturally.

**Partial arc case:** The last component at `index = n-1` MUST land exactly on `startAngle + sweepAngle` (the arc's endpoint). Using `totalParts = n-1` achieves this:

```
angle[n-1] = startAngle + sweepAngle * ((n-1) / (n-1))
           = startAngle + sweepAngle
```

Using `totalParts = n` would place the last component one step short of the endpoint, leaving the arc's end position empty.

## Consequences

- This branching logic lives in `CircleLayoutProvider.tsx` (`totalParts` useMemo)
- Any code that computes per-component angles must use `totalParts` from context, not `components.length` directly
- Adding or removing components changes `totalParts` and thus repositions all components — this is expected behaviour
