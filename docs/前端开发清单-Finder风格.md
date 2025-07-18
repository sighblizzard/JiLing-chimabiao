# 前端开发清单 - Finder 风格尺码表生成器

## 📋 开发概览

本项目旨在复刻 macOS Finder 的界面设计和交互体验，打造专业的尺码表生成器桌面应用。

### 🎯 设计目标
- **原生体验**：完全遵循 macOS 设计语言
- **直观交互**：Finder 风格的操作逻辑
- **专业功能**：服装行业专用工具
- **高性能**：流畅的用户体验

---

## 🏗️ 技术架构

### 核心技术栈
```bash
React 18             # 前端框架
Styled Components    # CSS-in-JS 样式方案
Framer Motion       # 动画库
React DnD           # 拖拽功能
Ant Design 5        # 基础组件库 (深度定制)
React Hotkeys Hook  # 快捷键处理
```

### 项目结构 (已更新)
```bash
src/
├── components/          # 所有组件 (扁平化结构)
│   ├── App.jsx         # 应用主入口 (已简化状态管理)
│   ├── TitleBar.jsx    # 标题栏 (交通灯按钮)
│   ├── Toolbar.jsx     # 工具栏 (已精简，移除重复按钮)
│   ├── Sidebar.jsx     # 侧边栏导航 (支持动态递增值显示)
│   ├── MainContent.jsx # 主内容区域 (优化布局)
│   ├── StatusBar.jsx   # 状态栏
│   ├── Button.jsx      # 按钮组件
│   ├── Input.jsx       # 输入框组件
│   ├── Select.jsx      # 下拉选择器
│   ├── Table.jsx       # 表格组件
│   ├── Modal.jsx       # 模态框组件
│   ├── SegmentedControl.jsx # 分段控制器 (支持size属性)
│   ├── SizeSettings.jsx     # 尺码设置面板 (紧凑布局优化)
│   ├── CategoryManager.jsx  # 类别管理面板
│   ├── PreviewPanel.jsx     # 预览面板 (集成所有导出功能)
│   └── SettingsPanel.jsx    # 设置面板
├── hooks/              # 自定义 Hooks (按需添加)
│   ├── useKeyboard.js      # 快捷键处理
│   └── useAnimation.js     # 动画控制
├── services/           # 业务逻辑 (纯函数)
│   ├── sizeCalculator.js   # 尺码计算 (智能毛衣模式逻辑)
│   ├── dataManager.js      # 数据管理
│   └── canvasRenderer.js   # Canvas 渲染
├── styles/             # 样式文件
│   ├── theme.js            # 主题配置
│   ├── globals.css         # 全局样式
│   └── animations.js       # 动画定义
├── utils/              # 工具函数
│   ├── constants.js        # 常量定义
│   ├── helpers.js          # 辅助函数
│   └── validators.js       # 数据验证
├── test/               # 测试文件
│   └── verify-auto-type.js # 智能类型识别测试
└── types.js            # TypeScript 类型定义 (合并为一个文件)
```

---

## 🎨 设计系统 - Finder 风格

### 1. 色彩规范

#### 主色调 (macOS 系统色)
```css
/* 系统灰色 */
--gray-50: #f9f9f9;     /* 背景色 */
--gray-100: #f0f0f0;    /* 分割线 */
--gray-200: #e0e0e0;    /* 边框 */
--gray-300: #d0d0d0;    /* 次要文本 */
--gray-600: #6b7280;    /* 主要文本 */
--gray-900: #111827;    /* 标题文本 */

/* 系统蓝色 (选中状态) */
--blue-500: #007AFF;    /* 选中背景 */
--blue-600: #0056CC;    /* 选中边框 */

/* 窗口控制按钮 */
--red: #FF5F57;         /* 关闭按钮 */
--yellow: #FFBD2E;      /* 最小化按钮 */
--green: #28CA42;       /* 最大化按钮 */
```

#### 语义色彩
```css
/* 功能色 */
--success: #34D399;     /* 成功状态 */
--warning: #FBBF24;     /* 警告状态 */
--error: #EF4444;       /* 错误状态 */
--info: #3B82F6;        /* 信息提示 */
```

### 2. 字体规范

#### SF Pro Display (macOS 系统字体)
```css
/* 字体家族 */
font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;

/* 字体大小 */
--text-xs: 12px;        /* 辅助信息 */
--text-sm: 14px;        /* 正文 */
--text-base: 16px;      /* 基础文本 */
--text-lg: 18px;        /* 小标题 */
--text-xl: 20px;        /* 大标题 */
--text-2xl: 24px;       /* 主标题 */

/* 字重 */
--font-normal: 400;     /* 正常 */
--font-medium: 500;     /* 中等 */
--font-semibold: 600;   /* 半粗体 */
--font-bold: 700;       /* 粗体 */
```

### 3. 间距规范

