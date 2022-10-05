import * as React from 'react';

import Slider from '@react-native-community/slider';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { CircleLayout } from 'react-native-circle-layout';

export default function App() {
  const { width: windowWidth } = useWindowDimensions();
  const [radius, setRadius] = React.useState(100);
  const [sweepAngle, setSweepAngle] = React.useState(2 * Math.PI);
  const [startAngle, setStartAngle] = React.useState(0);
  const [numberOfPoints, setNumberOfPoints] = React.useState(2);

  const createComponents = (n: number) => {
    const components = [];

    for (let i = 0; i < n; i++) {
      components.push(
        <View style={{ alignItems: 'center' }}>
          <View style={styles.circleLayoutComponent} />
          <Text>Point {i}</Text>
        </View>
      );
    }
    return components;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar />
      <View style={styles.container}>
        <CircleLayout
          containerStyle={{ width: '100%', flex: 1 }}
          components={createComponents(numberOfPoints)}
          radius={radius}
          sweepAngle={sweepAngle}
          startAngle={startAngle}
          centerComponent={<View style={styles.centerComponent} />}
        />

        <View style={styles.sliderContainer}>
          <Text style={styles.sliderLabel}>Radius</Text>
          <Slider
            value={radius}
            style={styles.slider}
            minimumValue={0}
            maximumValue={Number(((windowWidth * 0.85) / 2).toFixed(0))}
            step={1}
            onValueChange={setRadius}
          />
          <Text style={styles.sliderValue}>{radius}</Text>
        </View>
        <View style={styles.sliderContainer}>
          <Text style={styles.sliderLabel}>Sweep Angle</Text>
          <Slider
            value={sweepAngle}
            style={styles.slider}
            minimumValue={0}
            maximumValue={2 * Math.PI}
            onValueChange={setSweepAngle}
          />
          <Text style={styles.sliderValue}>
            {((sweepAngle * 180) / Math.PI).toFixed(2)}°
          </Text>
        </View>
        <View style={styles.sliderContainer}>
          <Text style={styles.sliderLabel}>Start Angle</Text>
          <Slider
            value={startAngle}
            style={styles.slider}
            minimumValue={0}
            maximumValue={2 * Math.PI}
            onValueChange={setStartAngle}
          />
          <Text style={styles.sliderValue}>
            {((startAngle * 180) / Math.PI).toFixed(2)}°
          </Text>
        </View>
        <View style={styles.sliderContainer}>
          <Text style={styles.sliderLabel}>Number of Points</Text>
          <Slider
            value={numberOfPoints}
            style={styles.slider}
            minimumValue={2}
            maximumValue={50}
            step={1}
            onValueChange={setNumberOfPoints}
          />
          <Text style={styles.sliderValue}>{numberOfPoints}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: '100%',
    alignItems: 'center',
  },
  centerComponent: {
    height: 25,
    width: 25,
    backgroundColor: 'pink',
    borderRadius: 20,
  },
  circleLayoutComponent: {
    height: 10,
    width: 10,
    borderRadius: 10,
    backgroundColor: 'black',
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-evenly',
  },
  slider: { width: '50%', height: 40 },
  sliderLabel: { flex: 1, textAlign: 'right' },
  sliderValue: { flex: 1 },
});
