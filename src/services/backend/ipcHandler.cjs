/**
 * Electron 主进程 IPC 处理程序
 * 
 * 功能：
 * - 处理渲染进程的 IPC 请求
 * - 管理数据库操作
 * - 处理文件系统操作
 * - 管理导出功能
 */

const { ipcMain, app, dialog, shell, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');

// 导入后端服务
const LocalDatabase = require('./localDatabase.cjs');
const ExcelExporter = require('./excelExporter.cjs');
const DataMigration = require('./dataMigration.cjs');

class IPCHandler {
  constructor() {
    this.database = new LocalDatabase();
    this.excelExporter = new ExcelExporter();
    this.dataMigration = new DataMigration(this.database);
    this.isInitialized = false;
    
    this.setupIPCHandlers();
  }

  /**
   * 设置所有 IPC 处理程序
   */
  setupIPCHandlers() {
    // 数据库操作处理程序
    this.setupDatabaseHandlers();
    
    // 导出功能处理程序
    this.setupExportHandlers();
    
    // 数据迁移处理程序
    this.setupMigrationHandlers();
    
    // 文件系统处理程序
    this.setupFileHandlers();
    
    // 应用程序处理程序
    this.setupAppHandlers();
    
    // 窗口操作处理程序
    this.setupWindowHandlers();
    
    // 开发工具处理程序
    this.setupDevHandlers();
    
    // 通知处理程序
    this.setupNotificationHandlers();
    
    // 主题处理程序
    this.setupThemeHandlers();
  }

  /**
   * 设置数据库操作处理程序
   */
  setupDatabaseHandlers() {
    // 初始化数据库
    ipcMain.handle('db:initialize', async () => {
      try {
        const appDataPath = app.getPath('userData');
        const result = await this.database.initialize(appDataPath);
        this.isInitialized = result.success;
        return result;
      } catch (error) {
        return {
          success: false,
          message: '数据库初始化失败: ' + error.message,
          error: error
        };
      }
    });

    // 类别操作
    ipcMain.handle('db:getCategories', async () => {
      try {
        return this.database.getCategories();
      } catch (error) {
        return {
          success: false,
          message: '获取类别失败: ' + error.message,
          error: error
        };
      }
    });

    ipcMain.handle('db:createCategory', async (event, categoryData) => {
      try {
        return this.database.createCategory(categoryData);
      } catch (error) {
        return {
          success: false,
          message: '创建类别失败: ' + error.message,
          error: error
        };
      }
    });

    ipcMain.handle('db:updateCategory', async (event, categoryId, updateData) => {
      try {
        return this.database.updateCategory(categoryId, updateData);
      } catch (error) {
        return {
          success: false,
          message: '更新类别失败: ' + error.message,
          error: error
        };
      }
    });

    ipcMain.handle('db:deleteCategory', async (event, categoryId) => {
      try {
        return this.database.deleteCategory(categoryId);
      } catch (error) {
        return {
          success: false,
          message: '删除类别失败: ' + error.message,
          error: error
        };
      }
    });

    // 尺码表操作
    ipcMain.handle('db:getSizeCharts', async () => {
      try {
        return this.database.getSizeCharts();
      } catch (error) {
        return {
          success: false,
          message: '获取尺码表失败: ' + error.message,
          error: error
        };
      }
    });

    ipcMain.handle('db:getSizeChart', async (event, chartId) => {
      try {
        return this.database.getSizeChart(chartId);
      } catch (error) {
        return {
          success: false,
          message: '获取尺码表详情失败: ' + error.message,
          error: error
        };
      }
    });

    ipcMain.handle('db:createSizeChart', async (event, chartData) => {
      try {
        return this.database.createSizeChart(chartData);
      } catch (error) {
        return {
          success: false,
          message: '创建尺码表失败: ' + error.message,
          error: error
        };
      }
    });

    ipcMain.handle('db:deleteSizeChart', async (event, chartId) => {
      try {
        return this.database.deleteSizeChart(chartId);
      } catch (error) {
        return {
          success: false,
          message: '删除尺码表失败: ' + error.message,
          error: error
        };
      }
    });

    // 设置操作
    ipcMain.handle('db:getSetting', async (event, key) => {
      try {
        return this.database.getSetting(key);
      } catch (error) {
        return {
          success: false,
          message: '获取设置失败: ' + error.message,
          error: error
        };
      }
    });

    ipcMain.handle('db:updateSetting', async (event, key, value) => {
      try {
        return this.database.updateSetting(key, value);
      } catch (error) {
        return {
          success: false,
          message: '更新设置失败: ' + error.message,
          error: error
        };
      }
    });

    // 统计信息
    ipcMain.handle('db:getStats', async () => {
      try {
        return this.database.getStats();
      } catch (error) {
        return {
          success: false,
          message: '获取统计信息失败: ' + error.message,
          error: error
        };
      }
    });

    // 关闭数据库
    ipcMain.handle('db:close', async () => {
      try {
        this.database.close();
        return { success: true, message: '数据库连接已关闭' };
      } catch (error) {
        return {
          success: false,
          message: '关闭数据库失败: ' + error.message,
          error: error
        };
      }
    });
  }

  /**
   * 设置导出功能处理程序
   */
  setupExportHandlers() {
    // 导出单个尺码表
    ipcMain.handle('export:sizeChart', async (event, sizeChart, options = {}) => {
      try {
        const result = await dialog.showSaveDialog(BrowserWindow.getFocusedWindow(), {
          title: '导出尺码表',
          defaultPath: this.excelExporter.generateFileName(sizeChart.name || '尺码表', 'xlsx'),
          filters: [
            { name: 'Excel 文件', extensions: ['xlsx'] },
            { name: '所有文件', extensions: ['*'] }
          ]
        });

        if (result.canceled || !result.filePath) {
          return {
            success: false,
            message: '导出已取消'
          };
        }

        return await this.excelExporter.exportSizeChart(sizeChart, result.filePath, options);
      } catch (error) {
        return {
          success: false,
          message: '导出失败: ' + error.message,
          error: error
        };
      }
    });

    // 批量导出
    ipcMain.handle('export:multipleCharts', async (event, sizeCharts, options = {}) => {
      try {
        const result = await dialog.showSaveDialog(BrowserWindow.getFocusedWindow(), {
          title: '批量导出尺码表',
          defaultPath: `尺码表合集_${new Date().toISOString().slice(0, 10)}.xlsx`,
          filters: [
            { name: 'Excel 文件', extensions: ['xlsx'] },
            { name: '所有文件', extensions: ['*'] }
          ]
        });

        if (result.canceled || !result.filePath) {
          return {
            success: false,
            message: '导出已取消'
          };
        }

        return await this.excelExporter.exportMultipleSizeCharts(sizeCharts, result.filePath, options);
      } catch (error) {
        return {
          success: false,
          message: '批量导出失败: ' + error.message,
          error: error
        };
      }
    });

    // 导出模板
    ipcMain.handle('export:template', async (event, categories) => {
      try {
        const result = await dialog.showSaveDialog(BrowserWindow.getFocusedWindow(), {
          title: '导出尺码表模板',
          defaultPath: '尺码表模板.xlsx',
          filters: [
            { name: 'Excel 文件', extensions: ['xlsx'] },
            { name: '所有文件', extensions: ['*'] }
          ]
        });

        if (result.canceled || !result.filePath) {
          return {
            success: false,
            message: '导出已取消'
          };
        }

        return await this.excelExporter.exportTemplate(result.filePath, categories);
      } catch (error) {
        return {
          success: false,
          message: '模板导出失败: ' + error.message,
          error: error
        };
      }
    });

    // 打开导出文件夹
    ipcMain.handle('export:openFolder', async () => {
      try {
        const exportPath = path.join(app.getPath('documents'), '尺码表导出');
        
        // 确保文件夹存在
        if (!fs.existsSync(exportPath)) {
          fs.mkdirSync(exportPath, { recursive: true });
        }

        await shell.openPath(exportPath);
        
        return {
          success: true,
          message: '导出文件夹已打开',
          path: exportPath
        };
      } catch (error) {
        return {
          success: false,
          message: '打开导出文件夹失败: ' + error.message,
          error: error
        };
      }
    });
  }

  /**
   * 设置数据迁移处理程序
   */
  setupMigrationHandlers() {
    // 从 JSON 迁移
    ipcMain.handle('migration:fromJSON', async (event, filePath) => {
      try {
        if (!filePath) {
          const result = await dialog.showOpenDialog(BrowserWindow.getFocusedWindow(), {
            title: '选择要迁移的 JSON 文件',
            filters: [
              { name: 'JSON 文件', extensions: ['json'] },
              { name: '所有文件', extensions: ['*'] }
            ],
            properties: ['openFile']
          });

          if (result.canceled || result.filePaths.length === 0) {
            return {
              success: false,
              message: '迁移已取消'
            };
          }

          filePath = result.filePaths[0];
        }

        return await this.dataMigration.migrateFromJSON(filePath);
      } catch (error) {
        return {
          success: false,
          message: 'JSON迁移失败: ' + error.message,
          error: error
        };
      }
    });

    // 导出到 JSON
    ipcMain.handle('migration:exportJSON', async () => {
      try {
        const result = await dialog.showSaveDialog(BrowserWindow.getFocusedWindow(), {
          title: '导出数据到 JSON',
          defaultPath: `尺码表数据_${new Date().toISOString().slice(0, 10)}.json`,
          filters: [
            { name: 'JSON 文件', extensions: ['json'] },
            { name: '所有文件', extensions: ['*'] }
          ]
        });

        if (result.canceled || !result.filePath) {
          return {
            success: false,
            message: '导出已取消'
          };
        }

        return await this.dataMigration.exportToJSON(result.filePath);
      } catch (error) {
        return {
          success: false,
          message: 'JSON导出失败: ' + error.message,
          error: error
        };
      }
    });

    // 从应用状态迁移
    ipcMain.handle('migration:fromAppState', async (event, appState) => {
      try {
        return await this.dataMigration.migrateFromAppState(appState);
      } catch (error) {
        return {
          success: false,
          message: '应用状态迁移失败: ' + error.message,
          error: error
        };
      }
    });

    // 数据清理验证
    ipcMain.handle('migration:cleanupValidate', async () => {
      try {
        return await this.dataMigration.cleanupAndValidate();
      } catch (error) {
        return {
          success: false,
          message: '数据验证失败: ' + error.message,
          error: error
        };
      }
    });

    // 生成迁移报告
    ipcMain.handle('migration:generateReport', async (event, migrationResult) => {
      try {
        const reportPath = path.join(app.getPath('documents'), '尺码表迁移报告.json');
        return await this.dataMigration.generateMigrationReport(reportPath, migrationResult);
      } catch (error) {
        return {
          success: false,
          message: '生成迁移报告失败: ' + error.message,
          error: error
        };
      }
    });
  }

  /**
   * 设置文件系统处理程序
   */
  setupFileHandlers() {
    // 选择文件
    ipcMain.handle('file:select', async (event, options = {}) => {
      try {
        const result = await dialog.showOpenDialog(BrowserWindow.getFocusedWindow(), {
          title: options.title || '选择文件',
          filters: options.filters || [{ name: '所有文件', extensions: ['*'] }],
          properties: options.properties || ['openFile']
        });

        return {
          success: !result.canceled,
          filePaths: result.filePaths || [],
          canceled: result.canceled
        };
      } catch (error) {
        return {
          success: false,
          message: '选择文件失败: ' + error.message,
          error: error
        };
      }
    });

    // 选择保存位置
    ipcMain.handle('file:selectSave', async (event, options = {}) => {
      try {
        const result = await dialog.showSaveDialog(BrowserWindow.getFocusedWindow(), {
          title: options.title || '保存文件',
          defaultPath: options.defaultPath || '',
          filters: options.filters || [{ name: '所有文件', extensions: ['*'] }]
        });

        return {
          success: !result.canceled,
          filePath: result.filePath || '',
          canceled: result.canceled
        };
      } catch (error) {
        return {
          success: false,
          message: '选择保存位置失败: ' + error.message,
          error: error
        };
      }
    });

    // 读取文件
    ipcMain.handle('file:read', async (event, filePath) => {
      try {
        if (!fs.existsSync(filePath)) {
          return {
            success: false,
            message: '文件不存在'
          };
        }

        const content = fs.readFileSync(filePath, 'utf8');
        return {
          success: true,
          content: content
        };
      } catch (error) {
        return {
          success: false,
          message: '读取文件失败: ' + error.message,
          error: error
        };
      }
    });

    // 写入文件
    ipcMain.handle('file:write', async (event, filePath, content) => {
      try {
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }

        fs.writeFileSync(filePath, content, 'utf8');
        
        return {
          success: true,
          message: '文件写入成功'
        };
      } catch (error) {
        return {
          success: false,
          message: '写入文件失败: ' + error.message,
          error: error
        };
      }
    });

    // 检查文件存在
    ipcMain.handle('file:exists', async (event, filePath) => {
      try {
        return {
          success: true,
          exists: fs.existsSync(filePath)
        };
      } catch (error) {
        return {
          success: false,
          exists: false,
          error: error
        };
      }
    });

    // 获取应用数据路径
    ipcMain.handle('file:getAppDataPath', async () => {
      try {
        return {
          success: true,
          path: app.getPath('userData')
        };
      } catch (error) {
        return {
          success: false,
          message: '获取应用数据路径失败: ' + error.message,
          error: error
        };
      }
    });

    // 打开文件夹
    ipcMain.handle('file:openFolder', async (event, folderPath) => {
      try {
        await shell.openPath(folderPath);
        return {
          success: true,
          message: '文件夹已打开'
        };
      } catch (error) {
        return {
          success: false,
          message: '打开文件夹失败: ' + error.message,
          error: error
        };
      }
    });
  }

  /**
   * 设置应用程序处理程序
   */
  setupAppHandlers() {
    // 获取应用版本
    ipcMain.handle('app:getVersion', () => {
      return {
        success: true,
        version: app.getVersion()
      };
    });

    // 获取应用路径
    ipcMain.handle('app:getPath', (event, name) => {
      try {
        return {
          success: true,
          path: app.getPath(name)
        };
      } catch (error) {
        return {
          success: false,
          message: '获取路径失败: ' + error.message,
          error: error
        };
      }
    });

    // 退出应用
    ipcMain.handle('app:quit', () => {
      app.quit();
      return { success: true };
    });

    // 重启应用
    ipcMain.handle('app:restart', () => {
      app.relaunch();
      app.exit();
      return { success: true };
    });

    // 显示消息框
    ipcMain.handle('app:showMessageBox', async (event, options) => {
      try {
        const result = await dialog.showMessageBox(BrowserWindow.getFocusedWindow(), options);
        return {
          success: true,
          result: result
        };
      } catch (error) {
        return {
          success: false,
          message: '显示消息框失败: ' + error.message,
          error: error
        };
      }
    });

    // 显示错误对话框
    ipcMain.handle('app:showErrorBox', async (event, title, content) => {
      try {
        dialog.showErrorBox(title, content);
        return { success: true };
      } catch (error) {
        return {
          success: false,
          message: '显示错误对话框失败: ' + error.message,
          error: error
        };
      }
    });

    // 记录错误
    ipcMain.handle('app:logError', async (event, errorInfo) => {
      try {
        console.error('渲染进程错误:', errorInfo);
        
        // 可以在这里添加错误日志记录到文件
        const logPath = path.join(app.getPath('userData'), 'logs');
        if (!fs.existsSync(logPath)) {
          fs.mkdirSync(logPath, { recursive: true });
        }
        
        const logFile = path.join(logPath, `error_${new Date().toISOString().slice(0, 10)}.log`);
        const logEntry = `${errorInfo.timestamp}: ${JSON.stringify(errorInfo)}\n`;
        
        fs.appendFileSync(logFile, logEntry);
        
        return { success: true };
      } catch (error) {
        console.error('记录错误失败:', error);
        return {
          success: false,
          message: '记录错误失败: ' + error.message
        };
      }
    });
  }

  /**
   * 设置窗口操作处理程序
   */
  setupWindowHandlers() {
    // 最小化窗口
    ipcMain.handle('window:minimize', () => {
      const window = BrowserWindow.getFocusedWindow();
      if (window) {
        window.minimize();
      }
      return { success: true };
    });

    // 最大化/还原窗口
    ipcMain.handle('window:toggleMaximize', () => {
      const window = BrowserWindow.getFocusedWindow();
      if (window) {
        if (window.isMaximized()) {
          window.unmaximize();
        } else {
          window.maximize();
        }
      }
      return { success: true };
    });

    // 关闭窗口
    ipcMain.handle('window:close', () => {
      const window = BrowserWindow.getFocusedWindow();
      if (window) {
        window.close();
      }
      return { success: true };
    });

    // 设置窗口标题
    ipcMain.handle('window:setTitle', (event, title) => {
      const window = BrowserWindow.getFocusedWindow();
      if (window) {
        window.setTitle(title);
      }
      return { success: true };
    });

    // 检查窗口是否最大化
    ipcMain.handle('window:isMaximized', () => {
      const window = BrowserWindow.getFocusedWindow();
      return {
        success: true,
        isMaximized: window ? window.isMaximized() : false
      };
    });

    // 设置窗口大小
    ipcMain.handle('window:setSize', (event, width, height) => {
      const window = BrowserWindow.getFocusedWindow();
      if (window) {
        window.setSize(width, height);
      }
      return { success: true };
    });

    // 居中窗口
    ipcMain.handle('window:center', () => {
      const window = BrowserWindow.getFocusedWindow();
      if (window) {
        window.center();
      }
      return { success: true };
    });
  }

  /**
   * 设置开发工具处理程序
   */
  setupDevHandlers() {
    // 打开开发者工具
    ipcMain.handle('dev:openDevTools', () => {
      const window = BrowserWindow.getFocusedWindow();
      if (window) {
        window.webContents.openDevTools();
      }
      return { success: true };
    });

    // 重新加载页面
    ipcMain.handle('dev:reload', () => {
      const window = BrowserWindow.getFocusedWindow();
      if (window) {
        window.webContents.reload();
      }
      return { success: true };
    });

    // 强制重新加载页面
    ipcMain.handle('dev:forceReload', () => {
      const window = BrowserWindow.getFocusedWindow();
      if (window) {
        window.webContents.reloadIgnoringCache();
      }
      return { success: true };
    });

    // 切换开发者工具
    ipcMain.handle('dev:toggleDevTools', () => {
      const window = BrowserWindow.getFocusedWindow();
      if (window) {
        window.webContents.toggleDevTools();
      }
      return { success: true };
    });

    // 获取调试信息
    ipcMain.handle('dev:getDebugInfo', () => {
      const window = BrowserWindow.getFocusedWindow();
      return {
        success: true,
        info: {
          appVersion: app.getVersion(),
          electronVersion: process.versions.electron,
          nodeVersion: process.versions.node,
          chromeVersion: process.versions.chrome,
          platform: process.platform,
          arch: process.arch,
          userDataPath: app.getPath('userData'),
          windowId: window ? window.id : null,
          isPackaged: app.isPackaged
        }
      };
    });
  }

  /**
   * 设置通知处理程序
   */
  setupNotificationHandlers() {
    // 显示系统通知
    ipcMain.handle('notification:show', async (event, options) => {
      try {
        const { Notification } = require('electron');
        
        if (!Notification.isSupported()) {
          return {
            success: false,
            message: '系统不支持通知'
          };
        }

        const notification = new Notification(options);
        notification.show();

        return { success: true };
      } catch (error) {
        return {
          success: false,
          message: '显示通知失败: ' + error.message,
          error: error
        };
      }
    });
  }

  /**
   * 设置主题处理程序
   */
  setupThemeHandlers() {
    // 获取系统主题
    ipcMain.handle('theme:getSystemTheme', () => {
      const { nativeTheme } = require('electron');
      return {
        success: true,
        theme: nativeTheme.shouldUseDarkColors ? 'dark' : 'light'
      };
    });

    // 监听主题变化
    const { nativeTheme } = require('electron');
    nativeTheme.on('updated', () => {
      const theme = nativeTheme.shouldUseDarkColors ? 'dark' : 'light';
      BrowserWindow.getAllWindows().forEach(window => {
        window.webContents.send('theme:changed', theme);
      });
    });
  }

  /**
   * 清理资源
   */
  cleanup() {
    // 关闭数据库连接
    if (this.database) {
      this.database.close();
    }

    // 移除所有 IPC 监听器
    ipcMain.removeAllListeners();
  }
}

module.exports = IPCHandler;
