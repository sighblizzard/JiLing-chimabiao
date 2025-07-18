/**
 * 本地 SQLite 数据库管理服务
 * 
 * 功能：
 * - 数据库初始化和表结构创建
 * - 尺码表数据的增删改查
 * - 类别管理
 * - 数据验证和约束
 * - 事务处理
 */

const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

class LocalDatabase {
  constructor() {
    this.db = null;
    this.dbPath = null;
    this.isInitialized = false;
  }

  /**
   * 初始化数据库连接
   * @param {string} appPath - 应用数据目录路径
   */
  async initialize(appPath) {
    try {
      // 确保数据目录存在
      const dataDir = path.join(appPath, 'data');
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }

      // 设置数据库文件路径
      this.dbPath = path.join(dataDir, 'size_charts.db');
      
      // 创建数据库连接
      this.db = new Database(this.dbPath);
      
      // 启用外键约束
      this.db.pragma('foreign_keys = ON');
      
      // 设置 WAL 模式以提高性能
      this.db.pragma('journal_mode = WAL');
      
      // 创建表结构
      await this.createTables();
      
      // 初始化默认数据
      await this.initializeDefaultData();
      
      this.isInitialized = true;
      console.log('数据库初始化成功:', this.dbPath);
      
      return {
        success: true,
        message: '数据库初始化成功',
        path: this.dbPath
      };
    } catch (error) {
      console.error('数据库初始化失败:', error);
      return {
        success: false,
        message: '数据库初始化失败: ' + error.message,
        error: error
      };
    }
  }

  /**
   * 创建数据库表结构
   */
  createTables() {
    const tables = [
      // 类别表
      `CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        description TEXT,
        baseValue REAL NOT NULL,
        increment REAL NOT NULL,
        unit TEXT NOT NULL,
        isActive INTEGER DEFAULT 1,
        sortOrder INTEGER DEFAULT 0,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,

      // 尺码表
      `CREATE TABLE IF NOT EXISTS size_charts (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        isActive INTEGER DEFAULT 1,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,

      // 尺码表项目
      `CREATE TABLE IF NOT EXISTS size_chart_items (
        id TEXT PRIMARY KEY,
        chartId TEXT NOT NULL,
        categoryId TEXT NOT NULL,
        size TEXT NOT NULL,
        value REAL NOT NULL,
        sortOrder INTEGER DEFAULT 0,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (chartId) REFERENCES size_charts(id) ON DELETE CASCADE,
        FOREIGN KEY (categoryId) REFERENCES categories(id) ON DELETE CASCADE,
        UNIQUE(chartId, categoryId, size)
      )`,

      // 设置表
      `CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        description TEXT,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )`
    ];

    // 创建索引
    const indexes = [
      'CREATE INDEX IF NOT EXISTS idx_categories_active ON categories(isActive)',
      'CREATE INDEX IF NOT EXISTS idx_categories_sort ON categories(sortOrder)',
      'CREATE INDEX IF NOT EXISTS idx_size_charts_active ON size_charts(isActive)',
      'CREATE INDEX IF NOT EXISTS idx_size_chart_items_chart ON size_chart_items(chartId)',
      'CREATE INDEX IF NOT EXISTS idx_size_chart_items_category ON size_chart_items(categoryId)',
      'CREATE INDEX IF NOT EXISTS idx_size_chart_items_size ON size_chart_items(size)'
    ];

    // 执行表创建
    tables.forEach(sql => {
      this.db.exec(sql);
    });

    // 执行索引创建
    indexes.forEach(sql => {
      this.db.exec(sql);
    });

    console.log('数据库表结构创建完成');
  }

  /**
   * 初始化默认数据
   */
  initializeDefaultData() {
    // 检查是否已有数据
    const categoryCount = this.db.prepare('SELECT COUNT(*) as count FROM categories').get().count;
    
    if (categoryCount === 0) {
      // 插入默认类别数据
      const defaultCategories = [
        { id: 'bust', name: '胸围', description: '胸部最丰满处的周长', baseValue: 84, increment: 4, unit: 'cm', sortOrder: 1 },
        { id: 'waist', name: '腰围', description: '腰部最细处的周长', baseValue: 68, increment: 4, unit: 'cm', sortOrder: 2 },
        { id: 'hip', name: '臀围', description: '臀部最丰满处的周长', baseValue: 90, increment: 4, unit: 'cm', sortOrder: 3 },
        { id: 'shoulder', name: '肩宽', description: '两肩最外侧的距离', baseValue: 38, increment: 2, unit: 'cm', sortOrder: 4 },
        { id: 'sleeve', name: '袖长', description: '肩点到袖口的长度', baseValue: 58, increment: 2, unit: 'cm', sortOrder: 5 },
        { id: 'length', name: '衣长', description: '前中心点到下摆的长度', baseValue: 65, increment: 3, unit: 'cm', sortOrder: 6 }
      ];

      const insertCategory = this.db.prepare(`
        INSERT INTO categories (id, name, description, baseValue, increment, unit, sortOrder)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);

      defaultCategories.forEach(category => {
        insertCategory.run(
          category.id,
          category.name,
          category.description,
          category.baseValue,
          category.increment,
          category.unit,
          category.sortOrder
        );
      });

      console.log('默认类别数据初始化完成');
    }

    // 初始化默认设置
    const settingCount = this.db.prepare('SELECT COUNT(*) as count FROM settings').get().count;
    
    if (settingCount === 0) {
      const defaultSettings = [
        { key: 'default_start_size', value: 'S', description: '默认起始尺码' },
        { key: 'default_size_count', value: '4', description: '默认尺码数量' },
        { key: 'app_version', value: '1.0.0', description: '应用版本' },
        { key: 'db_version', value: '1.0.0', description: '数据库版本' }
      ];

      const insertSetting = this.db.prepare(`
        INSERT INTO settings (key, value, description)
        VALUES (?, ?, ?)
      `);

      defaultSettings.forEach(setting => {
        insertSetting.run(setting.key, setting.value, setting.description);
      });

      console.log('默认设置数据初始化完成');
    }
  }

  /**
   * 获取所有活跃的类别
   */
  getCategories() {
    if (!this.isInitialized) {
      throw new Error('数据库未初始化');
    }

    try {
      const stmt = this.db.prepare(`
        SELECT * FROM categories 
        WHERE isActive = 1 
        ORDER BY sortOrder, name
      `);
      
      return {
        success: true,
        data: stmt.all()
      };
    } catch (error) {
      return {
        success: false,
        message: '获取类别失败: ' + error.message,
        error: error
      };
    }
  }

  /**
   * 创建新类别
   * @param {Object} categoryData - 类别数据
   */
  createCategory(categoryData) {
    if (!this.isInitialized) {
      throw new Error('数据库未初始化');
    }

    try {
      const { id, name, description, baseValue, increment, unit, sortOrder } = categoryData;
      
      // 验证必填字段
      if (!id || !name || baseValue === undefined || increment === undefined || !unit) {
        return {
          success: false,
          message: '缺少必填字段'
        };
      }

      const stmt = this.db.prepare(`
        INSERT INTO categories (id, name, description, baseValue, increment, unit, sortOrder, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      `);

      const result = stmt.run(id, name, description, baseValue, increment, unit, sortOrder || 0);

      return {
        success: true,
        data: { id, ...categoryData },
        message: '类别创建成功'
      };
    } catch (error) {
      if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        return {
          success: false,
          message: '类别ID或名称已存在'
        };
      }
      
      return {
        success: false,
        message: '创建类别失败: ' + error.message,
        error: error
      };
    }
  }

  /**
   * 更新类别
   * @param {string} categoryId - 类别ID
   * @param {Object} updateData - 更新数据
   */
  updateCategory(categoryId, updateData) {
    if (!this.isInitialized) {
      throw new Error('数据库未初始化');
    }

    try {
      const { name, description, baseValue, increment, unit, sortOrder, isActive } = updateData;
      
      const stmt = this.db.prepare(`
        UPDATE categories 
        SET name = COALESCE(?, name),
            description = COALESCE(?, description),
            baseValue = COALESCE(?, baseValue),
            increment = COALESCE(?, increment),
            unit = COALESCE(?, unit),
            sortOrder = COALESCE(?, sortOrder),
            isActive = COALESCE(?, isActive),
            updatedAt = CURRENT_TIMESTAMP
        WHERE id = ?
      `);

      const result = stmt.run(
        name, description, baseValue, increment, unit, sortOrder, isActive, categoryId
      );

      if (result.changes === 0) {
        return {
          success: false,
          message: '类别不存在'
        };
      }

      return {
        success: true,
        message: '类别更新成功'
      };
    } catch (error) {
      return {
        success: false,
        message: '更新类别失败: ' + error.message,
        error: error
      };
    }
  }

  /**
   * 删除类别（软删除）
   * @param {string} categoryId - 类别ID
   */
  deleteCategory(categoryId) {
    if (!this.isInitialized) {
      throw new Error('数据库未初始化');
    }

    try {
      const stmt = this.db.prepare(`
        UPDATE categories 
        SET isActive = 0, updatedAt = CURRENT_TIMESTAMP 
        WHERE id = ?
      `);

      const result = stmt.run(categoryId);

      if (result.changes === 0) {
        return {
          success: false,
          message: '类别不存在'
        };
      }

      return {
        success: true,
        message: '类别删除成功'
      };
    } catch (error) {
      return {
        success: false,
        message: '删除类别失败: ' + error.message,
        error: error
      };
    }
  }

  /**
   * 创建尺码表
   * @param {Object} chartData - 尺码表数据
   */
  createSizeChart(chartData) {
    if (!this.isInitialized) {
      throw new Error('数据库未初始化');
    }

    const transaction = this.db.transaction((data) => {
      try {
        const { id, name, description, items } = data;
        
        // 创建尺码表记录
        const insertChart = this.db.prepare(`
          INSERT INTO size_charts (id, name, description, updatedAt)
          VALUES (?, ?, ?, CURRENT_TIMESTAMP)
        `);

        insertChart.run(id, name, description);

        // 插入尺码表项目
        if (items && items.length > 0) {
          const insertItem = this.db.prepare(`
            INSERT INTO size_chart_items (id, chartId, categoryId, size, value, sortOrder)
            VALUES (?, ?, ?, ?, ?, ?)
          `);

          items.forEach((item, index) => {
            const itemId = `${id}_${item.categoryId}_${item.size}`;
            insertItem.run(itemId, id, item.categoryId, item.size, item.value, index);
          });
        }

        return { success: true, id, message: '尺码表创建成功' };
      } catch (error) {
        throw error;
      }
    });

    try {
      return transaction(chartData);
    } catch (error) {
      return {
        success: false,
        message: '创建尺码表失败: ' + error.message,
        error: error
      };
    }
  }

  /**
   * 获取尺码表列表
   */
  getSizeCharts() {
    if (!this.isInitialized) {
      throw new Error('数据库未初始化');
    }

    try {
      const stmt = this.db.prepare(`
        SELECT sc.*, 
               COUNT(sci.id) as itemCount
        FROM size_charts sc
        LEFT JOIN size_chart_items sci ON sc.id = sci.chartId
        WHERE sc.isActive = 1
        GROUP BY sc.id
        ORDER BY sc.updatedAt DESC
      `);

      return {
        success: true,
        data: stmt.all()
      };
    } catch (error) {
      return {
        success: false,
        message: '获取尺码表失败: ' + error.message,
        error: error
      };
    }
  }

  /**
   * 获取尺码表详情
   * @param {string} chartId - 尺码表ID
   */
  getSizeChart(chartId) {
    if (!this.isInitialized) {
      throw new Error('数据库未初始化');
    }

    try {
      // 获取尺码表基本信息
      const chartStmt = this.db.prepare(`
        SELECT * FROM size_charts WHERE id = ? AND isActive = 1
      `);
      const chart = chartStmt.get(chartId);

      if (!chart) {
        return {
          success: false,
          message: '尺码表不存在'
        };
      }

      // 获取尺码表项目
      const itemsStmt = this.db.prepare(`
        SELECT sci.*, c.name as categoryName, c.unit
        FROM size_chart_items sci
        JOIN categories c ON sci.categoryId = c.id
        WHERE sci.chartId = ?
        ORDER BY sci.sortOrder, c.sortOrder
      `);
      const items = itemsStmt.all(chartId);

      return {
        success: true,
        data: {
          ...chart,
          items
        }
      };
    } catch (error) {
      return {
        success: false,
        message: '获取尺码表失败: ' + error.message,
        error: error
      };
    }
  }

  /**
   * 删除尺码表（软删除）
   * @param {string} chartId - 尺码表ID
   */
  deleteSizeChart(chartId) {
    if (!this.isInitialized) {
      throw new Error('数据库未初始化');
    }

    try {
      const stmt = this.db.prepare(`
        UPDATE size_charts 
        SET isActive = 0, updatedAt = CURRENT_TIMESTAMP 
        WHERE id = ?
      `);

      const result = stmt.run(chartId);

      if (result.changes === 0) {
        return {
          success: false,
          message: '尺码表不存在'
        };
      }

      return {
        success: true,
        message: '尺码表删除成功'
      };
    } catch (error) {
      return {
        success: false,
        message: '删除尺码表失败: ' + error.message,
        error: error
      };
    }
  }

  /**
   * 获取设置值
   * @param {string} key - 设置键
   */
  getSetting(key) {
    if (!this.isInitialized) {
      throw new Error('数据库未初始化');
    }

    try {
      const stmt = this.db.prepare('SELECT value FROM settings WHERE key = ?');
      const result = stmt.get(key);
      
      return {
        success: true,
        data: result ? result.value : null
      };
    } catch (error) {
      return {
        success: false,
        message: '获取设置失败: ' + error.message,
        error: error
      };
    }
  }

  /**
   * 更新设置值
   * @param {string} key - 设置键
   * @param {string} value - 设置值
   */
  updateSetting(key, value) {
    if (!this.isInitialized) {
      throw new Error('数据库未初始化');
    }

    try {
      const stmt = this.db.prepare(`
        INSERT OR REPLACE INTO settings (key, value, updatedAt)
        VALUES (?, ?, CURRENT_TIMESTAMP)
      `);

      stmt.run(key, value);

      return {
        success: true,
        message: '设置更新成功'
      };
    } catch (error) {
      return {
        success: false,
        message: '更新设置失败: ' + error.message,
        error: error
      };
    }
  }

  /**
   * 关闭数据库连接
   */
  close() {
    if (this.db) {
      this.db.close();
      this.db = null;
      this.isInitialized = false;
      console.log('数据库连接已关闭');
    }
  }

  /**
   * 获取数据库统计信息
   */
  getStats() {
    if (!this.isInitialized) {
      throw new Error('数据库未初始化');
    }

    try {
      const categoryCount = this.db.prepare('SELECT COUNT(*) as count FROM categories WHERE isActive = 1').get().count;
      const chartCount = this.db.prepare('SELECT COUNT(*) as count FROM size_charts WHERE isActive = 1').get().count;
      const itemCount = this.db.prepare('SELECT COUNT(*) as count FROM size_chart_items').get().count;

      return {
        success: true,
        data: {
          categories: categoryCount,
          charts: chartCount,
          items: itemCount,
          dbPath: this.dbPath,
          isInitialized: this.isInitialized
        }
      };
    } catch (error) {
      return {
        success: false,
        message: '获取统计信息失败: ' + error.message,
        error: error
      };
    }
  }
}

module.exports = LocalDatabase;
