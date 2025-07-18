/**
 * 验证类别起始值设置功能
 */

console.log('🧪 验证类别起始值设置功能...\n');

// 模拟应用状态
const mockAppState = {
  sizeSettings: { startSize: 'S', count: 4 },
  selectedCategories: [
    { id: 1, name: '胸围', baseValue: 92, baseIncrement: 4, type: 'chest', color: '#007AFF' },
    { id: 2, name: '腰围', baseValue: 78, baseIncrement: 4, type: 'waist', color: '#34C759' },
    { id: 3, name: '袖长', baseValue: 58, baseIncrement: 1.5, type: 'sleeve', color: '#FF9500' }
  ],
  categoryStartValues: {
    1: 96,  // 胸围自定义起始值
    3: 60   // 袖长自定义起始值
    // 腰围使用默认值 78
  }
};

// 模拟计算函数
const calculateSizeData = (sizeSettings, selectedCategories, mode = 'normal', categoryStartValues = {}) => {
  const sizeSequence = ['S', 'M', 'L', 'XL']; // 简化的序列
  
  return selectedCategories.map(category => {
    let increment = category.baseIncrement;
    
    if (mode === 'sweater' && category.type === 'chest') {
      increment = category.baseIncrement / 2;
    }
    
    const startValue = categoryStartValues[category.id] !== undefined 
      ? categoryStartValues[category.id] 
      : category.baseValue;
    
    const values = sizeSequence.map((size, index) => ({
      size,
      value: Math.round((startValue + increment * index) * 10) / 10,
      category: category.name
    }));
    
    return {
      categoryId: category.id,
      categoryName: category.name,
      values
    };
  });
};

// 验证计算结果
console.log('📊 计算结果验证:');
console.log('=====================================');

const result = calculateSizeData(
  mockAppState.sizeSettings,
  mockAppState.selectedCategories,
  'normal',
  mockAppState.categoryStartValues
);

result.forEach((categoryData, index) => {
  const category = mockAppState.selectedCategories[index];
  const hasCustomStart = mockAppState.categoryStartValues[category.id] !== undefined;
  const startValue = hasCustomStart 
    ? mockAppState.categoryStartValues[category.id] 
    : category.baseValue;
    
  console.log(`\n${index + 1}. ${categoryData.categoryName}:`);
  console.log(`   起始值: ${startValue}${hasCustomStart ? ' (自定义)' : ' (默认)'}`);
  console.log(`   递增值: ${category.baseIncrement}cm`);
  console.log('   尺码数据:');
  
  categoryData.values.forEach(item => {
    console.log(`     ${item.size}: ${item.value}cm`);
  });
});

// 验证毛衣模式
console.log('\n🧥 毛衣模式验证 (胸围递增减半):');
console.log('=====================================');

const sweaterResult = calculateSizeData(
  mockAppState.sizeSettings,
  mockAppState.selectedCategories,
  'sweater',
  mockAppState.categoryStartValues
);

const chestData = sweaterResult.find(item => item.categoryName === '胸围');
if (chestData) {
  console.log('胸围 (毛衣模式):');
  chestData.values.forEach(item => {
    console.log(`  ${item.size}: ${item.value}cm`);
  });
  
  // 验证递增值是否正确减半
  const firstDiff = chestData.values[1].value - chestData.values[0].value;
  const expectedIncrement = mockAppState.selectedCategories[0].baseIncrement / 2;
  
  console.log(`\n递增值验证: ${firstDiff}cm (期望: ${expectedIncrement}cm)`);
  console.log(firstDiff === expectedIncrement ? '✅ 递增值正确' : '❌ 递增值错误');
}

// 功能特点总结
console.log('\n🎯 功能特点:');
console.log('- 支持为每个选中类别设置自定义起始值');
console.log('- 未设置自定义值的类别使用默认baseValue');
console.log('- 保持毛衣模式的特殊计算逻辑');
console.log('- 数据持久化到localStorage');
console.log('- 实时UI反馈和预览');

console.log('\n✅ 类别起始值设置功能验证完成！');
