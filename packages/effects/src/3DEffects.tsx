/**
 * file: 3DEffects.tsx
 * description: 3DEffects module
 * author: YanYuCloudCube Team
 * version: v1.0.0
 * created: 2026-04-01
 * updated: 2026-04-01
 * status: active
 * tags: [component],[effect]
 */

import React, { useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';

// 3D倾斜卡片（跟随鼠标）
interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  scale?: number;
  speed?: number;
}

export function TiltCard({
  children,
  className = '',
  maxTilt = 10,
  scale = 1.05,
  speed = 400,
}: TiltCardProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: speed, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: speed, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [maxTilt, -maxTilt]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-maxTilt, maxTilt]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      whileHover={{ scale }}
      transition={{ duration: 0.3 }}
      className={`perspective-1000 ${className}`}
    >
      <div style={{ transform: 'translateZ(50px)' }}>{children}</div>
    </motion.div>
  );
}

// 3D翻转卡片
interface FlipCardProps {
  front: React.ReactNode;
  back: React.ReactNode;
  className?: string;
  flipOnHover?: boolean;
  flipDirection?: 'horizontal' | 'vertical';
}

export function FlipCard({
  front,
  back,
  className = '',
  flipOnHover = false,
  flipDirection = 'horizontal',
}: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleClick = () => {
    if (!flipOnHover) {
      setIsFlipped(!isFlipped);
    }
  };

  const handleHover = () => {
    if (flipOnHover) {
      setIsFlipped(true);
    }
  };

  const handleHoverEnd = () => {
    if (flipOnHover) {
      setIsFlipped(false);
    }
  };

  const rotateAxis = flipDirection === 'horizontal' ? 'rotateY' : 'rotateX';

  return (
    <div
      className={`relative perspective-1000 ${className}`}
      onClick={handleClick}
      onMouseEnter={handleHover}
      onMouseLeave={handleHoverEnd}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {/* 正面 */}
      <motion.div
        className="absolute inset-0"
        initial={false}
        animate={{
          [rotateAxis]: isFlipped ? 180 : 0,
        }}
        transition={{ duration: 0.6, ease: [0.175, 0.885, 0.32, 1.275] }}
        style={{
          backfaceVisibility: 'hidden',
          transformStyle: 'preserve-3d',
        }}
      >
        {front}
      </motion.div>

      {/* 背面 */}
      <motion.div
        className="absolute inset-0"
        initial={false}
        animate={{
          [rotateAxis]: isFlipped ? 0 : -180,
        }}
        transition={{ duration: 0.6, ease: [0.175, 0.885, 0.32, 1.275] }}
        style={{
          backfaceVisibility: 'hidden',
          transformStyle: 'preserve-3d',
          transform: `${rotateAxis}(180deg)`,
        }}
      >
        {back}
      </motion.div>
    </div>
  );
}

// 3D层叠卡片
interface StackedCardsProps {
  cards: React.ReactNode[];
  className?: string;
  spacing?: number;
}

export function StackedCards({
  cards,
  className = '',
  spacing = 20,
}: StackedCardsProps) {
  return (
    <div className={`relative perspective-1000 ${className}`}>
      {cards.map((card, index) => (
        <motion.div
          key={index}
          className="absolute inset-0"
          initial={{
            rotateX: -10,
            y: index * spacing,
            z: -index * 50,
            scale: 1 - index * 0.05,
          }}
          whileHover={{
            rotateX: 0,
            y: index * (spacing * 1.5),
            z: index * 50,
            scale: 1,
          }}
          transition={{ duration: 0.3 }}
          style={{
            transformStyle: 'preserve-3d',
            zIndex: cards.length - index,
          }}
        >
          {card}
        </motion.div>
      ))}
    </div>
  );
}

// 3D透视容器
interface PerspectiveContainerProps {
  children: React.ReactNode;
  className?: string;
  perspective?: number;
}

export function PerspectiveContainer({
  children,
  className = '',
  perspective = 1000,
}: PerspectiveContainerProps) {
  return (
    <div
      className={className}
      style={{
        perspective: `${perspective}px`,
        transformStyle: 'preserve-3d',
      }}
    >
      {children}
    </div>
  );
}

