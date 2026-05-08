/**
 * file: CyberpunkWidget.tsx
 * description: 赛博朋克风格悬浮窗口组件
 * author: YanYuCloudCube Team
 * version: v1.0.0
 * created: 2026-03-30
 * updated: 2026-03-30
 * status: active
 * tags: [component],[effects],[widget],[drag]
 *
 * copyright: YanYuCloudCube Team
 * license: MIT
 *
 * brief: 可拖拽、可缩放的赛博朋克风格悬浮窗口组件
 *
 * details:
 * - 支持拖拽移动和边缘缩放
 * - 支持最小化、最大化、还原操作
 * - 支持多标签页切换
 * - 赛博朋克风格视觉效果
 * - 支持自定义内容渲染
 *
 * exports: CyberpunkWidget, CyberpunkWidgetProps, WidgetTab
 * dependencies: react, lucide-react
 */

import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
  memo,
  type ReactNode,
} from 'react';

// ==========================================
// 类型定义
// ==========================================

/**
 * 标签页标识
 */
export type WidgetTab = string;

/**
 * 标签页配置
 */
export interface WidgetTabConfig {
  /** 标签页唯一标识 */
  id: WidgetTab;
  /** 标签页显示标签 */
  label: string;
  /** 标签页图标（React组件或emoji字符串） */
  icon: React.ComponentType<{ className?: string }> | string;
  /** 标签页主题颜色 */
  color: string;
  /** 标签页内容 */
  content: ReactNode;
}

/**
 * CyberpunkWidget 组件属性
 */
export interface CyberpunkWidgetProps {
  /** 标签页配置列表 */
  tabs: WidgetTabConfig[];
  /** 默认激活的标签页ID */
  defaultActiveTab?: WidgetTab;
  /** 窗口标题 */
  title?: string;
  /** 窗口副标题 */
  subtitle?: string;
  /** 默认宽度 */
  defaultWidth?: number;
  /** 默认高度 */
  defaultHeight?: number;
  /** 最小宽度 */
  minWidth?: number;
  /** 最大宽度 */
  maxWidth?: number;
  /** 最小高度 */
  minHeight?: number;
  /** 最大高度 */
  maxHeight?: number;
  /** 切换到独立模式回调 */
  onSwitchMode?: () => void;
  /** 自定义主题颜色 */
  themeColor?: string;
  /** 是否显示快速操作栏 */
  showQuickActions?: boolean;
  /** 快速操作配置 */
  quickActions?: Array<{
    label: string;
    icon: React.ComponentType<{ className?: string }> | string;
    color: string;
    onClick?: () => void;
  }>;
  /** 额外的CSS类名 */
  className?: string;
}

// ==========================================
// 默认配置
// ==========================================

const DEFAULT_THEME_COLOR = '#00f0ff';

// ==========================================
// 组件实现
// ==========================================

/**
 * 赛博朋克风格悬浮窗口组件
 *
 * 可拖拽、可缩放的悬浮窗口，支持最小化、最大化操作。
 * 提供赛博朋克风格的视觉效果和多标签页支持。
 *
 * @param props - 组件属性
 * @returns 悬浮窗口组件
 *
 * @example
 * ```tsx
 * const tabs = [
 *   { id: 'chat', label: '聊天', icon: MessageCircle, color: '#00f0ff', content: <ChatPanel /> },
 *   { id: 'tools', label: '工具', icon: Wrench, color: '#00ffcc', content: <ToolsPanel /> },
 * ];
 *
 * <CyberpunkWidget
 *   tabs={tabs}
 *   defaultActiveTab="chat"
 *   title="AI助手"
 * />
 * ```
 */