#### 统一间距系统
```css
/* 间距单位 (8px 基准) */
--space-1: 4px;         /* 极小间距 */
--space-2: 8px;         /* 小间距 */
--space-3: 12px;        /* 默认间距 */
--space-4: 16px;        /* 中等间距 */
--space-6: 24px;        /* 大间距 */
--space-8: 32px;        /* 超大间距 */
--space-12: 48px;       /* 区块间距 */
```

### 4. 圆角规范
```css
/* 圆角系统 */
--radius-sm: 4px;       /* 小圆角 */
--radius: 6px;          /* 默认圆角 */
--radius-md: 8px;       /* 中等圆角 */
--radius-lg: 12px;      /* 大圆角 */
--radius-full: 50%;     /* 圆形 */
```

---

## 📱 开发流程

### 阶段一：基础框架搭建

#### 核心架构设计
```jsx
// App.jsx - 简化的应用主入口
import { ThemeProvider } from 'styled-components';
import { useState } from 'react';
import { theme } from './styles/theme';
import { TitleBar } from './components/TitleBar';
import { Toolbar } from './components/Toolbar';
import { Sidebar } from './components/Sidebar';
import { MainContent } from './components/MainContent';
import { StatusBar } from './components/StatusBar';

const App = () => {
  // 简单的状态管理 - 直接在 App 层级
  const [appState, setAppState] = useState({
    mode: 'normal',
    sizeSettings: { startSize: 'S', count: 4 },
    selectedCategories: [],
    categories: [],
    categoryStartValues: {}, // 存储每个类别的自定义起始值
    chartData: null
  });

  return (
    <ThemeProvider theme={theme}>
      <div className="app">
        <TitleBar />
        <Toolbar appState={appState} setAppState={setAppState} />
        <div className="content">
          <Sidebar appState={appState} setAppState={setAppState} />
          <MainContent appState={appState} setAppState={setAppState} />
        </div>
        <StatusBar />
      </div>
    </ThemeProvider>
  );
};
```

#### 1.1 窗口框架
```jsx
// TitleBar.jsx - macOS 标题栏
const TitleBar = () => (
  <StyledTitleBar>
    <TrafficLights>
      <ControlButton color="red" />
      <ControlButton color="yellow" />
      <ControlButton color="green" />
    </TrafficLights>
    <WindowTitle>尺码表生成器</WindowTitle>
    <ToolbarButtons>
      <IconButton icon="settings" />
      <IconButton icon="help" />
    </ToolbarButtons>
  </StyledTitleBar>
);
```

### 阶段二：侧边栏导航

#### 核心实现逻辑 (已优化)
```jsx
// Sidebar.jsx - 侧边栏组件架构
const Sidebar = ({ appState, setAppState }) => {
  const { categories, selectedCategories, mode } = appState;
  
  // 简单的类别分组逻辑，直接在组件内部处理
  const presetCategories = categories.filter(cat => !cat.isCustom);
  const customCategories = categories.filter(cat => cat.isCustom);
  
  return (
    <SidebarContainer>
      <Input placeholder="搜索类别..." />
      <CategorySection 
        title="预设类别" 
        categories={presetCategories}
        mode={mode}
        selectedIds={selectedCategories.map(cat => cat.id)}
        onToggle={handleToggleCategory}
      />
      <CategorySection 
        title="自定义类别" 
        categories={customCategories}
        mode={mode}
        selectedIds={selectedCategories.map(cat => cat.id)}
        onToggle={handleToggleCategory}
      />
    </SidebarContainer>
  );
};

// 类别区域组件 - 传递模式信息
const CategorySection = ({ title, categories, mode, selectedIds, onToggle }) => (
  <SectionContainer>
    <SectionTitle>{title}</SectionTitle>
    {categories.map(category => (
      <CategoryItem 
        key={category.id} 
        category={category} 
        mode={mode}
        isSelected={selectedIds.includes(category.id)}
        onToggle={onToggle}
      />
    ))}
  </SectionContainer>
);

// 类别列表项 - 支持选中、右键、拖拽，动态显示递增值
const CategoryItem = ({ category, isSelected, onSelect, mode }) => {
  const handleContextMenu = (e) => {
    e.preventDefault();
    // 右键菜单逻辑
  };
  
  // 计算在当前模式下的实际递增值
  const getActualIncrement = (category) => {
    let increment = category.baseIncrement;
    if (mode === 'sweater' && category.baseIncrement >= 4) {
      increment = category.baseIncrement / 2;
    }
    return increment;
  };
  
  return (
    <CategoryItemContainer
      $selected={isSelected}
      onClick={() => onSelect(category.id)}
      onContextMenu={handleContextMenu}
    >
      <CategoryIcon type={category.type} iconUrl={category.iconUrl}>
        {category.name.charAt(0)}
      </CategoryIcon>
      <CategoryInfo>
        <CategoryName>{category.name}</CategoryName>
        <CategoryMeta>
          <span>基础 {category.baseValue}cm</span>
          <CategoryBadge>+{getActualIncrement(category)}cm</CategoryBadge>
        </CategoryMeta>
      </CategoryInfo>
    </CategoryItemContainer>
  );
};
```

