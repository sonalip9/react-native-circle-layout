import * as React from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';

export type CircleBadgeShadow = 'none' | 'item' | 'fab';

export type CircleBadgeProps = {
  /** Diameter in pixels. */
  size: number;
  /** Fill color. */
  color: string;
  /** 'item' = small tap-target shadow, 'fab' = larger prominent shadow. */
  shadow?: CircleBadgeShadow;
  /** Overrides the shadow variant's default color ('#000' for 'item', `color` for 'fab'). */
  shadowColor?: string;
  style?: ViewStyle;
  children?: React.ReactNode;
};

const SHADOW_PRESETS: Record<Exclude<CircleBadgeShadow, 'none'>, ViewStyle> = {
  item: {
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  fab: {
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 9,
    elevation: 7,
  },
};

const CircleBadge = ({
  size,
  color,
  shadow = 'none',
  shadowColor,
  style,
  children,
}: CircleBadgeProps) => {
  const shadowStyle =
    shadow === 'none'
      ? null
      : {
          ...SHADOW_PRESETS[shadow],
          shadowColor: shadowColor ?? (shadow === 'fab' ? color : '#000'),
        };

  return (
    <View
      style={[
        styles.badge,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
        },
        shadowStyle,
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default CircleBadge;
