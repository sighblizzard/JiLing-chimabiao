import React, { useState, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Button from './Button';
import Input from './Input';
import Select from './Select';
import { generateSizeSequence } from '../services/sizeCalculator';

const PanelContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
`;

const PanelHeader = styled.div`
  margin-bottom: 32px;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: ${props => props.theme.colors.gray[800]};
  margin: 0 0 8px 0;
`;

const Subtitle = styled.p`
  font-size: 16px;
  color: ${props => props.theme.colors.gray[600]};
  margin: 0;
  line-height: 1.5;
`;

const SettingsGrid = styled.div`
  display: grid;
  gap: 16px;
  margin-bottom: 24px;
`;

const SettingRow = styled.div`
  display: grid;
  grid-template-columns: 80px 1fr;
  gap: 12px;
  align-items: start;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 6px;
  }
`;

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

const Label = styled.label`
  font-size: 13px;
  font-weight: 600;
  color: ${props => props.theme.colors.gray[700]};
  padding-top: 8px;
  white-space: nowrap;

  @media (max-width: 640px) {
    padding-top: 0;
    font-size: 12px;
  }
`;

const PreviewSection = styled(motion.div)`
  background: ${props => props.theme.colors.background.primary};
  border: 1px solid ${props => props.theme.colors.border.light};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 16px;
  margin-bottom: 20px;
`;

const PreviewTitle = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.theme.colors.gray[700]};
  margin: 0 0 8px 0;
`;

const SizePreview = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
`;

const SizeTag = styled(motion.span)`
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

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;

  @media (max-width: 640px) {
    flex-direction: column;
  }
`;

const ErrorMessage = styled.div`
  color: ${props => props.theme.colors.error};
  font-size: 14px;
  margin-top: 8px;
  padding: 12px;
  background: ${props => props.theme.colors.error}10;
  border-radius: ${props => props.theme.borderRadius.md};
  border: 1px solid ${props => props.theme.colors.error}30;
`;

const StartValuesSection = styled(motion.div)`
  background: ${props => props.theme.colors.background.primary};
  border: 1px solid ${props => props.theme.colors.border.light};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 16px;
  margin-bottom: 20px;
`;

const StartValuesGrid = styled.div`
  display: grid;
  gap: 16px;
`;

const CategoryRow = styled.div`
  display: grid;
  grid-template-columns: 60px 1fr auto auto;
  gap: 12px;
  align-items: center;
  padding: 12px;
  background: ${props => props.theme.colors.background.secondary};
  border-radius: ${props => props.theme.borderRadius.md};
  border: 1px solid ${props => props.theme.colors.border.light};
`;

const CategoryIcon = styled.div`
  width: 36px;
  height: 36px;
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.color || props.theme.colors.primary}20;
  color: ${props => props.color || props.theme.colors.primary};
  border: 2px solid ${props => props.color || props.theme.colors.primary}30;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
`;

const CategoryInfo = styled.div`
  flex: 1;
`;

const CategoryName = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.theme.colors.gray[800]};
  margin-bottom: 2px;
`;

const CategoryType = styled.div`
  font-size: 12px;
  color: ${props => props.theme.colors.gray[500]};
`;

const ValueInput = styled(Input)`
  width: 100px;
  flex-shrink: 0;
`;

const UnitLabel = styled.span`
  font-size: 14px;
  color: ${props => props.theme.colors.gray[600]};
  font-weight: 500;
`;

/**
 * 尺码设置面板组件
 */
