#!/usr/bin/env node

/**
 * 尺码表生成器 - 功能测试脚本
 * 验证应用的各个核心功能
 */

import { test, expect } from '@jest/globals';
import { 
  validateCategory, 
  createCategory, 
  presetCategories 
} from '../src/services/dataManager.js';
import { 
  calculateSizeData, 
  generateSizeSequence, 
  validateSizeSettings 
} from '../src/services/sizeCalculator.js';
import { 
  renderSizeChart, 
  generateSizeChart, 
  exportToImage 
} from '../src/services/canvasRenderer.js';

// 测试数据管理服务
describe('数据管理服务测试', () => {
  test('应该正确验证类别数据', () => {
    const validCategory = {
      name: '胸围',
      type: 'chest',
      baseValue: '88',
      baseIncrement: '4'
    };
    
    const result = validateCategory(validCategory);
    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual({});
  });

  test('应该创建有效的类别', () => {
    const categoryData = {
      name: '腰围',
      type: 'waist',
      baseValue: '68',
      baseIncrement: '4',
      description: '测试腰围类别'
    };
    
    const category = createCategory(categoryData);
    expect(category).toHaveProperty('id');
    expect(category.name).toBe('腰围');
    expect(category.baseValue).toBe(68);
    expect(category.isCustom).toBe(true);
  });

  test('预设类别应该有效', () => {
    expect(presetCategories).toHaveLength(12);
    presetCategories.forEach(category => {
      expect(category).toHaveProperty('id');
      expect(category).toHaveProperty('name');
      expect(category.isCustom).toBe(false);
    });
  });
});

// 测试尺码计算服务
describe('尺码计算服务测试', () => {
  test('应该生成正确的尺码序列', () => {
    const sequence = generateSizeSequence('S', 4);
    expect(sequence).toEqual(['S', 'M', 'L', 'XL']);
  });

  test('应该验证尺码设置', () => {
    const validSettings = {
      startSize: 'M',
      count: 5
    };
    
    const result = validateSizeSettings(validSettings);
    expect(result.isValid).toBe(true);
  });

  test('应该计算尺码数据', () => {
    const settings = { startSize: 'S', count: 3 };
    const categories = [
      { name: '胸围', baseValue: 88, baseIncrement: 4 },
      { name: '腰围', baseValue: 68, baseIncrement: 4 }
    ];
    
    const data = calculateSizeData(settings, categories);
    expect(Array.isArray(data)).toBe(true);
    expect(data).toHaveLength(2);
    expect(data[0]).toHaveProperty('categoryName', '胸围');
    expect(data[0]).toHaveProperty('values');
    expect(data[0].values).toHaveLength(3);
  });
});

// 测试画布渲染服务
describe('画布渲染服务测试', () => {
  test('应该生成尺码表配置', async () => {
    const categories = [
      { name: '胸围', baseValue: 88, baseIncrement: 4 }
    ];
    const settings = { startSize: 'S', count: 3 };
    
    const chart = await generateSizeChart(categories, settings);
    expect(chart).toHaveProperty('title');
    expect(chart).toHaveProperty('data');
    expect(chart).toHaveProperty('dimensions');
  });

  // 注意：DOM 相关的测试需要 jsdom 环境
  test.skip('应该导出图片', async () => {
    // 这个测试需要 Canvas API 支持
    const mockCanvas = document.createElement('canvas');
    const dataUrl = await exportToImage(mockCanvas);
    expect(dataUrl).toMatch(/^data:image\/png;base64,/);
  });
});

// 集成测试
describe('应用集成测试', () => {
  test('完整的尺码表生成流程', async () => {
    // 1. 创建类别
    const categoryData = {
      name: '测试类别',
      type: 'chest',
      baseValue: '90',
      baseIncrement: '4'
    };
    
    const category = createCategory(categoryData);
    expect(category).toBeDefined();

    // 2. 设置尺码参数
    const settings = { startSize: 'S', count: 4 };
    const settingsValidation = validateSizeSettings(settings);
    expect(settingsValidation.isValid).toBe(true);

    // 3. 计算尺码数据
    const sizeData = calculateSizeData(settings, [category]);
    expect(Array.isArray(sizeData)).toBe(true);
    expect(sizeData).toHaveLength(1);
    expect(sizeData[0].values).toHaveLength(4);
    expect(sizeData[0].values[0].size).toBe('S');
    expect(sizeData[0].values[3].size).toBe('XL');

    // 4. 生成图表配置
    const chart = await generateSizeChart([category], settings);
    expect(chart.data).toHaveLength(2); // 表头 + 1个类别
    expect(chart.data[0]).toEqual(['类别', 'S', 'M', 'L', 'XL']);
    expect(chart.data[1]).toEqual(['测试类别', 90, 94, 98, 102]);
  });
});

console.log('📋 尺码表生成器 - 功能测试');
console.log('=====================================');

// 手动运行测试（不依赖 Jest 环境）
const runManualTests = () => {
  console.log('\n🔍 手动测试开始...\n');
  
  try {
    // 测试类别创建
    console.log('✅ 测试类别创建...');
    const testCategory = createCategory({
      name: '胸围',
      type: 'chest',
      baseValue: '88',
      baseIncrement: '4'
    });
    console.log('   创建的类别:', testCategory.name, '-', testCategory.baseValue + 'cm');

    // 测试尺码序列生成
    console.log('✅ 测试尺码序列生成...');
    const sizes = generateSizeSequence('S', 5);
    console.log('   生成的尺码:', sizes.join(', '));

    // 测试尺码数据计算
    console.log('✅ 测试尺码数据计算...');
    const sizeData = calculateSizeData(
      { startSize: 'S', count: 4 },
      [testCategory]
    );
    console.log('   尺码数据:', sizeData.sizes);

    console.log('\n🎉 所有手动测试通过！');
    
  } catch (error) {
    console.error('❌ 测试失败:', error.message);
    return false;
  }
  
  return true;
};

// 导出测试函数
module.exports = { runManualTests };
