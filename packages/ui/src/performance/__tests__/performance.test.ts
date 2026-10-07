/**
 * @file performance.test.ts
 * @description 性能监控三件套行为测试（2026-10-07 移植批次——源资产仅有导出冒烟，
 *              按实测要求补齐 Monitor/Benchmark/AlertManager 行为用例）
 * @author YYC³ Team
 */

import { describe, it, expect } from 'vitest';
import {
  PerformanceMonitor,
  PERFORMANCE_THRESHOLDS,
  performanceMonitor,
} from '../performance-monitor';
import { PerformanceBenchmark, performanceBenchmark } from '../performance-benchmark';
import {
  PerformanceAlertManager,
  performanceAlertManager,
} from '../performance-alert';
import * as monitoring from '../index';

describe('monitoring 导出冒烟（源资产原测试）', () => {
  it('should export monitoring utilities', () => {
    expect(monitoring).toBeDefined();
    expect(monitoring.PerformanceMonitor).toBeDefined();
    expect(monitoring.PerformanceBenchmark).toBeDefined();
    expect(monitoring.PerformanceAlertManager).toBeDefined();
  });

  it('单例导出存在', () => {
    expect(performanceMonitor).toBeInstanceOf(PerformanceMonitor);
    expect(performanceBenchmark).toBeInstanceOf(PerformanceBenchmark);
    expect(performanceAlertManager).toBeInstanceOf(PerformanceAlertManager);
  });
});

describe('PerformanceMonitor', () => {
  it('mark 计时：endMark 返回非负时长并清除标记', () => {
    const m = new PerformanceMonitor();
    m.startMark('op');
    const d = m.endMark('op');
    expect(d).toBeGreaterThanOrEqual(0);
    expect(() => m.endMark('op')).toThrow(/not found/);
  });

  it('recordMetric 关联阈值并支持按组件/类型过滤', () => {
    const m = new PerformanceMonitor();
    m.recordMetric('Card', 'mountTime', 120);
    m.recordMetric('Card', 'reRenderTime', 5);
    m.recordMetric('Modal', 'mountTime', 40);

    expect(m.getMetrics()).toHaveLength(3);
    expect(m.getMetricsByComponent('Card')).toHaveLength(2);
    expect(m.getMetricsByType('mountTime')).toHaveLength(2);
    expect(m.getMetrics()[0].threshold).toBe(PERFORMANCE_THRESHOLDS.mountTime.value);
  });

  it('checkThreshold 判定通过/失败', () => {
    const m = new PerformanceMonitor();
    m.recordMetric('Btn', 'clickResponseTime', 30);
    expect(m.checkThreshold('Btn', 'clickResponseTime')).toBe(true);

    m.recordMetric('Btn', 'clickResponseTime', 80);
    expect(m.checkThreshold('Btn', 'clickResponseTime')).toBe(false);
  });

  it('getPerformanceSummary 汇总通过/失败', () => {
    const m = new PerformanceMonitor();
    m.recordMetric('A', 'mountTime', 50);   // pass (≤100)
    m.recordMetric('B', 'mountTime', 300);  // fail
    const s = m.getPerformanceSummary();

    expect(s.totalMetrics).toBe(2);
    expect(s.passedMetrics).toBe(1);
    expect(s.failedMetrics).toBe(1);
    expect(s.averagePerformance).toBeGreaterThan(0);
  });

  it('clearMetrics / exportMetrics', () => {
    const m = new PerformanceMonitor();
    m.recordMetric('A', 'mountTime', 10);
    const json = m.exportMetrics();
    expect(JSON.parse(json)).toHaveLength(1);
    m.clearMetrics();
    expect(m.getMetrics()).toHaveLength(0);
  });
});

