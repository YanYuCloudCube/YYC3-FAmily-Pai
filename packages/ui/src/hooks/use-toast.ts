/**
 * file use-toast.ts
 * description Toast 通知 hook stub — 组件库内部使用，不依赖具体实现
 * module @yyc3/ui/hooks
 * author YanYuCloudCube Team <admin@0379.email>
 * version 3.0.0
 * created 2026-06-20
 * status active
 *
 * brief 组件库内使用的 toast 占位实现，业务方可通过 props 注入真实 toast
 *
 * copyright YanYuCloudCube Team
 * license MIT
 */

export interface ToastOptions {
  title?: string
  description?: string
  variant?: "default" | "success" | "warning" | "error" | "destructive"
  duration?: number
}

export function useToast() {
  return {
    toast: (options: ToastOptions): void => {
      // Stub: 实际项目应通过 Context 或 props 注入真实 toast 实现
      if (typeof console !== "undefined") {

        console.log("[Toast]", options.title || "", options.description || "")
      }
    },
  }
}

export const toast = (options: ToastOptions): void => {
  if (typeof console !== "undefined") {

    console.log("[Toast]", options.title || "", options.description || "")
  }
}
