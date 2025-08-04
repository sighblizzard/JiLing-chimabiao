import React, { useState, useEffect } from 'react';
import { ThemeProvider } from 'styled-components';
import styled from 'styled-components';
import { theme } from '../styles/theme';
import { presetCategories, storage } from '../services/dataManager';
import { calculateSizeData } from '../services/sizeCalculator';

// 组件导入
import Toolbar from './Toolbar';
import Sidebar from './Sidebar';
import MainContent from './MainContent';
import StatusBar from './StatusBar';
import SettingsPanel from './SettingsPanel';

// 全局样式导入
import '../styles/globals.css';
import { highQualityStyles } from '../styles/highQuality';

const AppContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: ${props => props.theme.colors.background.secondary};
  font-family: ${props => props.theme.typography.fontFamily.sans.join(', ')};
  
  /* 应用高质量渲染基础 */
  ${highQualityStyles.base}
  ${highQualityStyles.highDPI}
  
  /* 确保整体布局精度 */
  contain: layout style paint;
  isolation: isolate;
`;

const ContentArea = styled.div`
  flex: 1;
  display: flex;
  overflow-x: hidden;
  overflow-y: auto;
  width: 100%;
`;

/**
 * 应用主入口组件
 */
const App = () => {
  // 简单的状态管理 - 直接在 App 层级
  const [appState, setAppState] = useState({
    mode: 'normal',
    sizeSettings: { 
      startSize: 'S', 
      count: 4 
    },
    selectedCategories: [],
    categories: [],
    categoryStartValues: {}, // 存储每个类别的自定义起始值
    chartData: null,
    searchQuery: '',
    isGenerating: false,
    isSettingsOpen: false, // 设置面板状态
    exportPath: '', // 导出路径设置
  });

  // 初始化数据
  useEffect(() => {
    // 从本地存储加载数据
    const savedCategories = storage.load('customCategories', []);
    const savedSettings = storage.load('sizeSettings', appState.sizeSettings);
    const savedMode = storage.load('mode', appState.mode);
    const savedStartValues = storage.load('categoryStartValues', {});

    setAppState(prev => ({
      ...prev,
      categories: [...presetCategories, ...savedCategories],
      sizeSettings: savedSettings,
      mode: savedMode,
      categoryStartValues: savedStartValues
    }));
  }, []);

  // 添加键盘快捷键监听
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Ctrl + S 导出图片
      if (event.ctrlKey && event.key === 's') {
        event.preventDefault();
        console.log('Ctrl+S pressed, chartData:', !!appState.chartData);
        
        // 触发图片导出 - 发送自定义事件
        if (appState.chartData) {
          console.log('Dispatching export-shortcut event');
          window.dispatchEvent(new CustomEvent('export-shortcut', { 
            detail: { format: 'jpeg' } 
          }));
        } else {
          console.log('No chart data available');
          alert('请先生成尺码表数据');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [appState.chartData]);

  // 保存数据到本地存储
  useEffect(() => {
    const customCategories = appState.categories.filter(cat => cat.isCustom);
    storage.save('customCategories', customCategories);
    storage.save('sizeSettings', appState.sizeSettings);
    storage.save('categoryStartValues', appState.categoryStartValues);
    storage.save('mode', appState.mode);
  }, [appState.categories, appState.sizeSettings, appState.mode, appState.categoryStartValues]);

  // 实时更新预览 - 当设置或选择变化时自动生成预览
  useEffect(() => {
    const { sizeSettings, selectedCategories, mode, categoryStartValues } = appState;
    
    // 只有当有选中的类别时才生成预览
    if (selectedCategories.length > 0) {
      try {
        const chartData = calculateSizeData(sizeSettings, selectedCategories, mode, categoryStartValues);
        setAppState(prev => ({
          ...prev,
          chartData
        }));
      } catch (error) {
        console.error('实时预览生成失败:', error);
        // 出错时清空预览
        setAppState(prev => ({
          ...prev,
          chartData: null
        }));
      }
    } else {
      // 没有选中类别时清空预览
      setAppState(prev => ({
        ...prev,
        chartData: null
      }));
    }
  }, [appState.sizeSettings, appState.selectedCategories, appState.mode, appState.categoryStartValues]);


  // 窗口控制事件
  const handleClose = () => {
    if (confirm('确定要关闭应用吗？')) {
      window.close();
    }
  };

  const handleMinimize = () => {
    // Electron 环境下的最小化
    if (window.electronAPI) {
      window.electronAPI.window.minimize();
    }
  };

  const handleMaximize = () => {
    // Electron 环境下的最大化/还原
    if (window.electronAPI) {
      window.electronAPI.window.toggleMaximize();
    }
  };

  const handleSettings = () => {
    setAppState(prev => ({ ...prev, isSettingsOpen: true }));
  };

  const handleCloseSettings = () => {
    setAppState(prev => ({ ...prev, isSettingsOpen: false }));
  };

  // 类别管理方法
  const handleCategoryAdd = (newCategory) => {
    setAppState(prev => ({
      ...prev,
      categories: [...prev.categories, { ...newCategory, isCustom: true }]
    }));
  };

  const handleCategoryEdit = (categoryId, updatedCategory) => {
    setAppState(prev => ({
      ...prev,
      categories: prev.categories.map(cat => 
        cat.id === categoryId ? { ...cat, ...updatedCategory } : cat
      )
    }));
  };

  const handleCategoryDelete = (categoryId) => {
    setAppState(prev => ({
      ...prev,
      categories: prev.categories.filter(cat => cat.id !== categoryId),
      selectedCategories: prev.selectedCategories.filter(id => id !== categoryId)
    }));
  };

  const handleHelp = () => {
    // TODO: 打开帮助文档
    alert('帮助功能开发中...');
  };

  return (
    <ThemeProvider theme={theme}>
      <AppContainer>
        <Toolbar
          appState={appState}
          setAppState={setAppState}
          onSettings={handleSettings}
        />
        
        <ContentArea>
          <Sidebar
            appState={appState}
            setAppState={setAppState}
          />
          
          <MainContent
            appState={appState}
            setAppState={setAppState}
          />
        </ContentArea>
        
        <StatusBar
          appState={appState}
        />

        <SettingsPanel
          isOpen={appState.isSettingsOpen}
          onClose={handleCloseSettings}
          appState={appState}
          setAppState={setAppState}
          onCategoryAdd={handleCategoryAdd}
          onCategoryEdit={handleCategoryEdit}
          onCategoryDelete={handleCategoryDelete}
        />
      </AppContainer>
    </ThemeProvider>
  );
};

export default App;
