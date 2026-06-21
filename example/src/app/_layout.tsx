import { Drawer } from 'expo-router/drawer';

import { ThemeProvider } from '@shopify/restyle';
import { StatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';

import { AppContext, type AppContextValue } from '../AppContext';
import { PopUp } from '../design_system/molecules';
import type { PopUpProps } from '../design_system/molecules';
import theme from '../design_system/style';

const App = () => {
  const [popUp, setPopUp] = useState<PopUpProps | undefined>();
  const contextValue: AppContextValue = useMemo(
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
          <Drawer.Screen name="RadialMenu" options={{ title: 'Radial Menu' }} />
          <Drawer.Screen
            name="NestedRingMenu"
            options={{ title: 'Nested Ring Menu' }}
          />
          <Drawer.Screen
            name="ReanimatedDriver"
            options={{ title: 'Reanimated Driver' }}
          />
          <Drawer.Screen
            name="MotiIntegration"
            options={{ title: 'Moti Integration' }}
          />
          <Drawer.Screen
            name="GestureSelector"
            options={{ title: 'Gesture Selector' }}
          />
          <Drawer.Screen name="DonutChart" options={{ title: 'Donut Chart' }} />
          <Drawer.Screen
            name="OrbitalAnimation"
            options={{ title: 'Orbital Animation' }}
          />
          <Drawer.Screen
            name="CircularNavMenu"
            options={{ title: 'Circular Nav Menu' }}
          />
          <Drawer.Screen
            name="GridToCircleMorph"
            options={{ title: 'Grid to Circle Morph' }}
          />
        </Drawer>
        {popUp ? <PopUp {...popUp} /> : null}
      </ThemeProvider>
    </AppContext>
  );
};

export default App;
