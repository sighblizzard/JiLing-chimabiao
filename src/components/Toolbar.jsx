import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Button from './Button';
import SegmentedControl from './SegmentedControl';
import WindowControlsComponent from './WindowControls';

const ToolbarContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 52px;
  background: ${(props) => props.theme.colors.background.primary};
  border-bottom: 1px solid ${(props) => props.theme.colors.border.light};
  padding: 0 16px;
  gap: 16px;
  -webkit-app-region: drag; /* 允许拖拽整个工具栏 */

  &:not([data-no-drag]) {
    -webkit-app-region: drag;
  }
`;

const ToolbarSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  -webkit-app-region: no-drag; /* 按钮和控件区域禁止拖拽 */
`;

const ModeSelector = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ModeLabel = styled.span`
  font-size: 13px;
  font-weight: 500;
  color: ${(props) => props.theme.colors.gray[600]};
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
  border-radius: ${(props) => props.theme.borderRadius.sm};
  font-size: 12px;
  font-weight: 500;

  ${(props) => {
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

  ${(props) =>
    props.$pulsing &&
    `
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
  onSettings,
  className,
  ...props
}) => {
  const { mode, sizeSettings, selectedCategories, chartData } = appState;

  // 模式选项
  const modeOptions = [
    { label: '普通', value: 'normal' },
    { label: '毛衣', value: 'sweater' },
  ];

  // 处理模式切换
  const handleModeChange = (newMode) => {
    setAppState((prev) => ({
      ...prev,
      mode: newMode,
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

  // 处理双击标题栏事件
  const handleDoubleClick = (event) => {
    // 确保双击事件不是在按钮或其他交互元素上触发
    if (event.target.tagName === 'BUTTON' || event.target.closest('button')) {
      return;
    }

    if (window.electronAPI?.window?.toggleMaximize) {
      window.electronAPI.window.toggleMaximize();
    }
  };

  return (
    <ToolbarContainer
      className={className}
      onDoubleClick={handleDoubleClick}
      {...props}
    >
      <ToolbarSection>
        <WindowControlsComponent /> {/* 窗口控制按钮 */}
        <ModeSelector>
          <ModeLabel>模式:</ModeLabel>
          <SegmentedControl
            options={modeOptions}
            value={mode}
            onChange={handleModeChange}
            size='small'
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
        {/* 右侧操作按钮 */}
        <Button
          variant='ghost'
          size='small'
          onClick={onSettings}
          icon='⚙️'
          title='设置'
        ></Button>
      </ToolbarSection>
    </ToolbarContainer>
  );
};

export default Toolbar;
