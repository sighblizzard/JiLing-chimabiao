// 测试尺码表格式转换功能
import { generateSizeSequence } from '../src/services/sizeCalculator.js';

describe('尺码表格式转换功能', () => {
  test('验证尺码序列生成', () => {
    expect(generateSizeSequence('S', 3)).toEqual(['S', 'M', 'L']);
  });
});
