import { useEffect, useRef } from 'react';
import type { CircleLayoutRef } from 'react-native-circle-layout';

export function useShowOnMount() {
  const ref = useRef<CircleLayoutRef>(null);

  useEffect(() => {
    ref.current?.showComponents();
  }, []);

  return ref;
}
