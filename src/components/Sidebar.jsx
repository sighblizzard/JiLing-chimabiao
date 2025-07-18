import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import Input from './Input';
import Button from './Button';
import { searchCategories } from '../services/dataManager';

const SidebarContainer = styled.div`
  width: 240px;
  min-width: 240px;
  max-width: 240px;
  background: ${props => props.theme.colors.background.primary};
  border-right: 1px solid ${props => props.theme.colors.border.light};
  display: flex;
  flex-direction: column;
  overflow: hidden;
  flex-shrink: 0;
`;

const SidebarHeader = styled.div`
  padding: 16px;
  border-bottom: 1px solid ${props => props.theme.colors.border.light};
`;

const SidebarContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
`;

const SectionContainer = styled.div`
  margin-bottom: 24px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h3`
  font-size: 13px;
  font-weight: 600;
  color: ${props => props.theme.colors.gray[600]};
  margin: 0 0 12px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const CategoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const CategoryItemContainer = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: pointer;
  transition: all 0.15s ease-out;
  user-select: none;
  position: relative;

  &:hover {
    background: ${props => props.theme.colors.gray[50]};
  }

  ${props => props.$selected && `
    background: ${props.theme.colors.primary};
    color: white;
    
    &:hover {
      background: ${props.theme.colors.primary}dd;
    }
  `}

  &:active {
    transform: scale(0.98);
  }
`;

const CategoryIcon = styled.div`
  width: 20px;
  height: 20px;
  border-radius: ${props => props.theme.borderRadius.sm};
  background: ${props => {
    switch (props.$type) {
      case 'chest': return '#FF6B6B';
      case 'waist': return '#4ECDC4';
      case 'hip': return '#45B7D1';
      case 'shoulder': return '#96CEB4';
      case 'sleeve': return '#FECA57';
      case 'length': return '#FF9FF3';
      default: return props.theme.colors.gray[400];
    }
  }};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  color: white;
  font-weight: bold;
  flex-shrink: 0;
  
  /* 预留图标扩展 */
  ${props => props.$iconUrl && `
    background-image: url(${props.$iconUrl});
    background-size: cover;
    background-position: center;
  `}
  flex-shrink: 0;
`;

const CategoryInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const CategoryName = styled.div`
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const CategoryMeta = styled.div`
  font-size: 12px;
  opacity: 0.7;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CategoryBadge = styled.span`
  background: rgba(255, 255, 255, 0.2);
  padding: 2px 6px;
  border-radius: ${props => props.theme.borderRadius.sm};
  font-size: 11px;
  font-weight: 500;
`;

const SelectionCounter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  background: ${props => props.theme.colors.gray[50]};
  border-top: 1px solid ${props => props.theme.colors.border.light};
  font-size: 13px;
  color: ${props => props.theme.colors.gray[600]};
`;

const ClearButton = styled(Button)`
  font-size: 12px;
  padding: 4px 8px;
`;

/**
 * 类别列表项组件
 */
const CategoryItem = ({ category, isSelected, onToggle, mode }) => {
  const handleClick = () => {
    onToggle(category.id);
  };

  // 计算在当前模式下的实际递增值
  const getActualIncrement = (category) => {
    let increment = category.baseIncrement;
    if (mode === 'sweater' && category.baseIncrement >= 4) {
      increment = category.baseIncrement / 2;
    }
    return increment;
  };

  // 获取类别显示内容（暂时替代图标）
  const getCategoryDisplay = (category) => {
    if (category.iconUrl) {
      return null; // 如果有图标URL则不显示文字
    }
    return category.name.charAt(0); // 显示首字母
  };

  return (
    <CategoryItemContainer
      $selected={isSelected}
      onClick={handleClick}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <CategoryIcon $type={category.type} $iconUrl={category.iconUrl}>
        {getCategoryDisplay(category)}
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

/**
 * 类别区域组件
 */
const CategorySection = ({ title, categories, selectedIds, onToggle, mode }) => {
  if (categories.length === 0) {
    return null;
  }

  return (
    <SectionContainer>
      <SectionTitle>{title}</SectionTitle>
      <CategoryList>
        <AnimatePresence>
          {categories.map(category => (
            <CategoryItem
              key={category.id}
              category={category}
              isSelected={selectedIds.includes(category.id)}
              onToggle={onToggle}
              mode={mode}
            />
          ))}
        </AnimatePresence>
      </CategoryList>
    </SectionContainer>
  );
};

/**
 * 侧边栏组件
 */
const Sidebar = ({ appState, setAppState }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { categories, selectedCategories, mode } = appState;

  // 处理搜索
  const filteredCategories = searchCategories(categories, searchQuery);

  // 分组类别
  const presetCategories = filteredCategories.filter(cat => !cat.isCustom);
  const customCategories = filteredCategories.filter(cat => cat.isCustom);

  // 获取选中的类别 ID 列表
  const selectedIds = selectedCategories.map(cat => cat.id);

  // 处理类别选择切换
  const handleToggleCategory = useCallback((categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    if (!category) return;

    const isSelected = selectedIds.includes(categoryId);
    
    let newSelectedCategories;
    if (isSelected) {
      // 取消选择
      newSelectedCategories = selectedCategories.filter(cat => cat.id !== categoryId);
    } else {
      // 添加选择
      newSelectedCategories = [...selectedCategories, category];
    }

    setAppState(prev => ({
      ...prev,
      selectedCategories: newSelectedCategories
    }));
  }, [categories, selectedIds, selectedCategories, setAppState]);

  // 清空选择
  const handleClearSelection = useCallback(() => {
    setAppState(prev => ({
      ...prev,
      selectedCategories: []
    }));
  }, [setAppState]);

  // 全选预设类别
  const handleSelectAllPreset = useCallback(() => {
    setAppState(prev => ({
      ...prev,
      selectedCategories: presetCategories
    }));
  }, [presetCategories, setAppState]);

  return (
    <SidebarContainer>
      <SidebarHeader>
        <Input
          placeholder="搜索类别..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          leftIcon="🔍"
          size="small"
        />
      </SidebarHeader>

      <SidebarContent>
        <CategorySection
          title="预设类别"
          categories={presetCategories}
          selectedIds={selectedIds}
          onToggle={handleToggleCategory}
          mode={mode}
        />

        {customCategories.length > 0 && (
          <CategorySection
            title="自定义类别"
            categories={customCategories}
            selectedIds={selectedIds}
            onToggle={handleToggleCategory}
            mode={mode}
          />
        )}

        {filteredCategories.length === 0 && searchQuery && (
          <div style={{ 
            textAlign: 'center', 
            color: '#6B7280', 
            padding: '24px',
            fontSize: '14px'
          }}>
            未找到匹配的类别
          </div>
        )}
      </SidebarContent>

      <SelectionCounter>
        <span>已选择 {selectedCategories.length} 个类别</span>
        <div style={{ display: 'flex', gap: '8px' }}>
          {presetCategories.length > 0 && (
            <ClearButton
              variant="ghost"
              size="small"
              onClick={handleSelectAllPreset}
            >
              全选预设
            </ClearButton>
          )}
          {selectedCategories.length > 0 && (
            <ClearButton
              variant="ghost"
              size="small"
              onClick={handleClearSelection}
            >
              清空
            </ClearButton>
          )}
        </div>
      </SelectionCounter>
    </SidebarContainer>
  );
};

export default Sidebar;
