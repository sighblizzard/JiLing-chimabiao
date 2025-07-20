// 数据管理相关的纯函数

/**
 * 预设类别数据
 */
export const presetCategories = [
  {
    id: 'chest',
    name: '胸围',
    type: 'chest',
    baseValue: 88,
    baseIncrement: 4,
    isCustom: false,
    description: '胸部最丰满处的水平围长',
    iconUrl: null // 预留图标字段
  },
  {
    id: 'waist',
    name: '腰围',
    type: 'waist',
    baseValue: 68,
    baseIncrement: 4,
    isCustom: false,
    description: '腰部最细处的水平围长',
    iconUrl: null // 预留图标字段
  },
  {
    id: 'hip',
    name: '臀围',
    type: 'hip',
    baseValue: 92,
    baseIncrement: 4,
    isCustom: false,
    description: '臀部最丰满处的水平围长',
    iconUrl: null // 预留图标字段
  },
  {
    id: 'hem',
    name: '下摆围',
    type: 'hem',
    baseValue: 90,
    baseIncrement: 4,
    isCustom: false,
    description: '下摆处的水平围长',
    iconUrl: null // 预留图标字段
  },
  {
    id: 'shoulder',
    name: '肩宽',
    type: 'shoulder',
    baseValue: 38,
    baseIncrement: 1,
    isCustom: false,
    description: '两肩点之间的直线距离',
    iconUrl: null // 预留图标字段
  },
  {
    id: 'sleeve',
    name: '袖长',
    type: 'sleeve',
    baseValue: 58,
    baseIncrement: 1,
    isCustom: false,
    description: '肩点到袖口的长度',
    iconUrl: null // 预留图标字段
  },
  {
    id: 'shoulderSleeve',
    name: '肩袖长',
    type: 'shoulderSleeve',
    baseValue: 22,
    baseIncrement: 1,
    isCustom: false,
    description: '肩缝到袖口的长度',
    iconUrl: null // 预留图标字段
  },
  {
    id: 'length',
    name: '衣长',
    type: 'length',
    baseValue: 65,
    baseIncrement: 1,
    isCustom: false,
    description: '后中心领窝点到下摆的长度',
    iconUrl: null // 预留图标字段
  },
  {
    id: 'pantLength',
    name: '裤长',
    type: 'pantLength',
    baseValue: 100,
    baseIncrement: 1,
    isCustom: false,
    description: '裤腰到裤脚的长度',
    iconUrl: null // 预留图标字段
  },
  {
    id: 'skirtLength',
    name: '裙长',
    type: 'skirtLength',
    baseValue: 60,
    baseIncrement: 1,
    isCustom: false,
    description: '裙腰到裙摆的长度',
    iconUrl: null // 预留图标字段
  },
  {
    id: 'backLength',
    name: '中后长',
    type: 'backLength',
    baseValue: 38,
    baseIncrement: 1,
    isCustom: false,
    description: '后中心领窝点到腰线的长度',
    iconUrl: null // 预留图标字段
  },
  {
    id: 'frontLength',
    name: '中前长',
    type: 'frontLength',
    baseValue: 36,
    baseIncrement: 1,
    isCustom: false,
    description: '前中心领窝点到腰线的长度',
    iconUrl: null // 预留图标字段
  }
];

/**
 * 创建新类别
 * @param {Object} categoryData - 类别数据
 * @returns {Object} 新类别对象
 */
