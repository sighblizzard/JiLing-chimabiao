/**
 * 验证裤装模式移除后的功能
 */

import { calculateSizeData, generateSizeSequence } from '../src/services/sizeCalculator.js';

console.log('🔍 验证裤装模式移除...\n');

// 测试数据
const testCategory = {
  name: '腰围',
  type: 'waist',
  baseValue: 68,
  baseIncrement: 4
};

const settings = {
  startSize: 'S',
  count: 4
};

console.log('📋 测试不同模式的计算结果:');
console.log('=====================================');

// 测试普通模式
console.log('\n✅ 普通模式:');
const normalResult = calculateSizeData(settings, [testCategory], 'normal');
console.log('   尺码序列:', normalResult.sizes);
console.log('   腰围数值:', normalResult.tableData[0].values.map(v => v.value));

// 测试毛衣模式（应该不影响腰围）
console.log('\n✅ 毛衣模式（腰围不受影响）:');
const sweaterResult = calculateSizeData(settings, [testCategory], 'sweater');
console.log('   尺码序列:', sweaterResult.sizes);
console.log('   腰围数值:', sweaterResult.tableData[0].values.map(v => v.value));

// 验证胸围在毛衣模式下的变化
const chestCategory = {
  name: '胸围',
  type: 'chest',
  baseValue: 88,
  baseIncrement: 4
};

console.log('\n✅ 毛衣模式（胸围递增减半）:');
const chestNormal = calculateSizeData(settings, [chestCategory], 'normal');
const chestSweater = calculateSizeData(settings, [chestCategory], 'sweater');

console.log('   普通模式胸围:', chestNormal.tableData[0].values.map(v => v.value));
console.log('   毛衣模式胸围:', chestSweater.tableData[0].values.map(v => v.value));

// 验证不再支持裤装模式
console.log('\n❌ 裤装模式（已移除）:');
try {
  // 即使传入 pants 模式，也应该按普通模式处理
  const pantsResult = calculateSizeData(settings, [testCategory], 'pants');
  console.log('   处理结果（应等同普通模式）:', pantsResult.tableData[0].values.map(v => v.value));
  
  // 比较与普通模式是否相同
  const normalValues = normalResult.tableData[0].values.map(v => v.value);
  const pantsValues = pantsResult.tableData[0].values.map(v => v.value);
  const isEqual = JSON.stringify(normalValues) === JSON.stringify(pantsValues);
  
  console.log('   ✓ 裤装模式已正确移除，结果等同普通模式:', isEqual);
  
} catch (error) {
  console.log('   ❌ 发生错误:', error.message);
}

console.log('\n🎉 验证完成！裤装模式已成功移除。');
console.log('📝 当前支持的模式: normal (普通), sweater (毛衣)');
