
# React Native Circle Layout

Don't sit to re-invent the wheel, doing all the math, when you can use the `react-native-circle-layout` package to easily create any kind of a circular display of components - complete circle, semi-circle, quarter of a circle, or anything in the middle. You want it the other way around, we got you covered.

This library basically does the math to figure out where exactly it needs to place your elements so that they will be in a circular layout. Only minimal inputs required. See [this](#props) table for all inputs, and their defaults.

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

| Props        | Type     | Default | Description        |
| :----------- | :-------- | :------- | :-------------- |
| `components` | `ReactNode[]` | - | **Required**. List of components that need to be placed on the circle. |
|`radius`| `number` | - | **Required**. The radius of the circle.|
|`centerComponent`| `ReactNode`| -| The component to be shown at the center of the circle.|
|`sweepAngle` |`number`|`2 * Math.Pi`| The distance in radians to be covered by the circle's arc from the starting point. This value should always be in radians between `-2 * Math.PI` and `2 * Math.PI`. <br> <br> For example, if the elements need to be placed in semi-circle the value will be `Math.PI`, for quarter of a circle, it will be `Math.PI / 2`. |
|`startAngle`|`number`|0|The angle at which the first component will be placed. The value needs to be in radians between `-2 * Math.PI` and `2 * Math.PI`.|
|`containerStyle`|`ViewStyle`|-| The styling to be applied to the container of the component.|
|`centerComponentContainerStyle`|`ViewStyle`|-| The styling to be applied to the container of the center component.|
## Authors

- [@sonalip9](https://www.github.com/sonalip9)

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

You can report bugs or request a feature [here](https://github.com/sonalip9/react-native-circle-layout/issues).

## License

[MIT](LICENSE)

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