### 阶段三：工具栏设计

#### 精简工具栏实现（已优化）
```jsx
// Toolbar.jsx - 精简化工具栏设计
const Toolbar = ({ appState, setAppState, onGenerate }) => {
  const { mode, selectedCategories, chartData } = appState;

  // 模式选项
  const modeOptions = [
    { label: '普通', value: 'normal' },
    { label: '毛衣', value: 'sweater' }
  ];

  const handleModeChange = (newMode) => {
    setAppState(prev => ({ ...prev, mode: newMode }));
  };

  return (
    <ToolbarContainer>
      <ToolbarSection>
        <ModeSelector>
          <ModeLabel>模式:</ModeLabel>
          <SegmentedControl
            options={modeOptions}
            value={mode}
            onChange={handleModeChange}
            size="small"
          />
        </ModeSelector>
        
        <StatusIndicator>
          <StatusDot />
          {selectedCategories.length === 0 ? '请选择类别' : 
           !chartData ? '准备生成' : '已生成'}
        </StatusIndicator>
      </ToolbarSection>

      <ToolbarSection>
        {/* 核心功能按钮 - 移除重复的预览、导出、保存按钮 */}
        <Button
          variant="primary"
          size="small"
          onClick={onGenerate}
          disabled={selectedCategories.length === 0}
          icon="📊"
        >
          生成尺码表
        </Button>
      </ToolbarSection>
    </ToolbarContainer>
  );
};
```

#### 分段控制器实现
```jsx
// SegmentedControl.jsx - Finder 风格分段控制器
const SegmentedControl = ({ options, value, onChange, size = "normal" }) => (
  <SegmentContainer $size={size}>
    {options.map((option, index) => (
      <SegmentButton
        key={option.value}
        $active={value === option.value}
        $position={getPosition(index, options.length)}
        onClick={() => onChange(option.value)}
      >
        {option.label}
      </SegmentButton>
    ))}
  </SegmentContainer>
);

// 样式实现 - macOS 原生外观
const SegmentContainer = styled.div`
  display: flex;
  background: ${props => props.theme.colors.gray[100]};
  border-radius: 6px;
  padding: 2px;
  border: 1px solid ${props => props.theme.colors.border.medium};
  
  ${props => props.$size === 'small' && `
    font-size: 12px;
    padding: 1px;
  `}
`;
```

### 阶段四：主内容区域

#### 简化的状态管理
在 App.jsx 中直接使用 useState 进行状态管理，保持架构简单清晰：

```jsx
// App.jsx 中的状态管理（已在上面核心架构中展示）
const [appState, setAppState] = useState({
  mode: 'normal',
  sizeSettings: { startSize: 'S', count: 4 },
  selectedCategories: [],
  categories: [],
  chartData: null
});

// 状态更新通过 setAppState 直接操作
// 各个组件通过 props 接收 appState 和 setAppState
```

```jsx
// services/sizeCalculator.js - 纯函数业务逻辑 (已优化)
export const generateSizeSequence = (startSize, count) => {
  const sizes = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL'];
  const startIndex = sizes.indexOf(startSize);
  return sizes.slice(startIndex, startIndex + count);
};

export const calculateSizeData = (sizeSettings, selectedCategories, mode, categoryStartValues = {}) => {
  const { startSize, count } = sizeSettings;
  const sizeSequence = generateSizeSequence(startSize, count);
  
  return selectedCategories.map(category => {
    // 智能毛衣模式计算：基于递增值而非类型
    let increment = category.baseIncrement;
    if (mode === 'sweater' && category.baseIncrement >= 4) {
      // 毛衣模式下，递增值≥4cm的类别进行减半处理
      increment = category.baseIncrement / 2;
    }
    
    // 使用自定义起始值或默认基础值
    const startValue = categoryStartValues[category.id] !== undefined 
      ? categoryStartValues[category.id] 
      : category.baseValue;
      
    return {
      category,
      values: sizeSequence.map((size, index) => ({
        size,
        value: startValue + (increment * index)
      }))
    };
  });
};
```

#### 4.1 尺码设置面板 (已优化布局)

