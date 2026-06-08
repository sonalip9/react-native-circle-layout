import { AntDesign } from '@expo/vector-icons';
import * as React from 'react';
import { View } from 'react-native';
import {
  AnimationCombinationType,
  AnimationType,
  CircleLayout,
  type CircleLayoutRef,
} from 'react-native-circle-layout';

type Icon = keyof typeof AntDesign.glyphMap;

const icons: Icon[] = ['edit', 'home', 'star', 'delete', 'search', 'setting'];
const SECTION_ANGLE = (2 * Math.PI) / icons.length;
const subIcons: Icon[] = ['group', 'idcard', 'phone', 'camera'];

const Component = ({ icon, rotation }: { icon: Icon; rotation: number }) => {
  const circleLayoutRef = React.useRef<CircleLayoutRef>(null);
  const [showCircleComponent, setShowCircleComponent] = React.useState(false);

  React.useEffect(() => {
    if (showCircleComponent) {
      circleLayoutRef.current?.showComponents();
    } else {
      circleLayoutRef.current?.hideComponents();
    }
  }, [showCircleComponent]);

  return (
    <View style={{ transform: [{ rotate: `${rotation}rad` }] }}>
      <CircleLayout
        centerComponent={
          <AntDesign.Button
            backgroundColor="transparent"
            borderRadius={100}
            color="black"
            style={{
              justifyContent: 'center',
              height: 50,
              width: 50,
              transform: [{ rotate: `${-rotation}rad` }],
            }}
            iconStyle={{ marginRight: 0 }}
            name={icon}
            onPress={() => setShowCircleComponent((oldValue) => !oldValue)}
          />
        }
        components={subIcons.map((subIcon) => (
          <AntDesign.Button
            key={subIcon}
            backgroundColor="transparent"
            borderRadius={100}
            color="black"
            style={{
              justifyContent: 'center',
              height: 30,
              width: 30,
              transform: [{ rotate: `${-rotation}rad` }],
            }}
            iconStyle={{ marginRight: 0 }}
            name={subIcon}
            onPress={() => {}}
            size={12}
          />
        ))}
        animationProps={{
          animationCombinationType: AnimationCombinationType.PARALLEL,
          animationConfigs: {
            [AnimationType.LINEAR]: { duration: 500 },
            [AnimationType.OPACITY]: { duration: 500 },
          },
        }}
        radius={60}
        ref={circleLayoutRef}
        startAngle={SECTION_ANGLE / 2}
        sweepAngle={SECTION_ANGLE * 2}
        bgConfig={{ color: '#e8327b', outerRadius: 80, innerRadius: 40 }}
      />
    </View>
  );
};

const NestedRingMenu = () => {
  const [showCircleComponent, setShowCircleComponent] = React.useState(false);
  const circleLayoutRef = React.useRef<CircleLayoutRef>(null);

  React.useEffect(() => {
    if (showCircleComponent) {
      circleLayoutRef.current?.showComponents();
    } else {
      circleLayoutRef.current?.hideComponents();
    }
  }, [showCircleComponent]);

  return (
    <View style={{ flex: 1 }}>
      <CircleLayout
        centerComponent={
          <AntDesign.Button
            backgroundColor="black"
            borderRadius={100}
            color="white"
            style={{ justifyContent: 'center', height: 50, width: 50 }}
            iconStyle={{ marginRight: 0 }}
            name={showCircleComponent ? 'close' : 'appstore'}
            onPress={() => setShowCircleComponent((oldValue) => !oldValue)}
          />
        }
        components={icons.map((icon, index) => {
          const rotation = index * SECTION_ANGLE - Math.PI / 2;
          return <Component key={icon} icon={icon} rotation={rotation} />;
        })}
        containerStyle={{ bottom: 10, left: 0, position: 'absolute', right: 0 }}
        animationProps={{
          animationCombinationType: AnimationCombinationType.PARALLEL,
          animationConfigs: {
            [AnimationType.LINEAR]: { duration: 500 },
            [AnimationType.OPACITY]: { duration: 500 },
          },
        }}
        radius={120}
        ref={circleLayoutRef}
        startAngle={0}
        sweepAngle={Math.PI * 2}
        bgConfig={{ color: '#e8327bc0', innerRadius: 40, outerRadius: 120 }}
      />
    </View>
  );
};

export default NestedRingMenu;
