/**
 * 尺码表导出服务
 * 生成600x600白色背景的尺码表图片
 */

// 画布配置
const CANVAS_CONFIG = {
  width: 600,
  height: 600,
  backgroundColor: '#FFFFFF',
  padding: 40, // 画布边距
};

// 单元格配置
const CELL_CONFIG = {
  aspectRatio: 10 / 6, // 宽高比 10:6
  minWidth: 60,
  minHeight: 36,
  borderWidth: 1,
  borderColor: '#CCCCCC',
};

// 样式配置
const STYLES = {
  header: {
    backgroundColor: '#000000',
    textColor: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cell: {
    backgroundColor: '#FFFFFF',
    textColor: '#333333',
    fontSize: 14,
    fontWeight: 'normal',
    textAlign: 'center',
  },
  footer: {
    backgroundColor: '#F5F5F5',
    textColor: '#666666',
    fontSize: 12,
    fontWeight: 'normal',
    textAlign: 'center',
  }
};

/**
 * 计算表格尺寸和位置
 * @param {Array} data - 尺码表数据
 * @returns {Object} 表格布局信息
 */
export const calculateTableLayout = (data) => {
  if (!data || data.length === 0) return null;

  const rows = data.length + 2; // 数据行 + 表头 + 温馨提示
  const cols = Object.keys(data[0]).length; // 列数
  
  // 计算可用空间
  const availableWidth = CANVAS_CONFIG.width - (CANVAS_CONFIG.padding * 2);
  const availableHeight = CANVAS_CONFIG.height - (CANVAS_CONFIG.padding * 2);
  
  // 计算最优单元格尺寸
  let cellWidth, cellHeight;
  
  // 方案1：按宽度铺满计算
  const widthBasedCellWidth = availableWidth / cols;
  const widthBasedCellHeight = widthBasedCellWidth / CELL_CONFIG.aspectRatio;
  const widthBasedTableHeight = widthBasedCellHeight * rows;
  
  // 方案2：按高度铺满计算
  const heightBasedCellHeight = availableHeight / rows;
  const heightBasedCellWidth = heightBasedCellHeight * CELL_CONFIG.aspectRatio;
  const heightBasedTableWidth = heightBasedCellWidth * cols;
  
  // 选择合适的方案（不超出画布边界）
  if (widthBasedTableHeight <= availableHeight) {
    // 左右铺满
    cellWidth = widthBasedCellWidth;
    cellHeight = widthBasedCellHeight;
  } else {
    // 上下铺满
    cellWidth = heightBasedCellWidth;
    cellHeight = heightBasedCellHeight;
  }
  
  // 确保最小尺寸
  cellWidth = Math.max(cellWidth, CELL_CONFIG.minWidth);
  cellHeight = Math.max(cellHeight, CELL_CONFIG.minHeight);
  
  const tableWidth = cellWidth * cols;
  const tableHeight = cellHeight * rows;
  
  // 计算居中位置
  const startX = (CANVAS_CONFIG.width - tableWidth) / 2;
  const startY = (CANVAS_CONFIG.height - tableHeight) / 2;
  
  return {
    cellWidth,
    cellHeight,
    tableWidth,
    tableHeight,
    startX,
    startY,
    rows,
    cols
  };
};

/**
 * 绘制表格边框
 * @param {CanvasRenderingContext2D} ctx 
 * @param {Object} layout 
 */
const drawTableBorder = (ctx, layout) => {
  const { startX, startY, tableWidth, tableHeight, cellWidth, cellHeight, rows, cols } = layout;
  
  ctx.strokeStyle = CELL_CONFIG.borderColor;
  ctx.lineWidth = CELL_CONFIG.borderWidth;
  
  // 绘制外边框
  ctx.strokeRect(startX, startY, tableWidth, tableHeight);
  
  // 绘制垂直线
  for (let i = 1; i < cols; i++) {
    const x = startX + (cellWidth * i);
    ctx.beginPath();
    ctx.moveTo(x, startY);
    ctx.lineTo(x, startY + tableHeight);
    ctx.stroke();
  }
  
  // 绘制水平线
  for (let i = 1; i < rows; i++) {
    const y = startY + (cellHeight * i);
    ctx.beginPath();
    ctx.moveTo(startX, y);
    ctx.lineTo(startX + tableWidth, y);
    ctx.stroke();
  }
};

/**
 * 绘制单元格
 * @param {CanvasRenderingContext2D} ctx 
 * @param {Object} layout 
 * @param {number} row 
 * @param {number} col 
 * @param {string} text 
 * @param {Object} style 
 */
const drawCell = (ctx, layout, row, col, text, style) => {
  const { startX, startY, cellWidth, cellHeight } = layout;
  
  const x = startX + (col * cellWidth);
  const y = startY + (row * cellHeight);
  
  // 绘制背景
  ctx.fillStyle = style.backgroundColor;
  ctx.fillRect(x, y, cellWidth, cellHeight);
  
  // 绘制文字
  ctx.fillStyle = style.textColor;
  ctx.font = `${style.fontWeight} ${style.fontSize}px -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif`;
  ctx.textAlign = style.textAlign;
  ctx.textBaseline = 'middle';
  
  const textX = x + cellWidth / 2;
  const textY = y + cellHeight / 2;
  
  ctx.fillText(text, textX, textY);
};

/**
 * 绘制温馨提示行（合并整行）
 * @param {CanvasRenderingContext2D} ctx 
 * @param {Object} layout 
 * @param {string} tipText 
 */
const drawTipRow = (ctx, layout, tipText) => {
  const { startX, startY, tableWidth, cellHeight, rows } = layout;
  
  const y = startY + ((rows - 1) * cellHeight); // 最后一行
  
  // 绘制背景
  ctx.fillStyle = STYLES.footer.backgroundColor;
  ctx.fillRect(startX, y, tableWidth, cellHeight);
  
  // 绘制文字
  ctx.fillStyle = STYLES.footer.textColor;
  ctx.font = `${STYLES.footer.fontWeight} ${STYLES.footer.fontSize}px -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif`;
  ctx.textAlign = STYLES.footer.textAlign;
  ctx.textBaseline = 'middle';
  
  const textX = startX + tableWidth / 2;
  const textY = y + cellHeight / 2;
  
  ctx.fillText(tipText, textX, textY);
};

/**
 * 导出尺码表为图片
 * @param {Array} data - 尺码表数据
 * @param {string} tipText - 温馨提示文字
 * @returns {string} 图片的 base64 数据
 */
export const exportSizeTableToImage = (data, tipText = "温馨提示：由于手工测量会存在1-3cm误差，属于正常范围") => {
  // 创建画布
  const canvas = document.createElement('canvas');
  canvas.width = CANVAS_CONFIG.width;
  canvas.height = CANVAS_CONFIG.height;
  const ctx = canvas.getContext('2d');
  
  // 绘制白色背景
  ctx.fillStyle = CANVAS_CONFIG.backgroundColor;
  ctx.fillRect(0, 0, CANVAS_CONFIG.width, CANVAS_CONFIG.height);
  
  // 计算布局
  const layout = calculateTableLayout(data);
  if (!layout) return null;
  
  // 绘制表格边框
  drawTableBorder(ctx, layout);
  
  // 绘制表头
  const headers = Object.keys(data[0]);
  headers.forEach((header, col) => {
    drawCell(ctx, layout, 0, col, header, STYLES.header);
  });
  
  // 绘制数据行
  data.forEach((row, rowIndex) => {
    headers.forEach((header, col) => {
      const value = row[header];
      drawCell(ctx, layout, rowIndex + 1, col, String(value), STYLES.cell);
    });
  });
  
  // 绘制温馨提示行
  drawTipRow(ctx, layout, tipText);
  
  // 返回图片数据
  return canvas.toDataURL('image/jpeg', 0.9);
};

/**
 * 下载图片
 * @param {string} dataUrl - 图片的 base64 数据
 * @param {string} filename - 文件名
 */
export const downloadImage = (dataUrl, filename = 'size-chart.jpg') => {
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * 示例数据格式
 */
export const sampleData = [
  { '尺码': 'S', '胸围': '109', '肩宽': '35', '胸围': '78', '袖长': '11' },
  { '尺码': 'M', '胸围': '110', '肩宽': '36', '胸围': '82', '袖长': '12' },
  { '尺码': 'L', '胸围': '111', '肩宽': '37', '胸围': '86', '袖长': '13' },
  { '尺码': 'XL', '胸围': '112', '肩宽': '38', '胸围': '90', '袖长': '14' }
];
