import {
  AntDesign,
  type AntDesignIconName,
} from '@react-native-vector-icons/ant-design';
import { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import {
  AnimationCombinationType,
  AnimationType,
  CircleLayout,
} from 'react-native-circle-layout';

import { View } from '../design_system/atoms';

type Icon = AntDesignIconName;

const icons: Icon[] = ['edit', 'home', 'star', 'delete', 'search', 'setting'];
const SECTION_ANGLE = (2 * Math.PI) / icons.length;
const subIcons: Icon[] = ['group', 'idcard', 'phone', 'camera'];

const Component = ({ icon, rotation }: { icon: Icon; rotation: number }) => {
  const [showCircleComponent, setShowCircleComponent] = useState(false);

  return (
    <View style={{ transform: [{ rotate: `${rotation}rad` }] }}>
      <CircleLayout
        visible={showCircleComponent}
        centerComponent={
          <TouchableOpacity>
            <AntDesign
              style={{
                borderRadius: 100,
                transform: [{ rotate: `${-rotation}rad` }],
                padding: 12,
                backgroundColor: 'white',
              }}
              color="black"
              name={icon}
              size={24}
              onPress={() => setShowCircleComponent((oldValue) => !oldValue)}
            />
          </TouchableOpacity>
        }
        components={subIcons.map((subIcon) => (
          <AntDesign
            key={subIcon}
            color="black"
            style={{ transform: [{ rotate: `${-rotation}rad` }], padding: 8 }}
            name={subIcon}
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
        startAngle={SECTION_ANGLE / 2}
        sweepAngle={SECTION_ANGLE * 2}
        bgConfig={{ color: '#e8327b', outerRadius: 80, innerRadius: 40 }}
      />
    </View>
  );
};

const NestedRingMenu = () => {
  const [showCircleComponent, setShowCircleComponent] = useState(false);

  return (
    <View style={{ flex: 1 }}>
      <CircleLayout
        visible={showCircleComponent}
        centerComponent={
          <AntDesign
            color="white"
            style={{
              justifyContent: 'center',
              backgroundColor: 'black',
              borderRadius: 100,
              padding: 12,
            }}
            size={24}
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
        startAngle={0}
        sweepAngle={Math.PI * 2}
        bgConfig={{ color: '#e8327bc0', innerRadius: 40, outerRadius: 120 }}
      />
    </View>
  );
};

export default NestedRingMenu;
