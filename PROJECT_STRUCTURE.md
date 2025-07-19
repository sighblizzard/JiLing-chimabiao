# 项目文件结构说明

## 项目概述
尺码表生成器 - Finder风格的现代化尺码表生成应用

## 目录结构

```
chi-ma-biao-7.16/
├── src/                          # 源代码目录
│   ├── components/               # React组件
│   │   ├── App.jsx              # 主应用组件
│   │   ├── MainContent.jsx      # 主内容区域
│   │   ├── PreviewPanel.jsx     # 预览面板
│   │   ├── SettingsPanel.jsx    # 设置面板
│   │   ├── CategoryManager.jsx  # 类别管理器
│   │   ├── SizeSettings.jsx     # 尺码设置
│   │   ├── Select.jsx           # 下拉选择组件
│   │   ├── Button.jsx           # 按钮组件
│   │   ├── Input.jsx            # 输入框组件
│   │   ├── Modal.jsx            # 模态框组件
│   │   ├── Table.jsx            # 表格组件
│   │   ├── Sidebar.jsx          # 侧边栏
│   │   ├── StatusBar.jsx        # 状态栏
│   │   ├── TitleBar.jsx         # 标题栏
│   │   ├── Toolbar.jsx          # 工具栏
│   │   ├── WindowControls.jsx   # 窗口控制
│   │   ├── SegmentedControl.jsx # 分段控制器
│   │   ├── ErrorBoundary.jsx    # 错误边界
│   │   └── ExportDialog.js      # 导出对话框
│   ├── services/                # 业务逻辑服务
│   │   ├── tableExporter.js     # 表格导出服务
│   │   ├── sizeCalculator.js    # 尺码计算服务
│   │   ├── dataManager.js       # 数据管理服务
│   │   ├── canvasRenderer.js    # Canvas渲染服务
│   │   └── backend/             # 后端服务
│   │       ├── ipcHandler.cjs   # IPC通信处理
│   │       ├── excelExporter.cjs # Excel导出
│   │       ├── localDatabase.cjs # 本地数据库
│   │       ├── dataMigration.cjs # 数据迁移
│   │       └── preload.cjs      # 预加载脚本
│   ├── styles/                  # 样式文件
│   ├── assets/                  # 静态资源
│   │   └── fonts/               # 字体文件
│   ├── hooks/                   # React Hooks
│   ├── utils/                   # 工具函数
│   ├── examples/                # 示例文件
│   └── main.jsx                 # 应用入口文件
├── test/                        # 测试文件
├── docs/                        # 文档目录
│   └── archive/                 # 归档文档
├── dist/                        # 构建输出目录
├── dist-electron/               # Electron构建输出
├── main.cjs                     # Electron主进程文件
├── preload.cjs                  # Electron预加载脚本
├── package.json                 # 项目配置
├── vite.config.js              # Vite配置
├── .eslintrc.json              # ESLint配置
├── .prettierrc.json            # Prettier配置
├── index.html                  # HTML模板
└── README.md                   # 项目说明
```

## 核心功能模块

### 1. 组件系统 (src/components/)
- **App.jsx**: 应用主组件，管理全局状态和布局
- **MainContent.jsx**: 主内容区域，包含设置和预览
- **PreviewPanel.jsx**: 表格预览和导出功能
- **SettingsPanel.jsx**: 尺码设置和类别管理
- **Select.jsx**: 优化的下拉选择组件，支持Portal渲染

### 2. 服务层 (src/services/)
- **tableExporter.js**: 表格导出为图片，支持高质量渲染
- **sizeCalculator.js**: 尺码数据计算和格式化
- **dataManager.js**: 数据持久化管理
- **canvasRenderer.js**: Canvas渲染优化

### 3. Electron集成 (src/services/backend/)
- **ipcHandler.cjs**: 主进程IPC通信处理
- **excelExporter.cjs**: Excel文件导出功能
- **localDatabase.cjs**: 本地SQLite数据库

## 技术栈

- **前端框架**: React 18
- **构建工具**: Vite
- **桌面应用**: Electron
- **样式方案**: Styled Components
- **动画库**: Framer Motion
- **字体系统**: MiSans 完整字重系列
- **数据库**: SQLite (better-sqlite3)
- **Excel处理**: ExcelJS

## 关键特性

1. **高质量渲染**: 800x800像素Canvas，优化字体渲染
2. **智能导出**: 自动递增文件名，支持自定义导出路径
3. **快捷键支持**: Ctrl+S快速导出
4. **Portal下拉菜单**: 解决overflow限制的下拉菜单定位
5. **动态缩放**: 根据数据量自动调整字体大小
6. **数据持久化**: 本地数据库存储用户设置

## 开发命令

```bash
npm run dev          # 开发模式
npm run build        # 构建生产版本
npm run electron-dev # Electron开发模式
npm run build-electron # 构建Electron应用
npm run test         # 运行测试
npm run lint         # 代码检查
npm run format       # 代码格式化
```

## 文件清理记录

2025-07-19 整理：
- 删除测试组件：TestApp.jsx, FontTest.jsx, QualityDemo.jsx等
- 删除重复文件：PreviewPanel_new.jsx
- 删除空的主文件：main-simple.cjs, main-standard.cjs, main.js
- 移动开发文档到docs/archive/目录
- 优化项目结构，保留核心功能文件
