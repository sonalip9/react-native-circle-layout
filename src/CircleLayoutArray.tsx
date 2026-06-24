import React, { useEffect, use } from 'react';
import { CircleLayoutComponent } from './CircleLayoutComponent';
import { CircleLayoutContext } from './CircleLayoutContext';
import type { Layout, CircleLayoutRef, ComponentRef } from './types';

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
 * @param props.ref The ref that is used to expose the show and hide function of the
 * component to parent components.
 * @returns A component that places the passed components in a circular view.
 */
function CircleLayoutArray({
  components,
  sweepAngle,
  setMinComponentLayout,
  centerComponentLayout,
  ref,
}: {
  components: React.ReactNode[];
  sweepAngle: number;
  setMinComponentLayout: React.Dispatch<React.SetStateAction<Layout>>;
  centerComponentLayout: Layout;
} & { ref?: React.Ref<CircleLayoutRef> }) {
  /**
   * Array of references for each of the circle components.
   */
  const componentListRef = React.useRef<(ComponentRef | null)[]>(
    Array(components.length).fill(null) as null[]
  );

  const [isComponentsVisible, setIsComponentsVisible] = React.useState(false);

  const [componentLayouts, setComponentLayouts] = React.useState<Layout[]>([]);

  useEffect(() => {
    const currentLength = componentListRef.current.length;
    const diff = Math.abs(components.length - currentLength);
    if (currentLength < components.length) {
      // New component added — extend ref array and layout state.
      for (let i = 0; i < diff; i++) {
        componentListRef.current.push(null);
      }
      // eslint-disable-next-line @eslint-react/set-state-in-effect -- We need to update the layout state to add the new components' layout.
      setComponentLayouts((prev) => [
        ...prev,
        ...Array<Layout>(diff).fill({ width: 0, height: 0 }),
      ]);
    } else if (currentLength > components.length) {
      // Component removed — trim ref array and layout state.
      componentListRef.current.splice(components.length, diff);
      // eslint-disable-next-line @eslint-react/set-state-in-effect -- We need to update the layout state to remove the removed components' layout.
      setComponentLayouts((prev) => prev.slice(0, components.length));
    }
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

  const { startAngle, totalParts, componentAngles } = use(CircleLayoutContext);

  /**
   * The instance value that is exposed to parent components when using ref.
   */
  React.useImperativeHandle(ref, () => ({
    hideComponents: () => {
      componentListRef.current?.forEach((componentRef) =>
        componentRef?.hideComponent()
      );
      setIsComponentsVisible(false);
    },
    showComponents: () => {
      componentListRef.current?.forEach((componentRef) => {
        componentRef?.showComponent();
      });
      setIsComponentsVisible(true);
    },
  }));

  useEffect(() => {
    if (isComponentsVisible) {
      componentListRef.current?.forEach((componentRef) =>
        componentRef?.showComponent()
      );
    } else {
      componentListRef.current?.forEach((componentRef) =>
        componentRef?.hideComponent()
      );
    }
  }, [
    startAngle,
    sweepAngle,
    totalParts,
    isComponentsVisible,
    componentAngles,
  ]);

  return components.map((component, index) => {
    const angle = componentAngles[index]!;
    return (
      <CircleLayoutComponent
        component={component}
        index={index}
        // eslint-disable-next-line @eslint-react/no-array-index-key -- This is a stable index as the order of the components will not change.
        key={`Component-${index}`}
        radians={angle}
        ref={(el) => {
          componentListRef.current[index] = el;
        }}
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
