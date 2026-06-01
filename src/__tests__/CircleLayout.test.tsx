import { useRef } from 'react';
import { Text } from 'react-native';
import { render, act, renderHook } from '@testing-library/react-native';

import { CircleLayout, validateProps } from '../CircleLayout';
import type { CircleLayoutRef } from '../types';

const makeComponents = (n: number) =>
  Array.from({ length: n }, (_, i) => <Text key={i}>Item {i}</Text>);

// ─── validateProps unit tests ────────────────────────────────────────────────

const baseProps = { components: [null, null], radius: 100 };

describe('validateProps', () => {
  describe('validation errors', () => {
    it('throws when fewer than 2 components provided', () => {
      expect(() => validateProps({ ...baseProps, components: [null] })).toThrow(
        'At least two components need to be passed to CircleLayout'
      );
    });

    it('throws when radius is 0', () => {
      expect(() => validateProps({ ...baseProps, radius: 0 })).toThrow(
        'Radius needs to be greater than 0'
      );
    });

    it('throws when radius is negative', () => {
      expect(() => validateProps({ ...baseProps, radius: -1 })).toThrow(
        'Radius needs to be greater than 0'
      );
    });

    it('throws when sweepAngle is 0', () => {
      expect(() => validateProps({ ...baseProps, sweepAngle: 0 })).toThrow(
        'Sweep angle cannot be 0'
      );
    });

    it('collects multiple errors into a single throw', () => {
      expect(() => validateProps({ components: [null], radius: -5 })).toThrow(
        'At least two components need to be passed to CircleLayout\nRadius needs to be greater than 0'
      );
    });
  });

  describe('sweepAngle normalization', () => {
    it('defaults to 2π when sweepAngle not provided', () => {
      const result = validateProps(baseProps);
      expect(result.sweepAngle).toBeCloseTo(2 * Math.PI);
    });

    it('returns 2π for exact 2π input', () => {
      const result = validateProps({ ...baseProps, sweepAngle: 2 * Math.PI });
      expect(result.sweepAngle).toBeCloseTo(2 * Math.PI);
    });

    it('normalizes sweepAngle > 2π via modulo', () => {
      const result = validateProps({ ...baseProps, sweepAngle: 3 * Math.PI });
      expect(result.sweepAngle).toBeCloseTo(Math.PI);
    });

    it('returns 2π when sweepAngle is an exact multiple of 2π', () => {
      const result = validateProps({ ...baseProps, sweepAngle: 4 * Math.PI });
      expect(result.sweepAngle).toBeCloseTo(2 * Math.PI);
    });

    it('passes through sweepAngle < 2π unchanged', () => {
      const result = validateProps({ ...baseProps, sweepAngle: Math.PI });
      expect(result.sweepAngle).toBeCloseTo(Math.PI);
    });
  });

  describe('startAngle normalization', () => {
    it('defaults startAngle to 0 when not provided', () => {
      const result = validateProps(baseProps);
      expect(result.startAngle).toBe(0);
    });

    it('normalizes startAngle > 2π via modulo', () => {
      const result = validateProps({ ...baseProps, startAngle: 3 * Math.PI });
      expect(result.startAngle).toBeCloseTo(Math.PI);
    });

    it('passes through startAngle < 2π unchanged', () => {
      const result = validateProps({ ...baseProps, startAngle: Math.PI / 4 });
      expect(result.startAngle).toBeCloseTo(Math.PI / 4);
    });
  });

  describe('prop passthrough', () => {
    it('preserves all other props', () => {
      const containerStyle = { flex: 1 };
      const result = validateProps({ ...baseProps, containerStyle });
      expect(result.containerStyle).toBe(containerStyle);
      expect(result.radius).toBe(100);
      expect(result.components).toBe(baseProps.components);
    });

    it('normalized sweepAngle overrides original value in returned object', () => {
      const result = validateProps({ ...baseProps, sweepAngle: 4 * Math.PI });
      expect(result.sweepAngle).toBeCloseTo(2 * Math.PI);
    });
  });
});

// ─── CircleLayout integration tests ─────────────────────────────────────────

