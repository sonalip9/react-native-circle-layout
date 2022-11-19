# React Native Circle Layout

<div align='center'>

<a href='https://www.npmjs.com/package/react-native-circle-layout'>
  <img src='https://img.shields.io/npm/v/react-native-circle-layout' alt='NPM Version'></a>
<a href='https://github.com/sonalip9/react-native-circle-layout/releases/latest'>
  <img src='https://img.shields.io/github/release-date/sonalip9/react-native-circle-layout' alt='Releases'></a>
<a href='https://www.npmjs.com/package/react-native-circle-layout'>
  <img src='https://img.shields.io/npm/dt/react-native-circle-layout' /></a>
<a href='https://github.com/sonalip9/react-native-circle-layout/blob/main/LICENSE'>
  <img src='https://img.shields.io/github/license/sonalip9/react-native-circle-layout' alt='License'></a>
<br/>
<a href='https://github.com/sonalip9/react-native-circle-layout/releases'>
  <img src='https://img.shields.io/bundlephobia/minzip/react-native-circle-layout' alt='Minified zipped size'>
  <img src='https://img.shields.io/bundlephobia/min/react-native-circle-layout' alt='Minified size'></a>
<br/>
<a href='https://github.com/sonalip9/react-native-circle-layout/search?l=typescript'>
  <img src='https://img.shields.io/github/languages/top/sonalip9/react-native-circle-layout' alt='Language'></a>
<a href='https://github.com/sonalip9/react-native-circle-layout/commits/main'>
  <img src='https://img.shields.io/tokei/lines/github/sonalip9/react-native-circle-layout' alt='Lines of code'></a>
<a href='https://github.com/sonalip9/react-native-circle-layout/graphs/commit-activity'>
  <img src='https://img.shields.io/github/commit-activity/m/sonalip9/react-native-circle-layout' alt='GitHub commit activity'></a>
<br/>
<a href='https://github.com/sonalip9/react-native-circle-layout'>
  <img src='https://img.shields.io/github/stars/sonalip9/react-native-circle-layout?style=social' alt='GitHub Repo stars'></a>

</div>

Easily create any kind of a circular display of components - complete circle, semi-circle, quarter of a circle, or anything in between. Start anywhere, end anywhere. Animations? They're supported too. (Make sure you have the latest version.)

Don't sit to re-invent the wheel, doing all the math, when you can use `react-native-circle-layout`.

This library does the calculations to figure out where exactly it needs to place your elements so that they will be in a circular layout. Only minimal inputs required. See [this](#props) section for all inputs, and their defaults.

What each element is going to be is left to you - it can be an icon, a button, an image, literally anything.

Star the [project](https://github.com/sonalip9/react-native-circle-layout) to show your support if you liked it!

Share your project [here](https://github.com/sonalip9/react-native-circle-layout/discussions/29)!

## Installation

```sh
npm install react-native-circle-layout
```

or

```sh
yarn add react-native-circle-layout
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

You can report bugs or request a feature [here](https://github.com/sonalip9/react-native-circle-layout/issues).

## License

[MIT](LICENSE)

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
