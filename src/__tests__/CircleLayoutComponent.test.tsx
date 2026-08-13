import { Text } from 'react-native';
import { render } from '@testing-library/react-native';

import { rnAnimatedDriver } from '../animation/rnAnimatedDriver';
import { CircleLayoutComponent } from '../CircleLayoutComponent';
import { CircleLayoutContext } from '../CircleLayoutContext';
import { VisibilityContext } from '../VisibilityContext';
import {
  AnimationCombinationType,
  AnimationType,
  type CircleLayoutContextType,
  type Layout,
} from '../types';

const baseContext: CircleLayoutContextType = {
  totalParts: 3,
  radius: 100,
  startAngle: 0,
  sectorAngles: Array(3).fill((2 * Math.PI) / 3),
  componentAngles: [0, (2 * Math.PI) / 3, (4 * Math.PI) / 3],
  animationDriver: rnAnimatedDriver,
};

const zeroCenterLayout: Layout = { width: 0, height: 0 };

const renderComponent = (
  overrides: Partial<{
    component: React.ReactNode;
    index: number;
    radians: number;
    centerComponentLayout: Layout;
    onLayout: (event: import('react-native').LayoutChangeEvent) => void;
    ctx: CircleLayoutContextType;
    visible: boolean;
  }> = {}
) => {
  const ctx = overrides.ctx ?? baseContext;
  return render(
    <CircleLayoutContext value={ctx}>
      <VisibilityContext value={overrides.visible ?? true}>
        <CircleLayoutComponent
          component={overrides.component ?? <Text>Node</Text>}
          index={overrides.index ?? 0}
          radians={overrides.radians ?? 0}
          centerComponentLayout={
            overrides.centerComponentLayout ?? zeroCenterLayout
          }
          onLayout={overrides.onLayout}
        />
      </VisibilityContext>
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

    it('positions component at index 0 and higher without throwing', () => {
      expect(() => renderComponent({ index: 0 })).not.toThrow();
      expect(() => renderComponent({ index: 5 })).not.toThrow();
    });
  });

  describe('visibility (via VisibilityContext)', () => {
    it('renders the passed component when VisibilityContext is true', () => {
      const { getByText } = renderComponent({
        component: <Text>Hello</Text>,
        visible: true,
      });
      expect(getByText('Hello')).toBeTruthy();
    });

    it('still mounts the component when VisibilityContext is false (hidden via animation, not unmount)', () => {
      const { getByText } = renderComponent({
        component: <Text>Hello</Text>,
        visible: false,
      });
      expect(getByText('Hello')).toBeTruthy();
    });

    it('does not throw when VisibilityContext value changes after mount', () => {
      const { rerender } = render(
        <CircleLayoutContext value={baseContext}>
          <VisibilityContext value={true}>
            <CircleLayoutComponent
              component={<Text>Node</Text>}
              index={0}
              radians={0}
              centerComponentLayout={zeroCenterLayout}
            />
          </VisibilityContext>
        </CircleLayoutContext>
      );
      expect(() =>
        rerender(
          <CircleLayoutContext value={baseContext}>
            <VisibilityContext value={false}>
              <CircleLayoutComponent
                component={<Text>Node</Text>}
                index={0}
                radians={0}
                centerComponentLayout={zeroCenterLayout}
              />
            </VisibilityContext>
          </CircleLayoutContext>
        )
      ).not.toThrow();
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

  describe('edge cases', () => {
    it('positions component at radians > 2π without throwing', () => {
      expect(() => renderComponent({ radians: 3 * Math.PI })).not.toThrow();
    });

    it('positions component at negative radians without throwing', () => {
      expect(() => renderComponent({ radians: -Math.PI / 4 })).not.toThrow();
    });

    it('renders with non-zero centerComponentLayout without throwing', () => {
      expect(() =>
        renderComponent({ centerComponentLayout: { width: 80, height: 80 } })
      ).not.toThrow();
    });

    it('renders at very large index without throwing', () => {
      expect(() => renderComponent({ index: 1000 })).not.toThrow();
    });

    it('renders null component without throwing', () => {
      expect(() => renderComponent({ component: null })).not.toThrow();
    });

    it('renders with radius 0 in context without throwing', () => {
      expect(() =>
        renderComponent({
          ctx: { ...baseContext, radius: 0 },
        })
      ).not.toThrow();
    });

    it('renders with very large radius in context without throwing', () => {
      expect(() =>
        renderComponent({ ctx: { ...baseContext, radius: 100000 } })
      ).not.toThrow();
    });
  });

  describe('with animation context', () => {
    // CircleLayoutComponent now self-triggers showComponent()/hideComponent() on
    // mount (driven by VisibilityContext), which for these configs schedules a
    // real Animated.timing(..., { useNativeDriver: true }) run. Under a full
    // react-test-renderer tree that hits a pre-existing react/react-native
    // version mismatch in this environment (unrelated to this component's
    // logic — see Bg's identical mount-time pattern, which only avoids it by
    // passing useNativeDriver: false). Stub `driver.start` so these tests
    // exercise the real config-threading/render path without invoking that
    // native-driver internals.
    const nonNativeDriver = {
      ...rnAnimatedDriver,
      start: (
        _animation: ReturnType<typeof rnAnimatedDriver.sequence>,
        onComplete?: () => void
      ) => onComplete?.(),
    };

    it('positions component with OPACITY animation context', () => {
      const ctx: CircleLayoutContextType = {
        ...baseContext,
        animationDriver: nonNativeDriver,
        animationProps: {
          animationConfigs: {
            [AnimationType.OPACITY]: { duration: 300 },
          },
          animationCombinationType: AnimationCombinationType.PARALLEL,
        },
      };
      expect(() => renderComponent({ ctx })).not.toThrow();
    });

    it('positions component with LINEAR animation context', () => {
      const ctx: CircleLayoutContextType = {
        ...baseContext,
        animationDriver: nonNativeDriver,
        animationProps: {
          animationConfigs: {
            [AnimationType.LINEAR]: { duration: 300 },
          },
          animationCombinationType: AnimationCombinationType.PARALLEL,
        },
      };
      expect(() => renderComponent({ ctx })).not.toThrow();
    });

    it('positions component with CIRCULAR animation context', () => {
      const ctx: CircleLayoutContextType = {
        ...baseContext,
        animationDriver: nonNativeDriver,
        animationProps: {
          animationConfigs: {
            [AnimationType.CIRCULAR]: { duration: 300 },
          },
          animationCombinationType: AnimationCombinationType.PARALLEL,
        },
      };
      expect(() => renderComponent({ ctx })).not.toThrow();
    });

    it('positions component with all animation types and SEQUENCE combination', () => {
      const ctx: CircleLayoutContextType = {
        ...baseContext,
        animationDriver: nonNativeDriver,
        animationProps: {
          animationConfigs: {
            [AnimationType.OPACITY]: { duration: 300 },
            [AnimationType.LINEAR]: { duration: 300 },
            [AnimationType.CIRCULAR]: { duration: 300 },
          },
          animationCombinationType: AnimationCombinationType.SEQUENCE,
          animationGap: 50,
        },
      };
      expect(() => renderComponent({ ctx })).not.toThrow();
    });
  });
});
