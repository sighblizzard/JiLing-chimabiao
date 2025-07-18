import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import SizeSettings from './SizeSettings';
import PreviewPanel from './PreviewPanel';
import SegmentedControl from './SegmentedControl';

const MainContentContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: ${props => props.theme.colors.background.secondary};
  overflow: hidden;
  min-width: 0;
`;

const TabBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  background: ${props => props.theme.colors.background.primary};
  border-bottom: 1px solid ${props => props.theme.colors.border.light};
`;

const TabTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: ${props => props.theme.colors.gray[800]};
  margin: 0;
`;

const ContentArea = styled.div`
  flex: 1;
  overflow: hidden;
  position: relative;
`;

const TabContent = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow-y: auto;
  padding: 24px;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
  color: ${props => props.theme.colors.gray[500]};
  gap: 16px;

  .icon {
    font-size: 64px;
    opacity: 0.5;
  }

  .title {
    font-size: 20px;
    font-weight: 600;
    color: ${props => props.theme.colors.gray[700]};
  }

  .description {
    font-size: 14px;
    max-width: 400px;
    line-height: 1.5;
  }
`;

/**
 * 主内容区域组件
 */
const MainContent = ({ appState, setAppState }) => {
  const [activeTab, setActiveTab] = useState('settings');

  // 标签页选项
  const tabOptions = [
    { label: '尺码设置', value: 'settings' },
    { label: '预览导出', value: 'preview' }
  ];

  // 获取当前标签页标题
  const getCurrentTabTitle = () => {
    const currentTab = tabOptions.find(tab => tab.value === activeTab);
    return currentTab ? currentTab.label : '尺码表生成器';
  };

  // 渲染标签页内容
  const renderTabContent = () => {
    switch (activeTab) {
      case 'settings':
        return (
          <TabContent
            key="settings"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <SizeSettings
              appState={appState}
              setAppState={setAppState}
            />
          </TabContent>
        );

      case 'preview':
        return (
          <TabContent
            key="preview"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <PreviewPanel
              appState={appState}
              setAppState={setAppState}
            />
          </TabContent>
        );

      default:
        return (
          <TabContent
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <EmptyState>
              <div className="icon">📊</div>
              <div className="title">选择一个标签页</div>
              <div className="description">
                请从上方选择要使用的功能模块
              </div>
            </EmptyState>
          </TabContent>
        );
    }
  };

  return (
    <MainContentContainer>
      <TabBar>
        <TabTitle>{getCurrentTabTitle()}</TabTitle>
        
        <SegmentedControl
          options={tabOptions}
          value={activeTab}
          onChange={setActiveTab}
          size="medium"
        />
      </TabBar>

      <ContentArea>
        <AnimatePresence mode="wait">
          {renderTabContent()}
        </AnimatePresence>
      </ContentArea>
    </MainContentContainer>
  );
};

export default MainContent;
