# 尺码表生成器

一个基于 Electron + React + Vite 的现代化桌面应用程序，用于生成高质量的服装尺码表。

## ✨ 功能特性

- 🎯 **智能模式切换**: 支持普通和毛衣两种模式
- 📊 **实时预览**: 高质量Canvas渲染，800x800像素输出
- 📋 **多类别支持**: 上衣、裤子、内衣等多种尺码类别
- 🎨 **Finder风格UI**: 现代化的用户界面设计
- 💾 **数据持久化**: 本地SQLite数据库存储
- 📤 **智能导出**: 自动递增文件名，支持自定义导出路径
- ⌨️ **快捷键支持**: Ctrl+S快速导出
- 🔤 **优质字体**: MiSans完整字重系列，动态缩放
- 🎭 **Portal下拉菜单**: 解决overflow限制的UI组件

## 🛠 技术栈

- **前端框架**: React 18 + Vite 5
- **桌面应用**: Electron 27
- **样式方案**: Styled-components + Framer Motion  
- **字体系统**: MiSans 完整字重系列
- **数据库**: SQLite (better-sqlite3)
- **Excel处理**: ExcelJS
- **构建工具**: electron-builder

## 开发环境

### 系统要求

- Node.js 16+
- npm 或 yarn

### 安装依赖

\`\`\`bash
npm install
\`\`\`

### 开发模式

\`\`\`bash
# 启动开发服务器和 Electron
npm run electron-dev

# 仅启动前端开发服务器
npm run dev

# 仅启动 Electron
npm run electron
\`\`\`

### 构建应用

\`\`\`bash
# 构建前端
npm run build

# 构建并打包 Electron 应用
npm run build-electron
\`\`\`

## 项目结构

\`\`\`
├── src/                    # 前端源码
│   ├── components/         # React 组件
│   ├── hooks/             # 自定义 Hooks
│   ├── services/          # 服务层
│   ├── styles/            # 样式文件
│   └── utils/             # 工具函数
├── main.cjs               # Electron 主进程
├── preload.cjs            # Electron 预加载脚本
├── docs/                  # 项目文档
├── test/                  # 测试文件
└── dist/                  # 构建输出
\`\`\`

## 开发说明

### 主要组件

- `App.jsx` - 主应用组件
- `Toolbar.jsx` - 工具栏组件
- `CategorySelector.jsx` - 类别选择器
- `SizeChart.jsx` - 尺码表组件
- `PreviewPanel.jsx` - 预览面板

### 数据模型

应用支持两种模式：
- **普通模式**: 标准服装尺码
- **毛衣模式**: 毛衣专用尺码

### 本地存储

使用 SQLite 数据库存储：
- 尺码设置
- 用户偏好
- 历史记录

## 许可证

MIT License

## 更新日志

详见 `docs/` 目录中的相关文档。
