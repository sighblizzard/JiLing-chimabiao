/**
 * 尺码表导出功能集成示例
 */

import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import ExportDialog from './components/ExportDialog';

const ExportButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: linear-gradient(135deg, #007aff 0%, #0056cc 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  outline: none;
  box-shadow: 0 4px 12px rgba(0, 122, 255, 0.3);
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(0, 122, 255, 0.4);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: 0 4px 12px rgba(0, 122, 255, 0.3);
  }
`;

const Icon = styled.span`
  font-size: 16px;
`;

// 使用示例组件
const SizeTableApp = () => {
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [tableData, setTableData] = useState([
    { 尺码: 'S', 胸长: '109', 肩宽: '35', 胸围: '78', 袖长: '11' },
    { 尺码: 'M', 胸长: '110', 肩宽: '36', 胸围: '82', 袖长: '12' },
    { 尺码: 'L', 胸长: '111', 肩宽: '37', 胸围: '86', 袖长: '13' },
    { 尺码: 'XL', 胸长: '112', 肩宽: '38', 胸围: '90', 袖长: '14' },
  ]);

  const handleExport = () => {
    if (tableData && tableData.length > 0) {
      setShowExportDialog(true);
    }
  };

  return (
    <div>
      {/* 你的尺码表展示组件 */}

      {/* 导出按钮 */}
      <ExportButton
        onClick={handleExport}
        disabled={!tableData || tableData.length === 0}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Icon>📸</Icon>
        导出尺码表
      </ExportButton>

      {/* 导出对话框 */}
      <ExportDialog
        isOpen={showExportDialog}
        onClose={() => setShowExportDialog(false)}
        tableData={tableData}
      />
    </div>
  );
};

export default SizeTableApp;
