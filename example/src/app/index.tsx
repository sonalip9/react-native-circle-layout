import { use, useMemo, useReducer, useCallback } from 'react';
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

type State = {
  isCenterClickable: boolean;
  showCircle: boolean;
  radius: number;
  sweepAngle: number;
  startAngle: number;
  numberOfPoints: number;
  isParallelAnimation: boolean;
  animationTypeList: AnimationType[];
  animationDuration: number;
  animationGap: number;
  animationDelay: number;
  showBackground: boolean;
  bgColor: string;
  strokeColor: string;
  strokeWidth: number;
  innerRadius: number;
  outerRadius: number;
  showContainerBackground: boolean;
  highlightCenterComponent: boolean;
};

const initialState: State = {
  isCenterClickable: false,
  showCircle: false,
  radius: 100,
  sweepAngle: 2 * Math.PI,
  startAngle: 0,
  numberOfPoints: 10,
  isParallelAnimation: false,
  animationTypeList: [
    AnimationType.OPACITY,
    AnimationType.LINEAR,
    AnimationType.CIRCULAR,
  ],
  animationDuration: 500,
  animationGap: 0,
  animationDelay: 0,
  showBackground: false,
  bgColor: DEFAULT_BG_COLOR,
  strokeColor: DEFAULT_BG_COLOR,
  strokeWidth: 1,
  innerRadius: 0,
  outerRadius: DEFAULT_OUTER_RADIUS,
  showContainerBackground: false,
  highlightCenterComponent: false,
};

type Action =
  | { type: 'SET'; field: keyof State; value: State[keyof State] }
  | { type: 'TOGGLE_CIRCLE' }
  | { type: 'RESET' };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET':
      return { ...state, [action.field]: action.value };
    case 'TOGGLE_CIRCLE':
      return { ...state, showCircle: !state.showCircle };
    case 'RESET':
      return initialState;
  }
}

