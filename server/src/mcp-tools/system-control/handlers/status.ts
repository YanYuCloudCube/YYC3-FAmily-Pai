// @lifecycle canonical - Status action handler for system control.
/**
 * StatusActionHandler
 *
 * Handles the `status` action: overview (moved verbatim from
 * ConsolidatedSystemControl.getSystemStatus), health, diagnostics and
 * framework_status operations.
 */

import { ToolResponse } from '../../../types/index.js';
import { ActionHandler } from '../action-handler.js';

/**
 * Handler for status-related operations
 */
export class StatusActionHandler extends ActionHandler {
  async execute(args: any): Promise<ToolResponse> {
    const operation = args.operation || 'default';

    switch (operation) {
      case 'health':
        return await this.getSystemHealthStatus();
      case 'diagnostics':
        return await this.getSystemDiagnostics();
      case 'framework_status':
        return await this.getFrameworkStatus();
      case 'overview':
      case 'default':
      default:
        return await this.getSystemStatus({
          include_history: args.include_history,
          include_metrics: args.include_metrics,
        });
    }
  }

  /**
   * Get comprehensive system status
   */
  private async getSystemStatus(args: {
    include_history?: boolean;
    include_metrics?: boolean;
  }): Promise<ToolResponse> {
    const { include_history = false, include_metrics = true } = args;

    if (!this.systemControl.frameworkStateManager) {
      throw new Error('Framework state manager not initialized');
    }

    const health = this.systemControl.frameworkStateManager.getSystemHealth();
    const statusIcon = health.status === 'healthy' ? '✅' : '⚠️';

    // Check if framework system is enabled for injection
    const isFrameworkEnabled = health.frameworkSystemEnabled;
    const frameworkStatusIcon = isFrameworkEnabled ? '✅' : '🚫';
    const frameworkStatusText = isFrameworkEnabled
      ? `${frameworkStatusIcon} Enabled (${health.activeFramework})`
      : `${frameworkStatusIcon} Disabled (${health.activeFramework} selected)`;

    let response = `${statusIcon} **System Status Overview**\n\n`;
    response += `**Framework System**: ${frameworkStatusText}\n`;
    response += `**Status**: ${health.status}\n`;
    response += `**Uptime**: ${Math.floor((Date.now() - this.startTime) / 1000 / 60)} minutes\n\n`;

    // Add warning message when framework is selected but system disabled
    if (!isFrameworkEnabled && health.activeFramework) {
      response += `⚠️ **Notice**: ${health.activeFramework} is selected but framework injection is disabled.\n`;
      response += `Prompts will execute without methodology guidance.\n`;
      response += `Use \`system_control framework enable\` to activate framework injection.\n\n`;
    }

    if (include_metrics) {
      response += `📊 **Performance Metrics**:\n`;
      response += `- Total Executions: ${this.systemControl.systemAnalytics.totalExecutions}\n`;
      response += `- Success Rate: ${
        this.systemControl.systemAnalytics.totalExecutions > 0
          ? Math.round(
              (this.systemControl.systemAnalytics.successfulExecutions /
                this.systemControl.systemAnalytics.totalExecutions) *
                100
            )
          : 0
      }%\n`;
      response += `- Average Execution Time: ${this.systemControl.systemAnalytics.averageExecutionTime}ms\n\n`;
    }

    return this.createMinimalSystemResponse(response, 'status');
  }

  private async getSystemHealthStatus(): Promise<ToolResponse> {
    if (!this.systemControl.frameworkStateManager) {
      throw new Error('Framework state manager not initialized');
    }

    const health = this.systemControl.frameworkStateManager.getSystemHealth();
    const statusIcon = health.status === 'healthy' ? '✅' : '⚠️';

    let response = `${statusIcon} **System Health Status**: ${health.status}\n\n`;
    response += `📊 **Metrics**:\n`;

    // Improved framework status display
    const isFrameworkEnabled = health.frameworkSystemEnabled;
    const injectionStatus = isFrameworkEnabled ? 'Working' : 'Inactive';
    const frameworkStatusText = isFrameworkEnabled
      ? `✅ Enabled - ${health.activeFramework} methodology active`
      : `🚫 Disabled - ${health.activeFramework} selected but not injecting`;

    response += `- Framework System: ${frameworkStatusText}\n`;
    response += `- Framework Injection: ${injectionStatus}\n`;
    response += `- Available Frameworks: ${health.availableFrameworks.join(', ')}\n`;
    response += `- Total Framework Switches: ${health.switchingMetrics.totalSwitches}\n`;

    return this.createMinimalSystemResponse(response, 'health');
  }

  private async getSystemDiagnostics(): Promise<ToolResponse> {
    let response = `🔧 **System Diagnostics**\n\n`;

    try {
      if (this.systemControl.frameworkStateManager) {
        const health = this.systemControl.frameworkStateManager.getSystemHealth();
        response += `Framework State: ${health.status}\n`;
        response += `Active Framework: ${health.activeFramework}\n`;
      }

      response += `Server Uptime: ${Date.now() - this.systemControl.startTime}ms\n`;
    } catch (error) {
      response += `❌ Error during diagnostics: ${error}\n`;
    }

    return this.createMinimalSystemResponse(response, 'diagnostics');
  }

  private async getFrameworkStatus(): Promise<ToolResponse> {
    if (!this.systemControl.frameworkStateManager) {
      throw new Error('Framework state manager not initialized');
    }

    const health = this.systemControl.frameworkStateManager.getSystemHealth();

    let response = `🎯 **Framework System Status**\n\n`;

    // Enhanced status display
    const isFrameworkEnabled = health.frameworkSystemEnabled;
    const injectionStatusIcon = isFrameworkEnabled ? '✅' : '🚫';
    const injectionStatusText = isFrameworkEnabled
      ? 'Active - Framework guidance being applied'
      : 'Inactive - Framework guidance disabled';

    response += `**Selected Framework**: ${health.activeFramework}\n`;
    response += `**Injection Status**: ${injectionStatusIcon} ${injectionStatusText}\n`;
    response += `**System State**: ${health.frameworkSystemEnabled ? 'Enabled' : 'Disabled'}\n`;
    response += `**Health Status**: ${health.status}\n`;
    response += `**Available Frameworks**: ${health.availableFrameworks.join(', ')}\n`;

    // Add warning for confused state
    if (!isFrameworkEnabled && health.activeFramework) {
      response += `\n⚠️ **Warning**: Framework system is disabled while ${health.activeFramework} is selected.\n`;
      response += `This means prompts will NOT receive framework methodology guidance.\n`;
      response += `To enable framework injection, use: \`system_control framework enable\`\n`;
    }

    return this.createMinimalSystemResponse(response, 'framework_status');
  }
}
