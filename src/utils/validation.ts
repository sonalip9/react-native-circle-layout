import type { AnimationDriver } from '../animation/types';
import type { CircleLayoutProps } from '../types';

/**
 * Validates the props passed to the CircleLayout component and
 * returns the validated props. If any of the props are invalid, an error is thrown.
 * @param props The properties passed to the component
 * @returns The validated properties
 */
export function validateProps<D extends AnimationDriver>(
  props: CircleLayoutProps<D>
): CircleLayoutProps<D> & {
  sweepAngle: number;
  startAngle: number;
} {
  const errors: string[] = [];
  if (props.components.length < 2) {
    errors.push('At least two components need to be passed to CircleLayout');
  }
  if (props.radius <= 0) {
    errors.push('Radius needs to be greater than 0');
  }

  if (props.sweepAngle === 0) {
    errors.push('Sweep angle cannot be 0');
  }

  if (errors.length > 0) {
    throw new Error(errors.join('\n'));
  }

  return {
    ...props,
    sweepAngle: props.sweepAngle
      ? props.sweepAngle % (2 * Math.PI) === 0
        ? 2 * Math.PI
        : props.sweepAngle % (2 * Math.PI)
      : 2 * Math.PI,
    startAngle: (props.startAngle ?? 0) % (2 * Math.PI),
  };
}
