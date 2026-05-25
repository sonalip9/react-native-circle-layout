# Domain Context — react-native-circle-layout

## Glossary

| Term | Definition |
|---|---|
| circle layout | Container component that positions children at equal angular intervals on a circle |
| sweep angle | Arc in radians the layout spans; default `2π` (full circle). Prop: `sweepAngle` |
| start angle | Radian offset of the first component from the 9 o'clock position (0 = leftward). Prop: `startAngle` |
| total parts | Number of angular divisions used for spacing. `n` for full circles, `n-1` for partial arcs |
| polar-to-Cartesian | Coordinate transform `x = r·cosθ, y = r·sinθ` used to position each component. Implemented in `src/utils/circle.ts` |
| entry animation | Transition played when `showComponents()` is called on the ref |
| exit animation | Transition played when `hideComponents()` is called on the ref |
| animation gap | Millisecond delay between consecutive component animations (`animationProps.animationGap`) |
| animation combination type | Whether multiple animation types run in `PARALLEL` or `SEQUENCE` (`AnimationCombinationType`) |
| center component | Optional component rendered at the centre of the circle. Prop: `centerComponent` |

## Preferred terminology

- "sweep angle" not "arc angle"
- "radians" not "degrees" — all angular values throughout the codebase are in radians
- "entry/exit animation" not "show/hide animation"
- "circle layout component" (the wrapper, `CircleLayoutComponent`) vs "circle layout" (the public `CircleLayout` component)

## What this library does NOT do

- Does not handle gesture input or tap events on child components
- Does not manage visibility state — consumers drive show/hide imperatively via the ref
- Does not support non-uniform spacing between components
