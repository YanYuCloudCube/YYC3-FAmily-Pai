interface TauriFsApi {
  readTextFile(path: string): Promise<string>;
  writeTextFile(path: string, content: string): Promise<void>;
  exists(path: string): Promise<boolean>;
  mkdir(path: string, options?: { recursive?: boolean }): Promise<void>;
  readDir(path: string): Promise<Array<{ name: string; path: string; isDirectory?: boolean }>>;
  remove(path: string, options?: { recursive?: boolean }): Promise<void>;
  rename(path: string, newPath: string): Promise<void>;
}

interface TauriDialogApi {
  open(options?: {
    multiple?: boolean;
    filters?: Array<{ name: string; extensions: string[] }>;
  }): Promise<string | string[] | null>;
  save(options?: {
    defaultPath?: string;
    filters?: Array<{ name: string; extensions: string[] }>;
  }): Promise<string | null>;
}

interface TauriClipboardApi {
  writeText(text: string): Promise<void>;
  readText(): Promise<string | null>;
}

interface TauriApi {
  fs: TauriFsApi;
  dialog: TauriDialogApi;
  clipboard: TauriClipboardApi;
  notification: {
    sendNotification: (options: { title: string; body?: string; icon?: string }) => void;
    requestPermission: () => Promise<string>;
    isPermissionGranted: () => Promise<boolean>;
  };
  shell: {
    open: (url: string) => Promise<void>;
    Command: {
      new (program: string, args?: string[]): {
        execute: () => Promise<{ code: number; stdout: string; stderr: string }>;
        spawn: () => Promise<void>;
      };
      create: (program: string, args?: string[]) => {
        execute: () => Promise<{ code: number; stdout: string; stderr: string }>;
        spawn: () => Promise<void>;
      };
    };
  };
  window: {
    getCurrent: () => { close: () => void; minimize: () => void; toggleMaximize: () => void };
    create: (label: string, options?: Record<string, unknown>) => unknown;
    appWindow: { close: () => void; minimize: () => void; toggleMaximize: () => void; setTitle: (title: string) => void };
  };
}

interface Window {
  __TAURI__?: TauriApi;
}
