import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const SelectContainer = styled.div`
  position: relative;
  width: 100%;
`;

const SelectTrigger = styled(motion.button)`
  width: 100%;
  padding: ${props => {
    switch (props.$size) {
      case 'small': return '6px 32px 6px 12px';
      case 'large': return '12px 40px 12px 16px';
      default: return '8px 36px 8px 12px';
    }
  }};
  font-size: ${props => {
    switch (props.$size) {
      case 'small': return '12px';
      case 'large': return '16px';
      default: return '14px';
    }
  }};
  font-family: ${props => props.theme.typography.fontFamily.sans.join(', ')};
  border: 1px solid ${props => props.theme.colors.border.medium};
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.theme.colors.background.primary};
  color: ${props => props.$placeholder ? props.theme.colors.gray[400] : props.theme.colors.gray[700]};
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease-out;
  position: relative;

  &:hover {
    border-color: ${props => props.theme.colors.border.dark};
  }

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}33;
  }

  &:disabled {
    background: ${props => props.theme.colors.gray[50]};
    color: ${props => props.theme.colors.gray[400]};
    cursor: not-allowed;
  }

  /* 错误状态 */
  ${props => props.$error && `
    border-color: ${props.theme.colors.error};
    
    &:focus {
      border-color: ${props.theme.colors.error};
      box-shadow: 0 0 0 3px ${props.theme.colors.error}33;
    }
  `}

  /* 展开状态 */
  ${props => props.$isOpen && `
    border-color: ${props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props.theme.colors.primary}33;
  `}
`;

const ChevronIcon = styled(motion.div)`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  color: ${props => props.theme.colors.gray[400]};
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;

  &::after {
    content: '';
    width: 0;
    height: 0;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-top: 4px solid currentColor;
  }
`;

const OptionsContainer = styled(motion.div)`
  position: fixed;
  z-index: 9999;
  background: ${props => props.theme.colors.background.primary};
  border: 1px solid ${props => props.theme.colors.border.medium};
  border-radius: ${props => props.theme.borderRadius.md};
  box-shadow: ${props => props.theme.shadows.lg};
  max-height: 200px;
  overflow-y: auto;
  margin-top: 4px;
  min-width: 120px;
`;

const Option = styled(motion.div)`
  padding: 8px 12px;
  font-size: 14px;
  color: ${props => props.theme.colors.gray[700]};
  cursor: pointer;
  transition: all 0.15s ease-out;

  &:hover {
    background: ${props => props.theme.colors.gray[50]};
  }

  &:active {
    background: ${props => props.theme.colors.gray[100]};
  }

  ${props => props.$selected && `
    background: ${props.theme.colors.primary};
    color: white;
    
    &:hover {
      background: ${props.theme.colors.primary}dd;
    }
  `}

  ${props => props.$disabled && `
    color: ${props.theme.colors.gray[400]};
    cursor: not-allowed;
    
    &:hover {
      background: transparent;
    }
  `}
`;

const Label = styled.label`
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: ${props => props.theme.colors.gray[700]};
  margin-bottom: 4px;
`;

const ErrorMessage = styled.div`
  font-size: 12px;
  color: ${props => props.theme.colors.error};
  margin-top: 4px;
`;

const HelperText = styled.div`
  font-size: 12px;
  color: ${props => props.theme.colors.gray[500]};
  margin-top: 4px;
`;

/**
 * macOS 风格选择器组件
 */
const Select = ({
  label,
  placeholder = '请选择...',
  options = [],
  value,
  onChange,
  error,
  helperText,
  size = 'medium',
  disabled = false,
  className,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const containerRef = useRef(null);
  const triggerRef = useRef(null);

  // 计算下拉菜单位置
  const calculatePosition = () => {
    if (!triggerRef.current) return;
    
    const rect = triggerRef.current.getBoundingClientRect();
    console.log('计算位置:', {
      top: rect.bottom,
      left: rect.left,
      width: rect.width,
      scrollY: window.scrollY,
      scrollX: window.scrollX
    });
    
    setDropdownPosition({
      top: rect.bottom + window.scrollY + 4, // 添加4px间距
      left: rect.left + window.scrollX,
      width: rect.width
    });
  };

  // 处理打开下拉菜单
  const handleToggle = () => {
    if (!disabled) {
      if (!isOpen) {
        // 先设置状态，然后在下一帧计算位置
        setIsOpen(true);
        requestAnimationFrame(() => {
          calculatePosition();
        });
      } else {
        setIsOpen(false);
      }
    }
  };

  // 处理窗口大小变化
  useEffect(() => {
    const handleResize = () => {
      if (isOpen) {
        calculatePosition();
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleResize);
    };
  }, [isOpen]);

  // 处理点击外部关闭
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        // 检查是否点击在Portal渲染的下拉菜单内
        const dropdownElements = document.querySelectorAll('[data-dropdown-container]');
        let clickedInDropdown = false;
        
        dropdownElements.forEach(element => {
          if (element.contains(event.target)) {
            clickedInDropdown = true;
          }
        });
        
        if (!clickedInDropdown) {
          setIsOpen(false);
        }
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // 处理键盘事件
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!isOpen) return;

      switch (event.key) {
        case 'Escape':
          setIsOpen(false);
          break;
        case 'ArrowDown':
        case 'ArrowUp':
          event.preventDefault();
          // TODO: 添加键盘导航逻辑
          break;
        case 'Enter':
          event.preventDefault();
          // TODO: 添加选择逻辑
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleOptionClick = (option) => {
    if (!option.disabled) {
      onChange?.(option.value, option);
      setIsOpen(false);
    }
  };

  // 查找当前选中的选项
  const selectedOption = options.find(option => option.value === value);
  const displayValue = selectedOption ? selectedOption.label : '';
  const isPlaceholder = !selectedOption;

  return (
    <SelectContainer ref={containerRef} className={className}>
      {label && <Label>{label}</Label>}
      
      <SelectTrigger
        ref={triggerRef}
        $size={size}
        $error={Boolean(error)}
        $isOpen={isOpen}
        $placeholder={isPlaceholder}
        disabled={disabled}
        onClick={handleToggle}
        whileTap={{ scale: disabled ? 1 : 0.99 }}
        {...props}
      >
        {displayValue || placeholder}
        <ChevronIcon
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        />
      </SelectTrigger>

      {isOpen && createPortal(
        <AnimatePresence>
          <OptionsContainer
            as={motion.div}
            data-dropdown-container
            style={{
              position: 'fixed',
              top: dropdownPosition.top,
              left: dropdownPosition.left,
              width: dropdownPosition.width,
              zIndex: 9999,
              backgroundColor: 'white',
              border: '1px solid #ddd',
              borderRadius: '4px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              maxHeight: '200px',
              overflowY: 'auto'
            }}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            {options.map((option, index) => (
              <Option
                key={option.value}
                $selected={option.value === value}
                $disabled={option.disabled}
                onClick={() => handleOptionClick(option)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.02 }}
                whileHover={!option.disabled ? { backgroundColor: 'rgba(0, 0, 0, 0.04)' } : {}}
              >
                {option.label}
              </Option>
            ))}
            {options.length === 0 && (
              <Option $disabled>
                暂无选项
              </Option>
            )}
          </OptionsContainer>
        </AnimatePresence>,
        document.body
      )}

      {error && (
        <ErrorMessage>
          {error}
        </ErrorMessage>
      )}

      {!error && helperText && (
        <HelperText>
          {helperText}
        </HelperText>
      )}
    </SelectContainer>
  );
};

export default Select;