const SizeSettings = ({ appState, setAppState }) => {
  const { sizeSettings, selectedCategories, categoryStartValues, categories, mode } = appState;
  const { startSize, count } = sizeSettings;
  
  // 计算在当前模式下的实际递增值
  const getActualIncrement = (category) => {
    let increment = category.baseIncrement;
    if (mode === 'sweater' && category.baseIncrement >= 4) {
      increment = category.baseIncrement / 2;
    }
    return increment;
  };
  
  const [errors, setErrors] = useState({});

  // 尺码选项
  const sizeOptions = [
    { label: 'XS', value: 'XS' },
    { label: 'S', value: 'S' },
    { label: 'M', value: 'M' },
    { label: 'L', value: 'L' },
    { label: 'XL', value: 'XL' },
    { label: '2XL', value: '2XL' },
    { label: '3XL', value: '3XL' },
    { label: '4XL', value: '4XL' }
  ];

  // 更新尺码设置
  const updateSizeSettings = useCallback((updates) => {
    const newSettings = { ...sizeSettings, ...updates };
    
    setAppState(prev => ({
      ...prev,
      sizeSettings: newSettings
    }));

    // 清除相关错误
    const newErrors = { ...errors };
    Object.keys(updates).forEach(key => {
      if (newErrors[key]) {
        delete newErrors[key];
      }
    });
    setErrors(newErrors);
  }, [sizeSettings, errors, setAppState]);

  // 更新类别起始值
  const updateCategoryStartValue = useCallback((categoryId, value) => {
    const numValue = parseFloat(value);
    const newStartValues = { ...categoryStartValues };
    
    if (isNaN(numValue) || value === '') {
      // 如果值无效或为空，删除自定义值，使用默认值
      delete newStartValues[categoryId];
    } else {
      newStartValues[categoryId] = numValue;
    }
    
    setAppState(prev => ({
      ...prev,
      categoryStartValues: newStartValues
    }));
  }, [categoryStartValues, setAppState]);

  // 获取类别的当前起始值
  const getCategoryStartValue = useCallback((category) => {
    return categoryStartValues[category.id] !== undefined 
      ? categoryStartValues[category.id] 
      : category.baseValue;
  }, [categoryStartValues]);

  // 获取类别图标文字
  const getCategoryIcon = (category) => {
    const name = category.name;
    if (name.length >= 2) {
      return name.substring(0, 2);
    }
    return name.charAt(0).toUpperCase() || '?';
  };

  // 生成尺码序列预览
  const generatedSizes = useMemo(() => {
    try {
      return generateSizeSequence(startSize, count);
    } catch (error) {
      return [];
    }
  }, [startSize, count]);

  // 重置设置
  const handleReset = useCallback(() => {
    updateSizeSettings({
      startSize: 'S',
      count: 4
    });
    // 同时清空自定义起始值
    setAppState(prev => ({
      ...prev,
      categoryStartValues: {}
    }));
    setErrors({});
  }, [updateSizeSettings, setAppState]);

  return (
    <PanelContainer>
      <PanelHeader>
        <Title>尺码设置</Title>
        <Subtitle>
          配置尺码范围和数量，设置会实时应用到预览中。
          当前已选择 {selectedCategories.length} 个类别。
        </Subtitle>
      </PanelHeader>

      <SettingsGrid>
        <CompactRow>
          <Label>起始尺码</Label>
          <Select
            placeholder="选择起始尺码"
            options={sizeOptions}
            value={startSize}
            onChange={(value) => updateSizeSettings({ startSize: value })}
            error={errors.startSize}
            helperText="选择尺码表的第一个尺码"
            size="small"
          />
          <Label>尺码数量</Label>
          <Input
            type="number"
            placeholder="输入尺码数量"
            value={count}
            onChange={(e) => updateSizeSettings({ count: parseInt(e.target.value) || 1 })}
            min={1}
            max={8}
            error={errors.count}
            helperText="设置要生成的尺码总数量（1-8个）"
            size="small"
          />
        </CompactRow>
      </SettingsGrid>

      {/* 尺码预览 */}
      {generatedSizes.length > 0 && (
        <PreviewSection
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <PreviewTitle>尺码预览</PreviewTitle>
          <SizePreview>
            {generatedSizes.map((size, index) => (
              <SizeTag
                key={size}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 300,
                  damping: 25
                }}
              >
                {size}
              </SizeTag>
            ))}
          </SizePreview>
        </PreviewSection>
      )}

      {/* 类别起始值设置 */}
      {selectedCategories.length > 0 && (
        <StartValuesSection
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <PreviewTitle>类别起始值设置</PreviewTitle>
          <StartValuesGrid>
            {selectedCategories.map((category, index) => (
              <CategoryRow
                key={category.id}
                as={motion.div}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ 
                  delay: index * 0.05,
                  type: "spring",
                  stiffness: 300,
                  damping: 25
                }}
              >
                <CategoryIcon color={category.color}>
                  {getCategoryIcon(category)}
                </CategoryIcon>
                
                <CategoryInfo>
                  <CategoryName>{category.name}</CategoryName>
                  <CategoryType>递增：{getActualIncrement(category)}cm</CategoryType>
                </CategoryInfo>
                
                <ValueInput
                  type="number"
                  step="0.5"
                  min="0"
                  max="200"
                  value={getCategoryStartValue(category)}
                  onChange={(e) => updateCategoryStartValue(category.id, e.target.value)}
                  placeholder={`默认 ${category.baseValue}`}
                  size="small"
                  autoComplete="off"
                />
                
                <UnitLabel>cm</UnitLabel>
              </CategoryRow>
            ))}
          </StartValuesGrid>
        </StartValuesSection>
      )}

      {/* 错误信息 */}
      {Object.keys(errors).length > 0 && (
        <ErrorMessage>
          <strong>设置错误：</strong>
          <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px' }}>
            {Object.values(errors).map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </ErrorMessage>
      )}

      <ActionButtons>
        <Button
          variant="outline"
          onClick={handleReset}
          icon="🔄"
        >
          重置设置
        </Button>
      </ActionButtons>
    </PanelContainer>
  );
};

export default SizeSettings;
