export interface MCPTool {
  name: string;
  description: string;
  inputSchema: {
    type: "object";
    properties: Record<string, { type: string; description: string; enum?: string[]; items?: { type: string } }>;
    required?: string[];
  };
}

export interface MCPToolResult {
  content: Array<{
    type: "text" | "image" | "resource";
    text?: string;
    data?: string;
    mimeType?: string;
    resource?: MCPResourceReference;
  }>;
  isError?: boolean;
}

export interface MCPResourceReference {
  uri: string;
  mimeType?: string;
  text?: string;
  blob?: string;
}

export interface MCPResource {
  uri: string;
  name: string;
  description?: string;
  mimeType?: string;
  annotations?: {
    audience?: Array<"user" | "assistant">;
    priority?: number;
  };
}

export interface MCPResourceContent {
  uri: string;
  mimeType?: string;
  text?: string;
  blob?: string;
}

export interface MCPPromptArgument {
  name: string;
  description?: string;
  required?: boolean;
}

export interface MCPPrompt {
  name: string;
  description?: string;
  arguments?: MCPPromptArgument[];
}

export interface MCPPromptMessage {
  role: "user" | "assistant";
  content: {
    type: "text" | "image" | "resource";
    text?: string;
    data?: string;
    mimeType?: string;
    resource?: MCPResourceReference;
  };
}

export interface MCPPromptResult {
  description?: string;
  messages: MCPPromptMessage[];
}

export type MCPNotificationMethod =
  | "notifications/cancelled"
  | "notifications/progress"
  | "notifications/resources/list_changed"
  | "notifications/resources/updated"
  | "notifications/tools/list_changed"
  | "notifications/prompts/list_changed"
  | "notifications/message";

export interface MCPNotification {
  method: MCPNotificationMethod;
  params?: Record<string, unknown>;
}

export interface MCPServerConfig {
  name: string;
  command: string;
  args: string[];
  env?: Record<string, string>;
  enabled: boolean;
  priority?: number;
}

export interface MCPServerStatus {
  name: string;
  connected: boolean;
  lastPing?: Date;
  toolsCount?: number;
  resourcesCount?: number;
  promptsCount?: number;
  error?: string;
}

export type MCPConnectionState = "disconnected" | "connecting" | "connected" | "error";

export interface MCPServerDefinition {
  id: string;
  name: string;
  description: string;
  version: string;
  tools: MCPTool[];
  resources?: MCPResource[];
  prompts?: MCPPrompt[];
  configTemplate: MCPServerConfig;
  category: "search" | "code" | "database" | "filesystem" | "ai" | "container";
}

export interface MCPServerInstance {
  definition: MCPServerDefinition;
  status: MCPConnectionState;
  config: MCPServerConfig;
}

export interface MCPServerHandler {
  getTools(): MCPTool[];
  callTool(toolName: string, args: Record<string, unknown>): Promise<MCPToolResult>;
  getResources?(): MCPResource[];
  readResource?(uri: string): Promise<MCPResourceContent>;
  getPrompts?(): MCPPrompt[];
  getPrompt?(name: string, args?: Record<string, string>): Promise<MCPPromptResult>;
}
