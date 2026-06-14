/**
 * @file 骨架加载器组件
 * @description 提供页面加载时的占位效果，增强用户体验
 * @module components/ui
 * @author YYC
 * @version 1.0.0
 * @created 2024-10-15
 */

import React, { CSSProperties } from 'react';
import { motion } from 'framer-motion';

// 骨架加载器变体枚举
export enum SkeletonVariant {
  TEXT = 'text',
  RECTANGLE = 'rectangle',
  CIRCLE = 'circle',
  AVATAR = 'avatar',
  CARD = 'card',
  TABLE = 'table',
  FORM = 'form'
}

// 骨架加载器Props接口
interface SkeletonProps {
  /** 骨架变体类型 */
  variant?: SkeletonVariant;
  /** 宽度 */
  width?: string | number;
  /** 高度 */
  height?: string | number;
  /** 圆角 */
  borderRadius?: string | number;
  /** 是否显示动画 */
  animated?: boolean;
  /** 自定义样式 */
  className?: string;
  /** 子骨架数量 (用于重复模式) */
  count?: number;
  /** 间隔 */
  gap?: string | number;
  /** 行宽数组 (用于文本变体) */
  lineWidths?: (string | number)[];
  /** 是否为行内元素 */
  inline?: boolean;
  /** 自定义动画配置 */
  animationConfig?: {
    duration?: number;
    delay?: number;
    repeat?: number;
  };
  /** 响应式配置 */
  responsive?: {
    sm?: Partial<SkeletonProps>;
    md?: Partial<SkeletonProps>;
    lg?: Partial<SkeletonProps>;
    xl?: Partial<SkeletonProps>;
  };
  /** 测试ID */
  testId?: string;
}

// 骨架基础样式
const baseStyles: CSSProperties = {
  backgroundColor: 'var(--skeleton-background, #e5e7eb)',
  borderWidth: 0,
  borderStyle: 'solid',
  borderColor: 'transparent',
};

// 变体样式映射
const variantStyles: Record<SkeletonVariant, CSSProperties> = {
  [SkeletonVariant.TEXT]: {
    height: '1rem',
    borderRadius: '0.25rem',
    width: '100%',
  },
  [SkeletonVariant.RECTANGLE]: {
    height: '2rem',
    borderRadius: '0.375rem',
    width: '100%',
  },
  [SkeletonVariant.CIRCLE]: {
    borderRadius: '9999px',
    aspectRatio: '1 / 1',
  },
  [SkeletonVariant.AVATAR]: {
    borderRadius: '9999px',
    width: '3rem',
    height: '3rem',
  },
  [SkeletonVariant.CARD]: {
    borderRadius: '0.5rem',
    width: '100%',
    minHeight: '12rem',
  },
  [SkeletonVariant.TABLE]: {
    borderRadius: '0.375rem',
    width: '100%',
    minHeight: '24rem',
  },
  [SkeletonVariant.FORM]: {
    borderRadius: '0.5rem',
    width: '100%',
    minHeight: '32rem',
  },
};

/**
 * 基础骨架加载器组件
 */
export const Skeleton: React.FC<SkeletonProps> = ({
  variant = SkeletonVariant.TEXT,
  width,
  height,
  borderRadius,
  animated = true,
  className = '',
  animationConfig = {},
  testId,
  ...props
}) => {
  // 合并样式
  const mergedStyles: CSSProperties = {
    ...baseStyles,
    ...variantStyles[variant],
    width: width !== undefined ? width : undefined,
    height: height !== undefined ? height : undefined,
    borderRadius: borderRadius !== undefined ? borderRadius : undefined,
  };

  // 动画配置
  const defaultAnimationConfig = {
    duration: 1.5,
    delay: 0,
    repeat: Infinity,
  };

  const mergedAnimationConfig = {
    ...defaultAnimationConfig,
    ...animationConfig,
  };

  // 动画变体
  const motionVariants = {
    initial: { opacity: 0.3 },
    animate: { opacity: 0.7 },
  };

  // 计算动画过渡
  const transition = {
    duration: mergedAnimationConfig.duration,
    delay: mergedAnimationConfig.delay,
    repeat: mergedAnimationConfig.repeat,
    repeatType: 'reverse' as const,
    ease: 'easeInOut' as const,
  };

  // 渲染动画或静态骨架
  const skeletonContent = animated ? (
    <motion.div
      initial="initial"
      animate="animate"
      variants={motionVariants}
      transition={transition}
      style={mergedStyles}
      className={className}
      data-testid={testId}
    />
  ) : (
    <div
      style={mergedStyles}
      className={className}
      data-testid={testId}
    />
  );

  return skeletonContent;
};

/**
 * 骨架文本组件
 */
