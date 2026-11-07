// @lifecycle canonical - Injection control action handler for system control.
/**
 * InjectionActionHandler
 *
 * Handler for injection control operations.
 * Manages runtime injection overrides via the modular injection system.
 */

import {
  INJECTION_TYPES,
  INJECTION_TYPE_DESCRIPTIONS,
  DECISION_SOURCE_DESCRIPTIONS,
  isSessionOverrideManagerInitialized,
  getSessionOverrideManager,
  initSessionOverrideManager,
  type InjectionType,
} from '../../../execution/pipeline/decisions/injection/index.js';
import { ToolResponse } from '../../../types/index.js';
import { ActionHandler } from '../action-handler.js';

/**
 * Handler for injection control operations.
 * Manages runtime injection overrides via the modular injection system.
 */
export class InjectionActionHandler extends ActionHandler {
  async execute(args: any): Promise<ToolResponse> {
    const operation = args.operation || 'status';

    switch (operation) {
      case 'status':
        return this.getInjectionStatus();
      case 'override':
        return this.setInjectionOverride(args);
      case 'reset':
        return this.resetInjectionOverrides();
      default:
        return this.createMinimalSystemResponse(
          `❌ Unknown injection operation: ${operation}\n\n` +
            'Valid operations:\n' +
            '- `status` - Show injection configuration and active overrides\n' +
            '- `override` - Set a session override for an injection type\n' +
            '- `reset` - Clear all session overrides',
          'injection_error'
        );
    }
  }

  /**
   * Show current injection configuration and session overrides.
   */
  private getInjectionStatus(): ToolResponse {
    const lines: string[] = [];
    lines.push('💉 **Injection Control Status**\n');

    // Show available injection types
    lines.push('**Available Injection Types:**');
    for (const type of INJECTION_TYPES) {
      const description = INJECTION_TYPE_DESCRIPTIONS[type] || 'No description';
      lines.push(`- \`${type}\`: ${description}`);
    }
    lines.push('');

    // Show session overrides if manager is initialized
    if (isSessionOverrideManagerInitialized()) {
      const manager = getSessionOverrideManager();
      const status = manager.getStatusSummary();

      lines.push('**Session Overrides:**');
      if (status.activeOverrides === 0) {
        lines.push('_No active session overrides._');
      } else {
        for (const override of status.overrides) {
          const enabledStr =
            override.enabled === true
              ? '✅ Enabled'
              : override.enabled === false
                ? '🚫 Disabled'
                : '❓ Undefined';
          const expiresStr = override.expiresAt
            ? ` (expires: ${new Date(override.expiresAt).toISOString()})`
            : '';
          lines.push(
            `- \`${override.type}\`: ${enabledStr} [scope: ${override.scope}]${expiresStr}`
          );
        }
      }
      lines.push('');
      lines.push(`**Override History Count:** ${status.historyCount}`);
      lines.push('_Applied automatically by InjectionControlStage on every execution._');
    } else {
      lines.push('**Session Overrides:** _Manager not initialized._');
    }

    lines.push('');
    lines.push('**Decision Source Priority:**');
    for (const [source, description] of Object.entries(DECISION_SOURCE_DESCRIPTIONS)) {
      lines.push(`- \`${source}\`: ${description}`);
    }

    lines.push('');
    lines.push('**Usage:**');
    lines.push(
      '- Set override: `system_control action:"injection" operation:"override" type:"system-prompt" enabled:false`'
    );
    lines.push('- Clear overrides: `system_control action:"injection" operation:"reset"`');

    return this.createMinimalSystemResponse(lines.join('\n'), 'injection_status');
  }

  /**
   * Set a session override for an injection type.
   */
  private setInjectionOverride(args: any): ToolResponse {
    const type = args.type as InjectionType | undefined;
    const enabled = args.enabled as boolean | undefined;
    const scope = (args.scope as 'session' | 'chain' | 'step') || 'session';
    const scopeId = args.scope_id as string | undefined;
    const expiresInMs = args.expires_in_ms as number | undefined;

    // Validate type
    if (!type || !INJECTION_TYPES.includes(type)) {
      return this.createMinimalSystemResponse(
        `❌ Invalid injection type: \`${type}\`\n\n` +
          `Valid types: ${INJECTION_TYPES.map((t) => `\`${t}\``).join(', ')}`,
        'injection_override_error'
      );
    }

    // Validate enabled is provided
    if (enabled === undefined) {
      return this.createMinimalSystemResponse(
        '❌ Missing `enabled` parameter.\n\n' +
          'Specify `enabled:true` to enable injection or `enabled:false` to disable.',
        'injection_override_error'
      );
    }

    // Initialize manager if needed
    if (!isSessionOverrideManagerInitialized()) {
      initSessionOverrideManager(this.logger);
    }

    const manager = getSessionOverrideManager();
    const override = manager.setOverride(type, enabled, scope, scopeId, expiresInMs);

    const lines: string[] = [];
    lines.push('✅ **Injection Override Set**\n');
    lines.push(`**Type:** \`${type}\``);
    lines.push(`**Enabled:** ${enabled ? '✅ Yes' : '🚫 No'}`);
    lines.push(`**Scope:** ${scope}`);
    if (scopeId) {
      lines.push(`**Scope ID:** ${scopeId}`);
    }
    if (override.expiresAt) {
      lines.push(`**Expires:** ${new Date(override.expiresAt).toISOString()}`);
    }
    lines.push('');
    lines.push('_This override will affect injection decisions until cleared or expired._');

    return this.createMinimalSystemResponse(lines.join('\n'), 'injection_override');
  }

  /**
   * Clear all session overrides.
   */
  private resetInjectionOverrides(): ToolResponse {
    if (!isSessionOverrideManagerInitialized()) {
      return this.createMinimalSystemResponse(
        '✅ **No Active Overrides**\n\nSession override manager was not initialized. Nothing to reset.',
        'injection_reset'
      );
    }

    const manager = getSessionOverrideManager();
    const count = manager.clearAllOverrides();

    return this.createMinimalSystemResponse(
      `✅ **Injection Overrides Cleared**\n\n` +
        `Cleared ${count} override${count === 1 ? '' : 's'}.\n\n` +
        '_Injection decisions will now use default configuration._',
      'injection_reset'
    );
  }
}
