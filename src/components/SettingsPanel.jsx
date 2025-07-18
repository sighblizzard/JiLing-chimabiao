import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './Button';
import CategoryManager from './CategoryManager';

const PanelContainer = styled(motion.div)`
  position: fixed;
  top: 0;
  right: 0;
  width: 400px;
  height: 100vh;
  background: ${props => props.theme.colors.background.primary};
  border-left: 1px solid ${props => props.theme.colors.border.light};
  box-shadow: ${props => props.theme.shadows.xl};
  z-index: 1000;
  overflow-y: auto;
`;

const PanelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  border-bottom: 1px solid ${props => props.theme.colors.border.light};
  position: sticky;
  top: 0;
  background: ${props => props.theme.colors.background.primary};
  z-index: 10;
`;

const PanelTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: ${props => props.theme.colors.gray[800]};
  margin: 0;
`;

const PanelContent = styled.div`
  padding: 20px;
`;

const TabContainer = styled.div`
  display: flex;
  border-bottom: 1px solid ${props => props.theme.colors.border.light};
  margin-bottom: 20px;
`;

const Tab = styled.button`
  padding: 12px 16px;
  border: none;
  background: transparent;
  font-size: 14px;
  font-weight: 500;
  color: ${props => props.$active ? props.theme.colors.primary : props.theme.colors.gray[600]};
  border-bottom: 2px solid ${props => props.$active ? props.theme.colors.primary : 'transparent'};
  cursor: pointer;
  transition: all 0.2s ease-out;

  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const TabContent = styled(motion.div)`
  min-height: 300px;
`;

const Backdrop = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.3);
  z-index: 999;
`;

/**
 * 设置面板组件
 */
const SettingsPanel = ({ 
  isOpen, 
  onClose, 
  appState, 
  setAppState, 
  onCategoryAdd, 
  onCategoryEdit, 
  onCategoryDelete 
}) => {
  const [activeTab, setActiveTab] = useState('categories');

  const tabs = [
    { id: 'categories', label: '类别管理' },
    { id: 'general', label: '通用设置' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'categories':
        return (
          <CategoryManager
            appState={appState}
            setAppState={setAppState}
            onCategoryAdd={onCategoryAdd}
            onCategoryEdit={onCategoryEdit}
            onCategoryDelete={onCategoryDelete}
            showHeader={false}
          />
        );
      case 'general':
        return (
          <div>
            <h3>通用设置</h3>
            <p>这里将来可以添加其他设置选项</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <Backdrop
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <PanelContainer
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            <PanelHeader>
              <PanelTitle>设置</PanelTitle>
              <Button
                variant="ghost"
                size="small"
                onClick={onClose}
                icon="✕"
              >
              </Button>
            </PanelHeader>

            <TabContainer>
              {tabs.map(tab => (
                <Tab
                  key={tab.id}
                  $active={activeTab === tab.id}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </Tab>
              ))}
            </TabContainer>

            <PanelContent>
              <TabContent
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                {renderTabContent()}
              </TabContent>
            </PanelContent>
          </PanelContainer>
        </>
      )}
    </AnimatePresence>
  );
};

export default SettingsPanel;
