import type { ReactNode } from 'react';
import { Pressable } from 'react-native';
import Animated from 'react-native-reanimated';

// Reanimated 4.x + RN 0.85 / React 19 strips `children` from Animated.View.
// These wrappers restore it with permissive style typing for animated styles.

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- animated style handles are untyped
type AnimViewProps = { children?: ReactNode; style?: any; [key: string]: any };

export const AnimView =
  Animated.View as unknown as React.ComponentType<AnimViewProps>;
export const AnimPressable = Animated.createAnimatedComponent(
  Pressable
) as unknown as React.ComponentType<
  Omit<React.ComponentProps<typeof Pressable>, 'style' | 'children'> & {
    children?: ReactNode;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- animated style handles are untyped
    style?: any;
  }
>;
