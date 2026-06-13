import { AntDesign } from '@react-native-vector-icons/ant-design';
import * as React from 'react';

import {
  AnimationCombinationType,
  AnimationType,
  CircleLayout,
  type CircleLayoutRef,
} from 'react-native-circle-layout';

import { AppContext } from '../AppContext';

import { TouchableOpacity } from 'react-native';
import { View } from '../design_system/atoms';

type Icon = 'delete' | 'edit' | 'home' | 'star';

const RadialMenu = () => {
  const icons: Icon[] = ['edit', 'home', 'star', 'delete'];
  const [showCircleComponent, setShowCircleComponent] = React.useState(false);
  const circleLayoutRef = React.useRef<CircleLayoutRef>(null);
  const { showPopUp } = React.use(AppContext);

  React.useEffect(() => {
    if (showCircleComponent) {
      circleLayoutRef.current?.showComponents();
    } else {
      circleLayoutRef.current?.hideComponents();
    }
  }, [showCircleComponent]);

  return (
    <View flex={1}>
      <CircleLayout
        centerComponent={
          <TouchableOpacity
            style={{
              backgroundColor: 'black',
              borderRadius: 100,
              padding: 12,
            }}
            onPress={() => setShowCircleComponent((oldValue) => !oldValue)}
          >
            <AntDesign
              color="white"
              name={showCircleComponent ? 'close' : 'appstore'}
              size={32}
            />
          </TouchableOpacity>
        }
        components={icons.map((icon) => (
          <AntDesign
            key={icon}
            color="black"
            style={{ backgroundColor: 'white', borderRadius: 100, padding: 12 }}
            name={icon}
            onPress={() =>
              showPopUp({ message: `The ${icon} button was clicked.` })
            }
            size={24}
          />
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
        ref={circleLayoutRef}
        startAngle={0}
        sweepAngle={Math.PI}
      />
    </View>
  );
};

export default RadialMenu;
