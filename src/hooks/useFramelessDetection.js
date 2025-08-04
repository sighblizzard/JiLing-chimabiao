import { useState, useEffect } from 'react';

/**
 * 用于检测是否为无边框模式的Hook
 */
export const useFramelessDetection = () => {
  const [isFrameless, setIsFrameless] = useState(false);

  useEffect(() => {
    const checkFrameless = async () => {
      try {
        if (window.electronAPI?.window?.isFrameless) {
          const frameless = await window.electronAPI.window.isFrameless();
          setIsFrameless(frameless);
        }
      } catch (error) {
        console.error('检测无边框模式失败:', error);
        // 默认假设非无边框模式
        setIsFrameless(false);
      }
    };

    checkFrameless();
  }, []);

  return isFrameless;
};

export default useFramelessDetection;
