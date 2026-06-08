import * as React from 'react';
import { ScrollView, useWindowDimensions } from 'react-native';
import { Text, View, Button } from '../../design_system/atoms';
import {
  Dropdown,
  SliderWithLabel,
  Switch,
} from '../../design_system/molecules';
import {
  AnimationCombinationType,
  AnimationType,
  CircleLayout,
  type AnimationConfig,
  type CircleLayoutRef,
} from 'react-native-circle-layout';

const Playground = () => {
  const [showInitial, setShowInitial] = React.useState(false);
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const viewFlexDirection = React.useMemo(
    () => (windowHeight > windowWidth ? 'column' : 'row'),
    [windowHeight, windowWidth]
  );
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
        flexDirection: viewFlexDirection,
        alignItems: 'center',
        justifyContent: 'space-between',
        minHeight: '100%',
        padding: 24,
        gap: 24,
      }}
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
          <View bg="purplePrimary" borderRadius={'xl'} height={25} width={25} />
        }
        components={createComponents(numberOfPoints)}
        containerStyle={{ width: '100%' }}
        radius={radius}
        ref={circleLayoutRef}
        startAngle={startAngle}
        sweepAngle={sweepAngle}
      />

      <View
        gap="xl"
        width="100%"
        alignItems="center"
        borderWidth={1}
        borderColor="grey"
        padding="m"
        borderRadius="m"
      >
        <View gap="s">
          <SliderWithLabel
            label="Radius"
            maximumValue={Number(((windowWidth * 0.85) / 2).toFixed(0))}
            minimumValue={0}
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
            isDisabled={showInitial}
            maximumValue={20}
            minimumValue={2}
            onValueChange={setNumberOfPoints}
            step={1}
            value={numberOfPoints}
          />
          <Switch
            leftLabel="Parallel Animation"
            rightLabel="Sequential Animation"
            value={isParallelAnimation}
            onValueChange={setIsParallelAnimation}
          />
          <Dropdown
            onValueChange={(value) =>
              setAnimationTypeList(value as AnimationType[])
            }
            label="Animation Types"
            options={Object.values(AnimationType).map((animationType) => ({
              label: animationType,
              value: animationType,
            }))}
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
              setShowInitial(true);
              setShowCircle((oldValue) => !oldValue);
            }}
            label={showCircle ? 'Hide circle layout' : 'Show circle layout'}
          />
          <Button
            onPress={() => {
              setShowInitial(false);
              setShowCircle(false);
              setRadius(100);
              setSweepAngle(2 * Math.PI);
              setStartAngle(0);
              setNumberOfPoints(2);
            }}
            label="Reset"
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default Playground;
