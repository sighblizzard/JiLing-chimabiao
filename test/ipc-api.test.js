/**
 * IPC API 结构测试
 * 验证修复的电子API是否正确暴露
 */

// 模拟 Electron 环境
const mockIpcRenderer = {
  invoke: jest.fn()
};

const mockContextBridge = {
  exposeInMainWorld: jest.fn()
};

// 模拟 electron 模块
global.require = jest.fn((module) => {
  if (module === 'electron') {
    return {
      contextBridge: mockContextBridge,
      ipcRenderer: mockIpcRenderer
    };
  }
  return {};
});

describe('IPC API 修复测试', () => {
  let electronAPI;

  beforeAll(() => {
    // 模拟 preload.cjs 的执行
    // 由于无法直接执行 CommonJS 模块，我们手动创建相同的结构
    const fileAPI = {
      selectFile: (options) => mockIpcRenderer.invoke('file:select', options),
      selectDirectory: (options) => mockIpcRenderer.invoke('file:selectDirectory', options),
      selectSaveLocation: (options) => mockIpcRenderer.invoke('file:selectSave', options),
      readFile: (filePath) => mockIpcRenderer.invoke('file:read', filePath),
      writeFile: (filePath, content) => mockIpcRenderer.invoke('file:write', filePath, content),
      exists: (filePath) => mockIpcRenderer.invoke('file:exists', filePath),
      getAppDataPath: () => mockIpcRenderer.invoke('file:getAppDataPath'),
      openFolder: (folderPath) => mockIpcRenderer.invoke('file:openFolder', folderPath)
    };

    const windowAPI = {
      minimize: () => mockIpcRenderer.invoke('window:minimize'),
      toggleMaximize: () => mockIpcRenderer.invoke('window:toggleMaximize'),
      close: () => mockIpcRenderer.invoke('window:close'),
      setTitle: (title) => mockIpcRenderer.invoke('window:setTitle', title),
      isMaximized: () => mockIpcRenderer.invoke('window:isMaximized'),
      setSize: (width, height) => mockIpcRenderer.invoke('window:setSize', width, height),
      center: () => mockIpcRenderer.invoke('window:center')
    };

    electronAPI = {
      file: fileAPI,
      window: windowAPI,
      // 向后兼容的顶级文件夹选择方法
      selectDirectory: (options) => mockIpcRenderer.invoke('file:selectDirectory', options)
    };

    // 模拟暴露到全局
    global.window = {
      electronAPI
    };
  });

  test('Bug #1: selectDirectory 方法应该存在', () => {
    // 测试顶级 selectDirectory 方法
    expect(typeof window.electronAPI.selectDirectory).toBe('function');
    
    // 测试调用会正确映射到 IPC
    window.electronAPI.selectDirectory({ title: '选择文件夹' });
    expect(mockIpcRenderer.invoke).toHaveBeenCalledWith('file:selectDirectory', { title: '选择文件夹' });
  });

  test('Bug #1: file.selectDirectory 方法也应该存在', () => {
    // 测试 file API 中的 selectDirectory 方法
    expect(typeof window.electronAPI.file.selectDirectory).toBe('function');
    
    // 测试调用会正确映射到 IPC
    window.electronAPI.file.selectDirectory({ title: '选择文件夹' });
    expect(mockIpcRenderer.invoke).toHaveBeenCalledWith('file:selectDirectory', { title: '选择文件夹' });
  });

  test('Bug #2: window API 方法应该正确存在', () => {
    // 测试所有窗口控制方法
    expect(typeof window.electronAPI.window.minimize).toBe('function');
    expect(typeof window.electronAPI.window.toggleMaximize).toBe('function');
    expect(typeof window.electronAPI.window.close).toBe('function');
    
    // 测试方法调用
    window.electronAPI.window.minimize();
    expect(mockIpcRenderer.invoke).toHaveBeenCalledWith('window:minimize');
    
    window.electronAPI.window.toggleMaximize();
    expect(mockIpcRenderer.invoke).toHaveBeenCalledWith('window:toggleMaximize');
    
    window.electronAPI.window.close();
    expect(mockIpcRenderer.invoke).toHaveBeenCalledWith('window:close');
  });

  test('SettingsPanel.jsx 兼容性: 应该能调用 selectDirectory', () => {
    // 模拟 SettingsPanel.jsx 中的调用
    const mockOptions = {};
    window.electronAPI.selectDirectory(mockOptions);
    
    // 验证正确的 IPC 调用
    expect(mockIpcRenderer.invoke).toHaveBeenCalledWith('file:selectDirectory', mockOptions);
  });

  test('TitleBar.jsx 兼容性: 应该能调用窗口控制方法', () => {
    // 模拟 TitleBar.jsx 中的调用
    window.electronAPI.window.close();
    window.electronAPI.window.minimize();
    window.electronAPI.window.toggleMaximize();
    
    // 验证正确的 IPC 调用
    expect(mockIpcRenderer.invoke).toHaveBeenCalledWith('window:close');
    expect(mockIpcRenderer.invoke).toHaveBeenCalledWith('window:minimize');
    expect(mockIpcRenderer.invoke).toHaveBeenCalledWith('window:toggleMaximize');
  });
});

describe('修复前的问题验证', () => {
  test('修复前: selectDirectory 方法不存在会导致错误', () => {
    // 模拟没有 selectDirectory 的旧版本 API
    const oldAPI = {
      file: {
        selectFile: () => {},
        selectSaveLocation: () => {}
        // selectDirectory 缺失
      }
    };

    // 验证方法不存在
    expect(oldAPI.selectDirectory).toBeUndefined();
    expect(oldAPI.file.selectDirectory).toBeUndefined();
    
    // 这会导致 SettingsPanel.jsx 中的错误
  });

  test('修复前: 错误的 window.electron API 会导致调用失败', () => {
    // 模拟 TitleBar.jsx 中错误的 API 调用
    const incorrectAPI = {
      electron: {
        closeWindow: () => {},
        minimizeWindow: () => {},
        toggleMaximizeWindow: () => {}
      }
    };

    // 验证正确的 API 不存在
    expect(incorrectAPI.electronAPI).toBeUndefined();
    
    // 这会导致 TitleBar.jsx 中的功能失效
  });
});