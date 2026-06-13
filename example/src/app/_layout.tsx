import { Drawer } from 'expo-router/drawer';

import { ThemeProvider } from '@shopify/restyle';
import * as React from 'react';
import { StatusBar } from 'react-native';

import { AppContext, type AppContextValue } from '../AppContext';
import type { PopUpProps } from '../design_system/molecules/PopUp/PopUp';
import PopUp from '../design_system/molecules/PopUp/PopUp';
import theme from '../design_system/style';

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
        <StatusBar />
        <Drawer>
          <Drawer.Screen name="index" options={{ title: 'Playground' }} />
        </Drawer>
        {popUp ? <PopUp {...popUp} /> : null}
      </ThemeProvider>
    </AppContext>
  );
};

export default App;
