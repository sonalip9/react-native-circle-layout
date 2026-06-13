import { Drawer } from 'expo-router/drawer';

import { ThemeProvider } from '@shopify/restyle';
import { StatusBar } from 'expo-status-bar';
import * as React from 'react';

import { AppContext, type AppContextValue } from '../AppContext';
import { PopUp } from '../design_system/molecules';
import type { PopUpProps } from '../design_system/molecules/';
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
