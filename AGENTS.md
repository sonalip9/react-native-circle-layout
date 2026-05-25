# react-native-circle-layout

Open source React Native library for arranging components in a circular layout. Consumers pass child components and a radius; the library computes positions on the circle and renders children at the correct coordinates and angles.

**Repo:** `sonalip9/react-native-circle-layout`
**Package manager:** pnpm (workspaces)
**Language:** TypeScript
**Platforms:** iOS, Android, Web (via React Native Web)

## Commands

- Build library: `pnpm prepare`
- Test: `pnpm test`
- Lint: `pnpm lint`
- Typecheck: `pnpm typecheck`
- Run example app: `cd example && pnpm start`
- Full CI check: `pnpm lint && pnpm typecheck && pnpm test && pnpm prepare`

## Architecture

Components are positioned using polar-to-Cartesian conversion (x = r·cosθ, y = r·sinθ). Each child is wrapped in `CircleLayoutComponent` which handles absolute positioning and animation. Shared layout/animation props flow via React Context rather than prop-drilling.

```
CircleLayout (ref prop)
  └─ CircleLayoutContext          ← radius, totalParts, startAngle, animationProps
       └─ CircleLayoutComponent[] ← one per child; handles position + animation
            └─ useAnimation       ← per-axis Animated.Value (opacity, radius, radians)
                 └─ useCombinedAnimation ← parallel/sequence orchestration
```

**Key invariant:** `totalParts = components.length` for full circles, `components.length - 1` for partial arcs — so the last component lands exactly on `startAngle + sweepAngle`, not one step past it. See `docs/adr/0002-totalparts-invariant-for-partial-arcs.md`.

**Public API surface** (exported from `src/index.tsx`):
- `CircleLayout` — main component (ref prop)
- `CircleLayoutProps`, `CircleLayoutRef` — prop and ref types
- `AnimationType`, `AnimationCombinationType` — enums

## Agent skills

### Issue tracker

Issues live in GitHub Issues (`sonalip9/react-native-circle-layout`). See `docs/agents/issue-tracker.md`.

### Triage labels

Default label vocabulary — needs-triage, needs-info, ready-for-agent, ready-for-human, wontfix. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context repo — one `CONTEXT.md` + `docs/adr/` at root. See `docs/agents/domain.md`.