describe('PerformanceBenchmark', () => {
  it('runBenchmark 按内置阈值判定通过/失败', () => {
    const b = new PerformanceBenchmark();
    expect(b.runBenchmark('List', 'mountTime', 80).passed).toBe(true);
    expect(b.runBenchmark('List', 'mountTime', 200).passed).toBe(false);
    expect(b.getFailedBenchmarks()).toHaveLength(1);
  });

  it('两次运行差 >10% 判定为回归', () => {
    const b = new PerformanceBenchmark();
    b.runBenchmark('Grid', 'mountTime', 100);
    b.runBenchmark('Grid', 'mountTime', 130);

    const r = b.checkRegression('Grid', 'mountTime')!;
    expect(r).not.toBeNull();
    expect(r.hasRegression).toBe(true);
    expect(r.regressionPercentage).toBeCloseTo(30, 0);
  });

  it('改善方向不算回归', () => {
    const b = new PerformanceBenchmark();
    b.runBenchmark('Grid', 'mountTime', 130);
    b.runBenchmark('Grid', 'mountTime', 100);

    expect(b.checkRegression('Grid', 'mountTime')!.hasRegression).toBe(false);
    expect(b.checkAllRegressions()).toHaveLength(0);
  });

  it('基线比对：±10% 容差', () => {
    const b = new PerformanceBenchmark();
    b.loadBaseline({ Grid: { mountTime: 100 } });

    b.runBenchmark('Grid', 'mountTime', 105);
    expect(b.compareWithBaseline('Grid', 'mountTime')!.isWithinBaseline).toBe(true);

    b.runBenchmark('Grid', 'mountTime', 120);
    const cmp = b.compareWithBaseline('Grid', 'mountTime')!;
    expect(cmp.isWithinBaseline).toBe(false);
    expect(cmp.percentageDifference).toBeCloseTo(20, 0);
  });

  it('getBenchmarkSummary 与 exportBaseline', () => {
    const b = new PerformanceBenchmark();
    b.runBenchmark('X', 'mountTime', 50);
    const s = b.getBenchmarkSummary();
    expect(s.totalBenchmarks).toBe(1);
    expect(s.passRate).toBe(100);

    const baseline = b.exportBaseline();
    expect(baseline.X.mountTime).toBe(50);
  });
});

describe('PerformanceAlertManager', () => {
  const rule = (threshold: number, enabled = true) => ({
    componentName: 'Table',
    metric: 'mountTime',
    threshold,
    severity: 'high' as const,
    enabled,
  });

  it('规则增删改查', () => {
    const a = new PerformanceAlertManager();
    a.addRule(rule(100));
    expect(a.getRules()).toHaveLength(1);

    a.updateRule({ ...rule(200) });
    expect(a.getRules()[0].threshold).toBe(200);

    a.addRule({ componentName: 'Other', metric: 'mountTime', threshold: 10, severity: 'low', enabled: true });
    a.removeRule('Other', 'mountTime');
    expect(a.getRules()).toHaveLength(1);
  });

  it('超阈值按比例分级：1.1x=medium、1.3x=high、2x=critical', () => {
    const a = new PerformanceAlertManager();
    a.addRule(rule(100));

    expect(a.checkMetric('Table', 'mountTime', 110)!.severity).toBe('medium');
    expect(a.checkMetric('Table', 'mountTime', 130)!.severity).toBe('high');
    expect(a.checkMetric('Table', 'mountTime', 200)!.severity).toBe('critical');
    // 阈值内 → low → 不产生告警
    expect(a.checkMetric('Table', 'mountTime', 90)).toBeNull();
  });

  it('禁用规则不产生告警；无规则返回 null', () => {
    const a = new PerformanceAlertManager();
    a.addRule(rule(100, false));
    expect(a.checkMetric('Table', 'mountTime', 500)).toBeNull();

    const b = new PerformanceAlertManager();
    expect(b.checkMetric('Nope', 'mountTime', 500)).toBeNull();
  });

  it('告警消息包含超限百分比', () => {
    const a = new PerformanceAlertManager();
    a.addRule(rule(100));
    const alert = a.checkMetric('Table', 'mountTime', 150)!;
    expect(alert.message).toContain('50.0% above threshold');
  });

  it('getAlertSummary 分级统计与 clearAlerts', () => {
    const a = new PerformanceAlertManager();
    a.addRule(rule(100));
    a.checkMetric('Table', 'mountTime', 110); // medium
    a.checkMetric('Table', 'mountTime', 130); // high
    a.checkMetric('Table', 'mountTime', 200); // critical

    const s = a.getAlertSummary();
    expect(s.totalAlerts).toBe(3);
    expect(s.mediumAlerts).toBe(1);
    expect(s.highAlerts).toBe(1);
    expect(s.criticalAlerts).toBe(1);

    a.clearAlerts();
    expect(a.getAlerts()).toHaveLength(0);
  });

  it('exportRules / importRules 往返', () => {
    const a = new PerformanceAlertManager();
    a.addRule(rule(100));
    const json = a.exportRules();

    const b = new PerformanceAlertManager();
    b.importRules(json);
    expect(b.getRules()).toHaveLength(1);
    expect(b.getRules()[0].threshold).toBe(100);
  });
});
