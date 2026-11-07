// @lifecycle canonical - Base class for system control action handlers.
/**
 * ActionHandler Base Class
 *
 * Command-pattern base class for all system_control action handlers.
 * Exposes convenience getters over the ConsolidatedSystemControl registry
 * (managers, config writer, logger) plus the shared formatting helpers.
 */

import { GateGuidanceRenderer } from '../../gates/guidance/GateGuidanceRenderer.js';
import { ToolResponse } from '../../types/index.js';
import type { ConsolidatedSystemControl } from './registry.js';

/**
 * Base class for action handlers using command pattern
 */
export abstract class ActionHandler {
  constructor(protected systemControl: ConsolidatedSystemControl) {}
  abstract execute(args: any): Promise<ToolResponse>;

  // Convenience getters for accessing system control properties
  protected get responseFormatter() {
    return this.systemControl['responseFormatter'];
  }
  protected get logger() {
    return this.systemControl['logger'];
  }
  protected get startTime() {
    return this.systemControl.startTime;
  }
  protected get frameworkManager() {
    return this.systemControl['frameworkManager'];
  }
  protected get mcpToolsManager() {
    return this.systemControl['mcpToolsManager'];
  }
  protected get configManager() {
    return this.systemControl['configManager'];
  }
  protected get safeConfigWriter() {
    return this.systemControl['safeConfigWriter'];
  }
  protected get onRestart() {
    return this.systemControl['onRestart'];
  }
  protected get gateGuidanceRenderer(): GateGuidanceRenderer | undefined {
    return this.systemControl['gateGuidanceRenderer'];
  }

  // Helper methods for system status and formatting
  protected createMinimalSystemResponse(text: string, action: string): ToolResponse {
    return this.systemControl.createMinimalSystemResponse(text, action);
  }

  protected getExecutionsByMode(): Record<string, number> {
    // Extract execution mode data from performance trends
    const modeData: Record<string, number> = {};
    this.systemControl.systemAnalytics.performanceTrends.forEach((trend) => {
      if (trend.executionMode) {
        modeData[trend.executionMode] = (modeData[trend.executionMode] || 0) + 1;
      }
    });
    return modeData;
  }

  protected formatUptime(uptime: number): string {
    const seconds = Math.floor(uptime / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ${hours % 24}h ${minutes % 60}m`;
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  }

  protected formatExecutionTime(time: number): string {
    return `${Math.round(time)}ms`;
  }

  protected formatBytes(bytes: number): string {
    const units = ['B', 'KB', 'MB', 'GB'];
    let value = bytes;
    let unitIndex = 0;
    while (value >= 1024 && unitIndex < units.length - 1) {
      value /= 1024;
      unitIndex++;
    }
    return `${Math.round(value * 100) / 100}${units[unitIndex]}`;
  }

  protected getHealthIcon(status: string): string {
    switch (status) {
      case 'healthy':
        return '✅';
      case 'warning':
        return '⚠️';
      case 'error':
        return '❌';
      case 'critical':
        return '🚨';
      default:
        return '❓';
    }
  }

  protected getSuccessRate(): number {
    const total = this.systemControl.systemAnalytics.totalExecutions;
    if (total === 0) return 100;
    return Math.round((this.systemControl.systemAnalytics.successfulExecutions / total) * 100);
  }

  protected formatTrendContext(trend: any): string {
    let context = '';
    if (trend.framework) context += ` [${trend.framework}]`;
    if (trend.executionMode) context += ` (${trend.executionMode})`;
    if (trend.success !== undefined) context += trend.success ? ' ✓' : ' ✗';
    return context;
  }

  protected formatTrendValue(metric: string, value: number): string {
    switch (metric) {
      case 'executionTime':
        return `${Math.round(value)}ms`;
      case 'memoryDelta':
        return `${value > 0 ? '+' : ''}${this.formatBytes(value)}`;
      case 'successRate':
        return `${Math.round(value * 100)}%`;
      case 'gateValidationTime':
        return `${Math.round(value)}ms validation`;
      default:
        return String(value);
    }
  }
}
