import React from 'react';
import { ThemeProvider } from 'styled-components';
import styled from 'styled-components';
import { theme } from '../styles/theme';
import TitleBar from './TitleBar';
import '../styles/globals.css';

const AppContainer = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: ${props => props.theme.colors.background.secondary};
  font-family: ${props => props.theme.typography.fontFamily.sans.join(', ')};
`;

const SimpleApp = () => {
  const handleClose = () => {
    if (confirm('确定要关闭应用吗？')) {
      window.close();
    }
  };

  const handleMinimize = () => {
    if (window.electron) {
      window.electron.minimize();
    }
  };

  const handleMaximize = () => {
    if (window.electron) {
      window.electron.toggleMaximize();
    }
  };

  const handleSettings = () => {
    alert('设置功能');
  };

  const handleHelp = () => {
    alert('帮助功能');
  };

  return (
    <ThemeProvider theme={theme}>
      <AppContainer>
        <TitleBar
          title="尺码表生成器"
          onClose={handleClose}
          onMinimize={handleMinimize}
          onMaximize={handleMaximize}
          onSettings={handleSettings}
          onHelp={handleHelp}
        />
        <div style={{ 
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <h2>应用正常运行</h2>
        </div>
      </AppContainer>
    </ThemeProvider>
  );
};

export default SimpleApp;
