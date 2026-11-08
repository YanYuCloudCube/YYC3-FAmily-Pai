// @lifecycle canonical - System control module barrel.
/**
 * System Control module entry point.
 *
 * Public surface is unchanged from the pre-split single-file module:
 * ConsolidatedSystemControl + createConsolidatedSystemControl factory.
 * Internals are organized as registry + per-action handlers + shared helpers.
 */

import { ConsolidatedSystemControl } from './registry.js';
import { Logger } from '../../logging/index.js';

export { ConsolidatedSystemControl } from './registry.js';
export type { SystemAnalytics } from './shared/analytics.js';

/**
 * Create consolidated system control
 */
export function createConsolidatedSystemControl(
  logger: Logger,
  mcpServer: any,
  onRestart?: (reason: string) => Promise<void>
): ConsolidatedSystemControl {
  return new ConsolidatedSystemControl(logger, mcpServer, onRestart);
}
