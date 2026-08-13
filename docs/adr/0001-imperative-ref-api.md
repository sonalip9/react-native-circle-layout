# ADR-0001: Imperative ref API for show/hide

**Status:** Amended

## Decision

Show and hide are exposed via `useImperativeHandle` ref (`CircleLayoutRef.showComponents` / `hideComponents`) as the default control surface.

**Amendment:** a declarative `visible?: boolean` prop was added (see `CircleLayoutProps.visible`) for consumers who already hold visibility as derived state and don't want to also thread a ref. When `visible` is set to a boolean (not `undefined`), it becomes the sole source of truth: the ref's `showComponents`/`hideComponents` become no-ops for as long as the prop stays defined. A consumer uses one mode or the other, never both at once for the same `CircleLayout`.

## Rationale

Consumers typically trigger show/hide from a parent gesture handler or button press — a discrete event, not a derived state value. An imperative ref call fires immediately without requiring the parent to lift state or trigger a re-render of the full layout tree.

A `visible` prop would require:
1. Parent to own and update a boolean state
2. React reconciler to diff and re-render `CircleLayout` and all `CircleLayoutComponent` children on every toggle

The ref approach also matches the React Native idiom used by `FlatList.scrollToIndex`, `TextInput.focus`, etc. — imperative actions on layout components.

## Consequences

- Consumers must hold a ref to `CircleLayout` to trigger animations in ref mode
- Initial visibility depends on `animationProps`: components render **visible by default**. With an OPACITY animation config, they start hidden (opacity 0) and `showComponents()` animates them in. Without animation config, `showComponents()` / `hideComponents()` are no-ops.
- In prop mode (`visible` set), the ref's `showComponents`/`hideComponents` are no-ops — this is intentional, not a bug. Consumers who need to know whether their ref calls will actually do anything must check whether they're also passing `visible`.
- A consumer switching from ref mode to prop mode (or back) mid-lifecycle works, since the check is `visible !== undefined` on every call/render — but doing so is unusual and not a supported pattern to build UI around.