```jsx
// SizeSettings.jsx - 尺码设置面板 (包含类别起始值设置)
import { generateSizeSequence } from '../services/sizeCalculator';

const SizeSettings = ({ appState, setAppState }) => {
  const { sizeSettings, selectedCategories, categoryStartValues, categories, mode } = appState;
  const { startSize, count } = sizeSettings;
  
  const updateSizeSettings = (updates) => {
    setAppState(prev => ({
      ...prev,
      sizeSettings: { ...prev.sizeSettings, ...updates }
    }));
  };
  
  // 计算在当前模式下的实际递增值
  const getActualIncrement = (category) => {
    let increment = category.baseIncrement;
    if (mode === 'sweater' && category.baseIncrement >= 4) {
      increment = category.baseIncrement / 2;
    }
    return increment;
  };
  
  // 更新类别起始值
  const updateCategoryStartValue = (categoryId, value) => {
    const numValue = parseFloat(value);
    const newStartValues = { ...categoryStartValues };
    
    if (isNaN(numValue) || value === '') {
      delete newStartValues[categoryId];
    } else {
      newStartValues[categoryId] = numValue;
    }
    
    setAppState(prev => ({
      ...prev,
      categoryStartValues: newStartValues
    }));
  };
  
  const generatedSizes = generateSizeSequence(startSize, count);
  
  return (
    <PanelContainer>
      <PanelHeader>
        <Title>尺码设置</Title>
        <Subtitle>配置尺码范围和数量</Subtitle>
      </PanelHeader>
      
      {/* 紧凑的基础尺码设置 - 同行布局 */}
      <SettingsGrid>
        <CompactRow>
          <Label>起始尺码</Label>
          <Select
            value={startSize}
            onChange={(value) => updateSizeSettings({ startSize: value })}
            options={['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL']}
            size="small"
            helperText="选择尺码表的第一个尺码"
          />
          <Label>尺码数量</Label>
          <Input
            type="number"
            value={count}
            onChange={(value) => updateSizeSettings({ count: parseInt(value) })}
            min={1}
            max={8}
            size="small"
            helperText="设置要生成的尺码总数量（1-8个）"
          />
        </CompactRow>
      </SettingsGrid>
      
      {/* 尺码预览 - 更紧凑的样式 */}
      {generatedSizes.length > 0 && (
        <PreviewSection>
          <PreviewTitle>尺码预览</PreviewTitle>
          <SizePreview>
            {generatedSizes.map((size, index) => (
              <SizeTag key={size}>{size}</SizeTag>
            ))}
          </SizePreview>
        </PreviewSection>
      )}
      
      {/* 类别起始值设置 - 显示动态递增值 */}
      {selectedCategories.length > 0 && (
        <StartValuesSection>
          <PreviewTitle>类别起始值设置</PreviewTitle>
          {selectedCategories.map(category => (
            <CategoryStartValueItem key={category.id}>
              <CategoryIcon color={category.color}>
                {category.name.charAt(0)}
              </CategoryIcon>
              <CategoryInfo>
                <CategoryName>{category.name}</CategoryName>
                <CategoryType>递增：{getActualIncrement(category)}cm</CategoryType>
              </CategoryInfo>
              <ValueInput
                type="number"
                step="0.5"
                min="0"
                value={categoryStartValues[category.id] || category.baseValue}
                onChange={(e) => updateCategoryStartValue(category.id, e.target.value)}
              />
              <span>cm</span>
            </CategoryStartValueItem>
          ))}
        </StartValuesSection>
      )}
    </PanelContainer>
  );
};

// 新增紧凑布局样式
const CompactRow = styled.div`
  display: grid;
  grid-template-columns: 80px 1fr 80px 1fr;
  gap: 12px;
  align-items: start;

  @media (max-width: 768px) {
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 6px;
  }
`;

// 优化的样式组件
const SettingsGrid = styled.div`
  display: grid;
  gap: 16px;
  margin-bottom: 24px;
`;

const Label = styled.label`
  font-size: 13px;
  font-weight: 600;
  color: ${props => props.theme.colors.gray[700]};
  padding-top: 8px;
  white-space: nowrap;
`;

const PreviewSection = styled.div`
  background: ${props => props.theme.colors.background.primary};
  border: 1px solid ${props => props.theme.colors.border.light};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 16px;
  margin-bottom: 20px;
`;

const SizeTag = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  background: ${props => props.theme.colors.primary}15;
  color: ${props => props.theme.colors.primary};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: 12px;
  font-weight: 500;
  border: 1px solid ${props => props.theme.colors.primary}30;
`;
```
      </SettingsGrid>
      
      {/* 尺码预览 */}
      {generatedSizes.length > 0 && (
        <PreviewSection>
          <PreviewTitle>尺码预览</PreviewTitle>
          <SizePreview>
            {generatedSizes.map((size) => (
              <SizeTag key={size}>{size}</SizeTag>
            ))}
          </SizePreview>
        </PreviewSection>
      )}
      
      {/* 类别起始值设置 */}
      {selectedCategories.length > 0 && (
        <StartValuesSection>
          <PreviewTitle>类别起始值设置</PreviewTitle>
          <StartValuesGrid>
            {selectedCategories.map((category) => (
              <CategoryRow key={category.id}>
                <CategoryIcon color={category.color}>
                  {category.name.substring(0, 2)}
                </CategoryIcon>
                
                <CategoryInfo>
                  <CategoryName>{category.name}</CategoryName>
                  <CategoryType>递增：{category.baseIncrement}cm</CategoryType>
                </CategoryInfo>
                
                <ValueInput
                  type="number"
                  step="0.5"
                  value={categoryStartValues[category.id] || category.baseValue}
                  onChange={(e) => updateCategoryStartValue(category.id, e.target.value)}
                  placeholder={category.baseValue.toString()}
                />
                
                <UnitLabel>cm</UnitLabel>
              </CategoryRow>
            ))}
          </StartValuesGrid>
        </StartValuesSection>
      )}
    </PanelContainer>
  );
};
```

