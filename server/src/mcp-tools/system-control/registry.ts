// @lifecycle canonical - System control registry: action dispatch for system_control.
/**
 * ConsolidatedSystemControl Registry — slim orchestration core. Owns manager
 * references, analytics state and the action → handler dispatch. Domain
 * logic lives in ./handlers/*, response shaping in ./shared/*.
 */

import { SafeConfigWriter, createSafeConfigWriter } from '../config-utils.js';
import { ConfigManager } from '../../config/index.js';
import { FrameworkManager } from '../../frameworks/framework-manager.js';
import { FrameworkStateManager } from '../../frameworks/framework-state-manager.js';
import { GateSystemManager } from '../../gates/gate-state-manager.js';
import type { GateGuidanceRenderer } from '../../gates/guidance/GateGuidanceRenderer.js';
import { Logger } from '../../logging/index.js';
import { MetricsCollector } from '../../metrics/index.js';
import { PromptGuidanceService } from '../../frameworks/prompt-guidance/index.js';
import { SYSTEM_CONTROL_ACTION_IDS, type SystemControlActionId } from '../../tooling/action-metadata/definitions/system-control.js';
import { recordActionInvocation } from '../../tooling/action-metadata/usage-tracker.js';
import { ToolResponse } from '../../types/index.js';
import { ResponseFormatter } from '../prompt-engine/processors/response-formatter.js';
import { ToolDescriptionManager } from '../tool-description-manager.js';
import { ActionHandler } from './action-handler.js';
import { AnalyticsActionHandler } from './handlers/analytics.js';
import { ConfigActionHandler } from './handlers/config.js';
import { FrameworkActionHandler } from './handlers/framework.js';
import { GateActionHandler } from './handlers/gates.js';
import { GuideActionHandler } from './handlers/guide.js';
import { InjectionActionHandler } from './handlers/injection.js';
import { MaintenanceActionHandler } from './handlers/maintenance.js';
import { StatusActionHandler } from './handlers/status.js';
import { SystemAnalytics, SystemAnalyticsTracker } from './shared/analytics.js';
import { buildMinimalSystemResponse } from './shared/structured-response.js';

/**
 * Consolidated System Control Tool — slim registry; see ./handlers/* and ./shared/*.
 */
export class ConsolidatedSystemControl {
  private logger: Logger;
  private mcpServer: any;
  private configManager?: ConfigManager;
  private safeConfigWriter?: SafeConfigWriter;
  public frameworkStateManager?: FrameworkStateManager;
  private frameworkManager?: FrameworkManager;
  public gateSystemManager?: GateSystemManager;
  private onRestart?: (reason: string) => Promise<void>;
  private toolDescriptionManager?: ToolDescriptionManager;
  private mcpToolsManager?: any; // Reference to MCPToolsManager for tool updates
  private analyticsService?: MetricsCollector;
  private responseFormatter: ResponseFormatter;
  private promptGuidanceService?: PromptGuidanceService;
  private gateGuidanceRenderer?: GateGuidanceRenderer;
  public startTime: number = Date.now();

  private analyticsTracker = new SystemAnalyticsTracker();

  constructor(logger: Logger, mcpServer: any, onRestart?: (reason: string) => Promise<void>) {
    this.logger = logger;
    this.mcpServer = mcpServer;
    this.onRestart = onRestart;
    this.responseFormatter = new ResponseFormatter(this.logger);
  }

  setFrameworkStateManager(frameworkStateManager: FrameworkStateManager): void {
    this.frameworkStateManager = frameworkStateManager;
  }

  setFrameworkManager(frameworkManager: FrameworkManager): void {
    this.frameworkManager = frameworkManager;
  }

  setToolDescriptionManager(manager: ToolDescriptionManager): void {
    this.toolDescriptionManager = manager;
  }

  setAnalyticsService(analyticsService: MetricsCollector): void {
    this.analyticsService = analyticsService;
    this.responseFormatter.setAnalyticsService(analyticsService);
  }