const Playground = () => {
  const { showPopUp } = use(AppContext);
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const maxRadius = useMemo(
    () => Number((Math.min(windowWidth, windowHeight) * 0.4).toFixed(0)),
    [windowWidth, windowHeight]
  );

  const [state, dispatch] = useReducer(reducer, initialState);

  const set = useCallback(
    <K extends keyof State>(field: K) =>
      (value: State[K]) =>
        dispatch({ type: 'SET', field, value }),
    []
  );

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
        visible={state.showCircle}
        animationProps={{
          animationCombinationType: state.isParallelAnimation
            ? AnimationCombinationType.PARALLEL
            : AnimationCombinationType.SEQUENCE,
          animationGap: state.animationGap,
          animationConfigs: state.animationTypeList.reduce<
            Partial<Record<AnimationType, AnimationConfig>>
          >(
            (acc, animationType) => ({
              ...acc,
              [animationType]: {
                duration: state.animationDuration,
                delay: state.animationDelay,
              },
            }),
            {}
          ),
        }}
        bgConfig={
          state.showBackground
            ? {
                color: state.bgColor,
                strokeColor: state.strokeColor,
                strokeWidth: state.strokeWidth,
                innerRadius: state.innerRadius,
                outerRadius: state.outerRadius,
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
            disabled={!state.isCenterClickable}
            onPress={() => dispatch({ type: 'TOGGLE_CIRCLE' })}
          ></TouchableOpacity>
        }
        centerComponentContainerStyle={
          state.highlightCenterComponent
            ? {
                borderWidth: 2,
                borderColor: palette.greenPrimary,
                borderRadius: 999,
              }
            : undefined
        }
        components={createComponents(state.numberOfPoints)}
        containerStyle={{
          height: maxRadius * 2.2,
          width: maxRadius * 2.2,
          borderWidth: 1,
          borderColor: 'grey',
          borderRadius: 12,
          backgroundColor: state.showContainerBackground
            ? palette.disabled
            : 'transparent',
        }}
        radius={state.radius}
        startAngle={state.startAngle}
        sweepAngle={state.sweepAngle}
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
            value={state.isCenterClickable}
            onValueChange={set('isCenterClickable')}
          />
          <SliderWithLabel
            label="Radius"
            maximumValue={maxRadius}
            minimumValue={1}
            onValueChange={set('radius')}
            step={1}
            value={state.radius}
          />
          <SliderWithLabel
            label="Sweep Angle"
            maximumValue={360}
            minimumValue={0}
            onValueChange={(value) =>
              dispatch({
                type: 'SET',
                field: 'sweepAngle',
                value: (value * Math.PI) / 180,
              })
            }
            step={5}
            value={(state.sweepAngle * 180) / Math.PI}
            unit="°"
          />
          <SliderWithLabel
            label="Start Angle"
            maximumValue={360}
            minimumValue={0}
            onValueChange={(value) =>
              dispatch({
                type: 'SET',
                field: 'startAngle',
                value: (value * Math.PI) / 180,
              })
            }
            step={5}
            value={(state.startAngle * 180) / Math.PI}
            unit="°"
          />
          <SliderWithLabel
            label="Number of Points"
            maximumValue={20}
            minimumValue={2}
            onValueChange={set('numberOfPoints')}
            step={1}
            value={state.numberOfPoints}
          />
          <Switch
            leftLabel="Container background off"
            rightLabel="Container background on"
            value={state.showContainerBackground}
            onValueChange={set('showContainerBackground')}
          />
          <Switch
            leftLabel="Center component plain"
            rightLabel="Center component highlighted"
            value={state.highlightCenterComponent}
            onValueChange={set('highlightCenterComponent')}
          />
        </View>

        <View gap="s">
          <Text fontWeight="bold">Background</Text>
          <Switch
            leftLabel="Background off"
            rightLabel="Background on"
            value={state.showBackground}
            onValueChange={set('showBackground')}
          />
          <Dropdown
            onValueChange={(value) =>
              dispatch({ type: 'SET', field: 'bgColor', value })
            }
            label="Background Color"
            options={colorOptions}
            placeholder="Select a color"
            value={state.bgColor}
            variant="single"
            isDisabled={!state.showBackground}
            width={'100%'}
          />
          <Dropdown
            onValueChange={(value) =>
              dispatch({ type: 'SET', field: 'strokeColor', value })
            }
            label="Stroke Color"
            options={colorOptions}
            placeholder="Select a color"
            value={state.strokeColor}
            variant="single"
            isDisabled={!state.showBackground}
            width={'100%'}
          />
          <SliderWithLabel
            label="Stroke Width"
            maximumValue={10}
            minimumValue={0}
            onValueChange={set('strokeWidth')}
            step={1}
            value={state.strokeWidth}
            isDisabled={!state.showBackground}
          />
          <SliderWithLabel
            label="Inner Radius"
            maximumValue={maxRadius}
            minimumValue={0}
            onValueChange={set('innerRadius')}
            step={1}
            value={state.innerRadius}
            isDisabled={!state.showBackground}
          />
          <SliderWithLabel
            label="Outer Radius"
            maximumValue={maxRadius}
            minimumValue={0}
            onValueChange={set('outerRadius')}
            step={1}
            value={state.outerRadius}
            isDisabled={!state.showBackground}
          />
        </View>

        <View gap="s">
          <Text fontWeight="bold">Animation</Text>
          <Switch
            leftLabel="Sequential Animation"
            rightLabel="Parallel Animation"
            value={state.isParallelAnimation}
            onValueChange={set('isParallelAnimation')}
          />
          <Dropdown
            onValueChange={(value) =>
              dispatch({
                type: 'SET',
                field: 'animationTypeList',
                value: value as AnimationType[],
              })
            }
            label="Animation Types"
            options={Object.values(AnimationType).map(
              (animationType: AnimationType) => ({
                label: animationType,
                value: animationType,
              })
            )}
            placeholder="Select animation types"
            value={state.animationTypeList}
            variant="multiple"
            maintainSelectionOrder
            width={'100%'}
          />
          <SliderWithLabel
            label="Animation Duration"
            maximumValue={2000}
            minimumValue={0}
            onValueChange={set('animationDuration')}
            step={100}
            value={state.animationDuration}
            unit="ms"
          />
          <SliderWithLabel
            label="Animation Gap"
            maximumValue={300}
            minimumValue={0}
            onValueChange={set('animationGap')}
            step={10}
            value={state.animationGap}
            unit="ms"
          />
          <SliderWithLabel
            label="Animation Delay"
            maximumValue={1000}
            minimumValue={0}
            onValueChange={set('animationDelay')}
            step={50}
            value={state.animationDelay}
            unit="ms"
          />
        </View>

        <View gap="s" width="90%">
          <Button
            onPress={() => {
              if (state.isCenterClickable) {
                showPopUp({
                  message:
                    "Click the center component's circle to toggle the layout!",
                });
              } else {
                dispatch({ type: 'TOGGLE_CIRCLE' });
              }
            }}
            label={
              state.showCircle ? 'Hide circle layout' : 'Show circle layout'
            }
          />
          <Button onPress={() => dispatch({ type: 'RESET' })} label="Reset" />
        </View>
      </View>
    </ScrollView>
  );
};

export default Playground;
