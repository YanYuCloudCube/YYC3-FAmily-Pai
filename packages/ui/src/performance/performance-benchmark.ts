/**
 * file performance-benchmark.ts
 * description PerformanceBenchmark · 性能基准比对与回归检测
 * author YanYuCloudCube Team
 * version v1.0.0
 * created: 2026-04-01
 * updated: 2026-10-07
 * status: active
 * tags: [util],[performance]
 *
 * notes: 2026-10-07 移植自 yyc3-ui-organized/yyc3-zero-dependency/core/monitoring
 */

import { PerformanceMetrics, PERFORMANCE_THRESHOLDS } from './performance-monitor';

export interface BenchmarkResult {
  componentName: string;
  metric: string;
  value: number;
  threshold: number;
  passed: boolean;
  timestamp: Date;
}

export interface RegressionResult {
  componentName: string;
  metric: string;
  currentValue: number;
  previousValue: number;
  regressionPercentage: number;
  hasRegression: boolean;
}

export class PerformanceBenchmark {
  private results: BenchmarkResult[] = [];
  private baseline: Map<string, number> = new Map();

  loadBaseline(baselineData: Record<string, Record<string, number>>): void {
    Object.entries(baselineData).forEach(([componentName, metrics]) => {
      Object.entries(metrics).forEach(([metric, value]) => {
        const key = `${componentName}-${metric}`;
        this.baseline.set(key, value);
      });
    });
  }

  runBenchmark(
    componentName: string,
    metric: string,
    value: number
  ): BenchmarkResult {
    const threshold = PERFORMANCE_THRESHOLDS[metric as keyof typeof PERFORMANCE_THRESHOLDS];
    const result: BenchmarkResult = {
      componentName,
      metric,
      value,
      threshold: threshold?.value || 0,
      passed: threshold ? value <= threshold.value : true,
      timestamp: new Date(),
    };

    this.results.push(result);
    return result;
  }

  checkRegression(componentName: string, metric: string): RegressionResult | null {
    const componentResults = this.results.filter(
      r => r.componentName === componentName && r.metric === metric
    );

    if (componentResults.length < 2) return null;

    const latest = componentResults[componentResults.length - 1];
    const previous = componentResults[componentResults.length - 2];

    const regressionPercentage = ((latest.value - previous.value) / previous.value) * 100;
    const hasRegression = regressionPercentage > 10; // 10% regression threshold

    return {
      componentName,
      metric,
      currentValue: latest.value,
      previousValue: previous.value,
      regressionPercentage,
      hasRegression,
    };
  }

  checkAllRegressions(): RegressionResult[] {
    const uniqueComponents = [...new Set(this.results.map(r => r.componentName))];
    const uniqueMetrics = [...new Set(this.results.map(r => r.metric))];

    const regressions: RegressionResult[] = [];

    uniqueComponents.forEach(componentName => {
      uniqueMetrics.forEach(metric => {
        const regression = this.checkRegression(componentName, metric);
        if (regression && regression.hasRegression) {
          regressions.push(regression);
        }
      });
    });

    return regressions;
  }

  compareWithBaseline(componentName: string, metric: string): {
    currentValue: number;
    baselineValue: number;
    difference: number;
    percentageDifference: number;
    isWithinBaseline: boolean;
  } | null {
    const latestResult = this.results
      .filter(r => r.componentName === componentName && r.metric === metric)
      .pop();

    if (!latestResult) return null;

    const key = `${componentName}-${metric}`;
    const baselineValue = this.baseline.get(key);

    if (!baselineValue) return null;

    const difference = latestResult.value - baselineValue;
    const percentageDifference = (difference / baselineValue) * 100;
    const isWithinBaseline = Math.abs(percentageDifference) <= 10; // 10% tolerance

    return {
      currentValue: latestResult.value,
      baselineValue,
      difference,
      percentageDifference,
      isWithinBaseline,
    };
  }

  getResults(): BenchmarkResult[] {
    return this.results;
  }

  getResultsByComponent(componentName: string): BenchmarkResult[] {
    return this.results.filter(r => r.componentName === componentName);
  }

  getResultsByMetric(metric: string): BenchmarkResult[] {
    return this.results.filter(r => r.metric === metric);
  }

  getFailedBenchmarks(): BenchmarkResult[] {
    return this.results.filter(r => !r.passed);
  }

  getPassedBenchmarks(): BenchmarkResult[] {
    return this.results.filter(r => r.passed);
  }

  getBenchmarkSummary(): {
    totalBenchmarks: number;
    passedBenchmarks: number;
    failedBenchmarks: number;
    passRate: number;
    regressions: number;
  } {
    const totalBenchmarks = this.results.length;
    const passedBenchmarks = this.results.filter(r => r.passed).length;
    const failedBenchmarks = totalBenchmarks - passedBenchmarks;
    const passRate = totalBenchmarks > 0 ? (passedBenchmarks / totalBenchmarks) * 100 : 0;
    const regressions = this.checkAllRegressions().length;

    return {
      totalBenchmarks,
      passedBenchmarks,
      failedBenchmarks,
      passRate,
      regressions,
    };
  }

  clearResults(): void {
    this.results = [];
  }

  exportResults(): string {
    return JSON.stringify(this.results, null, 2);
  }

  exportBaseline(): Record<string, Record<string, number>> {
    const baseline: Record<string, Record<string, number>> = {};

    this.results.forEach(result => {
      if (!baseline[result.componentName]) {
        baseline[result.componentName] = {};
      }
      baseline[result.componentName][result.metric] = result.value;
    });

    return baseline;
  }
}

export const performanceBenchmark = new PerformanceBenchmark();
