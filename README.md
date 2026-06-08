# React Native Circle Layout

<!-- markdownlint-disable-next-line MD033 -->
<div align='center'>

![NPM Version](https://img.shields.io/npm/v/react-native-circle-layout) ![NPM Last Update](https://img.shields.io/npm/last-update/react-native-circle-layout) ![npms.io](https://img.shields.io/npm/dt/react-native-circle-layout) ![Licence](https://img.shields.io/github/license/sonalip9/react-native-circle-layout)
![Language](https://img.shields.io/github/languages/top/sonalip9/react-native-circle-layout) [![Lines of Code](https://img.shields.io/endpoint?url=https%3A%2F%2Ftokei.kojix2.net%2Fbadge%2Fgithub%2Fsonalip9%2Freact-native-circle-layout%2Flines)](https://tokei.kojix2.net/github/sonalip9/react-native-circle-layout) ![GitHub commit activity](https://img.shields.io/github/commit-activity/m/sonalip9/react-native-circle-layout) ![Codecov](https://img.shields.io/codecov/c/github/sonalip9/react-native-circle-layout)
[![install size](https://packagephobia.com/badge?p=react-native-circle-layout@0.9.1)](https://packagephobia.com/result?p=react-native-circle-layout@0.9.1) ![GitHub repo size](https://img.shields.io/github/repo-size/sonalip9/react-native-circle-layout)
![GitHub Repo stars](https://img.shields.io/github/stars/sonalip9/react-native-circle-layout?style=social)

</div>

Easily create any kind of a circular display of components - complete circle, semi-circle, quarter of a circle, or anything in between. Start anywhere, end anywhere. Animations? They're supported too. (Make sure you have the latest version.)

Don't sit to re-invent the wheel, doing all the math, when you can use `react-native-circle-layout`.

This library does the calculations to figure out where exactly it needs to place your elements so that they will be in a circular layout. Only minimal inputs required. See [this](#props) section for all inputs, and their defaults.

What each element is going to be is left to you - it can be an icon, a button, an image, literally anything.

Star the [project](https://github.com/sonalip9/react-native-circle-layout) to show your support if you liked it!

Share your project [in the discussions](https://github.com/sonalip9/react-native-circle-layout/discussions/29)!

## Installation

The published library works with the React Native stack used by the package, and the `example/` app is pinned to React 19.2.3. That example intentionally uses React 19 APIs such as context provider shorthand and `use`.

```sh
npm install react-native-circle-layout
```

or

```sh
yarn add react-native-circle-layout
```

or

```sh
pnpm add react-native-circle-layout
```

## Usage

```tsx
import { CircleLayout } from 'react-native-circle-layout';

const Example = () => {
  const components = [];
  for (let i = 0; i < 6; i++) {
    components.push(
      <View style={{ alignItems: 'center' }}>
        <View style={styles.circleLayoutComponent} />
        <Text>Point {i}</Text>
      </View>
    );
  }

  return <CircleLayout components={components} radius={100} />;
};
```

## Props

### `components` **Required**

_type:_ `ReactNode[]`

_description:_ List of components that need to be placed on the circle.

### `radius` **Required**

_type:_ `number`

_description:_ The radius of the circle.

### `centerComponent`

_type:_ `ReactNode`

_description:_ The component to be shown at the center of the circle

### `sweepAngle`

_type:_ `number`

_default value:_ `2 * Math.Pi`

_description:_ The distance in radians to be covered by the circle's arc from the starting point. This value should always be in radians between `-2 * Math.PI` and `2 * Math.PI`.

For example, if the elements need to be placed in semi-circle the value will be `Math.PI`, for quarter of a circle, it will be `Math.PI / 2`.

### `startAngle`

_type:_ `number`

_default value:_ 0

_description:_ The angle at which the first component will be placed. The value needs to be in radians between `-2 * Math.PI` and `2 * Math.PI`.

### `containerStyle`

_type:_ `ViewStyle`

_description:_ The styling to be applied to the container of the component.

### `centerComponentContainerStyle`

_type:_ `ViewStyle`

_description:_ The styling to be applied to the container of the center component.

### `animationProps`

_type_: [AnimationProps](#animationprops-1)

_description_: The properties to configure the entry and exit animation of the component.

### `bgConfig`

_type_: [BgConfig](#bgconfig)

_default value_: `undefined`

_description_: The configuration for the background sectors drawn behind each component on the circle. If this prop is not provided, then no background is shown.

## Methods

These methods are available via the `ref` prop on `CircleLayout`.

```tsx
const ref = useRef<CircleLayoutRef>(null);
<CircleLayout ref={ref} components={components} radius={100} />

ref.current?.showComponents();
ref.current?.hideComponents();
```

### `showComponents()`

Makes all circle-layout components visible. Triggers the entry animation on each component if `animationProps` is configured.

### `hideComponents()`

Hides all circle-layout components. Triggers the exit animation on each component if `animationProps` is configured.

## Custom Types and Constants

### AnimationProps

```ts
export type AnimationProps = {
  /**
   * The configuration for the animation. The key of the record is the type of
   * animation and the value is the configuration for that animation. If a
   * particular animation type is not provided, then that animation will not
   * be performed.
   *
   * The order of the animation is determined by the key order of the object.
   */
  animationConfigs: Partial<Record<AnimationType, AnimationConfig>>;
  /**
   * The type of composition animation to be performed with
   * all the animation configs provided.
   *
   * For those composition which perform animation in a particular order,
   * the order is picked by the key order of the animationConfigs object.
   */
  animationCombinationType: AnimationCombinationType;
  /**
   * The gap between the start of animation of 2 consecutive components.
   * This value is in milliseconds.
   */
  animationGap?: number;
};
```

```ts
// Example
{
  animationConfigs: {
    [AnimationType.OPACITY]: {
      duration: 500,
      easing: Easing.inOut(Easing.ease),
    },
    [AnimationType.LINEAR]: {
      duration: 500,
    },
  },
  animationCombinationType: AnimationCombinationType.PARALLEL,
}
```

### AnimationConfig

```ts
/**
 * The configuration for the animation.
 * @see https://reactnative.dev/docs/animated#timing
 */
export type AnimationConfig = Omit<
  Animated.TimingAnimationConfig,
  'toValue' | 'useNativeDriver'
>;
```

### AnimationType

```ts
export enum AnimationType {
  /**
   * The component will fade in on entry and fade out on exit.
   */
  OPACITY = 'opacityAnimationConfig',
  /**
   * The component will move from the center to its final position.
   */
  LINEAR = 'linearAnimationConfig',
  /**
   * The component will move along the circumference of the circle
   * from the position of the first component to its final position.
   */
  CIRCULAR = 'circularAnimationConfig',
}
```

### AnimationCombinationType

```ts
export enum AnimationCombinationType {
  /**
   * The animations will be performed in parallel.
   */
  PARALLEL = 'parallel',
  /**
   * The animations will be performed in sequence.
   */
  SEQUENCE = 'sequence',
}
```

### BgConfig

```ts
export type BgConfig = {
  /**
   * The fill color for the background of the circle layout.
   * @default '#3d19e0'
   */
  color?: string;
  /**
   * The stroke color for the divider lines in the background.
   * @default color
   */
  strokeColor?: string;
  /**
   * The width of the stroke for the divider lines in the background.
   * @default 1
   */
  strokeWidth?: number;
  /**
   * The radius of the inner circle in the background.
   *
   * If this prop is not provided, the background is a filled circle with
   * the radius provided in CircleLayoutProps. If provided, the background
   * is a donut shape between innerRadius and the outer radius.
   * @default 0
   */
  innerRadius?: number;
  /**
   * The radius of the outer circle in the background.
   * @default radius provided in CircleLayoutProps
   */
  outerRadius?: number;
};
```

## Authors

- [@sonalip9](https://www.github.com/sonalip9)

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

You can [report bugs or request a feature](https://github.com/sonalip9/react-native-circle-layout/issues) on GitHub.

## License

[MIT](LICENSE)

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
