/**
 * 高质量UI组件样式工具
 * 为应用提供统一的高品质视觉效果
 */

import { css } from 'styled-components';

// 高质量渲染基础
export const highQualityBase = css`
  /* 硬件加速 */
  -webkit-transform: translateZ(0);
  transform: translateZ(0);
  will-change: transform;

  /* 反锯齿 */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;

  /* 子像素精度 */
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
`;

// 精细化边框
export const precisionBorder = css`
  border: 1px solid ${(props) => props.theme.colors.border.light};

  @media (-webkit-min-device-pixel-ratio: 1.5), (min-resolution: 144dpi) {
    border-width: 0.5px;
  }
`;

// 高质量按钮样式
export const highQualityButton = css`
  ${highQualityBase}

  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${(props) => props.theme.spacing.sm}
    ${(props) => props.theme.spacing.md};
  border: none;
  border-radius: ${(props) => props.theme.borderRadius.md};
  font-family: ${(props) => props.theme.typography.fontFamily.sans.join(', ')};
  font-weight: ${(props) => props.theme.typography.fontWeight.medium};
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  line-height: ${(props) => props.theme.typography.lineHeight.normal};
  cursor: pointer;
  transition: all ${(props) => props.theme.rendering.duration.normal}
    ${(props) => props.theme.rendering.easing.ease};

  /* 防止文本选择 */
  user-select: none;
  -webkit-user-select: none;

  /* 触摸优化 */
  touch-action: manipulation;

  &:hover {
    transform: translateY(-1px) translateZ(0);
    box-shadow: ${(props) => props.theme.shadows.md};
  }

  &:active {
    transform: translateY(0) translateZ(0);
    transition-duration: ${(props) => props.theme.rendering.duration.fast};
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.2);
  }

  /* 禁用状态 */
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none !important;
  }
`;

// 高质量输入框样式
export const highQualityInput = css`
  ${highQualityBase}
  ${precisionBorder}
  
  padding: ${(props) => props.theme.spacing.sm} ${(props) =>
  props.theme.spacing.md};
  border-radius: ${(props) => props.theme.borderRadius.md};
  font-family: ${(props) => props.theme.typography.fontFamily.sans.join(', ')};
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  line-height: ${(props) => props.theme.typography.lineHeight.normal};
  background: ${(props) => props.theme.colors.background.primary};
  color: ${(props) => props.theme.colors.gray[700]};
  transition: all ${(props) => props.theme.rendering.duration.normal}
    ${(props) => props.theme.rendering.easing.ease};

  &::placeholder {
    color: ${(props) => props.theme.colors.gray[400]};
  }

  &:focus {
    border-color: ${(props) => props.theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.1);
    outline: none;
  }

  &:disabled {
    background: ${(props) => props.theme.colors.gray[50]};
    color: ${(props) => props.theme.colors.gray[400]};
    cursor: not-allowed;
  }
`;

// 高质量卡片样式
export const highQualityCard = css`
  ${highQualityBase}

  background: ${(props) => props.theme.colors.background.primary};
  border-radius: ${(props) => props.theme.borderRadius.lg};
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: ${(props) => props.theme.shadows.sm};
  transition: all ${(props) => props.theme.rendering.duration.slow}
    ${(props) => props.theme.rendering.easing.ease};

  &:hover {
    box-shadow: ${(props) => props.theme.shadows.md};
    transform: translateY(-2px) translateZ(0);
  }
`;

// 高质量表格样式
export const highQualityTable = css`
  ${highQualityBase}

  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  border-radius: ${(props) => props.theme.borderRadius.lg};
  overflow: hidden;
  box-shadow: ${(props) => props.theme.shadows.sm};
  background: ${(props) => props.theme.colors.background.primary};

  th,
  td {
    padding: ${(props) => props.theme.spacing.md};
    text-align: left;
    border-right: 1px solid ${(props) => props.theme.colors.border.light};
    border-bottom: 1px solid ${(props) => props.theme.colors.border.light};

    /* 优化表格文本渲染 */
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;

    &:last-child {
      border-right: none;
    }
  }

  th {
    background: ${(props) => props.theme.colors.background.secondary};
    font-weight: ${(props) => props.theme.typography.fontWeight.medium};
    color: ${(props) => props.theme.colors.gray[700]};
    font-size: ${(props) => props.theme.typography.fontSize.sm};
  }

  td {
    font-size: ${(props) => props.theme.typography.fontSize.sm};
    color: ${(props) => props.theme.colors.gray[600]};
  }

  tr:last-child td {
    border-bottom: none;
  }

  tr:hover td {
    background: ${(props) => props.theme.colors.background.secondary};
  }
`;

// 微动画
export const fadeInAnimation = css`
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  animation: fadeIn ${(props) => props.theme.rendering.duration.slow}
    ${(props) => props.theme.rendering.easing.easeOut};
`;

// 高DPI优化
export const highDPIOptimization = css`
  @media (-webkit-min-device-pixel-ratio: 1.5), (min-resolution: 144dpi) {
    /* 高DPI屏幕优化 */
    -webkit-transform: translateZ(0);
    transform: translateZ(0);
  }
`;

// 尺码表专用样式优化
export const sizeTableOptimization = css`
  ${highQualityBase}
  ${highQualityTable}
  
  /* 尺码表特定优化 */
  font-variant-numeric: tabular-nums;
  letter-spacing: ${(props) => props.theme.typography.letterSpacing.tight};

  th {
    font-weight: ${(props) => props.theme.typography.fontWeight.medium};
    text-transform: uppercase;
    letter-spacing: ${(props) => props.theme.typography.letterSpacing.wide};
    font-size: ${(props) => props.theme.typography.fontSize.xs};
  }

  td {
    font-weight: ${(props) => props.theme.typography.fontWeight.normal};
    font-variant-numeric: tabular-nums;
  }

  /* 数字单元格优化 */
  .numeric-cell {
    text-align: center;
    font-feature-settings: 'tnum';
    font-variant-numeric: tabular-nums;
  }

  /* 尺码标识优化 */
  .size-label {
    font-weight: ${(props) => props.theme.typography.fontWeight.medium};
    text-align: center;
  }
`;

// 导出所有样式工具
export const highQualityStyles = {
  base: highQualityBase,
  border: precisionBorder,
  button: highQualityButton,
  input: highQualityInput,
  card: highQualityCard,
  table: highQualityTable,
  sizeTable: sizeTableOptimization,
  fadeIn: fadeInAnimation,
  highDPI: highDPIOptimization,
};