#### 4.2 类别管理面板
```jsx
// CategoryManagerPanel.jsx - 类别管理
const CategoryManagerPanel = ({ appState, setAppState }) => {
  const { categories } = appState;
  
  const handleAddCategory = (newCategory) => {
    setAppState(prev => ({
      ...prev,
      categories: [...prev.categories, { ...newCategory, id: Date.now() }]
    }));
  };
  
  const handleEditCategory = (categoryId, updates) => {
    setAppState(prev => ({
      ...prev,
      categories: prev.categories.map(cat => 
        cat.id === categoryId ? { ...cat, ...updates } : cat
      )
    }));
  };
  
  const handleDeleteCategory = (categoryId) => {
    setAppState(prev => ({
      ...prev,
      categories: prev.categories.filter(cat => cat.id !== categoryId)
    }));
  };
  
  return (
    <PanelContainer>
      <PanelHeader>
        <Title>类别管理</Title>
        <Button onClick={handleAddCategory}>
          + 新建类别
        </Button>
      </PanelHeader>
      
      <CategoryGrid>
        {categories.map(category => (
          <div
            key={category.id}
            className="category-card"
          >
            <h4>{category.name}</h4>
            <p>{category.baseIncrement}cm 递增</p>
            <div>
              <Button onClick={() => handleEditCategory(category.id)}>编辑</Button>
              <Button onClick={() => handleDeleteCategory(category.id)}>删除</Button>
            </div>
          </div>
        ))}
      </CategoryGrid>
    </PanelContainer>
  );
};
```

#### 4.3 预览面板
```jsx
// PreviewPanel.jsx - 尺码表预览
const PreviewPanel = ({ appState, setAppState }) => {
  const { chartData } = appState;
  const [viewMode, setViewMode] = useState('表格');
  
  const handleExport = () => {
    // 导出逻辑
    console.log('导出尺码表', chartData);
  };
  
  const handlePrint = () => {
    // 打印逻辑
    window.print();
  };
  
  return (
    <PanelContainer>
      <PanelHeader>
        <Title>尺码表预览</Title>
        <SegmentedControl
          options={['表格', '图形']}
          value={viewMode}
          onChange={setViewMode}
        />
      </PanelHeader>
      
      <PreviewContent>
        {viewMode === '表格' ? (
          <Table data={chartData} />
        ) : (
          <div>图形展示区域</div>
        )}
      </PreviewContent>
      
      <PreviewActions>
        <Button onClick={handleExport}>导出图片</Button>
        <Button variant="outline" onClick={handlePrint}>打印</Button>
      </PreviewActions>
    </PanelContainer>
  );
};
```

---

## 🎭 交互体验开发

### 阶段五：Finder 风格交互 (2-3天)

#### 5.1 快捷键系统
```jsx
// useKeyboardShortcuts.js - 快捷键 Hook
const useKeyboardShortcuts = () => {
  useHotkeys('cmd+n', handleNewCategory);
  useHotkeys('cmd+e', handleExport);
  useHotkeys('cmd+r', handleRefresh);
  useHotkeys('space', handleQuickLook);
  useHotkeys('delete', handleDelete);
  useHotkeys('cmd+f', handleSearch);
  useHotkeys('cmd+comma', handleSettings);
};
```

#### 5.2 右键上下文菜单
```jsx
// ContextMenu.jsx - 右键菜单
const ContextMenu = ({ x, y, items, onClose }) => (
  <ContextMenuOverlay onClick={onClose}>
    <ContextMenuContainer style={{ left: x, top: y }}>
      {items.map(item => (
        <ContextMenuItem
          key={item.id}
          onClick={item.action}
          disabled={item.disabled}
        >
          <MenuIcon>{item.icon}</MenuIcon>
          <MenuText>{item.label}</MenuText>
          <MenuShortcut>{item.shortcut}</MenuShortcut>
        </ContextMenuItem>
      ))}
    </ContextMenuContainer>
  </ContextMenuOverlay>
);
```

