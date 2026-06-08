import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ThemeProvider } from '@shopify/restyle';
import * as React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppContext, type AppContextValue } from './AppContext';
import type { PopUpProps } from './design_system/molecules/PopUp/PopUp';
import PopUp from './design_system/molecules/PopUp/PopUp';
import theme from './design_system/style';
import { RootScreens, type RootStackParamList } from './navigation';
import { Home, NestedRingMenu, Playground, RadialMenu } from './screens';

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
      <ThemeProvider theme={theme}>
        <SafeAreaView style={{ flex: 1 }}>
          <StatusBar />
          <NavigationContainer>
            <Stack.Navigator>
              <Stack.Screen component={Home} name={RootScreens.HOME} />
              <Stack.Screen
                component={Playground}
                name={RootScreens.PLAYGROUND}
              />
              <Stack.Screen
                component={RadialMenu}
                name={RootScreens.RADIAL_MENU}
              />
              <Stack.Screen
                component={NestedRingMenu}
                name={RootScreens.NESTED_RING_MENU}
              />
            </Stack.Navigator>
          </NavigationContainer>
          {popUp ? <PopUp {...popUp} /> : null}
        </SafeAreaView>
      </ThemeProvider>
    </AppContext>
  );
};

export default App;
