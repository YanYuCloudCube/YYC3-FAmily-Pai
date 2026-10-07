/**
 * @file primitives.test.tsx
 * @description GlassCard / TypingIndicator 原子组件测试（2026-10-07 移植批次）
 * @author YYC³ Team
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GlassCard } from '../glass-card';
import { TypingIndicator } from '../typing-indicator';

describe('GlassCard', () => {
  it('should render children', () => {
    render(<GlassCard>卡片内容</GlassCard>);
    expect(screen.getByText('卡片内容')).toBeInTheDocument();
  });

  it('should merge custom className', () => {
    render(<GlassCard className="custom-cls">X</GlassCard>);
    const el = screen.getByText('X').closest('div');
    expect(el?.className).toContain('custom-cls');
    expect(el?.className).toContain('backdrop-blur-xl');
  });

  it('should apply glowColor via inline style', () => {
    render(<GlassCard glowColor="#10b981">X</GlassCard>);
    const el = screen.getByText('X').closest('div');
    expect(el?.style.boxShadow).toContain('#10b981');
  });

  it('should set cursor style when clickable', () => {
    render(<GlassCard clickable>X</GlassCard>);
    const el = screen.getByText('X').closest('div');
    expect(el?.className).toContain('cursor-pointer');
  });

  it('should forward ref', () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<GlassCard ref={ref}>X</GlassCard>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('should handle click', () => {
    const onClick = vi.fn();
    render(<GlassCard clickable onClick={onClick}>X</GlassCard>);
    screen.getByText('X').closest('div')!.click();
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});

describe('TypingIndicator', () => {
  it('should render terminal-style processing status', () => {
    render(<TypingIndicator />);
    expect(screen.getByText('PROCESSING...')).toBeInTheDocument();
    expect(screen.getByText('GENERATING_RESPONSE')).toBeInTheDocument();
  });

  it('should render generation log lines', () => {
    render(<TypingIndicator />);
    expect(screen.getByText(/analyzing_input_vector/)).toBeInTheDocument();
    expect(screen.getByText(/processing_neural_weights/)).toBeInTheDocument();
  });
});
