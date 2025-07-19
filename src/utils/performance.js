/**
 * 性能监控配置
 */

// 开发环境性能监控
if (process.env.NODE_ENV === 'development') {
  // React DevTools 性能监控
  if (typeof window !== 'undefined' && window.performance) {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'measure') {
          console.log(`Performance: ${entry.name} took ${entry.duration}ms`);
        }
      }
    });
    
    observer.observe({ entryTypes: ['measure'] });
  }
}

// 导出性能工具
export const performanceUtils = {
  mark: (name) => {
    if (typeof window !== 'undefined' && window.performance) {
      window.performance.mark(name);
    }
  },
  
  measure: (name, startMark, endMark) => {
    if (typeof window !== 'undefined' && window.performance) {
      window.performance.measure(name, startMark, endMark);
    }
  },
  
  // 组件渲染性能监控
  measureRender: (componentName, renderFn) => {
    const startMark = `${componentName}-render-start`;
    const endMark = `${componentName}-render-end`;
    const measureName = `${componentName}-render`;
    
    performanceUtils.mark(startMark);
    const result = renderFn();
    performanceUtils.mark(endMark);
    performanceUtils.measure(measureName, startMark, endMark);
    
    return result;
  }
};

// 内存使用监控
export const memoryUtils = {
  logMemoryUsage: () => {
    if (typeof window !== 'undefined' && window.performance.memory) {
      const memory = window.performance.memory;
      console.log('Memory Usage:', {
        used: `${Math.round(memory.usedJSHeapSize / 1024 / 1024)} MB`,
        total: `${Math.round(memory.totalJSHeapSize / 1024 / 1024)} MB`,
        limit: `${Math.round(memory.jsHeapSizeLimit / 1024 / 1024)} MB`
      });
    }
  }
};
