# ADR-0001: Imperative ref API for show/hide

**Status:** Accepted

## Decision

Show and hide are exposed via `useImperativeHandle` ref (`CircleLayoutRef.showComponents` / `hideComponents`) rather than a prop-driven `visible` boolean.

## Rationale

Consumers typically trigger show/hide from a parent gesture handler or button press — a discrete event, not a derived state value. An imperative ref call fires immediately without requiring the parent to lift state or trigger a re-render of the full layout tree.

A `visible` prop would require:
1. Parent to own and update a boolean state
2. React reconciler to diff and re-render `CircleLayout` and all `CircleLayoutComponent` children on every toggle

The ref approach also matches the React Native idiom used by `FlatList.scrollToIndex`, `TextInput.focus`, etc. — imperative actions on layout components.

## Consequences

- Consumers must hold a ref to `CircleLayout` to trigger animations
- Initial visibility is always "hidden" — consumers call `showComponents()` to animate in
- The ref API is the only way to trigger animations; there is no prop-driven alternative
