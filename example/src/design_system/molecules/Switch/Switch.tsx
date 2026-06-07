import {
  color,
  createRestyleComponent,
  spacing,
  type ColorProps,
  type SpacingProps,
} from '@shopify/restyle';
import { Switch as RNSwitch, type ViewStyle } from 'react-native';

import { palette, type Theme } from '../../style';
import { Text } from '../../atoms/Text';
import { View, type ViewProps } from '../../atoms/View';
import { resolveStyles } from '../../../utils/resolveStyles';

type SwitchOwnProps = {
  leftLabel: string;
  rightLabel?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  isDisabled?: boolean;
};

type SwitchComponentProps = Omit<ViewProps, 'style'> &
  SwitchOwnProps & { style?: (ViewStyle & { color?: string })[] };

const SwitchComponent = ({
  leftLabel,
  rightLabel,
  value,
  onValueChange,
  isDisabled = false,
  style,
}: SwitchComponentProps) => {
  const containerStyle = resolveStyles(style);

  return (
    <View
      style={containerStyle}
      alignItems="center"
      flexDirection="row"
      justifyContent="space-between"
      width="100%"
      gap="s"
    >
      <View flex={1} flexGrow={1} flexDirection="row" justifyContent="flex-end">
        <Text flexWrap={1} textAlign="right">
          {leftLabel}
        </Text>
      </View>
      <RNSwitch
        value={value}
        onValueChange={onValueChange}
        disabled={isDisabled}
        trackColor={{ false: palette.disabled, true: palette.purplePrimary }}
        thumbColor={value ? palette.purpleLight : palette.white}
      />
      {rightLabel && (
        <View flex={1} flexGrow={1} flexDirection="row">
          <Text flexWrap={1}>{rightLabel}</Text>
        </View>
      )}
    </View>
  );
};

export type SwitchProps = SpacingProps<Theme> &
  ColorProps<Theme> &
  SwitchOwnProps;

const Switch = createRestyleComponent<SwitchProps, Theme>(
  [spacing, color],
  SwitchComponent
);

export default Switch;
