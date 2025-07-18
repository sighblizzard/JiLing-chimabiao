import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Button from './Button';
import SegmentedControl from './SegmentedControl';

const ToolbarContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 52px;
  background: ${props => props.theme.colors.background.primary};
  border-bottom: 1px solid ${props => props.theme.colors.border.light};
  padding: 0 16px;
  gap: 16px;
`;

const ToolbarSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ModeSelector = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ModeLabel = styled.span`
  font-size: 13px;
  font-weight: 500;
  color: ${props => props.theme.colors.gray[600]};
  white-space: nowrap;
`;

const ActionButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StatusIndicator = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  border-radius: ${props => props.theme.borderRadius.sm};
  font-size: 12px;
  font-weight: 500;

  ${props => {
    switch (props.$status) {
      case 'ready':
        return `
          background: ${props.theme.colors.success}20;
          color: ${props.theme.colors.success};
        `;
      case 'generating':
        return `
          background: ${props.theme.colors.warning}20;
          color: ${props.theme.colors.warning};
        `;
      case 'error':
        return `
          background: ${props.theme.colors.error}20;
          color: ${props.theme.colors.error};
        `;
      default:
        return `
          background: ${props.theme.colors.gray[100]};
          color: ${props.theme.colors.gray[600]};
        `;
    }
  }}
`;

const StatusDot = styled.div`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
  
  ${props => props.$pulsing && `
    animation: pulse 1.5s ease-in-out infinite;
    
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
  `}
`;

/**
 * 工具栏组件
 */
const Toolbar = ({
  appState,
  setAppState,
  onGenerate,
  className,
  ...props
}) => {
  const { mode, sizeSettings, selectedCategories, chartData } = appState;

  // 模式选项
  const modeOptions = [
    { label: '普通', value: 'normal' },
    { label: '毛衣', value: 'sweater' }
  ];

  // 处理模式切换
  const handleModeChange = (newMode) => {
    setAppState(prev => ({
      ...prev,
      mode: newMode
    }));
  };

  // 处理生成尺码表
  const handleGenerate = () => {
    if (selectedCategories.length === 0) {
      alert('请先选择要生成的尺码类别');
      return;
    }
    onGenerate?.();
  };

  // 计算状态
  const getStatus = () => {
    if (selectedCategories.length === 0) {
      return { status: 'idle', text: '请选择类别' };
    }
    if (!chartData) {
      return { status: 'ready', text: '准备生成' };
    }
    return { status: 'ready', text: '已生成' };
  };

  const { status, text } = getStatus();
  const canGenerate = selectedCategories.length > 0;
  const canExport = Boolean(chartData);

  return (
    <ToolbarContainer className={className} {...props}>
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

        <StatusIndicator
          $status={status}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <StatusDot $pulsing={status === 'generating'} />
          {text}
        </StatusIndicator>
      </ToolbarSection>

      <ToolbarSection>
        {/* 实时预览模式下不需要生成按钮 */}
      </ToolbarSection>
    </ToolbarContainer>
  );
};

export default Toolbar;
