// @lifecycle canonical - Structured response builders for system control.
/**
 * Structured Response Builders
 *
 * Response-shaping helpers shared by the system control registry and domain
 * handlers: the generic structured-response wrapper and the minimal
 * output-schema-compliant response builder used by every action.
 */

import { FrameworkManager } from '../../../frameworks/framework-manager.js';
import { FrameworkStateManager } from '../../../frameworks/framework-state-manager.js';
import { ToolResponse } from '../../../types/index.js';

export function createStructuredResponse(
  content: any,
  second?: boolean | Record<string, any>,
  third?: boolean | Record<string, any>
): ToolResponse {
  let metadata: Record<string, any> | undefined;
  let isError = false;

  if (typeof second === 'boolean') {
    isError = second;
    if (third && typeof third === 'object') {
      metadata = third;
    }
  } else if (second && typeof second === 'object') {
    metadata = second;
    if (typeof third === 'boolean') {
      isError = third;
    }
  }

  const textContent = Array.isArray(content)
    ? content[0]?.text || String(content)
    : String(content);

  const response: ToolResponse = {
    content: [{ type: 'text' as const, text: textContent }],
    isError,
  };

  if (metadata) {
    (response as any).metadata = metadata;
  }

  return response;
}

/**
 * Context required to render a minimal system response.
 * ConsolidatedSystemControl satisfies this structurally.
 */
export interface MinimalResponseContext {
  frameworkStateManager?: FrameworkStateManager;
  frameworkManager?: FrameworkManager;
  startTime: number;
}

/**
 * Helper function for minimal outputSchema compliance
 */
export function buildMinimalSystemResponse(
  ctx: MinimalResponseContext,
  text: string,
  action: string
): ToolResponse {
  const now = Date.now();
  const frameworkState = ctx.frameworkStateManager?.getCurrentState();
  const systemHealth = ctx.frameworkStateManager?.getSystemHealth?.();
  const frameworkEnabled =
    systemHealth?.frameworkSystemEnabled ?? frameworkState?.frameworkSystemEnabled ?? false;

  const activeFramework =
    frameworkState?.activeFramework ?? systemHealth?.activeFramework ?? 'unknown';

  const availableFrameworks =
    systemHealth?.availableFrameworks ??
    ctx.frameworkManager?.listFrameworks(true).map((framework) => framework.id) ??
    [];

  const uptime = now - ctx.startTime;

  const memoryUsage =
    typeof process !== 'undefined' && typeof process.memoryUsage === 'function'
      ? process.memoryUsage()
      : undefined;

  const structuredMemoryUsage = memoryUsage
    ? {
        rss: memoryUsage.rss,
        heapTotal: memoryUsage.heapTotal,
        heapUsed: memoryUsage.heapUsed,
        external: memoryUsage.external,
        arrayBuffers: memoryUsage.arrayBuffers,
      }
    : undefined;

  return createStructuredResponse(text, false, {
    action,
    executionMetadata: {
      executionId: `sc-${action}-${now}`,
      executionType: 'single' as const,
      startTime: now,
      endTime: now,
      executionTime: 0,
      frameworkEnabled,
    },
    systemState: {
      frameworkEnabled,
      activeFramework,
      availableFrameworks,
      uptime,
      ...(structuredMemoryUsage ? { memoryUsage: structuredMemoryUsage } : {}),
      serverHealth: systemHealth?.status ?? 'unknown',
    },
  });
}
