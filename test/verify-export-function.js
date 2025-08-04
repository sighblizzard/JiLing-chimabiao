/**
 * 尺码表导出功能测试
 */

import { generateSizeSequence } from '../src/services/sizeCalculator.js';

describe('尺码表导出功能', () => {
  test('验证基本导出功能', () => {
    expect(generateSizeSequence('XS', 2)).toEqual(['XS', 'S']);
  });
});
