// @lifecycle canonical - Analytics action handler for system control.
/**
 * AnalyticsActionHandler
 *
 * Handles the `analytics` action: view (with optional history and reset),
 * reset and switch history. Method bodies moved verbatim from
 * ConsolidatedSystemControl; analytics state lives in the shared
 * SystemAnalyticsTracker behind the registry.
 */

import { ToolResponse } from '../../../types/index.js';
import { ActionHandler } from '../action-handler.js';

/**
 * Handler for analytics-related operations
 */
export class AnalyticsActionHandler extends ActionHandler {
  async execute(args: any): Promise<ToolResponse> {
    const operation = args.operation || 'default';

    switch (operation) {
      case 'reset':
        return await this.resetMetrics({
          confirm: args.confirm,
        });
      case 'history':
        return await this.getSwitchHistory({
          limit: args.limit,
        });
      case 'view':
      case 'default':
      default:
        return await this.getAnalytics({
          include_history: args.include_history,
          reset_analytics: args.reset_analytics,
        });
    }
  }

  private async resetMetrics(args: { confirm?: boolean }): Promise<ToolResponse> {
    if (!args.confirm) {
      return this.createMinimalSystemResponse(
        "❌ Metrics reset cancelled. Set 'confirm: true' to reset all switching performance metrics.",
        'reset_metrics'
      );
    }

    const beforeMetrics = { ...this.systemControl.systemAnalytics };

    this.systemControl.resetAnalyticsData();

    if (this.systemControl.frameworkStateManager) {
      this.systemControl.frameworkStateManager.resetMetrics();
    }

    let response = `# 🔄 Metrics Reset Completed\n\n`;
    response += `**Reset Timestamp**: ${new Date().toISOString()}\n\n`;

    response += '## Metrics Before Reset\n\n';
    response += `**Total Executions**: ${beforeMetrics.totalExecutions}\n`;
    response += `**Successful**: ${beforeMetrics.successfulExecutions}\n`;
    response += `**Failed**: ${beforeMetrics.failedExecutions}\n`;
    response += `**Average Time**: ${this.formatExecutionTime(
      beforeMetrics.averageExecutionTime
    )}\n\n`;

    response += '## Metrics After Reset\n\n';
    response += `**Total Executions**: ${this.systemControl.systemAnalytics.totalExecutions}\n`;
    response += `**Successful**: ${this.systemControl.systemAnalytics.successfulExecutions}\n`;
    response += `**Failed**: ${this.systemControl.systemAnalytics.failedExecutions}\n`;
    response += `**Average Time**: ${this.formatExecutionTime(
      this.systemControl.systemAnalytics.averageExecutionTime
    )}\n\n`;

    response +=
      '✅ All switching performance metrics have been reset. Framework switching monitoring will start fresh.';

    return this.createMinimalSystemResponse(response, 'reset_metrics');
  }

  private async getSwitchHistory(args: { limit?: number }): Promise<ToolResponse> {
    if (!this.systemControl.frameworkStateManager) {
      throw new Error('Framework state manager not initialized');
    }

    const { limit = 20 } = args;

    const history = this.systemControl.frameworkStateManager.getSwitchHistory(limit);
    const currentState = this.systemControl.frameworkStateManager.getCurrentState();

    let response = `# 📈 Framework Switch History\n\n`;
    response += `**Current Framework**: ${currentState.activeFramework}\n`;
    response += `**History Entries**: ${history.length}\n\n`;

    if (history.length === 0) {
      response += 'No framework switches recorded yet.\n\n';
    } else {
      response += '## Recent Switches\n\n';

      history.forEach((entry, index) => {
        response += `### ${index + 1}. ${entry.from} → ${entry.to}\n\n`;
        response += `**Timestamp**: ${entry.timestamp.toISOString()}\n`;
        response += `**Reason**: ${entry.reason}\n\n`;
      });
    }

    response += '---\n\n';
    response += '**Note**: This history helps track framework usage patterns and audit changes.';

    return this.createMinimalSystemResponse(response, 'switch_history');
  }

