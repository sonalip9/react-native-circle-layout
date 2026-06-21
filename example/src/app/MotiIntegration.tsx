import {
  AntDesign,
  type AntDesignIconName,
} from '@react-native-vector-icons/ant-design';
import { MotiPressable } from 'moti/interactions';
import * as React from 'react';
import { Pressable, StyleSheet, Text, View as RNView } from 'react-native';
import {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  FadeIn,
} from 'react-native-reanimated';

import {
  CircleLayout,
  type CircleLayoutRef,
  AnimationCombinationType,
  AnimationType,
} from 'react-native-circle-layout';

import { AnimView } from '../AnimatedComponents';
import { View } from '../design_system/atoms';

const ICONS: { name: AntDesignIconName; color: string; label: string }[] = [
  { name: 'edit', color: '#f43f5e', label: 'Edit' },
  { name: 'camera', color: '#8b5cf6', label: 'Camera' },
  { name: 'heart', color: '#ec4899', label: 'Like' },
  { name: 'sharealt', color: '#3b82f6', label: 'Share' },
  { name: 'star', color: '#f59e0b', label: 'Favorite' },
  { name: 'setting', color: '#10b981', label: 'Settings' },
];

const RADIUS = 120;

const MotiItem = ({
  icon,
  onPress,
}: {
  icon: (typeof ICONS)[number];
  onPress: (label: string) => void;
}) => {
  return (
    <MotiPressable
      animate={({ pressed }) => {
        'worklet';
        return { scale: pressed ? 0.85 : 1 };
      }}
      transition={{ type: 'spring', damping: 15, stiffness: 200 }}
      onPress={() => onPress(icon.label)}
      style={[styles.item, { backgroundColor: icon.color }]}
    >
      <AntDesign name={icon.name} size={22} color="#fff" />
    </MotiPressable>
  );
};

const MotiIntegration = () => {
  const [visible, setVisible] = React.useState(false);
  const [selectedLabel, setSelectedLabel] = React.useState<string | null>(null);
  const circleLayoutRef = React.useRef<CircleLayoutRef>(null);
  const fabRotation = useSharedValue(0);

  const toggleMenu = () => {
    const next = !visible;
    setVisible(next);
    fabRotation.value = withSpring(next ? 1 : 0, {
      damping: 12,
      stiffness: 100,
    });
    if (next) {
      circleLayoutRef.current?.showComponents();
    } else {
      circleLayoutRef.current?.hideComponents();
    }
  };

  const fabStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${fabRotation.value * 45}deg` }],
  }));

  const handleItemPress = (label: string) => {
    setSelectedLabel(label);
    setTimeout(() => setSelectedLabel(null), 1500);
  };

  return (
    <View flex={1}>
      <RNView style={styles.header}>
        <Text style={styles.title}>Moti Integration</Text>
        <Text style={styles.subtitle}>
          CircleLayout + MotiPressable spring press interactions
        </Text>
      </RNView>

      <View flex={1} alignItems="center" justifyContent="center">
        {selectedLabel && (
          <AnimView entering={FadeIn.duration(200)} style={styles.toast}>
            <Text style={styles.toastText}>{selectedLabel} tapped</Text>
          </AnimView>
        )}

        <CircleLayout
          components={ICONS.map((icon) => (
            <MotiItem key={icon.name} icon={icon} onPress={handleItemPress} />
          ))}
          centerComponent={
            <AnimView style={fabStyle}>
              <Pressable style={styles.fab} onPress={toggleMenu}>
                <AntDesign
                  name={visible ? 'close' : 'plus'}
                  size={28}
                  color="#fff"
                />
              </Pressable>
            </AnimView>
          }
          radius={RADIUS}
          ref={circleLayoutRef}
          animationProps={{
            animationCombinationType: AnimationCombinationType.SEQUENCE,
            animationGap: 80,
            animationConfigs: {
              [AnimationType.LINEAR]: { duration: 300 },
              [AnimationType.OPACITY]: { duration: 200 },
            },
          }}
        />
      </View>

      <RNView style={styles.footer}>
        <Text style={styles.subtitle}>CircleLayout SEQUENCE · Gap: 80ms</Text>
        <Text style={styles.subtitle}>
          MotiPressable: worklet spring scale 0.85 on press
        </Text>
      </RNView>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 16,
  },
  item: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#6366f1',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  toast: {
    position: 'absolute',
    top: 20,
    backgroundColor: '#1e1e2e',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    zIndex: 10,
  },
  toastText: {
    color: '#fff',
    fontWeight: '600',
  },
  footer: {
    padding: 16,
    alignItems: 'center',
    gap: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0B0B0B',
  },
  subtitle: {
    fontSize: 14,
    color: '#9E9E9E',
  },
});

export default MotiIntegration;
