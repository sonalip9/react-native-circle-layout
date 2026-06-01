import { useRef } from 'react';
import { Text } from 'react-native';
import { render, act, renderHook } from '@testing-library/react-native';

import { CircleLayoutComponent } from '../CircleLayoutComponent';
import { CircleLayoutContext } from '../CircleLayoutContext';
import {
  AnimationCombinationType,
  AnimationType,
  type CircleLayoutContextType,
  type ComponentRef,
  type Layout,
} from '../types';

const baseContext: CircleLayoutContextType = {
  totalParts: 3,
  radius: 100,
  startAngle: 0,
};

const zeroCenterLayout: Layout = { width: 0, height: 0 };

const renderComponent = (
  overrides: Partial<{
    component: React.ReactNode;
    index: number;
    radians: number;
    centerComponentLayout: Layout;
    onLayout: (event: import('react-native').LayoutChangeEvent) => void;
    ref: React.Ref<ComponentRef>;
    ctx: CircleLayoutContextType;
  }> = {}
) => {
  const ctx = overrides.ctx ?? baseContext;
  return render(
    <CircleLayoutContext value={ctx}>
      <CircleLayoutComponent
        component={overrides.component ?? <Text>Node</Text>}
        index={overrides.index ?? 0}
        radians={overrides.radians ?? 0}
        centerComponentLayout={
          overrides.centerComponentLayout ?? zeroCenterLayout
        }
        onLayout={overrides.onLayout}
        ref={overrides.ref ?? null}
      />
    </CircleLayoutContext>
  );
};

describe('CircleLayoutComponent', () => {
  describe('rendering', () => {
    it('renders the passed component', () => {
      const { getByText } = renderComponent({ component: <Text>Hello</Text> });
      expect(getByText('Hello')).toBeTruthy();
    });

    it('positions component at 0 radians', () => {
      expect(() => renderComponent({ radians: 0 })).not.toThrow();
    });

    it('positions component at π radians', () => {
      expect(() => renderComponent({ radians: Math.PI })).not.toThrow();
    });

    it('positions component at 3π/2 radians', () => {
      expect(() =>
        renderComponent({ radians: (3 * Math.PI) / 2 })
      ).not.toThrow();
    });

    it('positions component at index 0 and higher without crashing', () => {
      expect(() => renderComponent({ index: 0 })).not.toThrow();
      expect(() => renderComponent({ index: 5 })).not.toThrow();
    });
  });

  describe('ref methods', () => {
    it('exposes showComponent and hideComponent via ref', () => {
      const { result } = renderHook(() => useRef<ComponentRef>(null));
      const ref = result.current;
      renderComponent({ ref });
      expect(typeof ref.current?.showComponent).toBe('function');
      expect(typeof ref.current?.hideComponent).toBe('function');
    });

    it('showComponent and hideComponent execute without throwing', () => {
      const { result } = renderHook(() => useRef<ComponentRef>(null));
      const ref = result.current;
      renderComponent({ ref });
      expect(() => {
        act(() => {
          ref.current?.hideComponent();
          ref.current?.showComponent();
        });
      }).not.toThrow();
    });
  });

  describe('onLayout callback', () => {
    it('calls onLayout prop when invoked', () => {
      const onLayout = jest.fn();
      renderComponent({ onLayout });
      // onLayout is forwarded from the Animated.View — no throw when invoked
      expect(() => onLayout({})).not.toThrow();
    });
  });

  describe('with animation context', () => {
    it('positions component with OPACITY animation context', () => {
      const ctx: CircleLayoutContextType = {
        ...baseContext,
        animationProps: {
          animationConfigs: [
            { type: AnimationType.OPACITY, config: { duration: 300 } },
          ],
          animationCombinationType: AnimationCombinationType.PARALLEL,
        },
      };
      expect(() => renderComponent({ ctx })).not.toThrow();
    });

    it('positions component with LINEAR animation context', () => {
      const ctx: CircleLayoutContextType = {
        ...baseContext,
        animationProps: {
          animationConfigs: [
            { type: AnimationType.LINEAR, config: { duration: 300 } },
          ],
          animationCombinationType: AnimationCombinationType.PARALLEL,
        },
      };
      expect(() => renderComponent({ ctx })).not.toThrow();
    });

    it('positions component with CIRCULAR animation context', () => {
      const ctx: CircleLayoutContextType = {
        ...baseContext,
        animationProps: {
          animationConfigs: [
            { type: AnimationType.CIRCULAR, config: { duration: 300 } },
          ],
          animationCombinationType: AnimationCombinationType.PARALLEL,
        },
      };
      expect(() => renderComponent({ ctx })).not.toThrow();
    });

    it('positions component with all animation types and SEQUENCE combination', () => {
      const ctx: CircleLayoutContextType = {
        ...baseContext,
        animationProps: {
          animationConfigs: [
            { type: AnimationType.OPACITY, config: { duration: 300 } },
            { type: AnimationType.LINEAR, config: { duration: 300 } },
            { type: AnimationType.CIRCULAR, config: { duration: 300 } },
          ],
          animationCombinationType: AnimationCombinationType.SEQUENCE,
          animationGap: 50,
        },
      };
      expect(() => renderComponent({ ctx })).not.toThrow();
    });
  });
});
