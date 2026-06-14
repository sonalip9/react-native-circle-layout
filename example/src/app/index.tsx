import { AppContext } from '@/AppContext';
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

import { Button, Text, View } from '../design_system/atoms';
import { Dropdown, SliderWithLabel, Switch } from '../design_system/molecules';
import theme from '../design_system/style';

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
          animationConfigs: animationTypeList.reduce<
            Partial<Record<AnimationType, AnimationConfig>>
          >(
            (acc, animationType) => ({
              ...acc,
              [animationType]: { duration: 500 },
            }),
            {}
          ),
        }}
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
        components={createComponents(numberOfPoints)}
        containerStyle={{
          height: maxRadius * 2.2,
          width: maxRadius * 2.2,
          borderWidth: 1,
          borderColor: 'grey',
          borderRadius: 12,
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
            }}
            label="Reset"
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default Playground;
