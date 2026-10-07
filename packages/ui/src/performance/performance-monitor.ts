/**
 * file performance-monitor.ts
 * description PerformanceMonitor · 前端性能指标采集与阈值校验
 * author YanYuCloudCube Team
 * version v1.0.0
 * created: 2026-04-01
 * updated: 2026-10-07
 * status: active
 * tags: [util],[performance]
 *
 * notes: 2026-10-07 移植自 yyc3-ui-organized/yyc3-zero-dependency/core/monitoring
 */

const perf = typeof performance !== 'undefined' ? performance : { now: () => Date.now() };

export interface PerformanceMetrics {
  componentName: string;
  metric: string;
  value: number;
  threshold: number;
  unit: string;
  timestamp: Date;
}

export const PERFORMANCE_THRESHOLDS = {
  firstRenderTime: { value: 16, unit: 'ms' },
  reRenderTime: { value: 8, unit: 'ms' },
  mountTime: { value: 100, unit: 'ms' },
  unmountTime: { value: 50, unit: 'ms' },
  clickResponseTime: { value: 50, unit: 'ms' },
  inputLatency: { value: 16, unit: 'ms' },
  scrollPerformance: { value: 16, unit: 'ms' },
  animationFPS: { value: 60, unit: 'fps' },
  bundleSize: { value: 100, unit: 'KB' },
  memoryUsage: { value: 1024 * 1024, unit: 'bytes' },
};

export class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = [];
  private marks: Map<string, number> = new Map();

  startMark(name: string): void {
    this.marks.set(name, perf.now());
  }

  endMark(name: string): number {
    const startTime = this.marks.get(name);
    if (!startTime) {
      throw new Error(`Mark "${name}" not found`);
    }
    const duration = perf.now() - startTime;
    this.marks.delete(name);
    return duration;
  }

  recordMetric(
    componentName: string,
    metric: string,
    value: number,
    unit: string = 'ms'
  ): PerformanceMetrics {
    const threshold = PERFORMANCE_THRESHOLDS[metric as keyof typeof PERFORMANCE_THRESHOLDS];
    const metricData: PerformanceMetrics = {
      componentName,
      metric,
      value,
      threshold: threshold?.value || 0,
      unit,
      timestamp: new Date(),
    };
    this.metrics.push(metricData);
    return metricData;
  }

  getMetrics(): PerformanceMetrics[] {
    return this.metrics;
  }

  getMetricsByComponent(componentName: string): PerformanceMetrics[] {
    return this.metrics.filter(m => m.componentName === componentName);
  }

  getMetricsByType(metric: string): PerformanceMetrics[] {
    return this.metrics.filter(m => m.metric === metric);
  }

  getLatestMetric(componentName: string, metric: string): PerformanceMetrics | undefined {
    // 2026-10-07 修正：源实现用 find() 取到的是首条而非最新条，与语义相悖
    const componentMetrics = this.getMetricsByComponent(componentName);
    return [...componentMetrics].reverse().find(m => m.metric === metric);
  }

  checkThreshold(componentName: string, metric: string): boolean {
    const metricData = this.getLatestMetric(componentName, metric);
    if (!metricData) return false;
    return metricData.value <= metricData.threshold;
  }

  clearMetrics(): void {
    this.metrics = [];
  }

  exportMetrics(): string {
    return JSON.stringify(this.metrics, null, 2);
  }

  getPerformanceSummary(): {
    totalMetrics: number;
    passedMetrics: number;
    failedMetrics: number;
    averagePerformance: number;
  } {
    const totalMetrics = this.metrics.length;
    const passedMetrics = this.metrics.filter(m => m.value <= m.threshold).length;
    const failedMetrics = totalMetrics - passedMetrics;
    const averagePerformance = this.metrics.length > 0
      ? this.metrics.reduce((sum, m) => sum + (m.value / m.threshold), 0) / this.metrics.length
      : 0;

    return {
      totalMetrics,
      passedMetrics,
      failedMetrics,
      averagePerformance,
    };
  }
}

export const performanceMonitor = new PerformanceMonitor();
