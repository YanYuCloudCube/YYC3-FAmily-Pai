/**
 * file performance-alert.ts
 * description PerformanceAlertManager · 性能告警规则与分级告警管理
 * author YanYuCloudCube Team
 * version v1.0.0
 * created: 2026-04-01
 * updated: 2026-10-07
 * status: active
 * tags: [util],[performance]
 *
 * notes: 2026-10-07 移植自 yyc3-ui-organized/yyc3-zero-dependency/core/monitoring
 */

import { PerformanceMetrics } from './performance-monitor';

export interface PerformanceAlert {
  id: string;
  componentName: string;
  metric: string;
  currentValue: number;
  threshold: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  message: string;
}

export interface AlertRule {
  componentName: string;
  metric: string;
  threshold: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  enabled: boolean;
}

export class PerformanceAlertManager {
  private alerts: PerformanceAlert[] = [];
  private rules: AlertRule[] = [];
  private alertHistory: Map<string, number> = new Map();

  addRule(rule: AlertRule): void {
    this.rules.push(rule);
  }

  removeRule(componentName: string, metric: string): void {
    this.rules = this.rules.filter(
      r => r.componentName !== componentName || r.metric !== metric
    );
  }

  updateRule(rule: AlertRule): void {
    const index = this.rules.findIndex(
      r => r.componentName === rule.componentName && r.metric === rule.metric
    );
    if (index !== -1) {
      this.rules[index] = rule;
    }
  }

  getRules(): AlertRule[] {
    return this.rules;
  }

  getRulesByComponent(componentName: string): AlertRule[] {
    return this.rules.filter(r => r.componentName === componentName);
  }

  getRulesByMetric(metric: string): AlertRule[] {
    return this.rules.filter(r => r.metric === metric);
  }

  checkMetric(componentName: string, metric: string, value: number): PerformanceAlert | null {
    const rule = this.rules.find(
      r => r.componentName === componentName && r.metric === metric && r.enabled
    );

    if (!rule) return null;

    const severity = this.calculateSeverity(value, rule.threshold);

    if (severity === 'low') return null;

    const alert: PerformanceAlert = {
      id: `${componentName}-${metric}-${Date.now()}`,
      componentName,
      metric,
      currentValue: value,
      threshold: rule.threshold,
      severity,
      timestamp: new Date(),
      message: this.generateAlertMessage(componentName, metric, value, rule.threshold, severity),
    };

    this.alerts.push(alert);
    return alert;
  }

  checkAllMetrics(metrics: PerformanceMetrics[]): PerformanceAlert[] {
    const alerts: PerformanceAlert[] = [];

    metrics.forEach(metric => {
      const alert = this.checkMetric(
        metric.componentName,
        metric.metric,
        metric.value
      );
      if (alert) {
        alerts.push(alert);
      }
    });

    return alerts;
  }

  private calculateSeverity(value: number, threshold: number): 'low' | 'medium' | 'high' | 'critical' {
    const ratio = value / threshold;

    if (ratio <= 1) return 'low';
    if (ratio <= 1.2) return 'medium';
    if (ratio <= 1.5) return 'high';
    return 'critical';
  }

  private generateAlertMessage(
    componentName: string,
    metric: string,
    currentValue: number,
    threshold: number,
    severity: string
  ): string {
    const percentage = ((currentValue - threshold) / threshold) * 100;
    return `${severity.toUpperCase()}: ${componentName} ${metric} is ${percentage.toFixed(1)}% above threshold (${currentValue} > ${threshold})`;
  }

  getAlerts(): PerformanceAlert[] {
    return this.alerts;
  }

  getAlertsByComponent(componentName: string): PerformanceAlert[] {
    return this.alerts.filter(a => a.componentName === componentName);
  }

  getAlertsByMetric(metric: string): PerformanceAlert[] {
    return this.alerts.filter(a => a.metric === metric);
  }

  getAlertsBySeverity(severity: 'low' | 'medium' | 'high' | 'critical'): PerformanceAlert[] {
    return this.alerts.filter(a => a.severity === severity);
  }

  getCriticalAlerts(): PerformanceAlert[] {
    return this.getAlertsBySeverity('critical');
  }

  getHighAlerts(): PerformanceAlert[] {
    return this.getAlertsBySeverity('high');
  }

  getRecentAlerts(hours: number = 24): PerformanceAlert[] {
    const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000);
    return this.alerts.filter(a => a.timestamp >= cutoff);
  }

  getAlertSummary(): {
    totalAlerts: number;
    criticalAlerts: number;
    highAlerts: number;
    mediumAlerts: number;
    lowAlerts: number;
    recentAlerts: number;
  } {
    const totalAlerts = this.alerts.length;
    const criticalAlerts = this.getCriticalAlerts().length;
    const highAlerts = this.getHighAlerts().length;
    const mediumAlerts = this.getAlertsBySeverity('medium').length;
    const lowAlerts = this.getAlertsBySeverity('low').length;
    const recentAlerts = this.getRecentAlerts().length;

    return {
      totalAlerts,
      criticalAlerts,
      highAlerts,
      mediumAlerts,
      lowAlerts,
      recentAlerts,
    };
  }

  clearAlerts(): void {
    this.alerts = [];
  }

  clearOldAlerts(hours: number = 24): void {
    const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000);
    this.alerts = this.alerts.filter(a => a.timestamp >= cutoff);
  }

  exportAlerts(): string {
    return JSON.stringify(this.alerts, null, 2);
  }

  exportRules(): string {
    return JSON.stringify(this.rules, null, 2);
  }

  importRules(rulesJson: string): void {
    try {
      const rules = JSON.parse(rulesJson) as AlertRule[];
      this.rules = rules;
    } catch (error) {
      console.error('Failed to import rules:', error);
    }
  }
}

export const performanceAlertManager = new PerformanceAlertManager();