  private async getAnalytics(args: {
    include_history?: boolean;
    reset_analytics?: boolean;
  }): Promise<ToolResponse> {
    const { include_history = false, reset_analytics = false } = args;

    if (reset_analytics) {
      this.systemControl.resetAnalyticsData();
      return this.createMinimalSystemResponse('📊 Analytics have been reset to zero.', 'analytics');
    }

    const successRate = this.getSuccessRate();
    const avgTime = this.formatExecutionTime(this.systemControl.systemAnalytics.averageExecutionTime);

    let response = '# 📊 System Analytics Report\n\n';

    // Overall Performance
    response += '## 📈 Overall Performance\n\n';
    response += `**Total Executions**: ${this.systemControl.systemAnalytics.totalExecutions}\n`;
    response += `**Success Rate**: ${successRate}%\n`;
    response += `**Failed Executions**: ${this.systemControl.systemAnalytics.failedExecutions}\n`;
    response += `**Average Execution Time**: ${avgTime}\n`;
    response += `**System Uptime**: ${this.formatUptime(this.systemControl.systemAnalytics.uptime)}\n\n`;

    // Execution Modes
    response += '## 🎯 Execution Mode Distribution\n\n';
    const executionsByMode = this.getExecutionsByMode();
    const totalModeExecutions = Object.values(executionsByMode).reduce((a, b) => a + b, 0);
    Object.entries(executionsByMode).forEach(([mode, count]) => {
      const percentage =
        totalModeExecutions > 0 ? Math.round((count / totalModeExecutions) * 100) : 0;
      response += `- **${
        mode.charAt(0).toUpperCase() + mode.slice(1)
      } Mode**: ${count} executions (${percentage}%)\n`;
    });
    response += '\n';

    // Quality Gates
    response += '## 🛡️ Quality Gate Analytics\n\n';
    response += `**Gate Validations**: ${this.systemControl.systemAnalytics.gateValidationCount}\n`;
    response += `**Gate Adoption Rate**: ${
      this.systemControl.systemAnalytics.totalExecutions > 0
        ? Math.round(
            (this.systemControl.systemAnalytics.gateValidationCount /
              this.systemControl.systemAnalytics.totalExecutions) *
              100
          )
        : 0
    }%\n`;

    // System Resources
    if (this.systemControl.systemAnalytics.memoryUsage) {
      response += '## 💾 System Resources\n\n';
      const mem = this.systemControl.systemAnalytics.memoryUsage;
      response += `**Heap Used**: ${this.formatBytes(mem.heapUsed)}\n`;
      response += `**Heap Total**: ${this.formatBytes(mem.heapTotal)}\n`;
      response += `**RSS**: ${this.formatBytes(mem.rss)}\n`;
      response += `**External**: ${this.formatBytes(mem.external)}\n\n`;
    }

    // Performance Trends
    if (include_history && this.systemControl.systemAnalytics.performanceTrends.length > 0) {
      response += '## 📈 Performance Trends\n\n';

      // Group trends by metric type for better organization
      const trendsByMetric = this.systemControl.systemAnalytics.performanceTrends.reduce(
        (acc, trend) => {
          if (!acc[trend.metric]) acc[trend.metric] = [];
          acc[trend.metric].push(trend);
          return acc;
        },
        {} as Record<string, any[]>
      );

      Object.entries(trendsByMetric).forEach(([metric, trends]) => {
        const recentTrends = trends.slice(-10);
        response += `### ${metric.charAt(0).toUpperCase() + metric.slice(1)} Trends\n`;
        recentTrends.forEach((trend, index) => {
          const time = new Date(trend.timestamp).toISOString().split('T')[1].split('.')[0];
          const contextInfo = this.formatTrendContext(trend);
          response += `${index + 1}. ${time}: ${this.formatTrendValue(
            trend.metric,
            trend.value
          )}${contextInfo}\n`;
        });
        response += '\n';
      });
    }

    response += `\n---\n*Generated at: ${new Date().toISOString()}*`;

    return this.createMinimalSystemResponse(response, 'analytics');
  }
}
