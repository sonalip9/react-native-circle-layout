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
    const diff = Math.abs(components.length - componentListRef.current.length);
    if (componentListRef.current.length < components.length) {
      // This means that a new component has been added and we need to add a new ref for it.
      for (let i = 0; i < diff; i++) {
        componentListRef.current.push(null);
        componentLayouts.push({ width: 0, height: 0 });
      }
    } else if (componentListRef.current.length > components.length) {
      // This means that a component has been removed and we need to remove the ref for it.
      componentListRef.current.splice(components.length, diff);
      componentLayouts.splice(components.length, diff);
    }
  }, [componentLayouts, components.length, setMinComponentLayout]);

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

  const { startAngle, totalParts } = use(CircleLayoutContext);

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
  }, [startAngle, sweepAngle, totalParts, isComponentsVisible]);

  return components.map((component, index) => {
    const angle =
      (startAngle + sweepAngle * (index / totalParts)) % (2 * Math.PI);
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
