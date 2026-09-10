import { AntDesign } from '@react-native-vector-icons/ant-design';
import { use } from 'react';

import {
  AnimationCombinationType,
  AnimationType,
  CircleLayout,
} from 'react-native-circle-layout';

import { AppContext } from '../AppContext';

import { Pressable, TouchableOpacity } from 'react-native';
import { CircleBadge, View } from '../design_system/atoms';
import { useToggle } from '../hooks/useToggle';

type Icon = 'delete' | 'edit' | 'home' | 'star';

const RadialMenu = () => {
  const icons: Icon[] = ['edit', 'home', 'star', 'delete'];
  const [showCircleComponent, toggleShowCircleComponent] = useToggle();
  const { showPopUp } = use(AppContext);

  return (
    <View flex={1}>
      <CircleLayout
        visible={showCircleComponent}
        centerComponent={
          <TouchableOpacity onPress={toggleShowCircleComponent}>
            <CircleBadge size={56} color="black">
              <AntDesign
                color="white"
                name={showCircleComponent ? 'close' : 'appstore'}
                size={32}
              />
            </CircleBadge>
          </TouchableOpacity>
        }
        components={icons.map((icon) => (
          <Pressable
            key={icon}
            onPress={() =>
              showPopUp({ message: `The ${icon} button was clicked.` })
            }
          >
            <CircleBadge size={48} color="white">
              <AntDesign color="black" name={icon} size={24} />
            </CircleBadge>
          </Pressable>
        ))}
        containerStyle={{
          bottom: 0,
          left: 0,
          right: 0,
          elevation: 3,
          position: 'absolute',
        }}
        animationProps={{
          animationCombinationType: AnimationCombinationType.PARALLEL,
          animationConfigs: {
            [AnimationType.LINEAR]: { duration: 500 },
            [AnimationType.OPACITY]: { duration: 500 },
          },
        }}
        radius={100}
        startAngle={0}
        sweepAngle={Math.PI}
      />
    </View>
  );
};

export default RadialMenu;
