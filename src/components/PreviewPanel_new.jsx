import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Button from './Button';
import { exportSizeTableToImage, downloadImage } from '../services/tableExporter';
import { formatSizeDataForTable } from '../services/sizeCalculator';

const PanelContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const PanelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  flex-shrink: 0;
`;

const Title = styled.h2`
  color: ${props => props.theme.colors.gray[900]};
  font-size: 24px;
  font-weight: 600;
  margin: 0;
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ZoomControls = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: ${props => props.theme.colors.gray[50]};
  border-radius: 6px;
  border: 1px solid ${props => props.theme.colors.gray[200]};
`;

const ZoomButton = styled(Button)`
  padding: 4px 8px;
  min-width: auto;
  font-size: 12px;
`;

const ZoomLevel = styled.span`
  font-size: 14px;
  color: ${props => props.theme.colors.gray[600]};
  min-width: 60px;
  text-align: center;
`;

const CanvasContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  overflow: auto;
  background: 
    linear-gradient(45deg, #f8f9fa 25%, transparent 25%), 
    linear-gradient(-45deg, #f8f9fa 25%, transparent 25%), 
    linear-gradient(45deg, transparent 75%, #f8f9fa 75%), 
    linear-gradient(-45deg, transparent 75%, #f8f9fa 75%);
  background-size: 20px 20px;
  background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
`;

const Canvas = styled.canvas`
  border: 1px solid ${props => props.theme.colors.gray[300]};
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background: white;
  transform: scale(${props => props.zoom / 100});
  transform-origin: center;
  transition: transform 0.2s ease;
`;

const EmptyState = styled.div`
  text-align: center;
  color: ${props => props.theme.colors.gray[500]};
  font-size: 16px;
  padding: 60px 20px;
`;

const EmptyIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
`;

/**
 * 预览面板组件
 */
const PreviewPanel = ({ appState }) => {
  const { selectedCategories, sizeSettings, chartData, mode, categories, categoryStartValues } = appState;
  const canvasRef = useRef(null);
  const [zoom, setZoom] = useState(100);
  const [isGenerating, setIsGenerating] = useState(false);

  // 格式化图表数据为表格导出器期望的格式
  const formatChartDataForExport = (chartData) => {
    if (!chartData || chartData.length === 0) return [];
    
    const { headers, rows } = formatSizeDataForTable(chartData);
    
    // 转换为对象数组格式
    return rows.map(row => {
      const obj = {};
      headers.forEach((header, index) => {
        obj[header] = row[index] || '';
      });
      return obj;
    });
  };

  // 渲染Canvas预览
  const renderCanvasPreview = () => {
    if (!canvasRef.current || !chartData) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // 设置Canvas尺寸为600x600
    canvas.width = 600;
    canvas.height = 600;
    
    try {
      // 将chartData转换为tableExporter期望的格式
      const tableData = formatChartDataForExport(chartData);
      const tipText = mode === 'sweater' ? '毛衣模式：胸围等关键部位递进减半' : '此表格仅供参考，实际尺寸可能因面料和工艺而异';
      
      // 生成图片数据
      const imageDataUrl = exportSizeTableToImage(tableData, tipText);
      
      // 在Canvas上显示图片
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, 600, 600);
        ctx.drawImage(img, 0, 0, 600, 600);
      };
      img.src = imageDataUrl;
    } catch (error) {
      console.error('渲染预览失败:', error);
      
      // 降级到简单文本渲染
      ctx.clearRect(0, 0, 600, 600);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 600, 600);
      
      ctx.fillStyle = '#333333';
      ctx.font = '16px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('预览生成失败', 300, 280);
      ctx.fillText('请检查数据格式', 300, 310);
    }
  };

  // 当数据变化时重新渲染预览
  useEffect(() => {
    if (chartData && chartData.length > 0) {
      renderCanvasPreview();
    }
  }, [chartData, mode]);

  // 当选择变化时清空预览
  useEffect(() => {
    if (selectedCategories.length === 0 && canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, 600, 600);
    }
  }, [selectedCategories]);

  // 导出为图片
  const handleExportImage = async (format = 'jpeg') => {
    if (!chartData || chartData.length === 0) {
      alert('请先生成尺码表数据');
      return;
    }

    try {
      const tableData = formatChartDataForExport(chartData);
      const tipText = mode === 'sweater' ? '毛衣模式：胸围等关键部位递进减半' : '此表格仅供参考，实际尺寸可能因面料和工艺而异';
      
      const imageDataUrl = exportSizeTableToImage(tableData, tipText);
      const filename = `尺码表_${new Date().toISOString().slice(0, 10)}.${format}`;
      
      downloadImage(imageDataUrl, filename);
    } catch (error) {
      console.error('导出图片失败:', error);
      alert('导出失败，请重试');
    }
  };

  // 导出为Excel文件
  const handleExportExcel = async () => {
    if (!chartData || chartData.length === 0) {
      alert('请先生成尺码表数据');
      return;
    }

    try {
      if (window.electronAPI && window.electronAPI.exportSizeChart) {
        // 准备导出数据
        const exportData = {
          name: '尺码表',
          items: chartData.flatMap(category => 
            category.values.map(v => ({
              categoryId: category.categoryId,
              categoryName: category.categoryName,
              size: v.size,
              value: v.value,
              unit: 'cm'
            }))
          )
        };

        const result = await window.electronAPI.exportSizeChart(exportData);
        if (result.success) {
          alert('导出成功！');
        } else {
          alert(result.error || '导出失败');
        }
      } else {
        alert('Excel导出功能需要在Electron环境下运行');
      }
    } catch (error) {
      console.error('导出Excel失败:', error);
      alert('导出失败，请重试');
    }
  };

  // 缩放控制
  const handleZoomIn = () => setZoom(prev => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 25, 50));
  const handleZoomReset = () => setZoom(100);

  const hasData = chartData && chartData.length > 0;

  return (
    <PanelContainer>
      <PanelHeader>
        <Title>尺码表预览</Title>
        <Controls>
          <ZoomControls>
            <ZoomButton 
              variant="outline" 
              size="small" 
              onClick={handleZoomOut}
              disabled={zoom <= 50}
            >
              -
            </ZoomButton>
            <ZoomLevel>{zoom}%</ZoomLevel>
            <ZoomButton 
              variant="outline" 
              size="small" 
              onClick={handleZoomIn}
              disabled={zoom >= 200}
            >
              +
            </ZoomButton>
            <ZoomButton 
              variant="outline" 
              size="small" 
              onClick={handleZoomReset}
            >
              重置
            </ZoomButton>
          </ZoomControls>
          
          <Button
            variant="outline"
            onClick={() => handleExportImage('jpeg')}
            disabled={!hasData}
          >
            导出图片
          </Button>
          
          <Button
            variant="primary"
            onClick={handleExportExcel}
            disabled={!hasData}
          >
            导出Excel
          </Button>
        </Controls>
      </PanelHeader>

      <CanvasContainer>
        {hasData ? (
          <Canvas
            ref={canvasRef}
            zoom={zoom}
            width={600}
            height={600}
          />
        ) : (
          <EmptyState>
            <EmptyIcon>📊</EmptyIcon>
            <div>请先配置尺码设置并选择类别</div>
            <div style={{ fontSize: '14px', marginTop: '8px', opacity: 0.7 }}>
              在左侧选择类别，配置尺码设置，然后点击"应用设置"生成预览
            </div>
          </EmptyState>
        )}
      </CanvasContainer>
    </PanelContainer>
  );
};

export default PreviewPanel;
