// @lifecycle canonical - System analytics state tracking for system control.
/**
 * System Analytics Tracker
 *
 * Owns the execution analytics state previously inlined in
 * ConsolidatedSystemControl: aggregate counters, memory-delta sampling and
 * the rolling performance-trend buffer (last 100 points).
 */

/**
 * System analytics interface - optimized for API performance and rich historical context
 */
export interface SystemAnalytics {
  // High-frequency API fields (kept for O(1) performance)
  totalExecutions: number;
  successfulExecutions: number;
  failedExecutions: number;
  averageExecutionTime: number; // Critical for dashboard APIs
  gateValidationCount: number;
  uptime: number;
  memoryUsage?: NodeJS.MemoryUsage;

  // Rich historical data with execution context
  performanceTrends: Array<{
    timestamp: number;
    metric: 'executionTime' | 'memoryDelta' | 'successRate' | 'gateValidationTime';
    value: number;
    executionMode?: string; // Replaces executionsByMode aggregation
    framework?: string;
    success?: boolean;
  }>;
}

export function createEmptySystemAnalytics(uptime = 0): SystemAnalytics {
  return {
    totalExecutions: 0,
    successfulExecutions: 0,
    failedExecutions: 0,
    averageExecutionTime: 0,
    gateValidationCount: 0,
    uptime,
    performanceTrends: [],
  };
}

export class SystemAnalyticsTracker {
  private data: SystemAnalytics = createEmptySystemAnalytics();
  private lastMemoryUsage = 0;

  get snapshot(): SystemAnalytics {
    return this.data;
  }

  /**
   * Update system analytics with rich execution data
   */
  update(
    analytics: Partial<SystemAnalytics> & { currentExecution?: any },
    startTime: number
  ): void {
    // Update aggregate fields
    Object.assign(this.data, analytics);
    this.data.uptime = Date.now() - startTime;

    // Update memory usage
    this.data.memoryUsage = process.memoryUsage();

    // Record execution time trend with rich context
    if (analytics.currentExecution) {
      const currentExecution = analytics.currentExecution;
      this.data.performanceTrends.push({
        timestamp: Date.now(),
        metric: 'executionTime',
        value: currentExecution.executionTime,
        executionMode: currentExecution.executionMode,
        framework: currentExecution.framework,
        success: currentExecution.success,
      });
    }

    // Add memory delta trend if significant change
    if (this.data.memoryUsage) {
      const memoryDelta = this.calculateMemoryDelta();
      if (Math.abs(memoryDelta) > 1024 * 1024) {
        // Only track changes > 1MB
        this.data.performanceTrends.push({
          timestamp: Date.now(),
          metric: 'memoryDelta',
          value: memoryDelta,
        });
      }
    }

    // Add success rate trend periodically (every 10 executions)
    if (analytics.totalExecutions && analytics.totalExecutions % 10 === 0) {
      const successRate =
        analytics.totalExecutions > 0
          ? ((analytics.successfulExecutions || 0) / analytics.totalExecutions) * 100
          : 0;
      this.data.performanceTrends.push({
        timestamp: Date.now(),
        metric: 'successRate',
        value: successRate,
      });
    }

    // Keep only last 100 trend points
    if (this.data.performanceTrends.length > 100) {
      this.data.performanceTrends.shift();
    }
  }

  /**
   * Derived calculation: Get execution mode distribution from performance trends
   */
  getExecutionsByMode(): Record<string, number> {
    return this.data.performanceTrends.reduce(
      (acc, trend) => {
        if (trend.executionMode) {
          acc[trend.executionMode] = (acc[trend.executionMode] || 0) + 1;
        }
        return acc;
      },
      {} as Record<string, number>
    );
  }

  /**
   * Calculate memory usage delta from previous execution
   */
  private calculateMemoryDelta(): number {
    if (!this.data.memoryUsage) return 0;

    const currentMemory = this.data.memoryUsage.heapUsed;
    const delta = currentMemory - this.lastMemoryUsage;
    this.lastMemoryUsage = currentMemory;

    return delta;
  }

  /**
   * Reset analytics data
   */
  reset(startTime: number): void {
    this.data = createEmptySystemAnalytics(Date.now() - startTime);
  }
}