#### 5.3 空格预览功能 (Quick Look)
```jsx
// QuickLook.jsx - 快速预览
const QuickLook = ({ isOpen, data, onClose }) => (
  <AnimatePresence>
    {isOpen && (
      <QuickLookOverlay
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <QuickLookPanel
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={e => e.stopPropagation()}
        >
          <QuickLookHeader>
            <Title>{data.name}</Title>
            <CloseButton onClick={onClose}>×</CloseButton>
          </QuickLookHeader>
          <QuickLookContent>
            <PreviewCanvas data={data} />
          </QuickLookContent>
        </QuickLookPanel>
      </QuickLookOverlay>
    )}
  </AnimatePresence>
);
```

### 阶段六：动画和过渡 (2天)

#### 6.1 页面过渡动画
```jsx
// PageTransition.jsx - 页面切换动画
const PageTransition = ({ children, direction = 'left' }) => (
  <AnimatePresence mode="wait">
    <motion.div
      key={location.pathname}
      initial={{ 
        x: direction === 'left' ? -100 : 100,
        opacity: 0 
      }}
      animate={{ 
        x: 0,
        opacity: 1 
      }}
      exit={{ 
        x: direction === 'left' ? 100 : -100,
        opacity: 0 
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30
      }}
    >
      {children}
    </motion.div>
  </AnimatePresence>
);
```

#### 6.2 列表项动画
```jsx
// ListAnimation.jsx - 列表动画
const AnimatedList = ({ items }) => (
  <motion.div layout>
    <AnimatePresence>
      {items.map((item, index) => (
        <motion.div
          key={item.id}
          layout
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ 
            delay: index * 0.1,
            type: "spring",
            stiffness: 300,
            damping: 25
          }}
        >
          <ListItem item={item} />
        </motion.div>
      ))}
    </AnimatePresence>
  </motion.div>
);
```

#### 6.3 微交互动画
```jsx
// MicroAnimations.js - 微交互动画
const useHoverAnimation = () => {
  const [isHovered, setIsHovered] = useState(false);
  
  const hoverProps = {
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false),
    whileHover: { scale: 1.02 },
    whileTap: { scale: 0.98 },
    transition: { type: "spring", stiffness: 400, damping: 25 }
  };
  
  return { isHovered, hoverProps };
};
```

---

## 🧩 组件开发清单

### 基础组件 (按优先级排序)

- [ ] **Button** - macOS 风格按钮 (多种样式)
- [ ] **Input** - 输入框组件
- [ ] **Select** - 下拉选择器
- [ ] **Table** - 数据表格
- [ ] **Modal** - 模态框
- [ ] **Loading** - 加载指示器
- [ ] **Toast** - 消息提示

### 布局组件
- [ ] **TitleBar** - 标题栏 (交通灯按钮)
- [ ] **Toolbar** - 工具栏
- [ ] **Sidebar** - 侧边栏
- [ ] **MainContent** - 主内容区域
- [ ] **StatusBar** - 状态栏

### Finder 特色组件
- [ ] **ContextMenu** - 右键菜单
- [ ] **QuickLook** - 空格预览
- [ ] **SegmentedControl** - 分段控制器

### 业务组件
- [ ] **SizeSettings** - 尺码设置面板
- [ ] **CategoryManager** - 类别管理面板
- [ ] **PreviewPanel** - 预览面板
- [ ] **ExportDialog** - 导出对话框

---

## 🎨 样式系统开发

### CSS-in-JS 架构

#### 主题系统
```jsx
// theme.js - 主题配置
export const theme = {
  colors: {
    // 系统色彩
    primary: '#007AFF',
    secondary: '#5856D6',
    success: '#34C759',
    warning: '#FF9500',
    error: '#FF3B30',
    
    // 灰度色阶
    gray: {
      50: '#F9FAFB',
      100: '#F3F4F6',
      200: '#E5E7EB',
      300: '#D1D5DB',
      400: '#9CA3AF',
      500: '#6B7280',
      600: '#4B5563',
      700: '#374151',
      800: '#1F2937',
      900: '#111827',
    },
    
    // 背景色
    background: {
      primary: '#FFFFFF',
      secondary: '#F8F9FA',
      tertiary: '#F1F3F4',
    },
    
    // 边框色
    border: {
      light: '#E5E7EB',
      medium: '#D1D5DB',
      dark: '#9CA3AF',
    }
  },
  
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px',
  },
  
  typography: {
    fontFamily: {
      sans: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'sans-serif'],
    },
    fontSize: {
      xs: '12px',
      sm: '14px',
      base: '16px',
      lg: '18px',
      xl: '20px',
      '2xl': '24px',
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    }
  },
  
  borderRadius: {
    sm: '4px',
    md: '6px',
    lg: '8px',
    xl: '12px',
    full: '50%',
  },
  
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  }
};
```

