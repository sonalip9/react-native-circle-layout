import {
  AntDesign,
  type AntDesignIconName,
} from '@react-native-vector-icons/ant-design';
import * as React from 'react';
import { Pressable, StyleSheet, Text, View as RNView } from 'react-native';
import {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  cancelAnimation,
} from 'react-native-reanimated';

import { CircleLayout, type CircleLayoutRef } from 'react-native-circle-layout';

import { AnimView } from '../AnimatedComponents';

import { View } from '../design_system/atoms';

type OrbitalRing = {
  radius: number;
  speed: number;
  color: string;
  items: { icon: AntDesignIconName; label: string }[];
};

const RINGS: OrbitalRing[] = [
  {
    radius: 60,
    speed: 8000,
    color: '#6366f1',
    items: [
      { icon: 'api', label: 'API' },
      { icon: 'database', label: 'DB' },
    ],
  },
  {
    radius: 110,
    speed: 12000,
    color: '#3b82f6',
    items: [
      { icon: 'mobile', label: 'Mobile' },
      { icon: 'laptop', label: 'Web' },
      { icon: 'tablet', label: 'Tablet' },
    ],
  },
  {
    radius: 160,
    speed: 18000,
    color: '#10b981',
    items: [
      { icon: 'user', label: 'Users' },
      { icon: 'team', label: 'Teams' },
      { icon: 'global', label: 'Global' },
      { icon: 'cloud', label: 'Cloud' },
    ],
  },
];

const OrbitRing = ({
  ring,
  onItemPress,
  isPaused,
}: {
  ring: OrbitalRing;
  onItemPress: (label: string) => void;
  isPaused: boolean;
}) => {
  const rotation = useSharedValue(0);

  React.useEffect(() => {
    if (isPaused) {
      cancelAnimation(rotation);
    } else {
      rotation.value = withRepeat(
        withTiming(rotation.value + 2 * Math.PI, {
          duration: ring.speed,
          easing: Easing.linear,
        }),
        -1,
        false
      );
    }
  }, [isPaused, ring.speed, rotation]);

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}rad` }],
  }));

  const counterRotationStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${-rotation.value}rad` }],
  }));

  const circleLayoutRef = React.useRef<CircleLayoutRef>(null);
  React.useEffect(() => {
    if (circleLayoutRef.current) {
      circleLayoutRef.current.showComponents();
    }
  }, []);

  return (
    <RNView style={styles.ringWrapper}>
      <RNView
        style={[
          styles.orbitPath,
          {
            width: ring.radius * 2,
            height: ring.radius * 2,
            borderRadius: ring.radius,
            borderColor: `${ring.color}30`,
          },
        ]}
      />
      <AnimView style={ringStyle}>
        <CircleLayout
          ref={circleLayoutRef}
          components={ring.items.map((item) => (
            <AnimView key={item.label} style={counterRotationStyle}>
              <Pressable
                onPress={() => onItemPress(item.label)}
                style={[styles.orbitItem, { backgroundColor: ring.color }]}
              >
                <AntDesign name={item.icon} size={16} color="#fff" />
              </Pressable>
            </AnimView>
          ))}
          radius={ring.radius}
          startAngle={-Math.PI / 2}
        />
      </AnimView>
    </RNView>
  );
};

const OrbitalAnimation = () => {
  const [paused, setPaused] = React.useState(false);
  const [detail, setDetail] = React.useState<string | null>(null);

  const handleItemPress = (label: string) => {
    setPaused(true);
    setDetail(label);
  };

  const handleResume = () => {
    setPaused(false);
    setDetail(null);
  };

  return (
    <View flex={1}>
      <RNView style={styles.header}>
        <Text style={styles.title}>Orbital System</Text>
        <Text style={styles.subtitle}>
          CircleLayout per ring · Different speeds · Tap to pause
        </Text>
      </RNView>

      <View flex={1} alignItems="center" justifyContent="center">
        <RNView style={styles.solarSystem}>
          <Pressable style={styles.sun} onPress={handleResume}>
            <AntDesign name="code-sandbox" size={24} color="#fff" />
          </Pressable>

          {RINGS.map((ring, i) => (
            <OrbitRing
              key={i}
              ring={ring}
              onItemPress={handleItemPress}
              isPaused={paused}
            />
          ))}
        </RNView>

        {detail && (
          <RNView style={styles.detailCard}>
            <Text style={styles.detailTitle}>{detail}</Text>
            <Text style={styles.subtitle}>
              Orbits paused. Tap center to resume.
            </Text>
            <Pressable style={styles.resumeBtn} onPress={handleResume}>
              <Text style={styles.resumeText}>Resume</Text>
            </Pressable>
          </RNView>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 16,
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
  solarSystem: {
    width: 360,
    height: 360,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sun: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f59e0b',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    shadowColor: '#f59e0b',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 8,
  },
  ringWrapper: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbitPath: {
    position: 'absolute',
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  orbitItem: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  detailCard: {
    marginTop: 24,
    backgroundColor: '#1e1e2e',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    gap: 8,
  },
  detailTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#F0F2F3',
  },
  resumeBtn: {
    marginTop: 8,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#6366f1',
  },
  resumeText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default OrbitalAnimation;
