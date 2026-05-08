/**
 * file: MicroInteractions.tsx
 * description: MicroInteractions module
 * author: YanYuCloudCube Team
 * version: v1.0.0
 * created: 2026-04-01
 * updated: 2026-04-01
 * status: active
 * tags: [component],[effect]
 */

import React, { useState } from 'react';
import { motion, useAnimation } from 'motion/react';

// 按钮涟漪效果
interface RippleButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary' | 'ghost';
}

export function RippleButton({
  children,
  onClick,
  className = '',
  variant = 'primary',
}: RippleButtonProps) {
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newRipple = { x, y, id: Date.now() };
    setRipples([...ripples, newRipple]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 600);

    onClick?.();
  };

  const variantStyles = {
    primary: 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white',
    secondary: 'bg-white/10 text-white border border-white/20',
    ghost: 'bg-transparent text-white hover:bg-white/5',
  };

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      className={`relative overflow-hidden px-6 py-3 rounded-xl font-medium transition-all ${variantStyles[variant]} ${className}`}
    >
      {/* 内容 */}
      <span className="relative z-10">{children}</span>

      {/* 涟漪效果 */}
      {ripples.map((ripple) => (
        <motion.span
          key={ripple.id}
          className="absolute rounded-full bg-white"
          style={{
            left: ripple.x,
            top: ripple.y,
          }}
          initial={{ width: 0, height: 0, opacity: 0.5 }}
          animate={{ width: 300, height: 300, opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          onAnimationComplete={() => {
            setRipples((prev) => prev.filter((r) => r.id !== ripple.id));
          }}
        />
      ))}
    </motion.button>
  );
}

// 脉冲按钮
interface PulseButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  pulseColor?: string;
}

export function PulseButton({
  children,
  onClick,
  className = '',
  pulseColor = 'rgba(59, 130, 246, 0.5)',
}: PulseButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`relative px-6 py-3 rounded-xl font-medium ${className}`}
    >
      {/* 脉冲动画 */}
      <motion.div
        className="absolute inset-0 rounded-xl"
        style={{ backgroundColor: pulseColor }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* 内容 */}
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}

// 磁性按钮（跟随鼠标）
interface MagneticButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  strength?: number;
}

export function MagneticButton({
  children,
  onClick,
  className = '',
  strength = 0.3,
}: MagneticButtonProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * strength;
    const y = (e.clientY - rect.top - rect.height / 2) * strength;
    setPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.button
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      animate={position}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      whileTap={{ scale: 0.95 }}
      className={`px-6 py-3 rounded-xl font-medium ${className}`}
    >
      {children}
    </motion.button>
  );
}

// 输入框聚焦动画
interface AnimatedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
}

export function AnimatedInput({ label, icon, className = '', ...props }: AnimatedInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  return (
    <div className="relative">
      {/* 图标 */}
      {icon && (
        <motion.div
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          animate={{
            color: isFocused ? '#00ff87' : '#9ca3af',
            scale: isFocused ? 1.1 : 1,
          }}
          transition={{ duration: 0.2 }}
        >
          {icon}
        </motion.div>
      )}

      {/* 输入框 */}
      <motion.input
        {...props}
        onFocus={(e) => {
          setIsFocused(true);
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          props.onBlur?.(e);
        }}
        onChange={(e) => {
          setHasValue(e.target.value.length > 0);
          props.onChange?.(e);
        }}
        className={`w-full ${icon ? 'pl-12' : 'pl-4'} pr-4 py-3 glass-input rounded-xl text-white ${className}`}
        animate={{
          borderColor: isFocused ? '#00ff87' : 'rgba(255, 255, 255, 0.1)',
          boxShadow: isFocused
            ? '0 0 0 3px rgba(0, 255, 135, 0.1), 0 0 20px rgba(0, 255, 135, 0.2)'
            : 'none',
        }}
        transition={{ duration: 0.2 }}
      />

      {/* 浮动标签 */}
      {label && (
        <motion.label
          className="absolute left-4 pointer-events-none text-gray-400"
          animate={{
            top: isFocused || hasValue ? '0.5rem' : '50%',
            translateY: isFocused || hasValue ? 0 : '-50%',
            fontSize: isFocused || hasValue ? '0.75rem' : '1rem',
            color: isFocused ? '#00ff87' : '#9ca3af',
          }}
          transition={{ duration: 0.2 }}
        >
          {label}
        </motion.label>
      )}

      {/* 底部进度条 */}
      <motion.div
        className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500"
        initial={{ width: '0%' }}
        animate={{ width: isFocused ? '100%' : '0%' }}
        transition={{ duration: 0.3 }}
      />
    </div>
  );
}

// 切换开关动画
interface AnimatedSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  className?: string;
}

