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
    <CircleLayout
      centerComponent={
        <AntDesign.Button
          backgroundColor="white"
          borderRadius={100}
          color="black"
          style={{ justifyContent: 'center', height: 50, width: 50 }}
          iconStyle={{ marginRight: 0 }}
          name={icon}
          onPress={() => setShowCircleComponent((oldValue) => !oldValue)}
        />
      }
      components={subIcons.map((subIcon) => (
        <AntDesign.Button
          key={subIcon}
          backgroundColor="white"
          borderRadius={100}
          color="black"
          style={{ justifyContent: 'center', height: 50, width: 50 }}
          iconStyle={{ marginRight: 0 }}
          name={subIcon}
          onPress={() => {}}
        />
      ))}
      animationProps={{
        animationCombinationType: AnimationCombinationType.PARALLEL,
        animationConfigs: {
          [AnimationType.LINEAR]: { duration: 500 },
          [AnimationType.OPACITY]: { duration: 500 },
        },
      }}
      radius={80}
      ref={circleLayoutRef}
      startAngle={rotation}
      sweepAngle={Math.PI}
    />
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
            backgroundColor="white"
            borderRadius={100}
            color="black"
            style={{ justifyContent: 'center', height: 50, width: 50 }}
            iconStyle={{ marginRight: 0 }}
            name={showCircleComponent ? 'close' : 'appstore'}
            onPress={() => setShowCircleComponent((oldValue) => !oldValue)}
          />
        }
        components={icons.map((icon, index) => {
          const sectionAngle = (2 * Math.PI) / icons.length;
          const rotation = index * sectionAngle - Math.PI / 2;
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
        radius={80}
        ref={circleLayoutRef}
        startAngle={0}
        sweepAngle={Math.PI * 2}
      />
    </View>
  );
};

export default NestedRingMenu;
