import { createContext } from 'react';

import type { PopUpProps } from './design_system/molecules/PopUp/PopUp';

export type AppContextValue = {
  closePopUp: () => void;
  showPopUp: (popUpProps: PopUpProps) => void;
};

export const AppContext = createContext<AppContextValue>({
  closePopUp() {},
  showPopUp() {},
});
