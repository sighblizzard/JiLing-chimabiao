# 🎯 集领商品部尺码表生成器

> 专为服装行业量身打造的高质量尺码表生成工具

一个基于 **Electron + React + Vite** 技术栈的现代化桌面应用程序，为服装设计师和商品部门提供专业的尺码表生成、预览和导出解决方案。

![Node Version](https://img.shields.io/badge/node-%3E%3D16-blue) ![Electron Version](https://img.shields.io/badge/electron-27-9feaf9) ![React Version](https://img.shields.io/badge/react-18-61dafb)

## ✨ 核心功能

### 🎯 智能尺码管理

- **12个预设类别**: 胸围、腰围、臀围、下摆围、肩宽、袖长、肩袖长、衣长、裤长、裙长、中后长、中前长
- **自定义类别**: 支持创建、编辑、删除个性化测量部位
- **智能毛衣模式**: 大围度类别(≥4cm)自动减半递增，适配毛衣弹性特征
- **起始值设置**: 为每个类别独立设置自定义起始数值

### 📊 高质量预览与导出

- **实时预览**: 高性能Canvas渲染，WYSIWYG所见即所得
- **3000像素导出**: 超高清PNG格式，满足印刷级别要求
- **自适应布局**: 预览界面自动调整，始终保持最佳显示效果
- **一键导出**: 支持自定义导出路径和文件名

### 🎨 现代化用户界面

- **Finder风格设计**: 遵循macOS设计语言，提供原生体验
- **MiSans字体系统**: 完整字重系列(Light/Regular/Medium/Semibold/Bold)
- **流畅动画**: Framer Motion驱动的微交互效果
- **响应式布局**: 适配不同屏幕尺寸，优化显示效果

### ⚡ 高效操作体验

- **快捷键支持**: Ctrl+S快速导出等常用快捷键
- **侧边栏搜索**: 类别快速搜索和筛选功能
- **记忆功能**: 自动保存最后使用的设置和偏好

## 🛠 技术架构

### 核心技术栈

- **前端框架**: React 18 + Vite 5
- **桌面应用**: Electron 27 + electron-builder
- **样式方案**: Styled-components + CSS-in-JS
- **动画引擎**: Framer Motion
- **字体系统**: MiSans 完整字重系列
- **测试框架**: Jest + 自定义验证脚本

### 可选扩展功能

- **数据持久化**: SQLite (better-sqlite3)
- **Excel处理**: ExcelJS 导入导出
- **云端同步**: 数据备份与恢复(预留接口)

## 📦 预设类别配置

| 类别名称 | 基础值(cm) | 递增值(cm) | 说明 |
|---------|-----------|-----------|------|
| 胸围 | 88 | 4 | 上身核心围度，毛衣模式减半 |
| 腰围 | 68 | 4 | 腰部围度，毛衣模式减半 |
| 臀围 | 92 | 4 | 下身围度，毛衣模式减半 |
| 下摆围 | 90 | 4 | 衣服下摆围度，毛衣模式减半 |
| 肩宽 | 38 | 1 | 肩部宽度，精确测量 |
| 袖长 | 58 | 1 | 袖子长度，标准递增 |
| 肩袖长 | 22 | 1 | 肩点到袖口距离 |
| 衣长 | 65 | 1 | 衣服总长度 |
| 裤长 | 100 | 1 | 裤子长度 |
| 裙长 | 60 | 1 | 裙子长度 |
| 中后长 | 38 | 1 | 后中心线长度 |
| 中前长 | 36 | 1 | 前中心线长度 |

## 🚀 快速开始

### 环境要求

- **Node.js**: 16.0+ (推荐使用 18.x LTS)
- **NPM**: 8.0+ 或 **Yarn**: 1.22+
- **操作系统**: Windows 10+, macOS 10.14+, Ubuntu 18.04+

### 安装与运行

```bash
# 克隆项目
git clone https://github.com/SX2000CN/JiLing-chimabiao.git
cd chi-ma-biao-7.16

# 安装依赖
npm install

# 开发模式 - 同时启动前端和Electron
npm run electron-dev

# 仅启动前端开发服务器
npm run dev

# 仅启动Electron应用
npm run electron
```

### 构建与打包

```bash
# 构建前端资源
npm run build

# 构建并打包Electron应用
npm run build-electron

# 运行测试套件
npm test
```

## 📁 项目结构

```
chi-ma-biao-7.16/
├── 📂 src/                     # 源代码目录
│   ├── 📂 components/          # React组件 (19个)
│   │   ├── App.jsx            # 🏠 主应用组件
│   │   ├── PreviewPanel.jsx   # 👁️ 预览面板
│   │   ├── SettingsPanel.jsx  # ⚙️ 设置面板
│   │   ├── CategoryManager.jsx # 📋 类别管理器
│   │   └── ...                # 其他UI组件
│   ├── 📂 services/           # 业务逻辑服务 (9个)
│   │   ├── dataManager.js     # 📊 数据管理
│   │   ├── sizeCalculator.js  # 🧮 尺码计算
│   │   ├── tableExporter.js   # 📤 表格导出
│   │   └── backend/           # 🔧 Electron后端服务
│   ├── 📂 styles/             # 样式文件
│   ├── 📂 assets/fonts/       # MiSans字体系统
│   ├── 📂 hooks/              # React Hooks
│   └── 📂 utils/              # 工具函数
├── 📂 test/                   # 测试文件 (10个)
├── 📂 docs/                   # 项目文档
├── 📄 main.cjs                # Electron主进程
├── 📄 package.json            # 项目配置
└── 📄 vite.config.js          # Vite构建配置
```

## 💡 使用指南

### 基本操作流程

1. **选择尺码范围**: 从XS到4XL选择起始尺码和数量
2. **添加测量类别**: 从12个预设中选择或创建自定义类别
3. **设置起始值**: 为每个类别设置合适的起始数值
4. **实时预览**: 在右侧面板查看生成的尺码表
5. **导出表格**: 使用Ctrl+S或导出按钮保存高清PNG图片

### 高级功能

- **毛衣模式**: 启用后大围度类别递增值自动减半
- **自定义类别**: 创建特殊测量部位，设置个性化递增值
- **批量操作**: 支持多个类别同时编辑和管理
- **导出设置**: 自定义文件名和保存路径

## 🧪 测试

项目包含完整的测试体系，确保功能稳定性：

```bash
# 运行Jest测试套件
npm test

# 运行特定功能验证
npm run test:category     # 类别管理测试
npm run test:calculator   # 尺码计算测试
npm run test:export      # 导出功能测试
```

### 测试覆盖

- ✅ **数据管理**: 类别验证、创建、预设检查
- ✅ **尺码计算**: 序列生成、数据计算、设置验证
- ✅ **画布渲染**: 图表生成、配置验证
- ✅ **集成测试**: 完整的尺码表生成流程

## 🔧 配置说明

### 字体配置

项目集成MiSans字体系列，提供以下字重：

- **Light**: 轻量文字，用于辅助信息
- **Regular**: 常规文字，用于正文内容  
- **Medium**: 中等文字，用于强调内容
- **Semibold**: 半粗体，用于小标题
- **Bold**: 粗体，用于主标题和重点

### 导出配置

- **分辨率**: 3000×3000像素(可配置)
- **格式**: PNG格式，支持透明背景
- **质量**: 无损压缩，确保印刷质量
- **命名**: 智能递增命名，避免文件覆盖

## 📖 开发文档

详细的开发文档位于 `docs/` 目录：

- 📋 [功能文档](docs/尺码表生成器功能文档.md) - 详细功能说明
- 🎨 [界面设计](docs/前端开发清单-Finder风格.md) - UI设计规范
- 🔧 [技术架构](docs/后端实现指南.md) - 技术实现细节
- 📝 [开发日志](docs/开发日志-2025-07-17.md) - 开发过程记录

## 🤝 贡献指南

欢迎贡献代码和建议！请遵循以下步骤：

1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🎉 致谢

- **MiSans字体**: 小米公司开源字体项目
- **React团队**: 提供优秀的前端框架
- **Electron团队**: 跨平台桌面应用解决方案
- **集领商品部**: 专业需求指导和测试支持

---

<div align="center">

**[⬆ 回到顶部](#-集领商品部尺码表生成器)**

Made with ❤️ by the JiLing Development Team

</div>