export const CyberpunkWidget = memo(function CyberpunkWidget({
  tabs,
  defaultActiveTab,
  title = 'YYC³',
  subtitle = '智能助手',
  defaultWidth = 420,
  defaultHeight = 620,
  minWidth = 320,
  maxWidth = 800,
  minHeight = 400,
  maxHeight = 900,
  onSwitchMode,
  themeColor = DEFAULT_THEME_COLOR,
  showQuickActions = true,
  quickActions,
  className = '',
}: CyberpunkWidgetProps) {
  const [minimized, setMinimized] = useState(false);
  const [maximized, setMaximized] = useState(false);
  const [activeTab, setActiveTab] = useState<WidgetTab>(
    defaultActiveTab ?? tabs[0]?.id ?? ''
  );
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({ w: defaultWidth, h: defaultHeight });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const dragRef = useRef({ startX: 0, startY: 0, startPosX: 0, startPosY: 0 });
  const resizeRef = useRef({ startX: 0, startY: 0, startW: 0, startH: 0 });
  const widgetRef = useRef<HTMLDivElement>(null);

  // Initialize position
  useEffect(() => {
    setPosition({
      x: window.innerWidth - defaultWidth - 24,
      y: window.innerHeight - defaultHeight - 24,
    });
  }, [defaultWidth, defaultHeight]);

  // Drag handlers
  const onDragStart = useCallback(
    (e: React.MouseEvent) => {
      if (maximized) return;
      setIsDragging(true);
      dragRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        startPosX: position.x,
        startPosY: position.y,
      };
    },
    [position, maximized]
  );

  useEffect(() => {
    if (!isDragging) return;
    const onMove = (e: MouseEvent) => {
      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;
      setPosition({
        x: Math.max(0, Math.min(window.innerWidth - size.w, dragRef.current.startPosX + dx)),
        y: Math.max(0, Math.min(window.innerHeight - size.h, dragRef.current.startPosY + dy)),
      });
    };
    const onUp = () => setIsDragging(false);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [isDragging, size]);

  // Resize handlers
  const onResizeStart = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (maximized) return;
      setIsResizing(true);
      resizeRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        startW: size.w,
        startH: size.h,
      };
    },
    [size, maximized]
  );

  useEffect(() => {
    if (!isResizing) return;
    const onMove = (e: MouseEvent) => {
      const dw = e.clientX - resizeRef.current.startX;
      const dh = e.clientY - resizeRef.current.startY;
      setSize({
        w: Math.max(minWidth, Math.min(maxWidth, resizeRef.current.startW + dw)),
        h: Math.max(minHeight, Math.min(maxHeight, resizeRef.current.startH + dh)),
      });
    };
    const onUp = () => setIsResizing(false);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [isResizing, minWidth, maxWidth, minHeight, maxHeight]);

  const toggleMaximize = () => {
    setMaximized((prev) => !prev);
  };

  // Get active tab content
  const activeTabConfig = tabs.find((t) => t.id === activeTab);

  // Minimized FAB
  if (minimized) {
    return (
      <div className="fixed z-[10000]" style={{ bottom: 24, right: 24 }}>
        <button
          onClick={() => setMinimized(false)}
          className="w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 group"
          style={{
            background: `linear-gradient(135deg, ${themeColor}, #00d4ff)`,
            boxShadow: `0 0 20px ${themeColor}80, 0 0 40px ${themeColor}50`,
            animation: 'neon-pulse 2s ease-in-out infinite',
          }}
          aria-label="展开窗口"
        >
          <svg
            className="w-6 h-6 text-white group-hover:animate-spin"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        {/* Ripple ring */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            border: `2px solid ${themeColor}50`,
            animation: 'neon-pulse 2s ease-in-out infinite',
          }}
        />
      </div>
    );
  }

  return (
    <div
      ref={widgetRef}
      className={`fixed z-[10000] flex flex-col ${className}`}
      role="dialog"
      aria-label={title}
      style={{
        width: maximized ? '100vw' : size.w,
        height: maximized ? '100vh' : size.h,
        left: maximized ? 0 : position.x,
        top: maximized ? 0 : position.y,
        borderRadius: maximized ? 0 : 20,
        background: 'rgba(10,10,10,0.78)',
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        border: maximized ? 'none' : `2px solid ${themeColor}60`,
        boxShadow: maximized
          ? 'none'
          : `0 20px 60px rgba(0,0,0,0.6), 0 0 25px ${themeColor}66, 0 0 50px ${themeColor}30`,
        transition: isDragging || isResizing ? 'none' : 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        willChange: 'transform, opacity',
      }}
    >
      {/* Multi-layer glass overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          borderRadius: maximized ? 0 : 20,
          background: `linear-gradient(135deg, ${themeColor}12 0%, transparent 50%), linear-gradient(225deg, #00d4ff12 0%, transparent 50%)`,
        }}
      />
      {/* Circuit grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          borderRadius: maximized ? 0 : 20,
          backgroundImage: `linear-gradient(${themeColor}08 1px, transparent 1px), linear-gradient(90deg, ${themeColor}08 1px, transparent 1px)`,
          backgroundSize: '18px 18px',
        }}
      />

      {/* ==== HEADER ==== */}
      <div
        className="relative z-20 flex items-center justify-between px-4 py-3 shrink-0 select-none"
        style={{
          cursor: maximized ? 'default' : 'grab',
          borderBottom: `1px solid ${themeColor}25`,
          background: 'rgba(0,0,0,0.3)',
          borderRadius: maximized ? '0' : '20px 20px 0 0',
        }}
        onMouseDown={onDragStart}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${themeColor}, #00d4ff)`,
              boxShadow: `0 0 10px ${themeColor}80`,
            }}
          >
            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <span
              className="text-sm text-white/90 tracking-wider"
              style={{ textShadow: `0 0 8px ${themeColor}80` }}
            >
              {title}{' '}
              <span style={{ color: '#00d4ff', textShadow: '0 0 6px rgba(0,212,255,0.5)' }}>
                {subtitle}
              </span>
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {onSwitchMode && (
            <button
              onClick={onSwitchMode}
              className="p-1.5 rounded-lg transition-all duration-300 hover:bg-white/10 group"
              title="独立应用模式"
              aria-label="切换到独立模式"
            >
              <svg
                className="w-3.5 h-3.5 text-white/30 group-hover:text-[#00d4ff]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
          )}
          <button
            onClick={() => setMinimized(true)}
            className="p-1.5 rounded-lg transition-all duration-300 hover:bg-white/10 group"
            aria-label="最小化"
          >
            <svg
              className="w-3.5 h-3.5 text-white/30 group-hover:text-[#00ffcc]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
          <button
            onClick={toggleMaximize}
            className="p-1.5 rounded-lg transition-all duration-300 hover:bg-white/10 group"
            aria-label={maximized ? '还原' : '最大化'}
          >
            {maximized ? (
              <svg
                className="w-3.5 h-3.5 text-white/30 group-hover:text-[#00ffc8]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            ) : (
              <svg
                className="w-3.5 h-3.5 text-white/30 group-hover:text-[#00ffc8]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            )}
          </button>
          <button
            onClick={() => setMinimized(true)}
            className="p-1.5 rounded-lg transition-all duration-300 hover:bg-[#005f7320] group"
            aria-label="关闭"
          >
            <svg
              className="w-3.5 h-3.5 text-white/30 group-hover:text-[#005f73]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* ==== TABS ==== */}
      {tabs.length > 1 && (
        <div
          className="relative z-20 flex items-center gap-1 px-3 py-2 shrink-0"
          style={{ borderBottom: `1px solid ${themeColor}15`, background: 'rgba(0,0,0,0.15)' }}
        >
          {tabs.map((tab) => {
            const active = activeTab === tab.id;
            const IconComponent = typeof tab.icon === 'string' ? null : tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all duration-300"
                style={{
                  background: active ? `${tab.color}15` : 'transparent',
                  color: active ? tab.color : 'rgba(255,255,255,0.35)',
                  border: active ? `1px solid ${tab.color}30` : '1px solid transparent',
                  boxShadow: active ? `0 0 8px ${tab.color}20` : 'none',
                }}
              >
                {IconComponent ? (
                  <IconComponent className="w-3.5 h-3.5" />
                ) : (
                  typeof tab.icon === 'string' && <span className="text-sm">{tab.icon}</span>
                )}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* ==== CONTENT ==== */}
      <div className="relative z-20 flex-1 overflow-hidden">{activeTabConfig?.content}</div>

      {/* ==== QUICK ACTIONS ==== */}
      {showQuickActions && quickActions && quickActions.length > 0 && (
        <div
          className="relative z-20 flex items-center justify-around px-4 py-2 shrink-0"
          style={{
            borderTop: `1px solid ${themeColor}18`,
            background: 'rgba(0,0,0,0.2)',
            borderRadius: maximized ? '0' : '0 0 20px 20px',
          }}
        >
          {quickActions.map((action, i) => {
            const IconComponent = typeof action.icon === 'function' ? action.icon : null;
            return (
              <button
                key={i}
                onClick={action.onClick}
                className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-all duration-300 hover:bg-white/5 group"
              >
                {IconComponent ? (
                  <IconComponent className="w-3.5 h-3.5 text-white/25 group-hover:text-[#00f0ff] transition-colors" />
                ) : (
                  typeof action.icon === 'string' && <span className="text-sm">{action.icon}</span>
                )}
                <span className="text-[9px] text-white/20 group-hover:text-white/50 transition-colors">
                  {action.label}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Resize handle */}
      {!maximized && (
        <div
          className="absolute bottom-0 right-0 w-6 h-6 cursor-se-resize z-30 flex items-center justify-center"
          onMouseDown={onResizeStart}
          style={{ borderRadius: '0 0 20px 0' }}
        >
          <svg
            className="w-3 h-3 text-white/10 rotate-[-45deg]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
          </svg>
        </div>
      )}
    </div>
  );
});

export default CyberpunkWidget;
