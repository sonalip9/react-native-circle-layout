import Slider from '@react-native-community/slider';
import * as React from 'react';
import {
  Button,
  SafeAreaView,
  StatusBar,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { CircleLayout } from 'react-native-circle-layout';

import { styles } from './styles';

const App = () => {
  const [showInitial, setShowInitial] = React.useState(false);
  const { width: windowWidth } = useWindowDimensions();
  const [showCircle, setShowCircle] = React.useState(false);
  const [radius, setRadius] = React.useState(100);
  const [sweepAngle, setSweepAngle] = React.useState(2 * Math.PI);
  const [startAngle, setStartAngle] = React.useState(0);
  const [numberOfPoints, setNumberOfPoints] = React.useState(2);

  const createComponents = (n: number) => {
    const components = [];

    for (let i = 0; i < n; i += 1) {
      components.push(
        <View style={styles.alignCenter}>
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
        {showInitial && (
          <CircleLayout
            animationConfig={{
              gap: 1000,
              duration: 1000,
            }}
            centerComponent={<View style={styles.centerComponent} />}
            components={createComponents(numberOfPoints)}
            containerStyle={styles.circleLayoutContainer}
            radius={radius}
            showComponents={showCircle}
            startAngle={startAngle}
            sweepAngle={sweepAngle}
          />
        )}
        <View style={styles.flex} />

        <View style={styles.sliderContainer}>
          <Text style={styles.sliderLabel}>Radius</Text>
          <Slider
            maximumValue={Number(((windowWidth * 0.85) / 2).toFixed(0))}
            minimumValue={0}
            onValueChange={setRadius}
            step={1}
            style={styles.slider}
            value={radius}
          />
          <Text style={styles.sliderValue}>{radius}</Text>
        </View>
        <View style={styles.sliderContainer}>
          <Text style={styles.sliderLabel}>Sweep Angle</Text>
          <Slider
            maximumValue={2 * Math.PI}
            minimumValue={0}
            onValueChange={setSweepAngle}
            style={styles.slider}
            value={sweepAngle}
          />
          <Text style={styles.sliderValue}>
            {((sweepAngle * 180) / Math.PI).toFixed(2)}°
          </Text>
        </View>
        <View style={styles.sliderContainer}>
          <Text style={styles.sliderLabel}>Start Angle</Text>
          <Slider
            maximumValue={2 * Math.PI}
            minimumValue={0}
            onValueChange={setStartAngle}
            style={styles.slider}
            value={startAngle}
          />
          <Text style={styles.sliderValue}>
            {((startAngle * 180) / Math.PI).toFixed(2)}°
          </Text>
        </View>
        <View
          pointerEvents={showInitial ? 'none' : 'auto'}
          style={styles.sliderContainer}
        >
          <Text style={styles.sliderLabel}>Number of Points</Text>
          <Slider
            maximumValue={20}
            minimumValue={2}
            onValueChange={setNumberOfPoints}
            step={1}
            style={styles.slider}
            value={numberOfPoints}
          />
          <Text style={styles.sliderValue}>{numberOfPoints}</Text>
        </View>

        <Button
          onPress={() => {
            setShowInitial(() => true);
            setShowCircle((oldValue) => !oldValue);
          }}
          title={showCircle ? 'Hide circle layout' : 'Show circle layout'}
        />
        <View style={styles.footer} />
      </View>
    </SafeAreaView>
  );
};

export default App;
