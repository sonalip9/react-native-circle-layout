import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';

import { AppContext, type AppContextValue } from './AppContext';
import type { PopUpProps } from './design_system/molecules/PopUp/PopUp';
import PopUp from './design_system/molecules/PopUp/PopUp';
import { RootScreens, type RootStackParamList } from './navigation';
import { Home, Playground, RadialMenu } from './screens';

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  const [popUp, setPopUp] = React.useState<PopUpProps | undefined>();
  const contextValue: AppContextValue = React.useMemo(
    () => ({
      closePopUp: () => setPopUp(undefined),
      showPopUp: (popUpProps: PopUpProps) => setPopUp(popUpProps),
    }),
    []
  );

  return (
    <AppContext value={contextValue}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen component={Home} name={RootScreens.HOME} />
          <Stack.Screen component={Playground} name={RootScreens.PLAYGROUND} />
          <Stack.Screen component={RadialMenu} name={RootScreens.RADIAL_MENU} />
        </Stack.Navigator>
      </NavigationContainer>
      {popUp ? <PopUp {...popUp} /> : null}
    </AppContext>
  );
};

export default App;
