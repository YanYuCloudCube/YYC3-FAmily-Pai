// @lifecycle canonical - Gates action handler for system control.
/**
 * GateActionHandler
 *
 * Handles the `gates` action: enable/disable (with optional config.json
 * persistence), status, health and gate discovery with search filtering.
 * Method bodies moved verbatim from ConsolidatedSystemControl.
 */

import { SafeConfigWriter } from '../../config-utils.js';
import { Logger } from '../../../logging/index.js';
import { ToolResponse } from '../../../types/index.js';
import { ActionHandler } from '../action-handler.js';

/**
 * Persist gate enablement to config.json when requested.
 */
async function persistGateConfig(
  safeConfigWriter: SafeConfigWriter | undefined,
  logger: Logger,
  enabled: boolean
): Promise<string | undefined> {
  if (!safeConfigWriter) {
    return '⚠️ Persistence skipped (config writer unavailable).';
  }

  try {
    const result = await safeConfigWriter.updateConfigValue('gates.enabled', String(enabled), {
      createBackup: false,
    });
    if (!result.success) {
      return `⚠️ Failed to persist gates.enabled: ${result.message || result.error}`;
    }
    return `📁 Persisted gates.enabled=${enabled} to config.json.`;
  } catch (error) {
    logger.warn('Failed to persist gates.enabled', error);
    return `⚠️ Failed to persist gates.enabled: ${error instanceof Error ? error.message : String(error)}`;
  }
}

/**
 * Handler for gates-related operations
 */
export class GateActionHandler extends ActionHandler {
  async execute(args: any): Promise<ToolResponse> {
    const operation = args.operation || 'status';

    switch (operation) {
      case 'enable':
        return await this.enableGateSystem({
          reason: args.reason,
          persist: args.persist,
        });
      case 'disable':
        return await this.disableGateSystem({
          reason: args.reason,
          persist: args.persist,
        });
      case 'status':
        return await this.getGateSystemStatus();
      case 'health':
        return await this.getGateSystemHealth();
      case 'list':
        return await this.listAvailableGates(args.search_query);
      default:
        throw new Error(
          `Unknown gates operation: ${operation}. Valid operations: enable, disable, status, health, list`
        );
    }
  }

  /**
   * Enable gate system
   */
  private async enableGateSystem(args: {
    reason?: string;
    persist?: boolean;
  }): Promise<ToolResponse> {
    if (!this.systemControl.gateSystemManager) {
      throw new Error('Gate system manager not initialized');
    }

    const currentState = this.systemControl.gateSystemManager.getCurrentState();
    if (currentState.enabled) {
      return this.createMinimalSystemResponse(
        `ℹ️ Gate system is already enabled.`,
        'enable_gate_system'
      );
    }

    await this.systemControl.gateSystemManager.enableGateSystem(
      args.reason || 'User requested to enable gate system'
    );

    const persistenceNotes: string[] = [];
    if (args.persist) {
      const note = await persistGateConfig(this.safeConfigWriter, this.logger, true);
      if (note) persistenceNotes.push(note);
    }

    const response =
      `✅ **Gate System Enabled**\n\n` +
      `**Reason**: ${args.reason || 'User requested to enable gate system'}\n` +
      `**Status**: Gate system is now active\n` +
      `**Validation**: Quality gates will now be applied to prompt executions\n\n` +
      `🔍 All template and chain executions will now include gate validation and guidance.` +
      (persistenceNotes.length ? `\n\n${persistenceNotes.join('\n')}` : '');

    return this.createMinimalSystemResponse(response, 'enable_gate_system');
  }

  /**
   * Disable gate system
   */
  private async disableGateSystem(args: {
    reason?: string;
    persist?: boolean;
  }): Promise<ToolResponse> {
    if (!this.systemControl.gateSystemManager) {
      throw new Error('Gate system manager not initialized');
    }

    const currentState = this.systemControl.gateSystemManager.getCurrentState();
    if (!currentState.enabled) {
      return this.createMinimalSystemResponse(
        `ℹ️ Gate system is already disabled.`,
        'disable_gate_system'
      );
    }

    await this.systemControl.gateSystemManager.disableGateSystem(
      args.reason || 'User requested to disable gate system'
    );

    const persistenceNotes: string[] = [];
    if (args.persist) {
      const note = await persistGateConfig(this.safeConfigWriter, this.logger, false);
      if (note) persistenceNotes.push(note);
    }

    const response =
      `⚠️ **Gate System Disabled**\n\n` +
      `**Reason**: ${args.reason || 'User requested to disable gate system'}\n` +
      `**Status**: Gate system is now inactive\n` +
      `**Impact**: Gate validation and guidance will be skipped\n\n` +
      `📝 Prompt executions will now skip quality gate validation.` +
      (persistenceNotes.length ? `\n\n${persistenceNotes.join('\n')}` : '');

    return this.createMinimalSystemResponse(response, 'disable_gate_system');
  }

