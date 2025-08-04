// Canvas 渲染相关的纯函数

/**
 * 创建尺码表图像
 * @param {Array} sizeData - 尺码数据
 * @param {Object} options - 渲染选项
 * @returns {Promise<string>} 图像的 Data URL
 */
export const renderSizeChart = async (sizeData, options = {}) => {
  const {
    width = 800,
    height = 600,
    backgroundColor = '#ffffff',
    fontFamily = '-apple-system, BlinkMacSystemFont, SF Pro Display, sans-serif',
    fontSize = 14,
    headerFontSize = 16,
    title = '尺码表',
    showGrid = true,
    showTitle = true,
  } = options;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  // 设置背景
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, width, height);

  if (!sizeData || sizeData.length === 0) {
    // 绘制空状态
    ctx.fillStyle = '#6B7280';
    ctx.font = `${fontSize}px ${fontFamily}`;
    ctx.textAlign = 'center';
    ctx.fillText('暂无数据', width / 2, height / 2);
    return canvas.toDataURL();
  }

  // 计算布局
  const padding = 40;
  const titleHeight = showTitle ? 40 : 0;
  const tableTop = padding + titleHeight;
  const tableWidth = width - padding * 2;
  const tableHeight = height - tableTop - padding;

  // 绘制标题
  if (showTitle) {
    ctx.fillStyle = '#111827';
    ctx.font = `bold ${headerFontSize + 4}px ${fontFamily}`;
    ctx.textAlign = 'center';
    ctx.fillText(title, width / 2, padding + 20);
  }

  // 获取表格数据
  const sizes = sizeData[0]?.values?.map((v) => v.size) || [];
  const headers = ['部位', ...sizes];
  const rows = sizeData.map((category) => [
    category.categoryName,
    ...category.values.map((v) => `${v.value}`),
  ]);

  // 计算单元格尺寸
  const cellWidth = tableWidth / headers.length;
  const cellHeight = Math.min(40, tableHeight / (rows.length + 1));

  // 绘制表格
  ctx.strokeStyle = '#E5E7EB';
  ctx.lineWidth = 1;

  // 绘制表头
  ctx.fillStyle = '#F3F4F6';
  ctx.fillRect(padding, tableTop, tableWidth, cellHeight);

  ctx.fillStyle = '#374151';
  ctx.font = `bold ${headerFontSize}px ${fontFamily}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  headers.forEach((header, index) => {
    const x = padding + index * cellWidth + cellWidth / 2;
    const y = tableTop + cellHeight / 2;
    ctx.fillText(header, x, y);

    // 绘制表头边框
    if (showGrid) {
      ctx.strokeRect(
        padding + index * cellWidth,
        tableTop,
        cellWidth,
        cellHeight
      );
    }
  });

  // 绘制数据行
  ctx.font = `${fontSize}px ${fontFamily}`;
  ctx.fillStyle = '#374151';

  rows.forEach((row, rowIndex) => {
    const y = tableTop + (rowIndex + 1) * cellHeight;

    // 交替行背景
    if (rowIndex % 2 === 1) {
      ctx.fillStyle = '#F9FAFB';
      ctx.fillRect(padding, y, tableWidth, cellHeight);
      ctx.fillStyle = '#374151';
    }

    row.forEach((cell, cellIndex) => {
      const x = padding + cellIndex * cellWidth + cellWidth / 2;
      const cellY = y + cellHeight / 2;

      // 第一列（部位名称）左对齐，其他列居中
      if (cellIndex === 0) {
        ctx.textAlign = 'left';
        ctx.fillText(cell, padding + cellIndex * cellWidth + 10, cellY);
      } else {
        ctx.textAlign = 'center';
        ctx.fillText(cell, x, cellY);
      }

      // 绘制单元格边框
      if (showGrid) {
        ctx.strokeRect(
          padding + cellIndex * cellWidth,
          y,
          cellWidth,
          cellHeight
        );
      }
    });
  });

  return canvas.toDataURL();
};

/**
 * 创建图形化尺码图表
 * @param {Array} sizeData - 尺码数据
 * @param {Object} options - 渲染选项
 * @returns {Promise<string>} 图像的 Data URL
 */
export const renderSizeChart2D = async (sizeData, options = {}) => {
  const {
    width = 800,
    height = 600,
    backgroundColor = '#ffffff',
    primaryColor = '#007AFF',
    gridColor = '#E5E7EB',
    textColor = '#374151',
    fontFamily = '-apple-system, BlinkMacSystemFont, SF Pro Display, sans-serif',
    fontSize = 12,
    title = '尺码趋势图',
  } = options;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  // 设置背景
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, width, height);

  if (!sizeData || sizeData.length === 0) {
    ctx.fillStyle = textColor;
    ctx.font = `${fontSize}px ${fontFamily}`;
    ctx.textAlign = 'center';
    ctx.fillText('暂无数据', width / 2, height / 2);
    return canvas.toDataURL();
  }

  // 计算布局
  const padding = 60;
  const titleHeight = 40;
  const chartTop = padding + titleHeight;
  const chartWidth = width - padding * 2;
  const chartHeight = height - chartTop - padding;

  // 绘制标题
  ctx.fillStyle = textColor;
  ctx.font = `bold 18px ${fontFamily}`;
  ctx.textAlign = 'center';
  ctx.fillText(title, width / 2, padding + 20);

  // 获取数据范围
  const allValues = sizeData.flatMap((category) =>
    category.values.map((v) => v.value)
  );
  const minValue = Math.min(...allValues);
  const maxValue = Math.max(...allValues);
  const valueRange = maxValue - minValue;

  // 绘制坐标轴
  ctx.strokeStyle = gridColor;
  ctx.lineWidth = 1;

  // Y轴
  ctx.beginPath();
  ctx.moveTo(padding, chartTop);
  ctx.lineTo(padding, chartTop + chartHeight);
  ctx.stroke();

  // X轴
  ctx.beginPath();
  ctx.moveTo(padding, chartTop + chartHeight);
  ctx.lineTo(padding + chartWidth, chartTop + chartHeight);
  ctx.stroke();

  // 绘制网格线和刻度
  const sizes = sizeData[0]?.values?.map((v) => v.size) || [];
  const stepX = chartWidth / (sizes.length - 1);

  sizes.forEach((size, index) => {
    const x = padding + index * stepX;

    // 垂直网格线
    ctx.strokeStyle = gridColor;
    ctx.setLineDash([2, 2]);
    ctx.beginPath();
    ctx.moveTo(x, chartTop);
    ctx.lineTo(x, chartTop + chartHeight);
    ctx.stroke();
    ctx.setLineDash([]);

    // X轴标签
    ctx.fillStyle = textColor;
    ctx.font = `${fontSize}px ${fontFamily}`;
    ctx.textAlign = 'center';
    ctx.fillText(size, x, chartTop + chartHeight + 20);
  });

  // 绘制Y轴刻度
  const stepCount = 5;
  for (let i = 0; i <= stepCount; i++) {
    const value = minValue + (valueRange / stepCount) * i;
    const y = chartTop + chartHeight - (i / stepCount) * chartHeight;

    // 水平网格线
    ctx.strokeStyle = gridColor;
    ctx.setLineDash([2, 2]);
    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(padding + chartWidth, y);
    ctx.stroke();
    ctx.setLineDash([]);

    // Y轴标签
    ctx.fillStyle = textColor;
    ctx.font = `${fontSize}px ${fontFamily}`;
    ctx.textAlign = 'right';
    ctx.fillText(Math.round(value), padding - 10, y + 4);
  }

  // 绘制数据线
  const colors = [
    '#007AFF',
    '#FF3B30',
    '#34C759',
    '#FF9500',
    '#5856D6',
    '#AF52DE',
    '#FF2D92',
    '#A2845E',
  ];

  sizeData.forEach((category, categoryIndex) => {
    const color = colors[categoryIndex % colors.length];
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 2;

    // 绘制线条
    ctx.beginPath();
    category.values.forEach((valueData, index) => {
      const x = padding + index * stepX;
      const y =
        chartTop +
        chartHeight -
        ((valueData.value - minValue) / valueRange) * chartHeight;

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();

    // 绘制数据点
    category.values.forEach((valueData, index) => {
      const x = padding + index * stepX;
      const y =
        chartTop +
        chartHeight -
        ((valueData.value - minValue) / valueRange) * chartHeight;

      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
    });
  });

  // 绘制图例
  const legendTop = chartTop + chartHeight + 40;
  const legendItemWidth = 100;
  const legendStartX = (width - sizeData.length * legendItemWidth) / 2;

  sizeData.forEach((category, index) => {
    const color = colors[index % colors.length];
    const x = legendStartX + index * legendItemWidth;

    // 图例色块
    ctx.fillStyle = color;
    ctx.fillRect(x, legendTop, 12, 12);

    // 图例文字
    ctx.fillStyle = textColor;
    ctx.font = `${fontSize}px ${fontFamily}`;
    ctx.textAlign = 'left';
    ctx.fillText(category.categoryName, x + 20, legendTop + 9);
  });

  return canvas.toDataURL();
};

/**
 * 下载图像
 * @param {string} dataUrl - 图像的 Data URL
 * @param {string} filename - 文件名
 */
export const downloadImage = (dataUrl, filename = 'size-chart.png') => {
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * 复制图像到剪贴板
 * @param {string} dataUrl - 图像的 Data URL
 * @returns {Promise<boolean>} 是否成功
 */
export const copyImageToClipboard = async (dataUrl) => {
  try {
    // 将 Data URL 转换为 Blob
    const response = await fetch(dataUrl);
    const blob = await response.blob();

    // 写入剪贴板
    await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);

    return true;
  } catch (error) {
    console.error('复制图像失败:', error);
    return false;
  }
};

/**
 * 生成尺码表数据和样式配置
 */
export const generateSizeChart = async (categories, settings) => {
  const { startSize, count } = settings;

  // 生成尺码序列
  const sizes = generateSizeSequence(startSize, count);

  // 构建表格数据
  const headers = ['类别', ...sizes];
  const data = [headers];

  // 为每个类别计算对应的尺寸数据
  categories.forEach((category) => {
    const row = [category.name];
    sizes.forEach((size, index) => {
      const value = category.baseValue + index * category.baseIncrement;
      row.push(value);
    });
    data.push(row);
  });

  return {
    title: '尺码表',
    data,
    categories,
    sizes,
    settings,
    dimensions: {
      width: Math.max(800, data[0].length * 100),
      height: Math.max(400, data.length * 50 + 100),
    },
    createdAt: new Date().toISOString(),
  };
};

/**
 * 将画布导出为图片
 */
export const exportToImage = async (canvas, format = 'png') => {
  return new Promise((resolve, reject) => {
    try {
      const dataUrl = canvas.toDataURL(`image/${format}`, 1.0);
      resolve(dataUrl);
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * 导出为 Excel 文件
 */
export const exportToExcel = async (chartData, categories, settings) => {
  // 创建简单的 CSV 格式数据，模拟 Excel 导出
  const csvContent = chartData.data
    .map((row) => row.map((cell) => `"${cell}"`).join(','))
    .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `尺码表_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
};

/**
 * 生成尺码序列
 */
const generateSizeSequence = (startSize, count) => {
  const sizeMap = {
    XXS: 0,
    XS: 1,
    S: 2,
    M: 3,
    L: 4,
    XL: 5,
    XXL: 6,
    XXXL: 7,
  };

  const sizeArray = Object.keys(sizeMap);
  const startIndex = sizeMap[startSize] || 2; // 默认从 S 开始

  const result = [];
  for (let i = 0; i < count; i++) {
    const index = startIndex + i;
    if (index < sizeArray.length) {
      result.push(sizeArray[index]);
    } else {
      // 超出范围时使用数字编号
      result.push(`Size${index + 1}`);
    }
  }

  return result;
};