export function AnimatedSwitch({
  checked,
  onChange,
  label,
  className = '',
}: AnimatedSwitchProps) {
  return (
    <label className={`flex items-center gap-3 cursor-pointer ${className}`}>
      <div className="relative">
        <motion.div
          className="w-14 h-8 rounded-full"
          animate={{
            backgroundColor: checked ? '#00ff87' : 'rgba(255, 255, 255, 0.1)',
          }}
          transition={{ duration: 0.3 }}
        />
        <motion.div
          className="absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-lg"
          animate={{
            x: checked ? 24 : 0,
          }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </div>
      {label && <span className="text-white">{label}</span>}
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="hidden"
      />
    </label>
  );
}

// 加载按钮
interface LoadingButtonProps {
  children: React.ReactNode;
  loading: boolean;
  onClick?: () => void;
  className?: string;
}

export function LoadingButton({
  children,
  loading,
  onClick,
  className = '',
}: LoadingButtonProps) {
  return (
    <motion.button
      whileHover={!loading ? { scale: 1.05 } : {}}
      whileTap={!loading ? { scale: 0.95 } : {}}
      onClick={!loading ? onClick : undefined}
      disabled={loading}
      className={`relative px-6 py-3 rounded-xl font-medium bg-gradient-to-r from-blue-500 to-cyan-500 text-white overflow-hidden ${className}`}
    >
      {/* 加载动画 */}
      {loading && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
      )}

      {/* 内容 */}
      <span className={`relative z-10 ${loading ? 'opacity-70' : ''}`}>
        {loading ? (
          <div className="flex items-center gap-2">
            <motion.div
              className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
            加载中...
          </div>
        ) : (
          children
        )}
      </span>
    </motion.button>
  );
}

// 计数器动画
interface AnimatedCounterProps {
  value: number;
  duration?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
}

export function AnimatedCounter({
  value,
  duration = 1,
  className = '',
  prefix = '',
  suffix = '',
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0);

  React.useEffect(() => {
    const startValue = displayValue;
    const endValue = value;
    const startTime = Date.now();

    const animate = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / (duration * 1000), 1);
      const currentValue = Math.floor(startValue + (endValue - startValue) * progress);

      setDisplayValue(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }, [value, duration]);

  return (
    <motion.span
      className={className}
      initial={{ scale: 0.8 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
    >
      {prefix}
      {displayValue.toLocaleString()}
      {suffix}
    </motion.span>
  );
}

// 复选框动画
interface AnimatedCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  className?: string;
}

export function AnimatedCheckbox({
  checked,
  onChange,
  label,
  className = '',
}: AnimatedCheckboxProps) {
  return (
    <label className={`flex items-center gap-3 cursor-pointer ${className}`}>
      <div className="relative">
        <motion.div
          className="w-6 h-6 rounded border-2"
          animate={{
            borderColor: checked ? '#00ff87' : 'rgba(255, 255, 255, 0.2)',
            backgroundColor: checked ? '#00ff87' : 'transparent',
          }}
          transition={{ duration: 0.2 }}
        />
        {checked && (
          <motion.svg
            className="absolute inset-0 w-6 h-6 text-white"
            viewBox="0 0 24 24"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <motion.path
              d="M5 13l4 4L19 7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </motion.svg>
        )}
      </div>
      {label && <span className="text-white">{label}</span>}
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="hidden"
      />
    </label>
  );
}

// 点赞按钮
export function LikeButton({ className = '' }: { className?: string }) {
  const [liked, setLiked] = useState(false);
  const controls = useAnimation();

  const handleClick = async () => {
    setLiked(!liked);

    if (!liked) {
      await controls.start({
        scale: [1, 1.3, 1],
        rotate: [0, -10, 10, 0],
        transition: { duration: 0.4 },
      });
    }
  };

  return (
    <motion.button
      onClick={handleClick}
      animate={controls}
      className={`relative ${className}`}
    >
      <motion.svg
        className="w-8 h-8"
        viewBox="0 0 24 24"
        fill={liked ? '#ef4444' : 'none'}
        animate={{
          fill: liked ? '#ef4444' : 'none',
          stroke: liked ? '#ef4444' : '#fff',
        }}
        transition={{ duration: 0.2 }}
      >
        <path
          d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </motion.svg>

      {/* 粒子爆炸效果 */}
      {liked && (
        <>
          {Array.from({ length: 6 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-red-500 rounded-full"
              style={{
                top: '50%',
                left: '50%',
              }}
              initial={{ scale: 0, x: 0, y: 0 }}
              animate={{
                scale: [0, 1, 0],
                x: Math.cos((i / 6) * Math.PI * 2) * 30,
                y: Math.sin((i / 6) * Math.PI * 2) * 30,
              }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          ))}
        </>
      )}
    </motion.button>
  );
}
