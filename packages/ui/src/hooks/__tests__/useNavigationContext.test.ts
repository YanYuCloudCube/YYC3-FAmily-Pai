/**
 * @file useNavigationContext.test.ts
 * @description useNavigationContext Hook 测试（2026-10-07 移植）
 * @author YYC³ Team
 */

import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useNavigationContext } from '../useNavigationContext';

describe('useNavigationContext', () => {
  it('should initialize with empty context', () => {
    const { result } = renderHook(() => useNavigationContext(undefined, 'test'));

    expect(result.current.hasContext).toBe(false);
    expect(result.current.context).toBeNull();
    expect(result.current.contextData).toEqual({});
  });

  it('should detect context presence', () => {
    const context = { customerId: '123', source: 'customers' };
    const { result } = renderHook(() => useNavigationContext(context, 'orders'));

    expect(result.current.hasContext).toBe(true);
    expect(result.current.context).toEqual(context);
    expect(result.current.contextData.customerId).toBe('123');
  });

  it('should extract context data correctly', () => {
    const context = {
      customerId: 'cust-001',
      orderId: 'ord-001',
      customerName: 'Test Customer',
      amount: 1000,
      status: 'active'
    };
    const { result } = renderHook(() => useNavigationContext(context, 'customers'));

    expect(result.current.contextData.customerId).toBe('cust-001');
    expect(result.current.contextData.orderId).toBe('ord-001');
    expect(result.current.contextData.customerName).toBe('Test Customer');
    expect(result.current.contextData.amount).toBe(1000);
    expect(result.current.contextData.status).toBe('active');
  });

  it('should highlight items correctly', () => {
    const context = { customerId: 'cust-001' };
    const { result } = renderHook(() => useNavigationContext(context, 'customers'));

    expect(result.current.shouldHighlight('cust-001')).toBe(true);
    expect(result.current.shouldHighlight('cust-002')).toBe(false);
  });

  it('should return filter criteria based on module type', () => {
    const context = { customerId: 'cust-001', status: 'pending' };
    const { result } = renderHook(() => useNavigationContext(context, 'orders'));

    const criteria = result.current.getFilterCriteria();
    expect(criteria.customerId).toBe('cust-001');
    expect(criteria.status).toBe('pending');
  });

  it('should return recommendations from context', () => {
    const recommendations = [
      { title: 'Test Recommendation', description: 'Test Description' }
    ];
    const context = { recommendations };
    const { result } = renderHook(() => useNavigationContext(context, 'test'));

    expect(result.current.getRecommendations()).toEqual(recommendations);
  });

  it('should handle different module types', () => {
    const context = { employeeId: 'emp-001' };
    const { result } = renderHook(() => useNavigationContext(context, 'employees'));

    expect(result.current.shouldHighlight('emp-001')).toBe(true);
  });

  it('should return empty recommendations when no context', () => {
    const { result } = renderHook(() => useNavigationContext(undefined, 'test'));

    expect(result.current.getRecommendations()).toEqual([]);
  });
});
