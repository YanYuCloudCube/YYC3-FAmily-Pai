/**
 * @file 虚拟列表组件
 * @description 用于高效渲染大型列表数据，只渲染可视区域内的元素
 * @module components/ui/virtual-list
 * @author YYC
 * @version 1.0.0
 * @created 2024-10-15
 */

'use client';

import * as React from 'react';
import { useState, useRef, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface VirtualListProps<T> {
  /** 数据源数组 */
  items: T[];
  /** 每个列表项的渲染函数 */
  renderItem: (item: T, index: number) => React.ReactNode;
  /** 容器类名 */
  className?: string;
  /** 列表项类名 */
  itemClassName?: string;
  /** 列表项高度（固定高度模式） */
  itemHeight?: number;
  /** 预渲染的额外项数（上方和下方） */
  overscanCount?: number;
  /** 列表容器的固定高度 */
  height?: number | string;
  /** 列表容器的最大高度 */
  maxHeight?: number | string;
  /** 滚动到指定索引位置 */
  scrollToIndex?: number;
  /** 滚动模式：auto（自动）、smooth（平滑） */
  scrollBehavior?: 'auto' | 'smooth';
  /** 滚动事件回调 */
  onScroll?: (scrollTop: number, scrollOffset: number) => void;
}

/**
 * 虚拟列表组件 - 高效渲染大型数据集
 */
export function VirtualList<T>({
  items,
  renderItem,
  className,
  itemClassName,
  itemHeight = 50,
  overscanCount = 5,
  height = '100%',
  maxHeight,
  scrollToIndex,
  scrollBehavior = 'auto',
  onScroll,
}: VirtualListProps<T>) {
  // 容器引用
  const containerRef = useRef<HTMLDivElement>(null);
  // 滚动位置状态
  const [scrollTop, setScrollTop] = useState(0);
  // 容器尺寸状态
  const [containerHeight, setContainerHeight] = useState(0);

  // 计算可见项的索引范围
  const getItemRange = useCallback(() => {
    // 可见区域起始索引
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscanCount);
    // 可见区域结束索引
    const endIndex = Math.min(
      items.length - 1,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + overscanCount
    );
    return { startIndex, endIndex };
  }, [scrollTop, containerHeight, items.length, itemHeight, overscanCount]);

  // 计算总高度和偏移量
  const { startIndex, endIndex } = getItemRange();
  const totalHeight = items.length * itemHeight;
  const offsetY = startIndex * itemHeight;

  // 处理滚动事件
  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const currentScrollTop = e.currentTarget.scrollTop;
      setScrollTop((prev: number) => currentScrollTop);
      
      // 计算滚动偏移比例
      const scrollOffset = currentScrollTop / totalHeight;
      onScroll?.(currentScrollTop, scrollOffset);
    },
    [totalHeight, onScroll]
  );

  // 处理容器尺寸变化
  useEffect(() => {
    const updateContainerHeight = () => {
      if (containerRef.current) {
        setContainerHeight((prev: number) => containerRef.current!.clientHeight);
      }
    };

    // 初始化高度
    updateContainerHeight();

    // 添加窗口大小变化监听
    window.addEventListener('resize', updateContainerHeight);
    
    // 清理函数
    return () => {
      window.removeEventListener('resize', updateContainerHeight);
    };
  }, []);

  // 滚动到指定索引
  useEffect(() => {
    if (scrollToIndex !== undefined && containerRef.current && scrollToIndex >= 0 && scrollToIndex < items.length) {
      const targetScrollTop = scrollToIndex * itemHeight;
      containerRef.current.scrollTo({
        top: targetScrollTop,
        behavior: scrollBehavior,
      });
    }
  }, [scrollToIndex, itemHeight, scrollBehavior, items.length]);

  // 生成可见的项目列表
  const visibleItems = items.slice(startIndex, endIndex + 1).map((item, relativeIndex) => {
    const absoluteIndex = startIndex + relativeIndex;
    return (
      <div
        key={absoluteIndex}
        className={cn(
          itemClassName,
          'w-full'
        )}
        style={{
          height: `${itemHeight}px`,
          position: 'absolute',
          top: `${absoluteIndex * itemHeight}px`,
          width: '100%',
        }}
      >
        {renderItem(item, absoluteIndex)}
      </div>
    );
  });

  // 如果列表为空，显示空状态
  if (items.length === 0) {
    return (
      <div
        ref={containerRef}
        className={cn(
          className,
          'overflow-hidden',
          'flex',
          'items-center',
          'justify-center'
        )}
        style={{
          height,
          maxHeight,
        }}
      >
        <div className="text-center text-muted-foreground py-8">
          暂无数据
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        className,
        'overflow-y-auto',
        'relative'
      )}
      style={{
        height,
        maxHeight,
      }}
      onScroll={handleScroll}
    >
      {/* 占位元素，保持总高度 */}
      <div style={{ height: `${totalHeight}px`, position: 'relative' }}>
        {/* 可见项目容器，设置适当的偏移 */}
        <div
          style={{
            transform: `translateY(${offsetY}px)`,
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: `${(endIndex - startIndex + 1) * itemHeight}px`,
          }}
        >
          {visibleItems}
        </div>
      </div>
    </div>
  );
}

/**
 * 动态高度虚拟列表Hook
 * 适用于项目高度不固定的场景
 */
export function useDynamicVirtualList<T>(
  items: T[],
  containerHeight: number,
  overscanCount = 5
) {
  // 项目高度映射
  const [itemHeights, setItemHeights] = useState<Map<number, number>>(new Map());
  // 默认项目高度估算值
  const defaultItemHeight = 50;
  
  // 更新项目高度
  const updateItemHeight = useCallback((index: number, height: number) => {
    setItemHeights(prev => {
      const newHeights = new Map(prev);
      newHeights.set(index, height);
      return newHeights;
    });
  }, []);
  
  // 获取项目高度
  const getItemHeight = useCallback((index: number) => {
    return itemHeights.get(index) || defaultItemHeight;
  }, [itemHeights]);
  
  // 计算项目位置
  const getItemPosition = useCallback((index: number) => {
    let offset = 0;
    for (let i = 0; i < index; i++) {
      offset += getItemHeight(i);
    }
    return offset;
  }, [getItemHeight]);
  
  // 计算总高度
  const getTotalHeight = useCallback(() => {
    let total = 0;
    for (let i = 0; i < items.length; i++) {
      total += getItemHeight(i);
    }
    return total;
  }, [items.length, getItemHeight]);
  
  return {
    updateItemHeight,
    getItemHeight,
    getItemPosition,
    getTotalHeight,
    defaultItemHeight,
  };
}