  /**
   * Get gate system status
   */
  private async getGateSystemStatus(): Promise<ToolResponse> {
    if (!this.systemControl.gateSystemManager) {
      return this.createMinimalSystemResponse(
        `❌ Gate system manager not available.`,
        'gate_system_status'
      );
    }

    const currentState = this.systemControl.gateSystemManager.getCurrentState();
    const health = this.systemControl.gateSystemManager.getSystemHealth();

    let response = `🚪 **Gate System Status**\n\n`;
    response += `**System State**: ${currentState.enabled ? 'Enabled' : 'Disabled'}\n`;
    response += `**Health Status**: ${health.status}\n`;
    response += `**Total Validations**: ${health.totalValidations}\n`;
    response += `**Success Rate**: ${health.successRate}%\n`;
    response += `**Average Validation Time**: ${health.averageValidationTime}ms\n`;

    if (health.lastValidationTime) {
      response += `**Last Validation**: ${health.lastValidationTime.toISOString()}\n`;
    }

    if (health.issues.length > 0) {
      response += `\n⚠️ **Issues**:\n`;
      health.issues.forEach((issue) => {
        response += `- ${issue}\n`;
      });
    }

    response += `\n🔧 Control gates using: action="gates", operation="enable/disable"`;

    return this.createMinimalSystemResponse(response, 'gate_system_status');
  }

  /**
   * Get gate system health details
   */
  private async getGateSystemHealth(): Promise<ToolResponse> {
    if (!this.systemControl.gateSystemManager) {
      return this.createMinimalSystemResponse(
        `❌ Gate system manager not available.`,
        'gate_system_health'
      );
    }

    const health = this.systemControl.gateSystemManager.getSystemHealth();

    let response = `🏥 **Gate System Health Report**\n\n`;

    // Health status indicator
    const statusIcon =
      health.status === 'healthy' ? '✅' : health.status === 'degraded' ? '⚠️' : '❌';
    response += `**Overall Status**: ${statusIcon} ${health.status.toUpperCase()}\n\n`;

    // Core metrics
    response += `**Performance Metrics**:\n`;
    response += `- Enabled: ${health.enabled ? 'Yes' : 'No'}\n`;
    response += `- Total Validations: ${health.totalValidations}\n`;
    response += `- Success Rate: ${health.successRate}%\n`;
    response += `- Average Validation Time: ${health.averageValidationTime}ms\n`;

    if (health.lastValidationTime) {
      response += `- Last Validation: ${health.lastValidationTime.toISOString()}\n`;
    }

    // Health analysis
    if (health.status === 'healthy') {
      response += '\n✅ System is performing optimally. No action required.\n';
    } else if (health.status === 'degraded') {
      response += '\n⚠️ System performance is degraded. Monitor closely.\n';
      if (health.issues.length > 0) {
        response += '\n**Issues Detected**:\n';
        health.issues.forEach((issue) => {
          response += `- ${issue}\n`;
        });
      }
    } else if (health.status === 'disabled') {
      response += '\n🚫 Gate system is currently disabled.\n';
      response += "Enable using: `action='gates', operation='enable'`\n";
    }

    return this.createMinimalSystemResponse(response, 'gate_system_health');
  }

  /**
   * List all available quality gates with optional search filtering
   */
  async listAvailableGates(searchQuery?: string): Promise<ToolResponse> {
    const gateDefinitions =
      (await this.gateGuidanceRenderer?.getAvailableGateDefinitions()) || [];

    // Filter by search query if provided
    const filteredGates = searchQuery
      ? gateDefinitions.filter(
          (gate) =>
            gate.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            gate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (gate.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
        )
      : gateDefinitions;

    if (filteredGates.length === 0) {
      const noResultsMsg = searchQuery
        ? `No gates found matching "${searchQuery}". Try: \`>>gates\` to list all.`
        : 'No quality gates discovered. Ensure gate configuration is available.';

      return this.createMinimalSystemResponse(
        `📋 **Available Quality Gates**\n\n${noResultsMsg}`,
        'gate_list'
      );
    }

    const lines: string[] = ['📋 **Available Quality Gates**', ''];

    if (searchQuery) {
      lines.push(`🔍 Filtered by: "${searchQuery}"`, '');
    }

    // Format each gate with name, ID, and description
    for (const gate of filteredGates) {
      lines.push(`### ${gate.name}`);
      lines.push(`**ID**: \`${gate.id}\``);
      if (gate.description) {
        lines.push(`${gate.description}`);
      }
      lines.push('');
    }

    // Add usage syntax reference
    lines.push('---', '');
    lines.push('**Usage Syntax**:', '');
    lines.push('```');
    lines.push(`:: ${filteredGates[0]?.id || 'gate-id'}              # Use canonical gate`);
    lines.push(`:: security:"validate inputs"   # Named inline gate`);
    lines.push(`:: "custom criteria"            # Anonymous inline gate`);
    lines.push('```');
    lines.push('');
    lines.push(
      `**Total Gates**: ${filteredGates.length}${searchQuery ? ` (filtered from ${gateDefinitions.length})` : ''}`
    );

    return this.createMinimalSystemResponse(lines.join('\n'), 'gate_list');
  }
}
