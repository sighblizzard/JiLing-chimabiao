/**
 * Excel 导出服务
 * 
 * 功能：
 * - 导出尺码表到 Excel 文件
 * - 支持多种导出格式
 * - 自定义样式和格式
 * - 批量导出功能
 */

const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');

class ExcelExporter {
  constructor() {
    this.workbook = null;
  }

  /**
   * 导出单个尺码表到 Excel
   * @param {Object} sizeChart - 尺码表数据
   * @param {string} exportPath - 导出路径
   * @param {Object} options - 导出选项
   */
  async exportSizeChart(sizeChart, exportPath, options = {}) {
    try {
      this.workbook = new ExcelJS.Workbook();
      
      // 设置工作簿属性
      this.workbook.creator = '尺码表生成器';
      this.workbook.lastModifiedBy = '尺码表生成器';
      this.workbook.created = new Date();
      this.workbook.modified = new Date();

      // 创建工作表
      const worksheet = this.workbook.addWorksheet(sizeChart.name || '尺码表', {
        pageSetup: {
          paperSize: 9, // A4
          orientation: 'landscape'
        }
      });

      // 准备数据
      const { headers, rows } = this.prepareSizeChartData(sizeChart, options);

      // 设置标题
      if (options.includeTitle !== false) {
        worksheet.mergeCells('A1', `${String.fromCharCode(65 + headers.length - 1)}1`);
        const titleCell = worksheet.getCell('A1');
        titleCell.value = sizeChart.name || '尺码表';
        titleCell.font = { size: 16, bold: true };
        titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
        titleCell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFE6F3FF' }
        };
      }

      // 设置表头
      const headerRow = worksheet.addRow(headers);
      headerRow.font = { bold: true };
      headerRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFF2F2F2' }
      };

      // 添加数据行
      rows.forEach(row => {
        const dataRow = worksheet.addRow(row);
        // 为数值列设置数字格式
        dataRow.eachCell((cell, colNumber) => {
          if (colNumber > 1 && typeof cell.value === 'number') {
            cell.numFmt = '0.0';
          }
        });
      });

      // 设置列宽
      this.autoSizeColumns(worksheet);

      // 应用表格样式
      this.applyTableStyle(worksheet, headers.length, rows.length + 1);

      // 添加备注信息
      if (options.includeNotes !== false) {
        this.addNotesSection(worksheet, sizeChart, headers.length);
      }

      // 保存文件
      await this.workbook.xlsx.writeFile(exportPath);

