import type { TextProps as ShopifyTextProps } from '@shopify/restyle';

import type { Theme } from '../../style';

export { default as Text } from './Text';
export type TextProps = ShopifyTextProps<Theme>;
