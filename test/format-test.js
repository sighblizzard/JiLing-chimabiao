// 测试尺码表格式转换功能
import { formatSizeDataForTable } from '../src/services/sizeCalculator.js';

// 模拟输入数据（当前系统格式）
const mockSizeData = [
  {
    categoryId: 'chest',
    categoryName: '胸围', 
    values: [
      { size: 'S', value: 88 },
      { size: 'M', value: 92 },
      { size: 'L', value: 96 },
      { size: 'XL', value: 100 }
    ]
  },
  {
    categoryId: 'waist',
    categoryName: '腰围',
    values: [
      { size: 'S', value: 78 },
      { size: 'M', value: 82 },
      { size: 'L', value: 86 },
      { size: 'XL', value: 90 }
    ]
  },
  {
    categoryId: 'sleeve',
    categoryName: '袖长',
    values: [
      { size: 'S', value: 60 },
      { size: 'M', value: 61 },
      { size: 'L', value: 62 },
      { size: 'XL', value: 63 }
    ]
  }
];

console.log('=== 尺码表格式转换测试 ===');
console.log('输入数据格式：');
console.log(JSON.stringify(mockSizeData, null, 2));

const result = formatSizeDataForTable(mockSizeData);
console.log('\n输出表格格式：');
console.log('表头：', result.headers);
console.log('数据行：');
result.rows.forEach((row, index) => {
  console.log(`第${index + 1}行：`, row);
});

// 验证期望的格式
console.log('\n=== 格式验证 ===');
console.log('✓ 第一列应该是尺码:', result.headers[0] === '尺码');
console.log('✓ 第一行应该包含类别:', result.headers.includes('胸围') && result.headers.includes('腰围') && result.headers.includes('袖长'));
console.log('✓ 数据行第一列应该是尺码值:', result.rows[0][0] === 'S');

// 转换为导出格式
const exportData = result.rows.map(row => {
  const obj = {};
  result.headers.forEach((header, index) => {
    obj[header] = row[index] || '';
  });
  return obj;
});

console.log('\n=== 导出格式 ===');
console.log(JSON.stringify(exportData, null, 2));

console.log('\n=== 预期表格效果 ===');
console.log('| 尺码 | 胸围 | 腰围 | 袖长 |');
console.log('|------|------|------|------|');
exportData.forEach(row => {
  console.log(`| ${row['尺码'].padEnd(4)} | ${row['胸围'].padEnd(4)} | ${row['腰围'].padEnd(4)} | ${row['袖长'].padEnd(4)} |`);
});