// 3D旋转展示
interface RotatingShowcaseProps {
  items: React.ReactNode[];
  className?: string;
  autoRotate?: boolean;
  rotationSpeed?: number;
}

export function RotatingShowcase({
  items,
  className = '',
  autoRotate = true,
  rotationSpeed = 20, // 秒
}: RotatingShowcaseProps) {
  const [rotation, setRotation] = useState(0);
  const angleStep = 360 / items.length;

  React.useEffect(() => {
    if (!autoRotate) return;

    const interval = setInterval(() => {
      setRotation((prev) => prev + angleStep);
    }, rotationSpeed * 1000);

    return () => clearInterval(interval);
  }, [autoRotate, angleStep, rotationSpeed]);

  return (
    <div className={`relative perspective-1000 h-96 ${className}`}>
      <motion.div
        className="absolute inset-0"
        animate={{ rotateY: rotation }}
        transition={{ duration: 1, ease: 'easeInOut' }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {items.map((item, index) => {
          const angle = angleStep * index;
          const radius = 300;

          return (
            <motion.div
              key={index}
              className="absolute top-1/2 left-1/2"
              style={{
                transform: `
                  translateX(-50%) 
                  translateY(-50%)
                  rotateY(${angle}deg) 
                  translateZ(${radius}px)
                `,
                transformStyle: 'preserve-3d',
              }}
            >
              {item}
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}

// 3D浮动卡片
interface FloatingCardProps {
  children: React.ReactNode;
  className?: string;
  floatRange?: number;
  duration?: number;
}

export function FloatingCard({
  children,
  className = '',
  floatRange = 20,
  duration = 3,
}: FloatingCardProps) {
  return (
    <motion.div
      className={className}
      animate={{
        y: [0, -floatRange, 0],
        rotateX: [0, 5, 0],
        rotateY: [0, 5, 0],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {children}
    </motion.div>
  );
}

// 玻璃折射效果卡片
interface GlassRefractionCardProps {
  children: React.ReactNode;
  className?: string;
}

export function GlassRefractionCard({
  children,
  className = '',
}: GlassRefractionCardProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePosition({ x, y });
  };

  return (
    <motion.div
      className={`relative overflow-hidden glass-card rounded-2xl ${className}`}
      onMouseMove={handleMouseMove}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      {/* 渐变光晕跟随鼠标 */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(0, 255, 135, 0.3), transparent 50%)`,
          transition: 'background 0.3s ease',
        }}
      />

      {/* 内容 */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}

// 3D书本翻页效果
interface BookPageProps {
  pages: React.ReactNode[];
  className?: string;
}

export function BookPage({ pages, className = '' }: BookPageProps) {
  const [currentPage, setCurrentPage] = useState(0);

  const nextPage = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className={`relative perspective-2000 ${className}`}>
      <div className="relative h-96 w-full">
        {pages.map((page, index) => {
          const isVisible = index === currentPage;
          const isPrevious = index < currentPage;

          return (
            <motion.div
              key={index}
              className="absolute inset-0 glass-card rounded-xl p-6"
              initial={false}
              animate={{
                rotateY: isPrevious ? -180 : 0,
                opacity: isVisible ? 1 : 0,
                zIndex: isVisible ? 10 : index,
              }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
              style={{
                transformStyle: 'preserve-3d',
                transformOrigin: 'left center',
              }}
            >
              {page}
            </motion.div>
          );
        })}
      </div>

      {/* 翻页按钮 */}
      <div className="flex gap-4 justify-center mt-6">
        <button
          onClick={prevPage}
          disabled={currentPage === 0}
          className="px-4 py-2 glass-button rounded-lg disabled:opacity-50"
        >
          上一页
        </button>
        <span className="flex items-center text-gray-400">
          {currentPage + 1} / {pages.length}
        </span>
        <button
          onClick={nextPage}
          disabled={currentPage === pages.length - 1}
          className="px-4 py-2 glass-button rounded-lg disabled:opacity-50"
        >
          下一页
        </button>
      </div>
    </div>
  );
}