describe('CircleLayout', () => {
  describe('rendering', () => {
    it('renders with minimum required props', () => {
      expect(() =>
        render(
          <CircleLayout
            components={makeComponents(2)}
            radius={100}
            ref={null}
          />
        )
      ).not.toThrow();
    });

    it('renders all provided components', () => {
      const { getAllByText } = render(
        <CircleLayout
          components={[
            <Text key="A">A</Text>,
            <Text key="B">B</Text>,
            <Text key="C">C</Text>,
          ]}
          radius={100}
          ref={null}
        />
      );
      expect(getAllByText(/^[ABC]$/)).toHaveLength(3);
    });

    it('renders center component when provided', () => {
      const { getByText } = render(
        <CircleLayout
          components={makeComponents(3)}
          radius={100}
          centerComponent={<Text>Center</Text>}
          ref={null}
        />
      );
      expect(getByText('Center')).toBeTruthy();
    });

    it('renders with custom containerStyle', () => {
      expect(() =>
        render(
          <CircleLayout
            components={makeComponents(2)}
            radius={100}
            containerStyle={{ backgroundColor: 'red' }}
            ref={null}
          />
        )
      ).not.toThrow();
    });
  });

  describe('prop validation', () => {
    it('throws when fewer than 2 components passed', () => {
      expect(() =>
        render(
          <CircleLayout
            components={[<Text key="A">A</Text>]}
            radius={100}
            ref={null}
          />
        )
      ).toThrow('At least two components need to be passed to CircleLayout');
    });

    it('throws when radius is 0', () => {
      expect(() =>
        render(
          <CircleLayout components={makeComponents(2)} radius={0} ref={null} />
        )
      ).toThrow('Radius needs to be greater than 0');
    });

    it('throws when sweepAngle is 0', () => {
      expect(() =>
        render(
          <CircleLayout
            components={makeComponents(2)}
            radius={100}
            sweepAngle={0}
            ref={null}
          />
        )
      ).toThrow('Sweep angle cannot be 0');
    });
  });

  describe('ref methods', () => {
    it('exposes showComponents and hideComponents via ref', () => {
      // "Testing Component-Level Hooks via Refs" pattern — useRef inside renderHook
      const { result } = renderHook(() => useRef<CircleLayoutRef>(null));
      const ref = result.current;
      render(
        <CircleLayout components={makeComponents(3)} radius={100} ref={ref} />
      );
      expect(typeof ref.current?.showComponents).toBe('function');
      expect(typeof ref.current?.hideComponents).toBe('function');
    });

    it('showComponents and hideComponents execute without throwing', () => {
      const { result } = renderHook(() => useRef<CircleLayoutRef>(null));
      const ref = result.current;
      render(
        <CircleLayout components={makeComponents(3)} radius={100} ref={ref} />
      );
      expect(() => {
        act(() => {
          ref.current?.hideComponents();
          ref.current?.showComponents();
        });
      }).not.toThrow();
    });
  });

  describe('sweepAngle variations', () => {
    it('renders with sweepAngle of π (semi-circle)', () => {
      expect(() =>
        render(
          <CircleLayout
            components={makeComponents(4)}
            radius={100}
            sweepAngle={Math.PI}
            ref={null}
          />
        )
      ).not.toThrow();
    });

    it('renders with sweepAngle of π/2 (quarter-circle)', () => {
      expect(() =>
        render(
          <CircleLayout
            components={makeComponents(3)}
            radius={100}
            sweepAngle={Math.PI / 2}
            ref={null}
          />
        )
      ).not.toThrow();
    });

    it('renders with custom startAngle', () => {
      expect(() =>
        render(
          <CircleLayout
            components={makeComponents(3)}
            radius={100}
            startAngle={Math.PI / 4}
            ref={null}
          />
        )
      ).not.toThrow();
    });
  });

  describe('dynamic component changes', () => {
    it('adds new component to layout when components prop grows', () => {
      const { rerender, getAllByText } = render(
        <CircleLayout
          components={[<Text key="A">A</Text>, <Text key="B">B</Text>]}
          radius={100}
          ref={null}
        />
      );
      rerender(
        <CircleLayout
          components={[
            <Text key="A">A</Text>,
            <Text key="B">B</Text>,
            <Text key="C">C</Text>,
          ]}
          radius={100}
          ref={null}
        />
      );
      expect(getAllByText(/^[ABC]$/)).toHaveLength(3);
    });

    it('removes component from layout when components prop shrinks', () => {
      const { rerender, queryByText } = render(
        <CircleLayout
          components={[
            <Text key="A">A</Text>,
            <Text key="B">B</Text>,
            <Text key="C">C</Text>,
          ]}
          radius={100}
          ref={null}
        />
      );
      rerender(
        <CircleLayout
          components={[<Text key="A">A</Text>, <Text key="B">B</Text>]}
          radius={100}
          ref={null}
        />
      );
      expect(queryByText('C')).toBeNull();
    });
  });
});
