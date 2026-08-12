import { useRef } from 'react';
import type { CircleLayoutRef } from 'react-native-circle-layout';

export function useCircleVisibilityRef() {
  const ref = useRef<CircleLayoutRef>(null);

  return {
    ref,
    show: () => ref.current?.showComponents(),
    hide: () => ref.current?.hideComponents(),
  };
}
