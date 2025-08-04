/**
 * 验证类别起始值设置功能
 */

import { generateSizeSequence } from '../src/services/sizeCalculator.js';

describe('类别起始值设置功能', () => {
  test('验证起始值功能正常工作', () => {
    expect(generateSizeSequence('S', 4)).toEqual(['S', 'M', 'L', 'XL']);
  });
});
