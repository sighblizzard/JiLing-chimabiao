// 尺码计算相关的纯函数

/**
 * 生成尺码序列
 * @param {string} startSize - 起始尺码
 * @param {number} count - 尺码数量
 * @returns {string[]} 尺码序列
 */
export const generateSizeSequence = (startSize, count) => {
  const sizes = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL'];
  const startIndex = sizes.indexOf(startSize);

  if (startIndex === -1) {
    throw new Error(`无效的起始尺码: ${startSize}`);
  }

  if (startIndex + count > sizes.length) {
    return sizes.slice(startIndex);
  }

  return sizes.slice(startIndex, startIndex + count);
};

/**
 * 计算尺码数据
 * @param {Object} sizeSettings - 尺码设置
 * @param {Array} selectedCategories - 选中的类别
 * @param {string} mode - 计算模式 (normal, sweater)
 * @param {Object} categoryStartValues - 类别自定义起始值
 * @returns {Array} 计算后的尺码数据
 */
export const calculateSizeData = (
  sizeSettings,
  selectedCategories,
  mode = 'normal',
  categoryStartValues = {}
) => {
  const { startSize, count } = sizeSettings;
  const sizeSequence = generateSizeSequence(startSize, count);

  return selectedCategories.map((category) => {
    // 根据模式调整递增值
    let increment = category.baseIncrement;

    if (mode === 'sweater' && category.baseIncrement >= 4) {
      // 毛衣模式下，递增值≥4cm的类别进行减半处理
      increment = category.baseIncrement / 2;
    }

    // 使用自定义起始值或默认基础值
    const savedStartValue = categoryStartValues[category.id];
    let startValue = category.baseValue; // 默认值

    if (savedStartValue !== undefined) {
      // 如果有保存的值，确保它是有效数字
      const numValue =
        typeof savedStartValue === 'string'
          ? parseFloat(savedStartValue)
          : savedStartValue;
      if (!isNaN(numValue) && numValue > 0) {
        startValue = numValue;
      }
    }

    // 计算每个尺码的数值
    const values = sizeSequence.map((size, index) => ({
      size,
      value: Math.round((startValue + increment * index) * 10) / 10,
      category: category.name,
    }));

    return {
      categoryId: category.id,
      categoryName: category.name,
      categoryType: category.type,
      values,
    };
  });
};

/**
 * 验证尺码设置
 * @param {Object} sizeSettings - 尺码设置
 * @returns {Object} 验证结果
 */
export const validateSizeSettings = (sizeSettings) => {
  const { startSize, count } = sizeSettings;
  const errors = {};

  if (!startSize) {
    errors.startSize = '请选择起始尺码';
  }

  if (!count || count < 1) {
    errors.count = '尺码数量必须大于0';
  } else if (count > 8) {
    errors.count = '尺码数量不能超过8个';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * 格式化尺码表数据为表格格式（正确格式：第一行是类别，第一列是尺码）
 * @param {Array} sizeData - 尺码数据
 * @returns {Object} 表格格式数据
 */
export const formatSizeDataForTable = (sizeData) => {
  if (!sizeData || sizeData.length === 0) {
    return { headers: [], rows: [] };
  }

  // 获取尺码序列和类别
  const sizes = sizeData[0]?.values?.map((v) => v.size) || [];
  const categories = sizeData.map((category) => category.categoryName);

  // 构建表头：第一个元素是"尺码"，后面是各个测量类别
  const headers = ['尺码', ...categories];

  // 生成表格行数据：每行是一个尺码对应各个类别的数值
  const rows = sizes.map((size) => {
    const row = [size]; // 第一列是尺码

    // 为每个类别添加对应尺码的数值
    categories.forEach((categoryName) => {
      const category = sizeData.find(
        (cat) => cat.categoryName === categoryName
      );
      const valueObj = category?.values?.find((v) => v.size === size);
      row.push(valueObj ? `${valueObj.value}` : '');
    });

    return row;
  });

  return { headers, rows };
};

/**
 * 导出尺码表数据为CSV格式
 * @param {Array} sizeData - 尺码数据
 * @param {string} title - 表格标题
 * @returns {string} CSV格式字符串
 */
export const exportToCSV = (sizeData, title = '尺码表') => {
  const { headers, rows } = formatSizeDataForTable(sizeData);

  let csv = `${title}\n`;
  csv += headers.join(',') + '\n';
  csv += rows.map((row) => row.join(',')).join('\n');

  return csv;
};

/**
 * 计算尺码表统计信息
 * @param {Array} sizeData - 尺码数据
 * @returns {Object} 统计信息
 */
export const calculateStatistics = (sizeData) => {
  if (!sizeData || sizeData.length === 0) {
    return {
      totalCategories: 0,
      totalSizes: 0,
      averageIncrement: 0,
      sizeRange: '',
    };
  }

  const totalCategories = sizeData.length;
  const totalSizes = sizeData[0]?.values?.length || 0;
  const sizeRange =
    totalSizes > 0
      ? `${sizeData[0].values[0].size} - ${sizeData[0].values[totalSizes - 1].size}`
      : '';

  // 计算平均递增值
  let totalIncrement = 0;
  let count = 0;

  sizeData.forEach((category) => {
    if (category.values.length > 1) {
      const increment = category.values[1].value - category.values[0].value;
      totalIncrement += increment;
      count++;
    }
  });

  const averageIncrement =
    count > 0 ? Math.round((totalIncrement / count) * 10) / 10 : 0;

  return {
    totalCategories,
    totalSizes,
    averageIncrement,
    sizeRange,
  };
};
