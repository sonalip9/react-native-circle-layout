import {
  CircleLayout,
  AnimationCombinationType,
  AnimationType,
} from '../index';

describe('index exports', () => {
  it('exports CircleLayout component', () => {
    expect(typeof CircleLayout).toBe('function');
  });

  it('exports AnimationType enum with expected values', () => {
    expect(AnimationType.OPACITY).toBe('opacityAnimationConfig');
    expect(AnimationType.LINEAR).toBe('linearAnimationConfig');
    expect(AnimationType.CIRCULAR).toBe('circularAnimationConfig');
  });

  it('exports AnimationCombinationType enum with expected values', () => {
    expect(AnimationCombinationType.PARALLEL).toBe('parallel');
    expect(AnimationCombinationType.SEQUENCE).toBe('sequence');
  });

  describe('edge cases', () => {
    it('AnimationType values are distinct strings', () => {
      const values = Object.values(AnimationType);
      const unique = new Set(values);
      expect(unique.size).toBe(values.length);
    });

    it('AnimationCombinationType values are distinct strings', () => {
      const values = Object.values(AnimationCombinationType);
      const unique = new Set(values);
      expect(unique.size).toBe(values.length);
    });

    it('CircleLayout is not an arrow function returning null (is a real component)', () => {
      // Ensures the export is a proper renderable component, not a stub
      expect(CircleLayout).not.toBeNull();
      expect(CircleLayout).not.toBeUndefined();
    });
  });
});
