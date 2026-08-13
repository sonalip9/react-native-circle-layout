import React, { useEffect, use } from 'react';
import { CircleLayoutComponent } from './CircleLayoutComponent';
import { CircleLayoutContext } from './CircleLayoutContext';
import type { Layout } from './types';

/**
 * A component that renders the components in the circle layout. This is used to
 * render the components in the circle layout and is used internally by the
 * CircleLayout component.
 * @param props The properties passed to the component
 * @param props.components The list of components to be placed in the circle layout.
 * @param props.sweepAngle The distance in radians to be covered from the starting point.
 * The value needs to be in radians.
 * @param props.setMinComponentLayout The function to set the minimum layout of the
 * components in the circle layout. This is used to calculate the size of the container
 * of the circle layout.
 * @param props.centerComponentLayout The layout of the center component which is used
 * to calculate the position of the components on the circle.
 * @returns A component that places the passed components in a circular view.
 */
function CircleLayoutArray({
  components,
  sweepAngle,
  setMinComponentLayout,
  centerComponentLayout,
}: {
  components: React.ReactNode[];
  sweepAngle: number;
  setMinComponentLayout: React.Dispatch<React.SetStateAction<Layout>>;
  centerComponentLayout: Layout;
}) {
  /**
   * Tracks the previous `components.length` so the layout-state resize
   * effect below can compute a diff without depending on componentLayouts
   * itself (which onLayout already grows independently).
   */
  const previousLengthRef = React.useRef(components.length);

  const [componentLayouts, setComponentLayouts] = React.useState<Layout[]>([]);

  useEffect(() => {
    const currentLength = previousLengthRef.current;
    const diff = Math.abs(components.length - currentLength);
    if (currentLength < components.length) {
      // New component added — extend layout state.
      setComponentLayouts((prev) => [
        ...prev,
        ...Array<Layout>(diff).fill({ width: 0, height: 0 }),
      ]);
    } else if (currentLength > components.length) {
      // Component removed — trim layout state.
      setComponentLayouts((prev) => prev.slice(0, components.length));
    }
    previousLengthRef.current = components.length;
  }, [components.length]);

  useEffect(() => {
    const minLayout = componentLayouts.reduce(
      (acc, layout) => {
        return {
          height: Math.max(acc.height, layout.height),
          width: Math.max(acc.width, layout.width),
        };
      },
      { height: 0, width: 0 }
    );

    setMinComponentLayout(minLayout);
  }, [componentLayouts, setMinComponentLayout, sweepAngle]);

  const { componentAngles } = use(CircleLayoutContext);

  return components.map((component, index) => {
    const angle = componentAngles[index]!;
    return (
      <CircleLayoutComponent
        component={component}
        index={index}
        // eslint-disable-next-line @eslint-react/no-array-index-key -- This is a stable index as the order of the components will not change.
        key={`Component-${index}`}
        radians={angle}
        onLayout={(event) => {
          const layout = event.nativeEvent.layout;
          setComponentLayouts((prevLayouts) => {
            const newLayouts = [...prevLayouts];
            newLayouts[index] = layout;
            return newLayouts;
          });
        }}
        centerComponentLayout={centerComponentLayout}
      />
    );
  });
}

export default CircleLayoutArray;
