/**
 * 验证裤装模式移除后的功能
 */

import { calculateSizeData, generateSizeSequence } from '../src/services/sizeCalculator.js';

describe('裤装模式移除验证', () => {
  const testCategory = {
    id: 'waist-test',
    name: '腰围',
    type: 'waist',
    baseValue: 68,
    baseIncrement: 4
  };

  const settings = {
    startSize: 'S',
    count: 4
  };

  test('验证普通模式和毛衣模式都正常工作', () => {
    const normalResult = calculateSizeData(settings, [testCategory], 'normal');
    const sweaterResult = calculateSizeData(settings, [testCategory], 'sweater');
    
    expect(normalResult).toBeDefined();
    expect(sweaterResult).toBeDefined();
    expect(normalResult[0].values).toHaveLength(4);
    expect(sweaterResult[0].values).toHaveLength(4);
  });

  test('验证裤装模式被移除（等同于普通模式）', () => {
    const normalResult = calculateSizeData(settings, [testCategory], 'normal');
    const pantsResult = calculateSizeData(settings, [testCategory], 'pants');
    
    const normalValues = normalResult[0].values.map(v => v.value);
    const pantsValues = pantsResult[0].values.map(v => v.value);
    
    expect(pantsValues).toEqual(normalValues);
  });

  test('验证毛衣模式对大围度类别的递增减半效果', () => {
    const chestCategory = {
      id: 'chest-test',
      name: '胸围',
      type: 'chest',
      baseValue: 88,
      baseIncrement: 4
    };

    const chestNormal = calculateSizeData(settings, [chestCategory], 'normal');
    const chestSweater = calculateSizeData(settings, [chestCategory], 'sweater');

    const normalIncrement = chestNormal[0].values[1].value - chestNormal[0].values[0].value;
    const sweaterIncrement = chestSweater[0].values[1].value - chestSweater[0].values[0].value;

    expect(normalIncrement).toBe(4);
    expect(sweaterIncrement).toBe(2); // 毛衣模式减半
  });
});
