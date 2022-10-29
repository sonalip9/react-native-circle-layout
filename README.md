# React Native Circle Layout

<div align='center'>

![npm](https://img.shields.io/npm/v/react-native-circle-layout)
![GitHub Release Date](https://img.shields.io/github/release-date/sonalip9/react-native-circle-layout)
![npm](https://img.shields.io/npm/dt/react-native-circle-layout)
![GitHub](https://img.shields.io/github/license/sonalip9/react-native-circle-layout)

![npm bundle size](https://img.shields.io/bundlephobia/minzip/react-native-circle-layout)
![npm bundle size](https://img.shields.io/bundlephobia/min/react-native-circle-layout)

![GitHub top language](https://img.shields.io/github/languages/top/sonalip9/react-native-circle-layout)
![Lines of code](https://img.shields.io/tokei/lines/github/sonalip9/react-native-circle-layout)
![GitHub commit activity](https://img.shields.io/github/commit-activity/m/sonalip9/react-native-circle-layout)

![GitHub Repo stars](https://img.shields.io/github/stars/sonalip9/react-native-circle-layout?style=social)

</div>

Don't sit to re-invent the wheel, doing all the math, when you can use the `react-native-circle-layout` package to easily create any kind of a circular display of components - complete circle, semi-circle, quarter of a circle, or anything in the middle. You want it the other way around, I've got you covered. Animations? They're supported too.

This library basically does the math to figure out where exactly it needs to place your elements so that they will be in a circular layout. Only minimal inputs required. See [this](#props) section for all inputs, and their defaults.

What each element is going to be is left to you - it can be an icon, a button, an image, literally anything.

Star the [project](https://github.com/sonalip9/react-native-circle-layout) to show your support if you liked it!

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

  return (
    <CircleLayout
      components={components}
      radius={100}
    />
  );
}

```

## Props
### `components` **Required**
*type:* `ReactNode[]`

*description:* List of components that need to be placed on the circle.

### `radius` **Required**
*type:* `number` 

*description:* The radius of the circle.

### `centerComponent`
*type:* `ReactNode`

*description:* The component to be shown at the center of the circle

### `sweepAngle`
*type:* `number`

*default value:* `2 * Math.Pi`

*description:* The distance in radians to be covered by the circle's arc from the starting point. This value should always be in radians between `-2 * Math.PI` and `2 * Math.PI`.

 For example, if the elements need to be placed in semi-circle the value will be `Math.PI`, for quarter of a circle, it will be `Math.PI / 2`.

#### `startAngle`
*type:* `number`

*default value:* 0

*description:* The angle at which the first component will be placed. The value needs to be in radians between `-2 * Math.PI` and `2 * Math.PI`.

### `containerStyle`
*type:* `ViewStyle`

*description:* The styling to be applied to the container of the component.

#### `centerComponentContainerStyle`
*type:* `ViewStyle`

*description:* The styling to be applied to the container of the center component.

### `showComponents`
*type:* boolean

*description:* Flag to show or hide the components in the circle layout. This flag is used to perform the start and end animation.

### `opacityAnimationConfig`
*type:* AnimationConfig | undefined

*description:* The configuration for the fade-in entry and fade-out exit of the components. If this prop is undefined, then there will be no animation.


### `linearAnimationConfig`
*type:* AnimationConfig | undefined

*description:* The configuration for the linear entry and exit animations of the components. The components will start from the center and move to their final positions. If this prop is undefined, then there will be no animation.

### `circularAnimationConfig`
*type:* AnimationConfig | undefined
*description:* The configuration for the circle entry and exit animations of the components. The components will start from the position of the first component and move along the circumference of the circle to their final positions. If this prop is undefined, then there will be no animation.

## Authors

- [@sonalip9](https://www.github.com/sonalip9)

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

You can report bugs or request a feature [here](https://github.com/sonalip9/react-native-circle-layout/issues).

## License

[MIT](LICENSE)

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