#### 样式工具函数
```jsx
// styleUtils.js - 样式工具
export const createGlassEffect = (opacity = 0.8) => css`
  background: rgba(255, 255, 255, ${opacity});
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

export const createHoverEffect = () => css`
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

export const createFocusRing = (color = '#007AFF') => css`
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px ${color}33;
  }
`;
```

---

## 🚀 开发里程碑

### 第一阶段：基础框架
**目标**：建立项目基础架构和核心布局
- [ ] 项目初始化 + 开发环境配置
- [ ] 设计系统和主题配置
- [ ] 窗口框架 + 标题栏组件
- [ ] 侧边栏和工具栏基础结构

### 第二阶段：核心功能
**目标**：实现主要业务功能和数据流
- [ ] 主内容区域组件开发
- [ ] 状态管理和数据流设计
- [ ] 尺码计算和类别管理逻辑
- [ ] 基础交互功能实现

### 第三阶段：交互体验
**目标**：完善 Finder 风格交互和用户体验
- [ ] 快捷键系统和右键菜单
- [ ] 拖拽功能和空格预览
- [ ] 动画和过渡效果
- [ ] 响应式适配和优化

### 第四阶段：优化完善
**目标**：性能优化和质量保证
- [ ] 性能优化和错误处理
- [ ] 单元测试和集成测试
- [ ] 代码规范和文档完善
- [ ] 构建配置和部署准备

---

## 🧪 测试策略

### 单元测试
```jsx
// CategoryItem.test.jsx
import { render, fireEvent } from '@testing-library/react';
import { CategoryItem } from '../CategoryItem';

describe('CategoryItem', () => {
  test('应该正确渲染类别信息', () => {
    const category = {
      id: '1',
      name: '胸围',
      baseIncrement: 4,
      isCustom: false
    };
    
    const { getByText } = render(
      <CategoryItem category={category} />
    );
    
    expect(getByText('胸围')).toBeInTheDocument();
    expect(getByText('4cm')).toBeInTheDocument();
  });
  
  test('应该响应点击事件', () => {
    const onSelect = jest.fn();
    const category = {
      id: '1',
      name: '胸围',
      baseIncrement: 4,
      isCustom: false
    };
    
    const { container } = render(
      <CategoryItem category={category} onSelect={onSelect} />
    );
    
    fireEvent.click(container.firstChild);
    expect(onSelect).toHaveBeenCalledWith(category.id);
  });
});
```

### 集成测试
```jsx
// SizeSettingsPanel.test.jsx
import { render, fireEvent, waitFor } from '@testing-library/react';

describe('SizeSettingsPanel', () => {
  test('应该能正确设置尺码范围', async () => {
    const mockAppState = {
      sizeSettings: { startSize: 'S', count: 4 }
    };
    const mockSetAppState = jest.fn();
    
    const { getByLabelText, getByText } = render(
      <SizeSettingsPanel appState={mockAppState} setAppState={mockSetAppState} />
    );
    
    // 选择起始尺码
    const sizeSelector = getByLabelText('起始尺码');
    fireEvent.change(sizeSelector, { target: { value: 'M' } });
    
    // 设置数量
    const countInput = getByLabelText('尺码数量');
    fireEvent.change(countInput, { target: { value: '5' } });
    
    // 验证预览更新
    await waitFor(() => {
      expect(getByText('M, L, XL, 2XL, 3XL')).toBeInTheDocument();
    });
  });
});
```

---

## 📦 打包部署

### 开发环境配置
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "jest",
    "test:watch": "jest --watch",
    "lint": "eslint src --ext .js,.jsx,.ts,.tsx",
    "format": "prettier --write src/**/*.{js,jsx,ts,tsx}"
  }
}
```

### 构建优化
```javascript
// vite.config.js
export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'ui-vendor': ['antd', 'styled-components'],
          'animation-vendor': ['framer-motion'],
        }
      }
    }
  },
  css: {
    modules: {
      localsConvention: 'camelCase'
    }
  }
};
```

---

## ✅ 验收标准

### 视觉还原度
- [ ] **95%+** 的 Finder 视觉相似度
- [ ] **完整** 的 macOS 设计语言支持
- [ ] **流畅** 的动画和过渡效果
- [ ] **响应式** 的布局适配

### 交互体验
- [ ] **完整** 的快捷键支持
- [ ] **直观** 的拖拽操作
- [ ] **快速** 的空格预览
- [ ] **丰富** 的右键菜单

### 性能指标
- [ ] **< 3s** 首屏加载时间
- [ ] **< 100ms** 交互响应时间
- [ ] **< 50MB** 内存占用
- [ ] **60fps** 动画帧率

### 代码质量
- [ ] **> 80%** 测试覆盖率
- [ ] **0** ESLint 错误
- [ ] **TypeScript** 类型完整
- [ ] **统一** 的代码风格

---

## 🎯 核心技术要点

### 项目优势

- **📁 扁平化结构**: 所有组件在同一层级，便于查找和调试
- **🎯 单一状态源**: App 层级统一管理状态，数据流清晰
- **🔧 纯函数逻辑**: 业务逻辑独立于组件，便于测试和复用
- **🎨 主题驱动**: 统一的设计系统，一致的视觉体验

### 图标系统设计

- **扩展性优先**: 预留 `iconUrl` 字段支持自定义图标
- **优雅降级**: 无图标时显示类别首字母
- **智能识别**: 基于类别名称自动判断类型并分配颜色
- **未来扩展**: 可轻松添加图标管理功能

```jsx
// 图标显示逻辑
const CategoryIcon = ({ type, iconUrl, children }) => (
  <IconContainer $type={type} $iconUrl={iconUrl}>
    {iconUrl ? null : children} {/* 无图标时显示首字母 */}
  </IconContainer>
);

