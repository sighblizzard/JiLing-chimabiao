import React from 'react';

const TestApp = () => {
  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh', 
      background: '#f0f0f0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        padding: '20px',
        background: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h1>测试页面</h1>
        <p>如果你能看到这个页面，说明 React 正常工作</p>
        <button onClick={() => alert('按钮点击正常')}>
          测试按钮
        </button>
      </div>
    </div>
  );
};

export default TestApp;
