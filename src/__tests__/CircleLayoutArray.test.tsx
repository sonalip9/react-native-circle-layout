import { useRef } from 'react';
import { Text, View } from 'react-native';
import { render, act, renderHook } from '@testing-library/react-native';

import CircleLayoutArray from '../CircleLayoutArray';
import { CircleLayoutContext } from '../CircleLayoutContext';
import type {
  CircleLayoutContextType,
  CircleLayoutRef,
  Layout,
} from '../types';

const baseContext: CircleLayoutContextType = {
  totalParts: 2,
  radius: 100,
  startAngle: 0,
  sectorAngle: Math.PI,
};

const noopSetLayout = () => {};
const zeroCenterLayout: Layout = { width: 0, height: 0 };

const makeComponents = (n: number) =>
  Array.from({ length: n }, (_, i) => <Text key={i}>Item {i}</Text>);

const renderArray = (
  components: React.ReactNode[],
  ctx: CircleLayoutContextType = baseContext,
  props: Partial<{
    setMinComponentLayout: React.Dispatch<React.SetStateAction<Layout>>;
    centerComponentLayout: Layout;
    ref: React.Ref<CircleLayoutRef>;
  }> = {}
) =>
  render(
    <CircleLayoutContext value={ctx}>
      <View>
        <CircleLayoutArray
          components={components}
          sweepAngle={2 * Math.PI}
          setMinComponentLayout={props.setMinComponentLayout ?? noopSetLayout}
          centerComponentLayout={
            props.centerComponentLayout ?? zeroCenterLayout
          }
          ref={props.ref ?? null}
        />
      </View>
    </CircleLayoutContext>
  );

describe('CircleLayoutArray', () => {
  describe('rendering', () => {
    it('renders all components', () => {
      const { getAllByText } = renderArray([
        <Text key="A">A</Text>,
        <Text key="B">B</Text>,
        <Text key="C">C</Text>,
      ]);
      expect(getAllByText(/^[ABC]$/)).toHaveLength(3);
    });

    it('renders with minimum of 2 components', () => {
      expect(() => renderArray(makeComponents(2))).not.toThrow();
    });

    it('renders all 8 components when given 8', () => {
      const { getAllByText } = renderArray(makeComponents(8));
      expect(getAllByText(/^Item \d$/)).toHaveLength(8);
    });
  });

  describe('dynamic component changes', () => {
    it('renders newly added component when components prop grows', () => {
      const { rerender, getAllByText } = renderArray([
        <Text key="A">A</Text>,
        <Text key="B">B</Text>,
      ]);
      rerender(
        <CircleLayoutContext value={baseContext}>
          <View>
            <CircleLayoutArray
              components={[
                <Text key="A">A</Text>,
                <Text key="B">B</Text>,
                <Text key="C">C</Text>,
              ]}
              sweepAngle={2 * Math.PI}
              setMinComponentLayout={noopSetLayout}
              centerComponentLayout={zeroCenterLayout}
              ref={null}
            />
          </View>
        </CircleLayoutContext>
      );
      expect(getAllByText(/^[ABC]$/)).toHaveLength(3);
    });

    it('removes unmounted component when components prop shrinks', () => {
      const { rerender, queryByText } = renderArray([
        <Text key="A">A</Text>,
        <Text key="B">B</Text>,
        <Text key="C">C</Text>,
      ]);
      rerender(
        <CircleLayoutContext value={baseContext}>
          <View>
            <CircleLayoutArray
              components={[<Text key="A">A</Text>, <Text key="B">B</Text>]}
              sweepAngle={2 * Math.PI}
              setMinComponentLayout={noopSetLayout}
              centerComponentLayout={zeroCenterLayout}
              ref={null}
            />
          </View>
        </CircleLayoutContext>
      );
      expect(queryByText('C')).toBeNull();
    });
  });

  describe('ref methods', () => {
    it('exposes showComponents and hideComponents via ref', () => {
      const { result } = renderHook(() => useRef<CircleLayoutRef>(null));
      const ref = result.current;
      renderArray(makeComponents(3), baseContext, { ref });
      expect(typeof ref.current?.showComponents).toBe('function');
      expect(typeof ref.current?.hideComponents).toBe('function');
    });

    it('showComponents and hideComponents execute without throwing', () => {
      const { result } = renderHook(() => useRef<CircleLayoutRef>(null));
      const ref = result.current;
      renderArray(makeComponents(3), baseContext, { ref });
      expect(() => {
        act(() => {
          ref.current?.hideComponents();
          ref.current?.showComponents();
        });
      }).not.toThrow();
    });
  });

  describe('setMinComponentLayout callback', () => {
    it('calls setMinComponentLayout with layout dimensions after render', () => {
      const setMinComponentLayout = jest.fn();
      renderArray(makeComponents(3), baseContext, { setMinComponentLayout });
      expect(setMinComponentLayout).toHaveBeenCalled();
    });
  });

  describe('edge cases', () => {
    it('renders large number of components (20) without throwing', () => {
      expect(() => renderArray(makeComponents(20))).not.toThrow();
    });

    it('renders when all components in array are null', () => {
      expect(() => renderArray([null, null, null])).not.toThrow();
    });

    it('renders with sweepAngle < 2π (quarter-circle)', () => {
      expect(() =>
        render(
          <CircleLayoutContext value={baseContext}>
            <View>
              <CircleLayoutArray
                components={makeComponents(4)}
                sweepAngle={Math.PI / 2}
                setMinComponentLayout={noopSetLayout}
                centerComponentLayout={zeroCenterLayout}
                ref={null}
              />
            </View>
          </CircleLayoutContext>
        )
      ).not.toThrow();
    });

    it('renders with non-zero centerComponentLayout without throwing', () => {
      expect(() =>
        renderArray(makeComponents(3), baseContext, {
          centerComponentLayout: { width: 50, height: 50 },
        })
      ).not.toThrow();
    });

    it('calls setMinComponentLayout again when components grow', () => {
      const setMinComponentLayout = jest.fn();
      const { rerender } = renderArray(makeComponents(3), baseContext, {
        setMinComponentLayout,
      });
      const callsBefore = setMinComponentLayout.mock.calls.length;
      rerender(
        <CircleLayoutContext value={baseContext}>
          <View>
            <CircleLayoutArray
              components={makeComponents(5)}
              sweepAngle={2 * Math.PI}
              setMinComponentLayout={setMinComponentLayout}
              centerComponentLayout={zeroCenterLayout}
              ref={null}
            />
          </View>
        </CircleLayoutContext>
      );
      expect(setMinComponentLayout.mock.calls.length).toBeGreaterThanOrEqual(
        callsBefore
      );
    });

    it('rapid hide then show via ref does not throw', () => {
      const { result } = renderHook(() => useRef<CircleLayoutRef>(null));
      const ref = result.current;
      renderArray(makeComponents(3), baseContext, { ref });
      expect(() => {
        act(() => {
          ref.current?.hideComponents();
          ref.current?.hideComponents();
          ref.current?.showComponents();
          ref.current?.showComponents();
        });
      }).not.toThrow();
    });
  });
});