export const TextSkeleton: React.FC<Omit<SkeletonProps, 'variant' | 'lineWidths'> & {
  lineWidths?: (string | number)[];
  lines?: number;
  paragraph?: boolean;
}> = ({
  lineWidths,
  lines = 3,
  paragraph = false,
  gap = paragraph ? '0.75rem' : '0.5rem',
  className = '',
  ...props
}) => {
  // 生成行骨架
  const renderLines = () => {
    const lineElements = [];

    for (let i = 0; i < lines; i++) {
      // 使用行宽数组或默认值
      const width = lineWidths && lineWidths[i] !== undefined ? lineWidths[i] : '100%';

      lineElements.push(
        <Skeleton
          key={i}
          variant={SkeletonVariant.TEXT}
          width={width}
          className={props.className}
          {...props}
        />
      );
    }

    return lineElements;
  };

  return (
    <div
      className={`flex flex-col gap-${gap} ${className}`}
      style={{ gap }}
    >
      {renderLines()}
    </div>
  );
};

/**
 * 骨架卡片组件
 */
export const CardSkeleton: React.FC<SkeletonProps & {
  withImage?: boolean;
  withTitle?: boolean;
  withDescription?: boolean;
  withFooter?: boolean;
  titleLines?: number;
  descriptionLines?: number;
}> = ({
  withImage = true,
  withTitle = true,
  withDescription = true,
  withFooter = false,
  titleLines = 1,
  descriptionLines = 2,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-100 dark:border-gray-700 ${className}`}
      style={{
        width: props.width ?? '100%',
        minHeight: props.height ?? '200px',
      }}
    >
      {/* 卡片图片骨架 */}
      {withImage && (
        <Skeleton
          variant={SkeletonVariant.RECTANGLE}
          width="100%"
          height="120px"
          className="mb-4"
          {...props}
        />
      )}

      {/* 卡片标题骨架 */}
      {withTitle && (
        <div className="space-y-2 mb-3">
          {Array.from({ length: titleLines }).map((_, index) => (
            <Skeleton
              key={index}
              variant={SkeletonVariant.TEXT}
              width={index === 0 ? '80%' : '100%'}
              height="1.25rem"
              className="font-medium"
              {...props}
            />
          ))}
        </div>
      )}

      {/* 卡片描述骨架 */}
      {withDescription && (
        <div className="space-y-2 mb-4">
          {Array.from({ length: descriptionLines }).map((_, index) => (
            <Skeleton
              key={index}
              variant={SkeletonVariant.TEXT}
              width={index === descriptionLines - 1 ? '60%' : '100%'}
              {...props}
            />
          ))}
        </div>
      )}

      {/* 卡片页脚骨架 */}
      {withFooter && (
        <div className="flex items-center justify-between pt-2">
          <Skeleton
            variant={SkeletonVariant.RECTANGLE}
            width="60px"
            height="32px"
            {...props}
          />
          <Skeleton
            variant={SkeletonVariant.CIRCLE}
            width="32px"
            height="32px"
            {...props}
          />
        </div>
      )}
    </div>
  );
};

/**
 * 骨架表格组件
 */
export const TableSkeleton: React.FC<SkeletonProps & {
  rows?: number;
  columns?: number;
  withHeader?: boolean;
}> = ({
  rows = 5,
  columns = 4,
  withHeader = true,
  className = '',
  ...props
}) => {
  // 生成列骨架
  const renderColumns = () => {
    const columnElements = [];
    
    // 计算每列的宽度（随机变化以模拟真实表格）
    const columnWidths = Array.from({ length: columns }).map(() => 
      `${Math.floor(Math.random() * 20) + 15}%`
    );

    for (let i = 0; i < columns; i++) {
      columnElements.push(
        <div
          key={i}
          className="flex-1 px-4 py-2"
          style={{ width: columnWidths[i] }}
        >
          <Skeleton
            variant={SkeletonVariant.TEXT}
            width="80%"
            {...props}
          />
        </div>
      );
    }

    return columnElements;
  };

  // 生成行骨架
  const renderRows = () => {
    const rowElements = [];

    for (let i = 0; i < rows; i++) {
      rowElements.push(
        <div
          key={i}
          className="flex border-t border-gray-200 dark:border-gray-700"
        >
          {renderColumns()}
        </div>
      );
    }

    return rowElements;
  };

  return (
    <div
      className={`w-full bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden border border-gray-100 dark:border-gray-700 ${className}`}
    >
      {/* 表格头部 */}
      {withHeader && (
        <div className="flex border-b border-gray-200 dark:border-gray-700 font-medium">
          {renderColumns()}
        </div>
      )}
      
      {/* 表格内容 */}
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {renderRows()}
      </div>
    </div>
  );
};

/**
 * 骨架表单组件
 */
export const FormSkeleton: React.FC<SkeletonProps & {
  fields?: number;
  withButton?: boolean;
  withHeader?: boolean;
}> = ({
  fields = 5,
  withButton = true,
  withHeader = true,
  className = '',
  ...props
}) => {
  // 生成表单项骨架
  const renderFields = () => {
    const fieldElements = [];

    for (let i = 0; i < fields; i++) {
      // 随机决定是否显示标签
      const hasLabel = Math.random() > 0.2;
      // 随机决定是输入框还是选择框
      const isInput = Math.random() > 0.5;

      fieldElements.push(
        <div key={i} className="mb-5">
          {hasLabel && (
            <Skeleton
              variant={SkeletonVariant.TEXT}
              width="30%"
              height="1.25rem"
              className="mb-2"
              {...props}
            />
          )}
          <Skeleton
            variant={SkeletonVariant.RECTANGLE}
            width="100%"
            height={isInput ? '2.5rem' : '8rem'}
            {...props}
          />
        </div>
      );
    }

    return fieldElements;
  };

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-100 dark:border-gray-700 ${className}`}
      style={{
        width: props.width ?? '100%',
      }}
    >
      {/* 表单头部 */}
      {withHeader && (
        <div className="mb-6">
          <Skeleton
            variant={SkeletonVariant.TEXT}
            width="60%"
            height="1.75rem"
            className="mb-2 font-bold"
            {...props}
          />
          <Skeleton
            variant={SkeletonVariant.TEXT}
            width="100%"
            {...props}
          />
        </div>
      )}

      {/* 表单字段 */}
      <div className="space-y-1">
        {renderFields()}
      </div>

      {/* 表单按钮 */}
      {withButton && (
        <div className="mt-8 flex justify-end space-x-4">
          <Skeleton
            variant={SkeletonVariant.RECTANGLE}
            width="8rem"
            height="3rem"
            {...props}
          />
          <Skeleton
            variant={SkeletonVariant.RECTANGLE}
            width="10rem"
            height="3rem"
            {...props}
          />
        </div>
      )}
    </div>
  );
};