export const createCategory = (categoryData) => {
  const { name, type, baseValue, baseIncrement, description, iconUrl } = categoryData;
  
  if (!name || !type || baseValue === undefined || baseIncrement === undefined) {
    throw new Error('缺少必要的类别信息');
  }
  
  return {
    id: `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name: name.trim(),
    type: type.toLowerCase(),
    baseValue: Number(baseValue),
    baseIncrement: Number(baseIncrement),
    isCustom: true,
    description: description || '',
    iconUrl: iconUrl || null, // 图标URL，可选
    createdAt: new Date().toISOString()
  };
};

/**
 * 验证类别数据
 * @param {Object} categoryData - 类别数据
 * @returns {Object} 验证结果
 */
export const validateCategory = (categoryData) => {
  const { name, baseValue, baseIncrement } = categoryData;
  const errors = {};
  
  if (!name || name.trim().length === 0) {
    errors.name = '类别名称不能为空';
  } else if (name.trim().length > 20) {
    errors.name = '类别名称不能超过20个字符';
  }
  
  // 移除类型验证，类型将自动根据名称判断
  
  if (baseValue === undefined || baseValue === '') {
    errors.baseValue = '基础数值不能为空';
  } else if (isNaN(Number(baseValue)) || Number(baseValue) <= 0) {
    errors.baseValue = '基础数值必须是大于0的数字';
  }
  
  if (baseIncrement === undefined || baseIncrement === '') {
    errors.baseIncrement = '递增数值不能为空';
  } else if (isNaN(Number(baseIncrement)) || Number(baseIncrement) <= 0) {
    errors.baseIncrement = '递增数值必须是大于0的数字';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * 更新类别
 * @param {Array} categories - 类别列表
 * @param {string} categoryId - 类别ID
 * @param {Object} updates - 更新数据
 * @returns {Array} 更新后的类别列表
 */
export const updateCategory = (categories, categoryId, updates) => {
  return categories.map(category => {
    if (category.id === categoryId) {
      return {
        ...category,
        ...updates,
        updatedAt: new Date().toISOString()
      };
    }
    return category;
  });
};

/**
 * 删除类别
 * @param {Array} categories - 类别列表
 * @param {string} categoryId - 类别ID
 * @returns {Array} 删除后的类别列表
 */
export const deleteCategory = (categories, categoryId) => {
  return categories.filter(category => category.id !== categoryId);
};

/**
 * 搜索类别
 * @param {Array} categories - 类别列表
 * @param {string} query - 搜索关键词
 * @returns {Array} 搜索结果
 */
export const searchCategories = (categories, query) => {
  if (!query || query.trim().length === 0) {
    return categories;
  }
  
  const searchTerm = query.toLowerCase().trim();
  
  return categories.filter(category => 
    category.name.toLowerCase().includes(searchTerm) ||
    category.type.toLowerCase().includes(searchTerm) ||
    (category.description && category.description.toLowerCase().includes(searchTerm))
  );
};

/**
 * 按类型分组类别
 * @param {Array} categories - 类别列表
 * @returns {Object} 分组后的类别
 */
export const groupCategoriesByType = (categories) => {
  return categories.reduce((groups, category) => {
    const type = category.type;
    if (!groups[type]) {
      groups[type] = [];
    }
    groups[type].push(category);
    return groups;
  }, {});
};

/**
 * 导入类别数据
 * @param {string} jsonData - JSON格式的类别数据
 * @returns {Array} 导入的类别列表
 */
export const importCategories = (jsonData) => {
  try {
    const data = JSON.parse(jsonData);
    
    if (!Array.isArray(data)) {
      throw new Error('导入数据必须是数组格式');
    }
    
    return data.map(item => {
      const validation = validateCategory(item);
      if (!validation.isValid) {
        throw new Error(`无效的类别数据: ${Object.values(validation.errors).join(', ')}`);
      }
      
      return createCategory(item);
    });
  } catch (error) {
    throw new Error(`导入失败: ${error.message}`);
  }
};

/**
 * 导出类别数据
 * @param {Array} categories - 类别列表
 * @returns {string} JSON格式的类别数据
 */
export const exportCategories = (categories) => {
  const exportData = categories.map(category => ({
    name: category.name,
    type: category.type,
    baseValue: category.baseValue,
    baseIncrement: category.baseIncrement,
    description: category.description
  }));
  
  return JSON.stringify(exportData, null, 2);
};

/**
 * 本地存储管理
 */
export const storage = {
  // 保存数据到本地存储
  save: (key, data) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('保存数据失败:', error);
      return false;
    }
  },
  
  // 从本地存储加载数据
  load: (key, defaultValue = null) => {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch (error) {
      console.error('加载数据失败:', error);
      return defaultValue;
    }
  },
  
  // 删除本地存储数据
  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('删除数据失败:', error);
      return false;
    }
  },
  
  // 清空所有本地存储
  clear: () => {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('清空数据失败:', error);
      return false;
    }
  }
};
