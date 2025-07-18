/**
 * 数据迁移服务
 * 
 * 功能：
 * - 从现有数据迁移到 SQLite 数据库
 * - 数据备份和恢复
 * - 数据验证和清理
 * - 版本兼容性处理
 */

const fs = require('fs');
const path = require('path');

class DataMigration {
  constructor(database) {
    this.db = database;
  }

  /**
   * 从 JSON 文件迁移数据
   * @param {string} jsonFilePath - JSON 文件路径
   */
  async migrateFromJSON(jsonFilePath) {
    try {
      // 检查文件是否存在
      if (!fs.existsSync(jsonFilePath)) {
        return {
          success: false,
          message: 'JSON 文件不存在'
        };
      }

      // 读取 JSON 数据
      const jsonData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));
      
      // 验证数据结构
      const validation = this.validateJSONData(jsonData);
      if (!validation.isValid) {
        return {
          success: false,
          message: '数据格式验证失败',
          errors: validation.errors
        };
      }

      // 开始迁移
      const migrationResult = await this.performMigration(jsonData);
      
      if (migrationResult.success) {
        // 创建备份
        await this.createBackup(jsonFilePath);
      }

      return migrationResult;

    } catch (error) {
      console.error('JSON迁移失败:', error);
      return {
        success: false,
        message: '迁移失败: ' + error.message,
        error: error
      };
    }
  }

  /**
   * 验证 JSON 数据格式
   * @param {Object} data - 要验证的数据
   */
  validateJSONData(data) {
    const errors = [];

    // 检查基本结构
    if (!data || typeof data !== 'object') {
      errors.push('数据必须是一个对象');
      return { isValid: false, errors };
    }

    // 验证类别数据
    if (data.categories) {
      if (!Array.isArray(data.categories)) {
        errors.push('categories 必须是数组');
      } else {
        data.categories.forEach((category, index) => {
          if (!category.id) {
            errors.push(`类别 ${index} 缺少 id 字段`);
          }
          if (!category.name) {
            errors.push(`类别 ${index} 缺少 name 字段`);
          }
          if (typeof category.baseValue !== 'number') {
            errors.push(`类别 ${index} 的 baseValue 必须是数字`);
          }
          if (typeof category.increment !== 'number') {
            errors.push(`类别 ${index} 的 increment 必须是数字`);
          }
        });
      }
    }

    // 验证尺码表数据
    if (data.sizeCharts) {
      if (!Array.isArray(data.sizeCharts)) {
        errors.push('sizeCharts 必须是数组');
      } else {
        data.sizeCharts.forEach((chart, index) => {
          if (!chart.id) {
            errors.push(`尺码表 ${index} 缺少 id 字段`);
          }
          if (!chart.name) {
            errors.push(`尺码表 ${index} 缺少 name 字段`);
          }
          if (chart.items && !Array.isArray(chart.items)) {
            errors.push(`尺码表 ${index} 的 items 必须是数组`);
          }
        });
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * 执行数据迁移
   * @param {Object} data - 要迁移的数据
   */
  async performMigration(data) {
    const results = {
      categories: { success: 0, failed: 0, errors: [] },
      sizeCharts: { success: 0, failed: 0, errors: [] },
      settings: { success: 0, failed: 0, errors: [] }
    };

    try {
      // 迁移类别数据
      if (data.categories && Array.isArray(data.categories)) {
        for (const category of data.categories) {
          try {
            const result = this.db.createCategory({
              id: category.id,
              name: category.name,
              description: category.description || '',
              baseValue: category.baseValue,
              increment: category.increment,
              unit: category.unit || 'cm',
              sortOrder: category.sortOrder || 0
            });

            if (result.success) {
              results.categories.success++;
            } else {
              results.categories.failed++;
              results.categories.errors.push(`类别 ${category.name}: ${result.message}`);
            }
          } catch (error) {
            results.categories.failed++;
            results.categories.errors.push(`类别 ${category.name}: ${error.message}`);
          }
        }
      }

      // 迁移尺码表数据
      if (data.sizeCharts && Array.isArray(data.sizeCharts)) {
        for (const chart of data.sizeCharts) {
          try {
            const result = this.db.createSizeChart({
              id: chart.id,
              name: chart.name,
              description: chart.description || '',
              items: chart.items || []
            });

            if (result.success) {
              results.sizeCharts.success++;
            } else {
              results.sizeCharts.failed++;
              results.sizeCharts.errors.push(`尺码表 ${chart.name}: ${result.message}`);
            }
          } catch (error) {
            results.sizeCharts.failed++;
            results.sizeCharts.errors.push(`尺码表 ${chart.name}: ${error.message}`);
          }
        }
      }

      // 迁移设置数据
      if (data.settings && typeof data.settings === 'object') {
        for (const [key, value] of Object.entries(data.settings)) {
          try {
            const result = this.db.updateSetting(key, JSON.stringify(value));

            if (result.success) {
              results.settings.success++;
            } else {
              results.settings.failed++;
              results.settings.errors.push(`设置 ${key}: ${result.message}`);
            }
          } catch (error) {
            results.settings.failed++;
            results.settings.errors.push(`设置 ${key}: ${error.message}`);
          }
        }
      }

      // 生成迁移报告
      const totalSuccess = results.categories.success + results.sizeCharts.success + results.settings.success;
      const totalFailed = results.categories.failed + results.sizeCharts.failed + results.settings.failed;

      return {
        success: totalFailed === 0,
        message: `迁移完成。成功: ${totalSuccess}, 失败: ${totalFailed}`,
        details: results,
        summary: {
          totalItems: totalSuccess + totalFailed,
          successCount: totalSuccess,
          failedCount: totalFailed
        }
      };

    } catch (error) {
      return {
        success: false,
        message: '迁移过程中发生错误: ' + error.message,
        error: error,
        details: results
      };
    }
  }

  /**
   * 导出数据到 JSON
   * @param {string} exportPath - 导出路径
   */
  async exportToJSON(exportPath) {
    try {
      // 获取所有数据
      const categoriesResult = this.db.getCategories();
      const chartsResult = this.db.getSizeCharts();

      if (!categoriesResult.success || !chartsResult.success) {
        return {
          success: false,
          message: '获取数据失败'
        };
      }

      // 获取详细的尺码表数据
      const detailedCharts = [];
      for (const chart of chartsResult.data) {
        const detailResult = this.db.getSizeChart(chart.id);
        if (detailResult.success) {
          detailedCharts.push(detailResult.data);
        }
      }

      // 构建导出数据
      const exportData = {
        version: '1.0.0',
        exportDate: new Date().toISOString(),
        categories: categoriesResult.data,
        sizeCharts: detailedCharts,
        metadata: {
          totalCategories: categoriesResult.data.length,
          totalCharts: detailedCharts.length,
          exportedBy: '尺码表生成器'
        }
      };

      // 确保导出目录存在
      const exportDir = path.dirname(exportPath);
      if (!fs.existsSync(exportDir)) {
        fs.mkdirSync(exportDir, { recursive: true });
      }

      // 写入文件
      fs.writeFileSync(exportPath, JSON.stringify(exportData, null, 2), 'utf8');

      return {
        success: true,
        message: '数据导出成功',
        filePath: exportPath,
        summary: {
          categories: exportData.categories.length,
          sizeCharts: exportData.sizeCharts.length
        }
      };

    } catch (error) {
      console.error('JSON导出失败:', error);
      return {
        success: false,
        message: '导出失败: ' + error.message,
        error: error
      };
    }
  }

  /**
   * 创建数据备份
   * @param {string} originalPath - 原始文件路径
   */
  async createBackup(originalPath) {
    try {
      const backupDir = path.join(path.dirname(originalPath), 'backups');
      if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
      }

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
      const originalName = path.basename(originalPath, path.extname(originalPath));
      const backupPath = path.join(backupDir, `${originalName}_backup_${timestamp}.json`);

      fs.copyFileSync(originalPath, backupPath);

      return {
        success: true,
        message: '备份创建成功',
        backupPath: backupPath
      };

    } catch (error) {
      console.error('备份创建失败:', error);
      return {
        success: false,
        message: '备份创建失败: ' + error.message,
        error: error
      };
    }
  }

  /**
   * 从应用状态迁移数据
   * @param {Object} appState - 应用状态数据
   */
  async migrateFromAppState(appState) {
    try {
      // 验证应用状态数据
      if (!appState || typeof appState !== 'object') {
        return {
          success: false,
          message: '无效的应用状态数据'
        };
      }

      const migrationData = {
        categories: [],
        sizeCharts: [],
        settings: {}
      };

      // 转换类别数据
      if (appState.categories && Array.isArray(appState.categories)) {
        migrationData.categories = appState.categories.map(category => ({
          id: category.id,
          name: category.name,
          description: category.description || '',
          baseValue: category.baseValue,
          increment: category.increment,
          unit: category.unit || 'cm',
          sortOrder: category.sortOrder || 0
        }));
      }

      // 转换设置数据
      if (appState.sizeSettings) {
        migrationData.settings.sizeSettings = appState.sizeSettings;
      }

      if (appState.selectedCategories) {
        migrationData.settings.selectedCategories = appState.selectedCategories;
      }

      // 执行迁移
      return await this.performMigration(migrationData);

    } catch (error) {
      console.error('应用状态迁移失败:', error);
      return {
        success: false,
        message: '应用状态迁移失败: ' + error.message,
        error: error
      };
    }
  }

  /**
   * 清理和验证数据库数据
   */
  async cleanupAndValidate() {
    try {
      const results = {
        cleaned: 0,
        validated: 0,
        errors: []
      };

      // 获取所有类别
      const categoriesResult = this.db.getCategories();
      if (categoriesResult.success) {
        for (const category of categoriesResult.data) {
          // 验证数值范围
          if (category.baseValue <= 0 || category.increment <= 0) {
            results.errors.push(`类别 ${category.name} 的数值不合理`);
          }
        }
        results.validated += categoriesResult.data.length;
      }

      // 获取所有尺码表
      const chartsResult = this.db.getSizeCharts();
      if (chartsResult.success) {
        for (const chart of chartsResult.data) {
          const detailResult = this.db.getSizeChart(chart.id);
          if (detailResult.success) {
            const { items = [] } = detailResult.data;
            
            // 检查重复项
            const duplicates = this.findDuplicateItems(items);
            if (duplicates.length > 0) {
              results.errors.push(`尺码表 ${chart.name} 存在重复项`);
            }
          }
        }
        results.validated += chartsResult.data.length;
      }

      return {
        success: results.errors.length === 0,
        message: `数据验证完成。验证项目: ${results.validated}, 错误: ${results.errors.length}`,
        details: results
      };

    } catch (error) {
      return {
        success: false,
        message: '数据清理验证失败: ' + error.message,
        error: error
      };
    }
  }

  /**
   * 查找重复的尺码表项目
   * @param {Array} items - 尺码表项目数组
   */
  findDuplicateItems(items) {
    const seen = new Set();
    const duplicates = [];

    items.forEach(item => {
      const key = `${item.categoryId}_${item.size}`;
      if (seen.has(key)) {
        duplicates.push(item);
      } else {
        seen.add(key);
      }
    });

    return duplicates;
  }

  /**
   * 生成迁移报告
   * @param {string} reportPath - 报告文件路径
   * @param {Object} migrationResult - 迁移结果
   */
  async generateMigrationReport(reportPath, migrationResult) {
    try {
      const report = {
        title: '数据迁移报告',
        date: new Date().toISOString(),
        summary: migrationResult.summary || {},
        details: migrationResult.details || {},
        errors: [],
        recommendations: []
      };

      // 收集所有错误
      if (migrationResult.details) {
        Object.values(migrationResult.details).forEach(section => {
          if (section.errors) {
            report.errors.push(...section.errors);
          }
        });
      }

      // 生成建议
      if (report.errors.length > 0) {
        report.recommendations.push('检查并修复迁移过程中的错误');
      }

      if (migrationResult.summary && migrationResult.summary.failedCount > 0) {
        report.recommendations.push('备份原始数据以防数据丢失');
      }

      // 写入报告文件
      const reportContent = JSON.stringify(report, null, 2);
      fs.writeFileSync(reportPath, reportContent, 'utf8');

      return {
        success: true,
        message: '迁移报告生成成功',
        reportPath: reportPath
      };

    } catch (error) {
      return {
        success: false,
        message: '生成迁移报告失败: ' + error.message,
        error: error
      };
    }
  }
}

module.exports = DataMigration;
