import * as React from 'react';
import { use } from 'react';
import {
  Platform,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import {
  AnimationCombinationType,
  AnimationType,
  CircleLayout,
  type AnimationConfig,
  type CircleLayoutRef,
} from 'react-native-circle-layout';

import { AppContext } from '../AppContext';
import { Button, Text, View } from '../design_system/atoms';
import { Dropdown, SliderWithLabel, Switch } from '../design_system/molecules';
import theme, { palette } from '../design_system/style';

const colorOptions = Object.entries(palette)
  .filter(([name]) => name !== 'transparent')
  .map(([name, value]) => ({ label: name, value }));

const DEFAULT_OUTER_RADIUS = 100;
const DEFAULT_BG_COLOR = palette.purplePrimary;

const Playground = () => {
  const { showPopUp } = use(AppContext);
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const maxRadius = React.useMemo(
    () => Number((Math.min(windowWidth, windowHeight) * 0.4).toFixed(0)),
    [windowWidth, windowHeight]
  );
  const [isCenterClickable, setIsCenterClickable] = React.useState(false);
  const [showCircle, setShowCircle] = React.useState(false);
  const [radius, setRadius] = React.useState(100);
  const [sweepAngle, setSweepAngle] = React.useState(2 * Math.PI);
  const [startAngle, setStartAngle] = React.useState(0);
  const [numberOfPoints, setNumberOfPoints] = React.useState(10);
  const [isParallelAnimation, setIsParallelAnimation] = React.useState(false);
  const [animationTypeList, setAnimationTypeList] = React.useState<
    AnimationType[]
  >([AnimationType.OPACITY, AnimationType.LINEAR, AnimationType.CIRCULAR]);
  const [animationDuration, setAnimationDuration] = React.useState(500);
  const [animationGap, setAnimationGap] = React.useState(0);
  const [animationDelay, setAnimationDelay] = React.useState(0);

  const [showBackground, setShowBackground] = React.useState(false);
  const [bgColor, setBgColor] = React.useState(DEFAULT_BG_COLOR);
  const [strokeColor, setStrokeColor] = React.useState(DEFAULT_BG_COLOR);
  const [strokeWidth, setStrokeWidth] = React.useState(1);
  const [innerRadius, setInnerRadius] = React.useState(0);
  const [outerRadius, setOuterRadius] = React.useState(DEFAULT_OUTER_RADIUS);

  const [showContainerBackground, setShowContainerBackground] =
    React.useState(false);
  const [highlightCenterComponent, setHighlightCenterComponent] =
    React.useState(false);

  const circleLayoutRef = React.useRef<CircleLayoutRef>(null);

  React.useEffect(() => {
    if (showCircle) {
      circleLayoutRef.current?.showComponents();
    } else {
      circleLayoutRef.current?.hideComponents();
    }
  }, [showCircle]);

  const createComponents = (n: number) => {
    const components = [];

    for (let i = 0; i < n; i += 1) {
      components.push(
        <View key={i} alignItems="center">
          <View bg="black" borderRadius={'xl'} height={10} width={10} />
          <Text>Point {i}</Text>
        </View>
      );
    }

    return components;
  };

  return (
    <ScrollView
      contentContainerStyle={{
        flexDirection: Platform.select({ web: 'row', default: 'column' }),
        alignItems: 'center',
        justifyContent: 'space-around',
        minHeight: '100%',
        padding: 24,
        gap: 24,
      }}
      style={{ flex: 1 }}
    >
      <CircleLayout
        animationProps={{
          animationCombinationType: isParallelAnimation
            ? AnimationCombinationType.PARALLEL
            : AnimationCombinationType.SEQUENCE,
          animationGap,
          animationConfigs: animationTypeList.reduce<
            Partial<Record<AnimationType, AnimationConfig>>
          >(
            (acc, animationType) => ({
              ...acc,
              [animationType]: {
                duration: animationDuration,
                delay: animationDelay,
              },
            }),
            {}
          ),
        }}
        bgConfig={
          showBackground
            ? {
                color: bgColor,
                strokeColor,
                strokeWidth,
                innerRadius,
                outerRadius,
              }
            : undefined
        }
        centerComponent={
          <TouchableOpacity
            style={{
              backgroundColor: theme.colors.purplePrimary,
              borderRadius: theme.borderRadii.xl,
              height: 25,
              width: 25,
            }}
            disabled={!isCenterClickable}
            onPress={() => {
              setShowCircle((oldValue) => !oldValue);
            }}
          ></TouchableOpacity>
        }
        centerComponentContainerStyle={
          highlightCenterComponent
            ? {
                borderWidth: 2,
                borderColor: palette.greenPrimary,
                borderRadius: 999,
              }
            : undefined
        }
        components={createComponents(numberOfPoints)}
        containerStyle={{
          height: maxRadius * 2.2,
          width: maxRadius * 2.2,
          borderWidth: 1,
          borderColor: 'grey',
          borderRadius: 12,
          backgroundColor: showContainerBackground
            ? palette.disabled
            : 'transparent',
        }}
        radius={radius}
        ref={circleLayoutRef}
        startAngle={startAngle}
        sweepAngle={sweepAngle}
      />

      <View
        gap="xl"
        alignItems="center"
        borderWidth={1}
        borderColor="grey"
        padding="m"
        borderRadius="m"
      >
        <View gap="s">
          <Text fontWeight="bold">Layout</Text>
          <Switch
            leftLabel="Center Clickable"
            value={isCenterClickable}
            onValueChange={setIsCenterClickable}
          />
          <SliderWithLabel
            label="Radius"
            maximumValue={maxRadius}
            minimumValue={1}
            onValueChange={setRadius}
            step={1}
            value={radius}
          />
          <SliderWithLabel
            label="Sweep Angle"
            maximumValue={360}
            minimumValue={0}
            onValueChange={(value) => setSweepAngle((value * Math.PI) / 180)}
            step={5}
            value={(sweepAngle * 180) / Math.PI}
            unit="°"
          />
          <SliderWithLabel
            label="Start Angle"
            maximumValue={360}
            minimumValue={0}
            onValueChange={(value) => setStartAngle((value * Math.PI) / 180)}
            step={5}
            value={(startAngle * 180) / Math.PI}
            unit="°"
          />
          <SliderWithLabel
            label="Number of Points"
            maximumValue={20}
            minimumValue={2}
            onValueChange={setNumberOfPoints}
            step={1}
            value={numberOfPoints}
          />
          <Switch
            leftLabel="Container background off"
            rightLabel="Container background on"
            value={showContainerBackground}
            onValueChange={setShowContainerBackground}
          />
          <Switch
            leftLabel="Center component plain"
            rightLabel="Center component highlighted"
            value={highlightCenterComponent}
            onValueChange={setHighlightCenterComponent}
          />
        </View>

        <View gap="s">
          <Text fontWeight="bold">Background</Text>
          <Switch
            leftLabel="Background off"
            rightLabel="Background on"
            value={showBackground}
            onValueChange={setShowBackground}
          />
          <Dropdown
            onValueChange={(value) => setBgColor(value)}
            label="Background Color"
            options={colorOptions}
            placeholder="Select a color"
            value={bgColor}
            variant="single"
            isDisabled={!showBackground}
            width={'100%'}
          />
          <Dropdown
            onValueChange={(value) => setStrokeColor(value)}
            label="Stroke Color"
            options={colorOptions}
            placeholder="Select a color"
            value={strokeColor}
            variant="single"
            isDisabled={!showBackground}
            width={'100%'}
          />
          <SliderWithLabel
            label="Stroke Width"
            maximumValue={10}
            minimumValue={0}
            onValueChange={setStrokeWidth}
            step={1}
            value={strokeWidth}
            isDisabled={!showBackground}
          />
          <SliderWithLabel
            label="Inner Radius"
            maximumValue={maxRadius}
            minimumValue={0}
            onValueChange={setInnerRadius}
            step={1}
            value={innerRadius}
            isDisabled={!showBackground}
          />
          <SliderWithLabel
            label="Outer Radius"
            maximumValue={maxRadius}
            minimumValue={0}
            onValueChange={setOuterRadius}
            step={1}
            value={outerRadius}
            isDisabled={!showBackground}
          />
        </View>

        <View gap="s">
          <Text fontWeight="bold">Animation</Text>
          <Switch
            leftLabel="Sequential Animation"
            rightLabel="Parallel Animation"
            value={isParallelAnimation}
            onValueChange={setIsParallelAnimation}
          />
          <Dropdown
            onValueChange={(value) =>
              setAnimationTypeList(value as AnimationType[])
            }
            label="Animation Types"
            options={Object.values(AnimationType).map(
              (animationType: AnimationType) => ({
                label: animationType,
                value: animationType,
              })
            )}
            placeholder="Select animation types"
            value={animationTypeList}
            variant="multiple"
            maintainSelectionOrder
            width={'100%'}
          />
          <SliderWithLabel
            label="Animation Duration"
            maximumValue={2000}
            minimumValue={0}
            onValueChange={setAnimationDuration}
            step={100}
            value={animationDuration}
            unit="ms"
          />
          <SliderWithLabel
            label="Animation Gap"
            maximumValue={300}
            minimumValue={0}
            onValueChange={setAnimationGap}
            step={10}
            value={animationGap}
            unit="ms"
          />
          <SliderWithLabel
            label="Animation Delay"
            maximumValue={1000}
            minimumValue={0}
            onValueChange={setAnimationDelay}
            step={50}
            value={animationDelay}
            unit="ms"
          />
        </View>

        <View gap="s" width="90%">
          <Button
            onPress={() => {
              if (isCenterClickable) {
                showPopUp({
                  message:
                    "Click the center component's circle to toggle the layout!",
                });
              } else {
                setShowCircle((oldValue) => !oldValue);
              }
            }}
            label={showCircle ? 'Hide circle layout' : 'Show circle layout'}
          />
          <Button
            onPress={() => {
              setShowCircle(false);
              setRadius(100);
              setSweepAngle(2 * Math.PI);
              setStartAngle(0);
              setNumberOfPoints(10);
              setIsParallelAnimation(false);
              setAnimationTypeList([
                AnimationType.OPACITY,
                AnimationType.LINEAR,
                AnimationType.CIRCULAR,
              ]);
              setAnimationDuration(500);
              setAnimationGap(0);
              setAnimationDelay(0);
              setShowBackground(false);
              setBgColor(DEFAULT_BG_COLOR);
              setStrokeColor(DEFAULT_BG_COLOR);
              setStrokeWidth(1);
              setInnerRadius(0);
              setOuterRadius(DEFAULT_OUTER_RADIUS);
              setShowContainerBackground(false);
              setHighlightCenterComponent(false);
              setIsCenterClickable(false);
            }}
            label="Reset"
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default Playground;
