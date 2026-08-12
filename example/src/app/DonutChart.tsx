import * as React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View as RNView,
} from 'react-native';

import {
  AnimationCombinationType,
  AnimationType,
  CircleLayout,
} from 'react-native-circle-layout';

import { View } from '../design_system/atoms';
import { ScreenHeader } from '../design_system/molecules';

const DATA = [
  { label: 'React Native', value: 35, color: '#6366f1' },
  { label: 'Flutter', value: 25, color: '#3b82f6' },
  { label: 'SwiftUI', value: 20, color: '#10b981' },
  { label: 'Kotlin', value: 12, color: '#f59e0b' },
  { label: 'Other', value: 8, color: '#ef4444' },
];

const SIZE = 300;
const OUTER_RADIUS = 120;
const EXPANDED_OUTER = 130;
const INNER_RADIUS = 50;
const START_ANGLE = 0;
const TOTAL = DATA.reduce((sum, d) => sum + d.value, 0);

const DonutChart = () => {
  const [selectedIndex, setSelectedIndex] = React.useState<number | null>(null);

  const selected = selectedIndex !== null ? DATA[selectedIndex] : null;

  const sectors = DATA.reduce<
    {
      label: string;
      value: number;
      color: string;
      startAngle: number;
      endAngle: number;
      index: number;
    }[]
  >((acc, item, i) => {
    const prevEnd =
      acc.length > 0 ? acc[acc.length - 1]!.endAngle : -Math.PI / 2;
    const sweepAngle = (item.value / TOTAL) * 2 * Math.PI;
    acc.push({
      ...item,
      startAngle: prevEnd,
      endAngle: prevEnd + sweepAngle,
      index: i,
    });
    return acc;
  }, []);

  return (
    <ScrollView style={{ flex: 1 }}>
      <ScreenHeader
        title="Animated Donut Chart"
        subtitle="Weighted sectors · Per-sector bgConfig · pointOnCircle labels"
      />

      <View flex={1} alignItems="center" justifyContent="center">
        <RNView style={styles.chartContainer}>
          <CircleLayout
            components={sectors.map((sector) => (
              <View key={sector.label} style={{ height: 50, width: 50 }} />
            ))}
            radius={OUTER_RADIUS}
            startAngle={START_ANGLE}
            bgConfig={{
              color: (i) => DATA[i]!.color,
              strokeWidth: 2,
              strokeColor: '#1e1e2e',
              selectedIndex: selectedIndex ?? undefined,
              expandedOuterRadius: EXPANDED_OUTER,
              onSectorPress: (index: number) =>
                setSelectedIndex((prev) => (prev === index ? null : index)),
            }}
            centerComponent={
              <View
                flexDirection="column"
                bg="black"
                alignItems="center"
                justifyContent="center"
                width={INNER_RADIUS * 2}
                height={INNER_RADIUS * 2}
                borderRadius="full"
                borderWidth={1}
                borderColor="white"
              >
                {selected ? (
                  <>
                    <Text style={styles.centerValue}>{selected.value}%</Text>
                    <Text style={styles.centerName}>{selected.label}</Text>
                  </>
                ) : (
                  <>
                    <Text style={styles.centerValue}>Mobile</Text>
                    <Text style={styles.centerName}>Frameworks</Text>
                  </>
                )}
              </View>
            }
            containerStyle={styles.circleLayout}
            weights={sectors.map((sector) => sector.value / 100)}
            animationProps={{
              animationCombinationType: AnimationCombinationType.SEQUENCE,
              animationGap: 60,
              animationConfigs: {
                [AnimationType.OPACITY]: { duration: 400 },
              },
            }}
            visible={true}
          />
        </RNView>

        <RNView style={styles.legend}>
          {DATA.map((item, i) => (
            <Pressable
              key={item.label}
              style={[
                styles.legendItem,
                selectedIndex === i && styles.legendItemActive,
              ]}
              onPress={() =>
                setSelectedIndex((prev) => (prev === i ? null : i))
              }
            >
              <RNView
                style={[styles.legendDot, { backgroundColor: item.color }]}
              />
              <Text style={styles.legendText}>{item.label}</Text>
              <Text style={styles.legendValue}>{item.value}%</Text>
            </Pressable>
          ))}
        </RNView>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  chartContainer: {
    width: SIZE,
    height: SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#F0F2F3',
  },
  centerName: {
    fontSize: 12,
    color: '#9E9E9E',
  },
  legend: {
    marginTop: 24,
    gap: 8,
    width: 240,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 8,
  },
  legendItemActive: {
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    flex: 1,
    fontSize: 14,
    color: '#0B0B0B',
  },
  legendValue: {
    fontSize: 14,
    fontFamily: 'monospace',
    color: '#0B0B0B',
  },
  circleLayout: {
    ...StyleSheet.absoluteFill,
  },
});

export default DonutChart;
