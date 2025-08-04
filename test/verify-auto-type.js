/**
 * 验证智能类型识别功能
 */

import { generateSizeSequence } from '../src/services/sizeCalculator.js';

describe('智能类型识别功能', () => {
  test('验证尺码序列生成功能', () => {
    expect(generateSizeSequence('M', 3)).toEqual(['M', 'L', 'XL']);
  });
});
