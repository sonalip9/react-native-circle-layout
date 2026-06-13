import { AntDesign } from '@expo/vector-icons';
import * as React from 'react';

import {
  AnimationCombinationType,
  AnimationType,
  CircleLayout,
  type CircleLayoutRef,
} from 'react-native-circle-layout';

import { AppContext } from '../AppContext';

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
          <AntDesign.Button
            backgroundColor="white"
            borderRadius={100}
            color="black"
            iconStyle={{ marginRight: 0 }}
            name={showCircleComponent ? 'close' : 'appstore'}
            onPress={() => setShowCircleComponent((oldValue) => !oldValue)}
          />
        }
        components={icons.map((icon) => (
          <AntDesign.Button
            key={icon}
            backgroundColor="white"
            borderRadius={100}
            color="black"
            iconStyle={{ marginRight: 0 }}
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
