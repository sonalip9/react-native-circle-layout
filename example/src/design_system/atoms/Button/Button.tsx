import {
  backgroundColor,
  type BackgroundColorProps,
  border,
  type BorderProps,
  createRestyleComponent,
  createVariant,
  spacing,
  type SpacingProps,
  type VariantProps,
} from '@shopify/restyle';
import { TouchableOpacity, type ViewStyle } from 'react-native';

import type { Theme } from '../../style';
import { Text } from '../Text';
import { View, type ViewProps } from '../View';

type RestyleProps = SpacingProps<Theme> &
  BorderProps<Theme> &
  BackgroundColorProps<Theme>;
type ResolvedStyle = ViewStyle & { color?: string };

type Props = {
  onPress: () => void;
  label: string;
};

type ButtonComponentProps = Omit<ViewProps, 'style'> &
  Props & { style?: [ResolvedStyle] };

const ButtonComponent = ({
  onPress,
  label,
  style,
  ...props
}: ButtonComponentProps) => {
  const [{ color: labelColor, ...viewStyle }] = style ?? [{}];

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={viewStyle as ViewStyle} {...props}>
        <Text style={labelColor ? { color: labelColor } : undefined}>
          {label}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export type ButtonProps = VariantProps<Theme, 'buttonVariants'> &
  RestyleProps &
  Props;

const Button = createRestyleComponent<ButtonProps, Theme>(
  [
    spacing,
    border,
    backgroundColor,
    createVariant({ themeKey: 'buttonVariants' }),
  ],
  ButtonComponent
);

export default Button;
