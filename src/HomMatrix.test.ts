import { describe, test, expect } from '@jest/globals';
import { HomMatrix, identity } from './HomMatrix';

describe('HomMatrix.equal', () => {
  test('should identify equal matrices', () => {
    const a = new HomMatrix(1,2,3,4,5,6);
    const b = new HomMatrix(1,2,3,4,5,6);

    expect(a.equals(b)).toBeTruthy();
  });
  test('should identify different matrices', () => {
    const a = new HomMatrix(1,2,3,4,5,6);

    expect(a.equals(undefined)).toBeFalsy();
    expect(a.equals(null)).toBeFalsy();
    expect(a.equals(new HomMatrix(7,2,3,4,5,6))).toBeFalsy();
    expect(a.equals(new HomMatrix(1,7,3,4,5,6))).toBeFalsy();
    expect(a.equals(new HomMatrix(1,2,7,4,5,6))).toBeFalsy();
    expect(a.equals(new HomMatrix(1,2,3,7,5,6))).toBeFalsy();
    expect(a.equals(new HomMatrix(1,2,3,4,7,6))).toBeFalsy();
    expect(a.equals(new HomMatrix(1,2,3,4,5,7))).toBeFalsy();
  });
});

describe('HomMatrix.after', () => {
  test('identity should not change the other matrix', () => {
    const id = identity();
    const a = new HomMatrix(1,2,3,4,5,6);

    const result = id.after(a);

    expect(a.equals(result)).toBeTruthy();
  });
  test('basic transformations', () => {
    const a = new HomMatrix(1,2,3,4,5,6);
    const t = new HomMatrix(0,1,-1,0,1,2);

    // 0 -1 1   1 3 5   -2 -4 -5
    // 1  0 2 x 2 4 6 =  1  3  7
    // 0  0 1   0 0 1    0  0  1
    const expected = new HomMatrix(-2,1,-4,3,-5,7);
    const result = t.after(a);
    expect(expected.equals(result)).toBeTruthy();
  });
});