      return {
        success: true,
        message: '导出成功',
        filePath: exportPath
      };

    } catch (error) {
      console.error('Excel导出失败:', error);
      return {
        success: false,
        message: '导出失败: ' + error.message,
        error: error
      };
    }
  }

  /**
   * 批量导出多个尺码表
   * @param {Array} sizeCharts - 尺码表数组
   * @param {string} exportPath - 导出路径
   * @param {Object} options - 导出选项
   */
  async exportMultipleSizeCharts(sizeCharts, exportPath, options = {}) {
    try {
      this.workbook = new ExcelJS.Workbook();
      
      // 设置工作簿属性
      this.workbook.creator = '尺码表生成器';
      this.workbook.created = new Date();

      // 为每个尺码表创建工作表
      for (let i = 0; i < sizeCharts.length; i++) {
        const sizeChart = sizeCharts[i];
        const worksheetName = sizeChart.name || `尺码表${i + 1}`;
        
        const worksheet = this.workbook.addWorksheet(worksheetName, {
          pageSetup: {
            paperSize: 9, // A4
            orientation: 'landscape'
          }
        });

        // 准备数据
        const { headers, rows } = this.prepareSizeChartData(sizeChart, options);

        // 设置标题
        worksheet.mergeCells('A1', `${String.fromCharCode(65 + headers.length - 1)}1`);
        const titleCell = worksheet.getCell('A1');
        titleCell.value = worksheetName;
        titleCell.font = { size: 16, bold: true };
        titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
        titleCell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFE6F3FF' }
        };

        // 设置表头
        const headerRow = worksheet.addRow(headers);
        headerRow.font = { bold: true };
        headerRow.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFF2F2F2' }
        };

        // 添加数据行
        rows.forEach(row => {
          const dataRow = worksheet.addRow(row);
          dataRow.eachCell((cell, colNumber) => {
            if (colNumber > 1 && typeof cell.value === 'number') {
              cell.numFmt = '0.0';
            }
          });
        });

        // 设置列宽和样式
        this.autoSizeColumns(worksheet);
        this.applyTableStyle(worksheet, headers.length, rows.length + 1);
        
        // 添加备注
        this.addNotesSection(worksheet, sizeChart, headers.length);
      }

      // 保存文件
      await this.workbook.xlsx.writeFile(exportPath);

      return {
        success: true,
        message: `成功导出 ${sizeCharts.length} 个尺码表`,
        filePath: exportPath
      };

    } catch (error) {
      console.error('批量导出失败:', error);
      return {
        success: false,
        message: '批量导出失败: ' + error.message,
        error: error
      };
    }
  }

  /**
   * 准备尺码表数据
   * @param {Object} sizeChart - 尺码表数据
   * @param {Object} options - 选项
   */
  prepareSizeChartData(sizeChart, options) {
    const { items = [] } = sizeChart;
    
    if (items.length === 0) {
      return {
        headers: ['类别', 'S', 'M', 'L', 'XL'],
        rows: []
      };
    }

    // 获取所有尺码
    const sizes = [...new Set(items.map(item => item.size))];
    sizes.sort((a, b) => {
      const sizeOrder = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL'];
      return sizeOrder.indexOf(a) - sizeOrder.indexOf(b);
    });

    // 获取所有类别
    const categories = [...new Set(items.map(item => ({
      id: item.categoryId,
      name: item.categoryName || item.categoryId,
      unit: item.unit || 'cm'
    })))];

    // 构建表头
    const headers = ['类别/尺码', ...sizes];

    // 构建数据行
    const rows = categories.map(category => {
      const row = [`${category.name} (${category.unit})`];
      
      sizes.forEach(size => {
        const item = items.find(i => 
          i.categoryId === category.id && i.size === size
        );
        row.push(item ? item.value : '');
      });
      
      return row;
    });

    return { headers, rows };
  }

  /**
   * 自动调整列宽
   * @param {Object} worksheet - 工作表
   */
  autoSizeColumns(worksheet) {
    worksheet.columns.forEach((column, index) => {
      let maxLength = 0;
      
      column.eachCell({ includeEmpty: true }, (cell) => {
        const cellValue = cell.value ? cell.value.toString() : '';
        if (cellValue.length > maxLength) {
          maxLength = cellValue.length;
        }
      });
      
      // 设置最小宽度为10，最大宽度为50
      column.width = Math.max(10, Math.min(maxLength + 2, 50));
    });
  }

  /**
   * 应用表格样式
   * @param {Object} worksheet - 工作表
   * @param {number} columnCount - 列数
   * @param {number} rowCount - 行数
   */
  applyTableStyle(worksheet, columnCount, rowCount) {
    // 添加边框
    const range = `A2:${String.fromCharCode(65 + columnCount - 1)}${rowCount + 1}`;
    
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber >= 2) {
        row.eachCell((cell) => {
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          };
          
          // 数据行的对齐方式
          if (rowNumber > 2) {
            cell.alignment = { horizontal: 'center', vertical: 'middle' };
          }
        });
      }
    });

    // 冻结表头
    worksheet.views = [
      { state: 'frozen', ySplit: 2 }
    ];
  }

  /**
   * 添加备注信息
   * @param {Object} worksheet - 工作表
   * @param {Object} sizeChart - 尺码表数据
   * @param {number} columnCount - 列数
   */
  addNotesSection(worksheet, sizeChart, columnCount) {
    const lastRow = worksheet.rowCount;
    
    // 添加空行
    worksheet.addRow([]);
    
    // 添加备注标题
    const notesRow = worksheet.addRow(['备注信息']);
    notesRow.getCell(1).font = { bold: true, size: 12 };
    
    // 添加生成信息
    worksheet.addRow(['生成时间:', new Date().toLocaleString('zh-CN')]);
    
    if (sizeChart.description) {
      worksheet.addRow(['描述:', sizeChart.description]);
    }
    
    worksheet.addRow(['说明:', '单位为厘米(cm)，数据仅供参考']);
    
    // 为备注区域设置样式
    const notesStartRow = lastRow + 2;
    const notesEndRow = worksheet.rowCount;
    
    for (let row = notesStartRow; row <= notesEndRow; row++) {
      const currentRow = worksheet.getRow(row);
      currentRow.getCell(1).font = { italic: true };
      currentRow.getCell(1).alignment = { horizontal: 'left' };
    }
  }

  /**
   * 生成导出文件名
   * @param {string} chartName - 尺码表名称
   * @param {string} format - 文件格式
   */
  generateFileName(chartName, format = 'xlsx') {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const safeName = chartName.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '_');
    return `${safeName}_${timestamp}.${format}`;
  }

  /**
   * 确保导出目录存在
   * @param {string} dirPath - 目录路径
   */
  ensureExportDirectory(dirPath) {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }

  /**
   * 导出模板文件
   * @param {string} exportPath - 导出路径
   * @param {Array} categories - 类别数据
   */
  async exportTemplate(exportPath, categories) {
    try {
      this.workbook = new ExcelJS.Workbook();
      this.workbook.creator = '尺码表生成器';
      
      const worksheet = this.workbook.addWorksheet('尺码表模板');
      
      // 设置标题
      worksheet.mergeCells('A1:F1');
      const titleCell = worksheet.getCell('A1');
      titleCell.value = '尺码表模板';
      titleCell.font = { size: 16, bold: true };
      titleCell.alignment = { horizontal: 'center' };
      titleCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE6F3FF' }
      };

      // 设置表头
      const headers = ['类别/尺码', 'S', 'M', 'L', 'XL', '2XL'];
      const headerRow = worksheet.addRow(headers);
      headerRow.font = { bold: true };
      headerRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFF2F2F2' }
      };

      // 添加类别行
      categories.forEach(category => {
        const row = [`${category.name} (${category.unit})`];
        headers.slice(1).forEach(() => row.push(''));
        worksheet.addRow(row);
      });

      // 设置样式
      this.autoSizeColumns(worksheet);
      this.applyTableStyle(worksheet, headers.length, categories.length + 1);

      // 添加说明
      worksheet.addRow([]);
      worksheet.addRow(['使用说明:']);
      worksheet.addRow(['1. 在对应的尺码列中填入数值']);
      worksheet.addRow(['2. 保存后可导入到应用中']);
      worksheet.addRow(['3. 单位统一使用厘米(cm)']);

      await this.workbook.xlsx.writeFile(exportPath);

      return {
        success: true,
        message: '模板导出成功',
        filePath: exportPath
      };

    } catch (error) {
      return {
        success: false,
        message: '模板导出失败: ' + error.message,
        error: error
      };
    }
  }
}

module.exports = ExcelExporter;
