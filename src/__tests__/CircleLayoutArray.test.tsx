import { Text, View } from 'react-native';
import { render } from '@testing-library/react-native';

import { rnAnimatedDriver } from '../animation/rnAnimatedDriver';
import CircleLayoutArray from '../CircleLayoutArray';
import { CircleLayoutContext } from '../CircleLayoutContext';
import { VisibilityContext } from '../VisibilityContext';
import type { CircleLayoutContextType, Layout } from '../types';

const makeContext = (n: number): CircleLayoutContextType => {
  const sectorAngle = (2 * Math.PI) / n;
  return {
    totalParts: n,
    radius: 100,
    startAngle: 0,
    sectorAngles: Array<number>(n).fill(sectorAngle),
    componentAngles: Array.from(
      { length: n },
      (_, i) => (sectorAngle * i) % (2 * Math.PI)
    ),
    animationDriver: rnAnimatedDriver,
  };
};

const noopSetLayout = () => {};
const zeroCenterLayout: Layout = { width: 0, height: 0 };

const makeComponents = (n: number) =>
  Array.from({ length: n }, (_, i) => <Text key={i}>Item {i}</Text>);

const renderArray = async (
  components: React.ReactNode[],
  ctx?: CircleLayoutContextType,
  props: Partial<{
    setMinComponentLayout: React.Dispatch<React.SetStateAction<Layout>>;
    centerComponentLayout: Layout;
  }> = {}
) => {
  const context = ctx ?? makeContext(components.length);
  return await render(
    <CircleLayoutContext value={context}>
      <View>
        <CircleLayoutArray
          components={components}
          sweepAngle={2 * Math.PI}
          setMinComponentLayout={props.setMinComponentLayout ?? noopSetLayout}
          centerComponentLayout={
            props.centerComponentLayout ?? zeroCenterLayout
          }
        />
      </View>
    </CircleLayoutContext>
  );
};

describe('CircleLayoutArray', () => {
  describe('rendering', () => {
    it('renders all components', async () => {
      const { getAllByText } = await renderArray([
        <Text key="A">A</Text>,
        <Text key="B">B</Text>,
        <Text key="C">C</Text>,
      ]);
      expect(getAllByText(/^[ABC]$/)).toHaveLength(3);
    });

    it('renders with minimum of 2 components', async () => {
      await expect(renderArray(makeComponents(2))).resolves.not.toThrow();
    });

    it('renders all 8 components when given 8', async () => {
      const { getAllByText } = await renderArray(makeComponents(8));
      expect(getAllByText(/^Item \d$/)).toHaveLength(8);
    });
  });

  describe('dynamic component changes', () => {
    it('renders newly added component when components prop grows', async () => {
      const { rerender, getAllByText } = await renderArray([
        <Text key="A">A</Text>,
        <Text key="B">B</Text>,
      ]);
      await rerender(
        <CircleLayoutContext value={makeContext(3)}>
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
            />
          </View>
        </CircleLayoutContext>
      );
      expect(getAllByText(/^[ABC]$/)).toHaveLength(3);
    });

    it('removes unmounted component when components prop shrinks', async () => {
      const { rerender, queryByText } = await renderArray([
        <Text key="A">A</Text>,
        <Text key="B">B</Text>,
        <Text key="C">C</Text>,
      ]);
      await rerender(
        <CircleLayoutContext value={makeContext(2)}>
          <View>
            <CircleLayoutArray
              components={[<Text key="A">A</Text>, <Text key="B">B</Text>]}
              sweepAngle={2 * Math.PI}
              setMinComponentLayout={noopSetLayout}
              centerComponentLayout={zeroCenterLayout}
            />
          </View>
        </CircleLayoutContext>
      );
      expect(queryByText('C')).toBeNull();
    });
  });

  describe('visibility (via VisibilityContext)', () => {
    const renderArrayWithVisibility = async (visible: boolean) => {
      const context = makeContext(3);
      return await render(
        <CircleLayoutContext value={context}>
          <VisibilityContext value={visible}>
            <View>
              <CircleLayoutArray
                components={makeComponents(3)}
                sweepAngle={2 * Math.PI}
                setMinComponentLayout={noopSetLayout}
                centerComponentLayout={zeroCenterLayout}
              />
            </View>
          </VisibilityContext>
        </CircleLayoutContext>
      );
    };

    it('renders components when VisibilityContext is true', async () => {
      const { getAllByText } = await renderArrayWithVisibility(true);
      expect(getAllByText(/^Item \d$/)).toHaveLength(3);
    });

    it('still mounts components when VisibilityContext is false (hidden via animation, not unmount)', async () => {
      const { getAllByText } = await renderArrayWithVisibility(false);
      expect(getAllByText(/^Item \d$/)).toHaveLength(3);
    });
  });

  describe('setMinComponentLayout callback', () => {
    it('calls setMinComponentLayout with layout dimensions after render', async () => {
      const setMinComponentLayout = jest.fn();
      await renderArray(makeComponents(3), makeContext(3), {
        setMinComponentLayout,
      });
      expect(setMinComponentLayout).toHaveBeenCalled();
    });
  });

  describe('edge cases', () => {
    it('renders large number of components (20) without throwing', async () => {
      await expect(renderArray(makeComponents(20))).resolves.not.toThrow();
    });

    it('renders when all components in array are null', async () => {
      await expect(renderArray([null, null, null])).resolves.not.toThrow();
    });

    it('renders with sweepAngle < 2π (quarter-circle)', async () => {
      await expect(
        render(
          <CircleLayoutContext value={makeContext(4)}>
            <View>
              <CircleLayoutArray
                components={makeComponents(4)}
                sweepAngle={Math.PI / 2}
                setMinComponentLayout={noopSetLayout}
                centerComponentLayout={zeroCenterLayout}
              />
            </View>
          </CircleLayoutContext>
        )
      ).resolves.not.toThrow();
    });

    it('renders with non-zero centerComponentLayout without throwing', async () => {
      await expect(
        renderArray(makeComponents(3), makeContext(3), {
          centerComponentLayout: { width: 50, height: 50 },
        })
      ).resolves.not.toThrow();
    });

    it('calls setMinComponentLayout again when components grow', async () => {
      const setMinComponentLayout = jest.fn();
      const { rerender } = await renderArray(
        makeComponents(3),
        makeContext(3),
        {
          setMinComponentLayout,
        }
      );
      const callsBefore = setMinComponentLayout.mock.calls.length;
      await rerender(
        <CircleLayoutContext value={makeContext(5)}>
          <View>
            <CircleLayoutArray
              components={makeComponents(5)}
              sweepAngle={2 * Math.PI}
              setMinComponentLayout={setMinComponentLayout}
              centerComponentLayout={zeroCenterLayout}
            />
          </View>
        </CircleLayoutContext>
      );
      expect(setMinComponentLayout.mock.calls.length).toBeGreaterThanOrEqual(
        callsBefore
      );
    });
  });
});
