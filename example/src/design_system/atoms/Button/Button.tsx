import type { BoxProps } from '@shopify/restyle';
import {
  Button as ReactNativeButton,
  type ButtonProps as ReactNativeButtonProps,
} from 'react-native';

import { View } from '../View';
import type { Theme } from '../../style';

export type ButtonProps = {
  containerStyle: BoxProps<Theme>;
} & ReactNativeButtonProps;

const Button = ({ containerStyle, ...buttonProps }: ButtonProps) => (
  <View {...containerStyle}>
    <ReactNativeButton {...buttonProps} />
  </View>
);

export default Button;
