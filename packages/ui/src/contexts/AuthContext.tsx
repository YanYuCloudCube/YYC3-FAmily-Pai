/**
 * file AuthContext.tsx
 * description 认证上下文 stub — 组件库内部使用，不依赖具体实现
 * module @yyc3/ui/contexts
 * author YanYuCloudCube Team <admin@0379.email>
 * version 3.0.0
 * created 2026-06-20
 * status active
 *
 * brief ProtectedRoute 等组件依赖的 AuthContext 占位实现
 *        业务方应通过 Provider 注入真实认证逻辑
 *
 * copyright YanYuCloudCube Team
 * license MIT
 */

"use client"

import { createContext, useContext, type ReactNode } from "react"

export interface AuthUser {
  id: string
  name: string
  email: string
  role?: string
  permissions?: string[]
}

export interface AuthContextValue {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  hasRole: (role: string) => boolean
  hasPermission: (permission: string) => boolean
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  hasRole: () => false,
  hasPermission: () => false,
})

export function AuthProvider({
  children,
  value,
}: {
  children: ReactNode
  value?: Partial<AuthContextValue>
}) {
  const defaultValue: AuthContextValue = {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    hasRole: () => false,
    hasPermission: () => false,
    ...value,
  }
  return <AuthContext.Provider value={defaultValue}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  return useContext(AuthContext)
}