/**
 * 骨架列表组件
 */
export const ListSkeleton: React.FC<SkeletonProps & {
  items?: number;
  withAvatar?: boolean;
  withBadge?: boolean;
  withActions?: boolean;
}> = ({
  items = 4,
  withAvatar = true,
  withBadge = true,
  withActions = true,
  className = '',
  gap = '0.75rem',
  ...props
}) => {
  // 生成列表项骨架
  const renderItems = () => {
    const itemElements = [];

    for (let i = 0; i < items; i++) {
      itemElements.push(
        <div
          key={i}
          className="flex items-center p-3 border-b border-gray-200 dark:border-gray-700 last:border-0"
        >
          {/* 头像 */}
          {withAvatar && (
            <Skeleton
              variant={SkeletonVariant.AVATAR}
              className="mr-4"
              {...props}
            />
          )}

          {/* 内容 */}
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <Skeleton
                variant={SkeletonVariant.TEXT}
                width="60%"
                className="mb-1"
                {...props}
              />
              {withBadge && (
                <Skeleton
                  variant={SkeletonVariant.RECTANGLE}
                  width="4rem"
                  height="1.5rem"
                  borderRadius="999px"
                  {...props}
                />
              )}
            </div>
            <Skeleton
              variant={SkeletonVariant.TEXT}
              width="80%"
              {...props}
            />
          </div>

          {/* 操作按钮 */}
          {withActions && (
            <Skeleton
              variant={SkeletonVariant.CIRCLE}
              width="2rem"
              height="2rem"
              className="ml-4"
              {...props}
            />
          )}
        </div>
      );
    }

    return itemElements;
  };

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-100 dark:border-gray-700 ${className}`}
      style={{ gap }}
    >
      {renderItems()}
    </div>
  );
};

/**
 * 骨架仪表板组件
 */
export const DashboardSkeleton: React.FC<SkeletonProps & {
  cards?: number;
  withCharts?: boolean;
}> = ({
  cards = 4,
  withCharts = true,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`w-full space-y-6 ${className}`}
    >
      {/* 卡片网格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: cards }).map((_, index) => (
          <Skeleton
            key={index}
            variant={SkeletonVariant.CARD}
            height="120px"
            className="p-4 flex flex-col justify-between"
            {...props}
          >
            <div />
            <div>
              <Skeleton
                variant={SkeletonVariant.TEXT}
                width="40%"
                className="mb-1"
                {...props}
              />
              <Skeleton
                variant={SkeletonVariant.TEXT}
                width="60%"
                height="1.5rem"
                className="font-bold"
                {...props}
              />
            </div>
          </Skeleton>
        ))}
      </div>

      {/* 图表区域 */}
      {withCharts && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton
            variant={SkeletonVariant.CARD}
            height="300px"
            className="p-4"
            {...props}
          />
          <Skeleton
            variant={SkeletonVariant.CARD}
            height="300px"
            className="p-4"
            {...props}
          />
        </div>
      )}

      {/* 最近活动表格 */}
      <Skeleton
        variant={SkeletonVariant.TABLE}
        height="300px"
        className="p-4"
        {...props}
      />
    </div>
  );
};

/**
 * 骨架加载器容器组件
 * 用于组织多个骨架组件
 */
export const SkeletonLoader: React.FC<{
  children?: React.ReactNode;
  className?: string;
  animate?: boolean;
  loading?: boolean;
}> = ({ children, className = '', animate = true, loading = true }) => {
  // 如果不在加载状态，不显示骨架
  if (!loading) {
    return children || null;
  }

  return (
    <div
      className={`skeleton-container ${className}`}
      data-loading="true"
    >
      {children}
    </div>
  );
};

// 默认导出骨架加载器组件
export default SkeletonLoader;