  /** Set config manager for configuration operations */
  setConfigManager(configManager: ConfigManager): void {
    this.configManager = configManager;

    // Initialize SafeConfigWriter with the config file path
    try {
      // Get the config file path from the ConfigManager using proper getter method
      const configPath = configManager.getConfigPath();
      this.safeConfigWriter = createSafeConfigWriter(this.logger, configManager, configPath);
      this.logger.debug('ConfigManager and SafeConfigWriter configured for system control');
    } catch (error) {
      this.logger.warn('Failed to initialize SafeConfigWriter:', error);
      this.logger.debug('ConfigManager configured for system control (read-only mode)');
    }
  }

  setRestartCallback(onRestart: (reason: string) => Promise<void>): void {
    this.onRestart = onRestart;
    this.logger.debug('Restart callback configured for system control');
  }

  setMCPToolsManager(mcpToolsManager: any): void {
    this.mcpToolsManager = mcpToolsManager;
    this.logger.debug('MCPToolsManager reference configured for dynamic tool updates');
  }

  setGateSystemManager(gateSystemManager: GateSystemManager): void {
    this.gateSystemManager = gateSystemManager;
    this.logger.debug('Gate system manager configured for runtime gate control');
  }

  setGateGuidanceRenderer(renderer: GateGuidanceRenderer): void {
    this.gateGuidanceRenderer = renderer;
    this.logger.debug('Gate guidance renderer configured for gate discovery');
  }

  public get systemAnalytics(): SystemAnalytics {
    return this.analyticsTracker.snapshot;
  }

  updateAnalytics(analytics: Partial<SystemAnalytics> & { currentExecution?: any }): void {
    this.analyticsTracker.update(analytics, this.startTime);
  }

  getExecutionsByMode(): Record<string, number> {
    return this.analyticsTracker.getExecutionsByMode();
  }

  resetAnalyticsData(): void {
    this.analyticsTracker.reset(this.startTime);
  }

  /** Helper function for minimal outputSchema compliance */
  createMinimalSystemResponse(text: string, action: string): ToolResponse {
    const ctx = {
      frameworkStateManager: this.frameworkStateManager,
      frameworkManager: this.frameworkManager,
      startTime: this.startTime,
    };
    return buildMinimalSystemResponse(ctx, text, action);
  }

  public async handleAction(args: { action: string; [key: string]: any }, extra: any): Promise<ToolResponse> {
    const { action } = args;
    this.logger.info(`⚙️ System Control: Executing action "${action}"`);

    recordActionInvocation('system_control', action, 'received');

    try {
      if (!isSystemControlActionId(action)) {
        recordActionInvocation('system_control', action, 'unknown', {
          error: `Unknown action: ${action}`,
        });
        throw new Error(
          `Unknown action: ${action}. Valid actions: ${SYSTEM_CONTROL_ACTION_IDS.join(', ')}`
        );
      }

      const actionHandler = this.getActionHandler(action);
      const response = await actionHandler.execute(args);
      recordActionInvocation('system_control', action, 'success');
      return response;
    } catch (error) {
      const status =
        error instanceof Error && /Unknown action/i.test(error.message) ? 'unknown' : 'failure';
      recordActionInvocation('system_control', action, status, {
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  private getActionHandler(action: SystemControlActionId): ActionHandler {
    switch (action) {
      case 'status':
        return new StatusActionHandler(this);
      case 'framework':
        return new FrameworkActionHandler(this);
      case 'gates':
        return new GateActionHandler(this);
      case 'analytics':
        return new AnalyticsActionHandler(this);
      case 'config':
        return new ConfigActionHandler(this);
      case 'maintenance':
        return new MaintenanceActionHandler(this);
      case 'guide':
        return new GuideActionHandler(this);
      case 'injection':
        return new InjectionActionHandler(this);
      default:
        throw new Error(
          `Unknown action: ${action}. Valid actions: ${SYSTEM_CONTROL_ACTION_IDS.join(', ')}`
        );
    }
  }
}

function isSystemControlActionId(value: string): value is SystemControlActionId {
  return (SYSTEM_CONTROL_ACTION_IDS as readonly string[]).includes(value);
}
