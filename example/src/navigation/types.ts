import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { RootScreens } from './constants';

export type RootStackParamList = {
  [RootScreens.PLAYGROUND]: undefined;
  [RootScreens.HOME]: undefined;
  [RootScreens.RADIAL_MENU]: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;
