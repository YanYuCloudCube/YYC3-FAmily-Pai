/**
 * file: ParallaxScroll.tsx
 * description: ParallaxScroll module
 * author: YanYuCloudCube Team
 * version: v1.0.0
 * created: 2026-04-01
 * updated: 2026-04-01
 * status: active
 * tags: [component],[effect]
 */

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, MotionValue } from 'motion/react';

// 基础视差滚动
interface ParallaxProps {
  children: React.ReactNode;
  speed?: number; // 滚动速度（负值向上，正值向下）
  className?: string;
}

export function Parallax({ children, speed = 0.5, className = '' }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, speed * 100]);

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y }}>{children}</motion.div>
    </div>
  );
}

// 多层视差背景
interface ParallaxLayerProps {
  children: React.ReactNode;
  speed: number;
  className?: string;
  zIndex?: number;
}

function ParallaxLayer({ children, speed, className = '', zIndex = 0 }: ParallaxLayerProps) {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, speed * 100]);

  return (
    <motion.div
      style={{ y, zIndex }}
      className={`absolute inset-0 ${className}`}
    >
      {children}
    </motion.div>
  );
}

interface ParallaxBackgroundProps {
  layers: Array<{
    content: React.ReactNode;
    speed: number;
    className?: string;
  }>;
  className?: string;
}

export function ParallaxBackground({ layers, className = '' }: ParallaxBackgroundProps) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {layers.map((layer, index) => (
        <ParallaxLayer
          key={index}
          speed={layer.speed}
          className={layer.className}
          zIndex={index}
        >
          {layer.content}
        </ParallaxLayer>
      ))}
    </div>
  );
}

// 视差滚动容器（平滑）
interface SmoothParallaxProps {
  children: React.ReactNode;
  className?: string;
}

export function SmoothParallax({ children, className = '' }: SmoothParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const y = useTransform(smoothProgress, [0, 1], [100, -100]);
  const opacity = useTransform(smoothProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(smoothProgress, [0, 0.5, 1], [0.8, 1, 0.8]);

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y, opacity, scale }}>{children}</motion.div>
    </div>
  );
}

// 视差文本
interface ParallaxTextProps {
  text: string;
  className?: string;
  speed?: number;
}

export function ParallaxText({ text, className = '', speed = 0.5 }: ParallaxTextProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, speed * 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y, opacity }} className="text-4xl font-bold">
        {text}
      </motion.div>
    </div>
  );
}

// 视差图片
interface ParallaxImageProps {
  src: string;
  alt: string;
  speed?: number;
  className?: string;
  scale?: boolean;
}

export function ParallaxImage({
  src,
  alt,
  speed = 0.5,
  className = '',
  scale = true,
}: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, speed * 100]);
  const scaleValue = scale
    ? useTransform(scrollYProgress, [0, 0.5, 1], [1.2, 1, 1.2])
    : 1;

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.img
        src={src}
        alt={alt}
        style={{ y, scale: scaleValue }}
        className="w-full h-full object-cover"
      />
    </div>
  );
}

// 视差卡片堆叠
interface ParallaxStackProps {
  cards: React.ReactNode[];
  className?: string;
}

export function ParallaxStack({ cards, className = '' }: ParallaxStackProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  return (
    <div ref={ref} className={`space-y-8 ${className}`}>
      {cards.map((card, index) => {
        const y = useTransform(
          scrollYProgress,
          [0, 1],
          [0, -50 * (index + 1)]
        );
        const scale = useTransform(
          scrollYProgress,
          [0, 0.5, 1],
          [0.95, 1, 0.95]
        );
        const opacity = useTransform(
          scrollYProgress,
          [0, 0.2, 0.8, 1],
          [0, 1, 1, 0]
        );

        return (
          <motion.div
            key={index}
            style={{ y, scale, opacity }}
            className="glass-card rounded-2xl p-6"
          >
            {card}
          </motion.div>
        );
      })}
    </div>
  );
}

// 视差揭示效果
interface ParallaxRevealProps {
  children: React.ReactNode;
  direction?: 'left' | 'right' | 'up' | 'down';
  className?: string;
}

export function ParallaxReveal({
  children,
  direction = 'up',
  className = '',
}: ParallaxRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const directionMap = {
    left: { x: [-100, 0], y: [0, 0] },
    right: { x: [100, 0], y: [0, 0] },
    up: { x: [0, 0], y: [100, 0] },
    down: { x: [0, 0], y: [-100, 0] },
  };

  const x = useTransform(scrollYProgress, [0, 1], directionMap[direction].x);
  const y = useTransform(scrollYProgress, [0, 1], directionMap[direction].y);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 1]);

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ x, y, opacity }}>{children}</motion.div>
    </div>
  );
}

// 滚动进度指示器
export function ScrollProgress({ className = '' }: { className?: string }) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className={`fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 origin-left z-50 ${className}`}
      style={{ scaleX }}
    />
  );
}

// 滚动触发动画
interface ScrollTriggerProps {
  children: React.ReactNode;
  animation?: 'fade' | 'slide-up' | 'slide-down' | 'scale' | 'rotate';
  threshold?: number;
  className?: string;
}

export function ScrollTrigger({
  children,
  animation = 'fade',
  threshold = 0.1,
  className = '',
}: ScrollTriggerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const animations = {
    fade: {
      opacity: useTransform(scrollYProgress, [0, threshold], [0, 1]),
    },
    'slide-up': {
      y: useTransform(scrollYProgress, [0, threshold], [100, 0]),
      opacity: useTransform(scrollYProgress, [0, threshold], [0, 1]),
    },
    'slide-down': {
      y: useTransform(scrollYProgress, [0, threshold], [-100, 0]),
      opacity: useTransform(scrollYProgress, [0, threshold], [0, 1]),
    },
    scale: {
      scale: useTransform(scrollYProgress, [0, threshold], [0.8, 1]),
      opacity: useTransform(scrollYProgress, [0, threshold], [0, 1]),
    },
    rotate: {
      rotate: useTransform(scrollYProgress, [0, threshold], [-10, 0]),
      opacity: useTransform(scrollYProgress, [0, threshold], [0, 1]),
    },
  };

  return (
    <div ref={ref} className={className}>
      <motion.div style={animations[animation]}>{children}</motion.div>
    </div>
  );
}

// 3D视差卡片
interface Parallax3DCardProps {
  children: React.ReactNode;
  className?: string;
}

export function Parallax3DCard({ children, className = '' }: Parallax3DCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [15, 0, -15]);
  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

  return (
    <div ref={ref} className={`perspective-1000 ${className}`}>
      <motion.div
        style={{
          rotateX,
          y,
          transformStyle: 'preserve-3d',
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}

// 无限滚动背景
interface InfiniteScrollProps {
  children: React.ReactNode;
  speed?: number;
  direction?: 'horizontal' | 'vertical';
  className?: string;
}

export function InfiniteScroll({
  children,
  speed = 1,
  direction = 'horizontal',
  className = '',
}: InfiniteScrollProps) {
  const { scrollY } = useScroll();
  
  const x = direction === 'horizontal' 
    ? useTransform(scrollY, [0, 1000], [0, -speed * 100])
    : 0;
  
  const y = direction === 'vertical' 
    ? useTransform(scrollY, [0, 1000], [0, -speed * 100])
    : 0;

  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.div
        style={{ x, y }}
        className="flex gap-4"
      >
        {children}
        {children} {/* 重复内容实现无限滚动效果 */}
      </motion.div>
    </div>
  );
}
