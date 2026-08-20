/**
 * file Trans.tsx
 * description Trans 组件 — 声明式 ICU 翻译 + JSX 插值
 * module @yyc3/i18n-react
 * author YanYuCloudCube Team <admin@0379.email>
 * version 0.1.0
 * created 2026-07-15
 * updated 2026-07-15
 * status active
 * tags [ui],[react],[i18n],[components]
 *
 * copyright YanYuCloudCube Team
 * license MIT
 *
 * brief 支持将 JSX 组件插值到 ICU 翻译文本中
 */

import { Fragment, type ReactNode, isValidElement } from 'react'
import { useTranslation } from './useTranslation.js'

export interface TransProps {
  id: string
  values?: Record<string, string | number>
  components?: Record<string, ReactNode>
  fallback?: string
}

export function Trans({ id, values, components, fallback }: TransProps) {
  const { t } = useTranslation()

  const stringValues: Record<string, string> = {}
  if (values) {
    for (const [k, v] of Object.entries(values)) {
      stringValues[k] = String(v)
    }
  }

  const text = t(id, stringValues)
  const isMissing = text === id

  if (!components) {
    return <>{(isMissing && fallback) ? fallback : text}</>
  }

  return <>{interpolateJSX(isMissing && fallback ? fallback : text, components)}</>
}

function interpolateJSX(
  text: string,
  components: Record<string, ReactNode>,
): ReactNode[] {
  const parts: ReactNode[] = []
  const regex = /<(\w+)>(.*?)<\/\1>|<(\w+)\/>/g
  let lastIndex = 0
  let match: RegExpExecArray | null
  let key = 0

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index))
    }

    const tagName = match[1] || match[3]
    const content = match[2] || ''
    const comp = components[tagName]

    if (comp !== undefined && isValidElement(comp)) {
      if (content) {
        parts.push(
          <Fragment key={`trans-${key++}`}>
            {cloneWithChildren(comp, content)}
          </Fragment>,
        )
      } else {
        parts.push(<Fragment key={`trans-${key++}`}>{comp}</Fragment>)
      }
    } else {
      parts.push(match[0])
    }

    lastIndex = regex.lastIndex
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }

  return parts
}

function cloneWithChildren(element: ReactNode, children: ReactNode): ReactNode {
  if (isValidElement(element)) {
    const props = { ...(element.props as Record<string, unknown>), children }
    return { ...element, props }
  }
  return element
}
