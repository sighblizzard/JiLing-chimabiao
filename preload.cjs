/**
 * Electron 预加载脚本 - 简化版本
 */

const { contextBridge, ipcRenderer } = require('electron');

// 暴露安全的 API 给渲染进程
contextBridge.exposeInMainWorld('electronAPI', {
  // 窗口控制
  window: {
    close: () => {
      const { BrowserWindow } = require('electron').remote || require('@electron/remote');
      const win = BrowserWindow.getFocusedWindow();
      if (win) win.close();
    },
    minimize: () => {
      const { BrowserWindow } = require('electron').remote || require('@electron/remote');
      const win = BrowserWindow.getFocusedWindow();
      if (win) win.minimize();
    },
    maximize: () => {
      const { BrowserWindow } = require('electron').remote || require('@electron/remote');
      const win = BrowserWindow.getFocusedWindow();
      if (win) {
        if (win.isMaximized()) {
          win.unmaximize();
        } else {
          win.maximize();
        }
      }
    }
  },

  // 平台信息
  platform: process.platform,
  
  // 版本信息
  versions: {
    node: process.versions.node,
    chrome: process.versions.chrome,
    electron: process.versions.electron
  }
});

console.log('预加载脚本加载完成');
