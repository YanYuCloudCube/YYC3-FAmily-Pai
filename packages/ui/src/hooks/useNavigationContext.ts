/**
 * file useNavigationContext.ts
 * description useNavigationContext Hook · 跨模块导航上下文数据联动
 * author YanYuCloudCube Team
 * version v1.0.0
 * created: 2026-04-01
 * updated: 2026-10-07
 * status: active
 * tags: [hook],hook,context,navigation
 *
 * notes: 2026-10-07 移植自 yyc3-ui-organized；移除调试用 console.log effect（库级净化）
 */

import { useState, useMemo } from 'react';

export interface NavigationContext {
  source?: string;
  sourceModule?: string;
  type?: string;
  priority?: 'high' | 'normal' | 'low';
  recommendations?: Array<{
    title: string;
    description?: string;
    action?: string;
    data?: any;
  }>;
  [key: string]: any;
}

export interface UseNavigationContextResult {
  hasContext: boolean;
  context: NavigationContext | null;
  contextData: {
    customerId?: string;
    orderId?: string;
    employeeId?: string;
    projectId?: string;
    invoiceId?: string;
    [key: string]: any;
  };
  shouldHighlight: (itemId: string, itemType?: string) => boolean;
  getFilterCriteria: () => Record<string, any>;
  getRecommendations: () => Array<{
    title: string;
    description?: string;
    action?: string;
    data?: any;
  }>;
}

export function useNavigationContext(
  navigationContext: Record<string, any> | undefined,
  moduleType: string
): UseNavigationContextResult {
  const [hasContext] = useState(!!navigationContext);

  const contextData = useMemo(() => {
    if (!navigationContext) return {};

    const extracted: Record<string, any> = {};

    const idFields = [
      'customerId', 'orderId', 'employeeId', 'projectId',
      'invoiceId', 'supplierId', 'assetId', 'contractId'
    ];

    idFields.forEach(field => {
      if (navigationContext[field]) {
        extracted[field] = navigationContext[field];
      }
    });

    if (navigationContext.customerName) extracted.customerName = navigationContext.customerName;
    if (navigationContext.amount) extracted.amount = navigationContext.amount;
    if (navigationContext.status) extracted.status = navigationContext.status;
    if (navigationContext.category) extracted.category = navigationContext.category;

    return extracted;
  }, [navigationContext]);

  const shouldHighlight = (itemId: string, itemType?: string): boolean => {
    if (!navigationContext) return false;

    switch (moduleType) {
      case 'customers':
        return contextData.customerId === itemId;
      case 'orders':
        return contextData.orderId === itemId || contextData.customerId === itemId;
      case 'employees':
        return contextData.employeeId === itemId;
      case 'projects':
        return contextData.projectId === itemId || contextData.customerId === itemId;
      case 'invoices':
        return contextData.invoiceId === itemId || contextData.customerId === itemId;
      default:
        return Object.values(contextData).includes(itemId);
    }
  };

  const getFilterCriteria = (): Record<string, any> => {
    if (!navigationContext) return {};

    const criteria: Record<string, any> = {};

    switch (moduleType) {
      case 'orders':
        if (contextData.customerId) criteria.customerId = contextData.customerId;
        if (contextData.status) criteria.status = contextData.status;
        break;
      case 'invoices':
        if (contextData.customerId) criteria.customerId = contextData.customerId;
        if (contextData.orderId) criteria.orderId = contextData.orderId;
        break;
      case 'projects':
        if (contextData.customerId) criteria.customerId = contextData.customerId;
        if (contextData.employeeId) criteria.assignee = contextData.employeeId;
        break;
      case 'employees':
        if (contextData.department) criteria.department = contextData.department;
        break;
    }

    return criteria;
  };

  const getRecommendations = () => {
    if (!navigationContext?.recommendations) return [];
    return navigationContext.recommendations;
  };

  return {
    hasContext,
    context: navigationContext || null,
    contextData,
    shouldHighlight,
    getFilterCriteria,
    getRecommendations
  };
}

/**
 * 生成智能推荐的辅助函数
 */
export function generateRecommendations(
  sourceModule: string,
  targetModule: string,
  contextData: Record<string, any>
): Array<{ title: string; description?: string; action?: string; data?: any }> {
  const recommendations: Array<any> = [];

  if (sourceModule === 'dashboard' && targetModule === 'customers') {
    if (contextData.customerId) {
      recommendations.push({
        title: '查看该客户的所有订单',
        description: '快速访问该客户的历史订单记录',
        action: 'navigate',
        data: { target: 'orders', filter: { customerId: contextData.customerId } }
      });
      recommendations.push({
        title: '查看客户项目',
        description: '查看与该客户相关的所有项目',
        action: 'navigate',
        data: { target: 'projects', filter: { customerId: contextData.customerId } }
      });
    }
  }

  if (sourceModule === 'customers' && targetModule === 'orders') {
    if (contextData.customerId) {
      recommendations.push({
        title: '创建新订单',
        description: '为该客户创建新的销售订单',
        action: 'create',
        data: { customerId: contextData.customerId }
      });
    }
  }

  if (sourceModule === 'orders' && targetModule === 'invoices') {
    if (contextData.orderId) {
      recommendations.push({
        title: '生成订单发票',
        description: '基于该订单自动生成发票',
        action: 'generate',
        data: { orderId: contextData.orderId }
      });
    }
  }

  return recommendations;
}
