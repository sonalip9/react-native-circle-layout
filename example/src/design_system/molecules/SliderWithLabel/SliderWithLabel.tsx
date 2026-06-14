import Slider from '@react-native-community/slider';
import {
  color,
  createRestyleComponent,
  spacing,
  type ColorProps,
  type SpacingProps,
} from '@shopify/restyle';
import { Platform, type ViewStyle } from 'react-native';

import { palette, type Theme } from '../../style';
import { Text } from '../../atoms/Text';
import { View, type ViewProps } from '../../atoms/View';
import { resolveStyles } from '../../../utils/resolveStyles';

type SliderWithLabelOwnProps = {
  label: string;
  value: number;
  onValueChange: (value: number) => void;
  unit?: string;
  maximumValue: number;
  minimumValue: number;
  step: number;
  isDisabled?: boolean;
  tapToSeek?: boolean;
};

type SliderWithLabelComponentProps = Omit<ViewProps, 'style'> &
  SliderWithLabelOwnProps & { style?: (ViewStyle & { color?: string })[] };

const SliderWithLabelComponent = ({
  label,
  value,
  onValueChange,
  unit,
  maximumValue,
  minimumValue,
  step,
  isDisabled = false,
  tapToSeek = true,
  style,
}: SliderWithLabelComponentProps) => {
  const containerStyle = resolveStyles(style);

  return (
    <View
      style={containerStyle}
      alignItems="center"
      justifyContent="space-evenly"
      flexDirection="row"
      width="100%"
      gap="s"
    >
      <View flex={1} flexGrow={1} flexDirection="row" justifyContent="flex-end">
        <Text textAlign="right" flexWrap={'wrap'}>
          {label}
        </Text>
      </View>
      <Slider
        maximumValue={maximumValue}
        minimumValue={minimumValue}
        onValueChange={onValueChange}
        step={step}
        value={value}
        style={{ width: '50%', height: 40 }}
        disabled={isDisabled}
        minimumTrackTintColor={containerStyle.color ?? palette.purpleLight}
        thumbTintColor={Platform.select({
          web: containerStyle.color ?? palette.purpleLight,
          android: containerStyle.color ?? palette.purpleLight,
          default: undefined,
        })}
        tapToSeek={tapToSeek}
      />
      <Text flex={1}>{`${value.toFixed(2)}${unit ?? ''}`}</Text>
    </View>
  );
};

export type SliderWithLabelProps = SpacingProps<Theme> &
  ColorProps<Theme> &
  SliderWithLabelOwnProps;

const SliderWithLabel = createRestyleComponent<SliderWithLabelProps, Theme>(
  [spacing, color],
  SliderWithLabelComponent
);

export default SliderWithLabel;
