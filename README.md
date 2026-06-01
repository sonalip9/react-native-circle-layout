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
   * Array of animations to be performed on entry and exit of components.
   */
  animationConfigs: AnimationConfig[];
  /**
   * The type of composition animation to be performed with
   * all the animation configs provided.
   *
   * For those composition which perform animation in a particular order,
   * the order is picked by the order in the animationConfig array.
   */
  animationCombinationType: AnimationCombinationType;
  /**
   * The gap between the start of animation of 2 consecutive components.
   * This value is in milliseconds.
   */
  animationGap?: number;
};
```

### AnimationConfig

```ts
export type AnimationConfig = {
  /**
   * The type of animation to be performed.
   */
  animationType: AnimationType;
  /**
   * The configuration for the animation.
   */
  config?: {
    /**
     * The duration of the animation in milliseconds.
     * @default 500
     */
    duration?: number;
    /**
     * The delay before the animation starts in milliseconds.
     * @default 0
     */
    delay?: number;
    /**
     * The easing function to be used for the animation.
     * @default Easing.inOut(Easing.ease)
     */
    easing?: EasingFunction;
    /**
     * Flag to indicate if this animation creates an "interaction
     * handle" on the InteractionManager.
     * @default true.
     */
    isInteraction?: boolean | undefined;
  };
};
```

### AnimationType

```ts
export enum AnimationType {
  /**
   * The component will fade in on entry and fade out on exit.
   */
  OPACITY = 'OPACITY',
  /**
   * The component will move from the center to its final position.
   */
  LINEAR = 'LINEAR',
  /**
   * The component will move along the circumference of the circle
   * from the position of the first component to its final position.
   */
  CIRCULAR = 'CIRCULAR',
}
```

### AnimationCombinationType

```ts
export enum AnimationCombinationType {
  /**
   * The animations will be performed in parallel.
   */
  PARALLEL = 'PARALLEL',
  /**
   * The animations will be performed in sequence.
   */
  SEQUENCE = 'SEQUENCE',
}
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
