import React from 'react';
import styled from 'styled-components';

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  padding: 2rem;
  text-align: center;
  background: ${(props) =>
    props.theme?.colors?.background?.primary || '#f9fafb'};
  border-radius: 8px;
  border: 2px dashed
    ${(props) => props.theme?.colors?.border?.light || '#e5e7eb'};
`;

const ErrorTitle = styled.h2`
  color: ${(props) => props.theme?.colors?.error || '#ef4444'};
  margin-bottom: 1rem;
  font-size: 1.5rem;
`;

const ErrorMessage = styled.p`
  color: ${(props) => props.theme?.colors?.gray?.[600] || '#6b7280'};
  margin-bottom: 1.5rem;
  max-width: 500px;
  line-height: 1.6;
`;

const ErrorButton = styled.button`
  background: ${(props) => props.theme?.colors?.primary || '#3b82f6'};
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;

  &:hover {
    background: ${(props) => props.theme?.colors?.primaryHover || '#2563eb'};
  }
`;

const ErrorDetails = styled.details`
  margin-top: 1rem;
  padding: 1rem;
  background: ${(props) =>
    props.theme?.colors?.background?.secondary || '#f3f4f6'};
  border-radius: 4px;
  max-width: 600px;
  text-align: left;

  summary {
    cursor: pointer;
    font-weight: 500;
    margin-bottom: 0.5rem;
  }

  pre {
    font-size: 0.75rem;
    overflow-x: auto;
    white-space: pre-wrap;
    word-break: break-word;
  }
`;

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(_error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // 记录错误到控制台
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // 如果有错误报告服务，可以在这里发送错误
    if (window.electronAPI?.logError) {
      window.electronAPI.logError({
        error: error.toString(),
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
      });
    }
  }

  handleReload = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleRestart = () => {
    if (window.electronAPI?.restart) {
      window.electronAPI.restart();
    } else {
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorContainer>
          <ErrorTitle>😵 应用遇到了错误</ErrorTitle>
          <ErrorMessage>
            很抱歉，应用在运行过程中遇到了意外错误。
            您可以尝试重新加载组件或重启应用。
          </ErrorMessage>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <ErrorButton onClick={this.handleReload}>重新加载</ErrorButton>
            <ErrorButton onClick={this.handleRestart}>重启应用</ErrorButton>
          </div>

          {process.env.NODE_ENV === 'development' && this.state.error && (
            <ErrorDetails>
              <summary>错误详情 (开发模式)</summary>
              <pre>
                <strong>错误信息:</strong> {this.state.error.toString()}
                {this.state.error.stack && (
                  <>
                    <br />
                    <br />
                    <strong>错误堆栈:</strong>
                    <br />
                    {this.state.error.stack}
                  </>
                )}
                {this.state.errorInfo?.componentStack && (
                  <>
                    <br />
                    <br />
                    <strong>组件堆栈:</strong>
                    <br />
                    {this.state.errorInfo.componentStack}
                  </>
                )}
              </pre>
            </ErrorDetails>
          )}
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