// 自动类型判断
const getAutoType = (name) => {
  const lowerName = name.toLowerCase();
  if (lowerName.includes('胸') || lowerName.includes('chest')) return 'chest';
  if (lowerName.includes('腰') || lowerName.includes('waist')) return 'waist';
  if (lowerName.includes('臀') || lowerName.includes('hip')) return 'hip';
  if (lowerName.includes('肩') || lowerName.includes('shoulder')) return 'shoulder';
  if (lowerName.includes('袖') || lowerName.includes('sleeve')) return 'sleeve';
  if (lowerName.includes('长') || lowerName.includes('length')) return 'length';
  return 'other';
};

// 数据结构支持
const categorySchema = {
  id: string,
  name: string,
  type: 'chest' | 'waist' | 'hip' | 'shoulder' | 'sleeve' | 'length' | 'other', // 自动判断
  iconUrl: string | null, // 预留图标字段
  baseValue: number,
  baseIncrement: number
};
```

### 开发建议

1. **先布局后交互**: 优先完成基础布局组件
2. **状态优先**: 先确定数据结构再开发组件
3. **组件独立**: 每个组件文件包含完整功能
4. **逐步增强**: 从简单功能开始，逐步添加复杂交互

### 调试策略

- **组件隔离**: 每个组件可以独立开发和测试
- **状态可视**: 在 App.jsx 中打印 appState 查看状态变化
- **纯函数测试**: services/ 中的函数容易进行单元测试
- **样式调试**: 使用 React DevTools 检查主题变量

---

## 📝 最新更新记录

### 2025-07-18 重要优化

#### 🔧 工具栏精简化
- **移除重复功能**：删除工具栏中的预览、导出、保存按钮
- **统一操作入口**：预览和导出功能统一在PreviewPanel中进行
- **简化UI**：工具栏仅保留核心的"生成尺码表"按钮
- **状态指示器**：添加状态显示，帮助用户了解当前操作状态

#### 🧠 毛衣模式智能计算
- **算法优化**：从基于类型判断改为基于递增值智能判断
  ```javascript
  // 旧逻辑：仅针对胸围类型
  if (mode === 'sweater' && category.type === 'chest')
  
  // 新逻辑：针对所有大递增值类别
  if (mode === 'sweater' && category.baseIncrement >= 4)
  ```
- **更广泛适用**：现在胸围、腰围、臀围等所有4cm+递增的类别都会在毛衣模式下减半
- **动态显示**：侧边栏和设置面板中的递增值会根据当前模式动态更新

#### 📐 布局空间优化
- **紧凑设计**：起始尺码和尺码数量改为同行显示
- **空间节省**：标签宽度从120px减少到80px，整体间距优化
- **响应式改进**：更好的移动端适配，自动切换单列布局
- **视觉优化**：尺码预览标签更小更精致

#### 🎯 用户体验改进
- **一致性**：递增值显示在所有地方保持一致（侧边栏、设置面板）
- **即时反馈**：切换模式时立即看到递增值变化
- **减少困惑**：移除重复按钮，简化操作流程
- **空间利用**：更紧凑的布局提供更多内容显示空间

#### 💾 数据结构扩展
- **起始值自定义**：支持为每个类别设置自定义起始值
- **状态管理优化**：`categoryStartValues` 独立管理，便于扩展
- **向前兼容**：新增字段不影响现有功能

### 🚀 性能优化

- **减少重渲染**：优化组件props传递，减少不必要的重新渲染
- **内存优化**：移除重复的事件处理函数，统一状态管理
- **包体积优化**：减少重复代码，提高代码复用率

### 🔍 开发体验改进

- **代码简化**：移除App.jsx中的handleExport、handlePreview、handleSave函数
- **逻辑集中**：相关功能集中在对应组件中，便于维护
- **类型安全**：增强TypeScript类型定义，减少运行时错误

---

**简化的架构让开发更高效，调试更容易！** 🚀
