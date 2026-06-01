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
});
