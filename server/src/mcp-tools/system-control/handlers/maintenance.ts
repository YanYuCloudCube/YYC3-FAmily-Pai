// @lifecycle canonical - Maintenance action handler for system control.
/**
 * MaintenanceActionHandler
 *
 * Handles the `maintenance` action (server restart). Cleanup and
 * log-diagnostics operations are planned once supporting hooks exist —
 * see the TODOs in execute().
 */

import { ToolResponse } from '../../../types/index.js';
import { ActionHandler } from '../action-handler.js';

/**
 * Handler for maintenance-related operations
 */
export class MaintenanceActionHandler extends ActionHandler {
  async execute(args: any): Promise<ToolResponse> {
    const operation = args.operation || 'default';

    // TODO: Add cleanup operation to prune logs, remove not-found prompt artifacts, and resync state with the current stack once supporting hooks exist.
    // TODO: Add diagnostics operation that searches logs for specific error topics/ids and surfaces results to LLM clients for in-tool debugging after log plumbing is in place.
    switch (operation) {
      case 'restart':
      case 'default':
      default:
        return await this.restartServer({
          reason: args.reason,
          confirm: args.confirm,
        });
    }
  }

  /**
   * Restart server with confirmation and reason
   */
  private async restartServer(args: {
    reason?: string;
    confirm?: boolean;
  }): Promise<ToolResponse> {
    const { reason = 'Manual restart requested via system_control', confirm = false } = args;

    if (!this.onRestart) {
      return {
        content: [
          {
            type: 'text',
            text: "❌ **Restart Unavailable**: Server restart functionality not configured. This may indicate the server is running in a mode that doesn't support programmatic restart.",
          },
        ],
        isError: true,
      };
    }

    if (!confirm) {
      return {
        content: [
          {
            type: 'text',
            text:
              `⚠️ **Server Restart Confirmation Required**\n\n` +
              `**Reason**: ${reason}\n` +
              `**Impact**: All active connections will be terminated\n` +
              `**Downtime**: Server will restart (typically 5-10 seconds)\n\n` +
              `**To proceed**: Set 'confirm: true' to execute the restart.\n\n` +
              `🔄 **Alternative**: Use hot-reload via prompt_manager 'reload' action for most changes.`,
          },
        ],
      };
    }

    let response = `🚨 **Server Restart Initiated**\n\n`;
    response += `**Reason**: ${reason}\n`;
    response += `**Timestamp**: ${new Date().toISOString()}\n\n`;
    response += `📊 **Pre-Restart System Status**:\n`;
    response += `- **Uptime**: ${this.formatUptime(this.systemControl.systemAnalytics.uptime)}\n`;
    response += `- **Total Executions**: ${this.systemControl.systemAnalytics.totalExecutions}\n`;
    response += `- **Success Rate**: ${this.getSuccessRate()}%\n`;

    if (this.systemControl.frameworkStateManager) {
      const currentState = this.systemControl.frameworkStateManager.getCurrentState();
      response += `- **Active Framework**: ${currentState.activeFramework}\n`;
    }

    response += `\n⚡ **Server will restart in 2 seconds**... Please wait for reconnection.\n\n`;
    response += `✅ All system state and configurations will be preserved.`;

    // Schedule restart after response is sent
    setTimeout(() => {
      this.logger.info(`System restart initiated via system_control. Reason: ${reason}`);
      this.onRestart!(reason);
    }, 2000);

    return this.createMinimalSystemResponse(response, 'restart');
  }
}
