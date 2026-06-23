import { renderHook } from '@testing-library/react-native';
import { useCirclePosition, useCirclePositions } from '../../hooks';

describe('useCirclePositions', () => {
  it('returns empty array for count 0', () => {
    const { result } = renderHook(() =>
      useCirclePositions({ count: 0, radius: 100 })
    );
    expect(result.current).toEqual([]);
  });

  it('distributes positions evenly around full circle', () => {
    const { result } = renderHook(() =>
      useCirclePositions({ count: 4, radius: 100 })
    );
    expect(result.current).toHaveLength(4);

    // First item at angle 0: x=100, y=0
    expect(result.current[0]!.x).toBeCloseTo(100);
    expect(result.current[0]!.y).toBeCloseTo(0);
    expect(result.current[0]!.angle).toBeCloseTo(0);

    // Second item at π/2: x=0, y=100
    expect(result.current[1]!.x).toBeCloseTo(0);
    expect(result.current[1]!.y).toBeCloseTo(100);
    expect(result.current[1]!.angle).toBeCloseTo(Math.PI / 2);

    // Third item at π: x=-100, y=0
    expect(result.current[2]!.x).toBeCloseTo(-100);
    expect(result.current[2]!.y).toBeCloseTo(0);
    expect(result.current[2]!.angle).toBeCloseTo(Math.PI);

    // Fourth item at 3π/2: x=0, y=-100
    expect(result.current[3]!.x).toBeCloseTo(0);
    expect(result.current[3]!.y).toBeCloseTo(-100);
    expect(result.current[3]!.angle).toBeCloseTo((3 * Math.PI) / 2);
  });

  it('respects startAngle', () => {
    const { result } = renderHook(() =>
      useCirclePositions({
        count: 2,
        radius: 100,
        startAngle: Math.PI / 2,
      })
    );
    // First item at π/2
    expect(result.current[0]!.angle).toBeCloseTo(Math.PI / 2);
    expect(result.current[0]!.x).toBeCloseTo(0);
    expect(result.current[0]!.y).toBeCloseTo(100);
  });

  it('distributes over partial sweep (not complete circle)', () => {
    const { result } = renderHook(() =>
      useCirclePositions({
        count: 3,
        radius: 100,
        startAngle: 0,
        sweepAngle: Math.PI,
      })
    );
    expect(result.current).toHaveLength(3);

    // For non-complete circle: totalParts = count - 1 = 2
    // sectorAngle = π/2
    expect(result.current[0]!.angle).toBeCloseTo(0);
    expect(result.current[1]!.angle).toBeCloseTo(Math.PI / 2);
    expect(result.current[2]!.angle).toBeCloseTo(Math.PI);
  });

  it('handles single item', () => {
    const { result } = renderHook(() =>
      useCirclePositions({ count: 1, radius: 50 })
    );
    expect(result.current).toHaveLength(1);
    expect(result.current[0]!.x).toBeCloseTo(50);
    expect(result.current[0]!.y).toBeCloseTo(0);
  });
});

describe('useCirclePosition', () => {
  it('returns position for a single index', () => {
    const { result } = renderHook(() =>
      useCirclePosition({ index: 1, count: 4, radius: 100 })
    );
    // Second item in 4-item full circle: angle = π/2
    expect(result.current.angle).toBeCloseTo(Math.PI / 2);
    expect(result.current.x).toBeCloseTo(0);
    expect(result.current.y).toBeCloseTo(100);
  });

  it('matches useCirclePositions output', () => {
    const { result: allResult } = renderHook(() =>
      useCirclePositions({ count: 6, radius: 120, startAngle: 0.5 })
    );
    const { result: singleResult } = renderHook(() =>
      useCirclePosition({ index: 3, count: 6, radius: 120, startAngle: 0.5 })
    );

    expect(singleResult.current.x).toBeCloseTo(allResult.current[3]!.x);
    expect(singleResult.current.y).toBeCloseTo(allResult.current[3]!.y);
    expect(singleResult.current.angle).toBeCloseTo(allResult.current[3]!.angle);
  });
});
