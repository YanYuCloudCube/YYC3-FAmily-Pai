/**
 * @file Middleware 使用示例
 * @description 演示如何使用 MiddlewareChain 和内置中间件
 * @author YYC³ AI Team
 * @version 1.0.0
 */

import {
  MiddlewareChain,
  createLoggingMiddleware,
  createRetryMiddleware,
  createCacheMiddleware,
  createRateLimitMiddleware,
} from '../src/middleware/index';
import type { MiddlewareContext } from '../src/middleware/index';

function main() {
  console.log('🔧 YYC³ Middleware 示例\n');

  const chain = new MiddlewareChain();

  chain.use(createLoggingMiddleware())
    .use(createRetryMiddleware(3))
    .use(createCacheMiddleware(30000))
    .use(createRateLimitMiddleware(10));

  console.log('已注册中间件:', chain.list().join(', '));

  const ctx: MiddlewareContext = {
    task: '分析代码质量',
    agentId: 'quality-agent',
    metadata: {},
  };

  chain.executeBefore(ctx).then((processedCtx) => {
    console.log('\n处理后的上下文:', JSON.stringify(processedCtx.metadata, null, 2));
    console.log('\n✅ 中间件链执行完成');
  });
}

main();
