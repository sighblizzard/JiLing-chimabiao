import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

// 窗口控制容器
const WindowControls = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  -webkit-app-region: no-drag;
  padding: 8px 12px;
`;

// 控制按钮
const ControlButton = styled.button`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    transform: scale(1.1);
  }

  &.close {
    background: #ff5f57;
    &:hover::after {
      content: '×';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: #4a0000;
      font-size: 8px;
      font-weight: bold;
    }
  }

  &.minimize {
    background: #ffbd2e;
    &:hover::after {
      content: '−';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: #7a4a00;
      font-size: 8px;
      font-weight: bold;
    }
  }

  &.maximize {
    background: #28ca42;
    &:hover::after {
      content: '□';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: #0a4a1a;
      font-size: 6px;
      font-weight: bold;
    }
  }
`;

const WindowControlsComponent = () => {
  const [isMaximized, setIsMaximized] = useState(false);
  const [isFrameless, setIsFrameless] = useState(false);

  useEffect(() => {
    const checkMaximized = async () => {
      if (window.electronAPI?.window?.isMaximized) {
        try {
          const result = await window.electronAPI.window.isMaximized();
          setIsMaximized(result.isMaximized || false);
        } catch (error) {
          console.error('检查窗口状态失败:', error);
        }
      }
    };

    const checkFrameless = async () => {
      if (window.electronAPI?.window?.frameless?.isFrameless) {
        try {
          const frameless = await window.electronAPI.window.frameless.isFrameless();
          setIsFrameless(frameless);
        } catch (error) {
          console.error('检查无边框状态失败:', error);
        }
      }
    };

    checkMaximized();
    checkFrameless();

    // 监听窗口状态变化
    let unsubscribe;
    if (window.electronAPI?.windowState?.onWindowStateChanged) {
      unsubscribe = window.electronAPI.windowState.onWindowStateChanged((state) => {
        if (typeof state.maximized !== 'undefined') {
          setIsMaximized(state.maximized);
        }
      });
    }

    // 备用轮询机制（降低频率以提高性能）
    const interval = setInterval(checkMaximized, 2000);

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
      clearInterval(interval);
    };
  }, []);

  const handleClose = () => {
    try {
      if (isFrameless && window.electronAPI?.window?.frameless?.close) {
        window.electronAPI.window.frameless.close();
      } else if (window.electronAPI?.window?.close) {
        window.electronAPI.window.close();
      } else {
        console.warn('窗口控制 API 不可用');
        window.close();
      }
    } catch (error) {
      console.error('关闭窗口失败:', error);
    }
  };

  const handleMinimize = () => {
    try {
      if (isFrameless && window.electronAPI?.window?.frameless?.minimize) {
        window.electronAPI.window.frameless.minimize();
      } else if (window.electronAPI?.window?.minimize) {
        window.electronAPI.window.minimize();
      }
    } catch (error) {
      console.error('最小化窗口失败:', error);
    }
  };

  const handleMaximize = () => {
    try {
      if (isFrameless && window.electronAPI?.window?.frameless?.toggleMaximize) {
        window.electronAPI.window.frameless.toggleMaximize();
      } else if (window.electronAPI?.window?.toggleMaximize) {
        window.electronAPI.window.toggleMaximize();
      }
    } catch (error) {
      console.error('切换窗口最大化失败:', error);
    }
  };

  return (
    <WindowControls>
      <ControlButton className='close' onClick={handleClose} title='关闭' />
      <ControlButton
        className='minimize'
        onClick={handleMinimize}
        title='最小化'
      />
      <ControlButton
        className='maximize'
        onClick={handleMaximize}
        title={isMaximized ? '还原' : '最大化'}
      />
    </WindowControls>
  );
};

export default WindowControlsComponent;
