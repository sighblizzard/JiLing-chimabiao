/**
 * Electron 预加载脚本 - 简化版本
 */

const { contextBridge, ipcRenderer } = require('electron');

// 暴露安全的 API 给渲染进程
contextBridge.exposeInMainWorld('electronAPI', {
  // 窗口控制 - 使用IPC通信
  window: {
    close: () => ipcRenderer.invoke('window-close'),
    minimize: () => ipcRenderer.invoke('window-minimize'),
    maximize: () => ipcRenderer.invoke('window-maximize'),
    unmaximize: () => ipcRenderer.invoke('window-unmaximize'),
    toggleMaximize: () => ipcRenderer.invoke('window-toggle-maximize'),
    isMaximized: () => ipcRenderer.invoke('window-is-maximized'),
    isMinimized: () => ipcRenderer.invoke('window-is-minimized'),
    setAlwaysOnTop: (flag) => ipcRenderer.invoke('window-set-always-on-top', flag),
    isFrameless: () => ipcRenderer.invoke('window-is-frameless')
  },

  // 文件系统操作
  selectDirectory: (options = {}) => ipcRenderer.invoke('file:selectDirectory', options),
  selectFile: (options = {}) => ipcRenderer.invoke('file:select', options),
  selectSave: (options = {}) => ipcRenderer.invoke('file:selectSave', options),
  saveImageToPath: (filePath, base64Data) => ipcRenderer.invoke('file:saveImage', filePath, base64Data),
  fileExists: (filePath) => ipcRenderer.invoke('file:exists', filePath),

  // 平台信息
  platform: {
    getPlatform: () => ipcRenderer.invoke('get-platform'),
    current: process.platform
  },
  
  // 窗口状态事件监听
  onWindowStateChanged: (callback) => {
    ipcRenderer.on('window-state-changed', (event, state) => callback(state));
  },
  removeWindowStateListener: () => {
    ipcRenderer.removeAllListeners('window-state-changed');
  },
  
  // 版本信息
  versions: {
    node: process.versions.node,
    chrome: process.versions.chrome,
    electron: process.versions.electron
  }
});

// 监听窗口状态变化并分发全局事件
ipcRenderer.on('window-state-changed', (event, state) => {
  // 确保 DOM 已加载后再分发事件
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.dispatchEvent(new CustomEvent('window-state-changed', { detail: state }));
    });
  } else {
    window.dispatchEvent(new CustomEvent('window-state-changed', { detail: state }));
  }
});

console.log('预加载脚本加载完成');
