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

  if (props.weights !== undefined) {
    if (props.weights.length !== props.components.length) {
      errors.push(
        `Weights length (${props.weights.length}) must match components length (${props.components.length})`
      );
    }
    if (props.weights.some((w) => !Number.isFinite(w) || w <= 0)) {
      errors.push('All weights must be finite numbers greater than 0');
    }
  }

  if (props.bgConfig) {
    const count = props.components.length;
    const {
      color,
      strokeColor,
      strokeWidth,
      innerRadius,
      outerRadius,
      selectedIndex,
      expandedOuterRadius,
    } = props.bgConfig;
    if (Array.isArray(color) && color.length !== count) {
      errors.push(
        `bgConfig.color array length (${color.length}) must match components length (${count})`
      );
    }
    if (Array.isArray(strokeColor) && strokeColor.length !== count) {
      errors.push(
        `bgConfig.strokeColor array length (${strokeColor.length}) must match components length (${count})`
      );
    }
    if (Array.isArray(strokeWidth) && strokeWidth.length !== count) {
      errors.push(
        `bgConfig.strokeWidth array length (${strokeWidth.length}) must match components length (${count})`
      );
    }
    if (Array.isArray(innerRadius) && innerRadius.length !== count) {
      errors.push(
        `bgConfig.innerRadius array length (${innerRadius.length}) must match components length (${count})`
      );
    }
    if (Array.isArray(outerRadius) && outerRadius.length !== count) {
      errors.push(
        `bgConfig.outerRadius array length (${outerRadius.length}) must match components length (${count})`
      );
    }
    if (
      selectedIndex !== undefined &&
      (!Number.isInteger(selectedIndex) ||
        selectedIndex < 0 ||
        selectedIndex >= count)
    ) {
      errors.push(
        `bgConfig.selectedIndex (${selectedIndex}) must be an integer within [0, ${count})`
      );
    }
    if (
      expandedOuterRadius !== undefined &&
      (!Number.isFinite(expandedOuterRadius) || expandedOuterRadius <= 0)
    ) {
      errors.push(
        'bgConfig.expandedOuterRadius must be a finite number greater than 0'
      );
    }
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
