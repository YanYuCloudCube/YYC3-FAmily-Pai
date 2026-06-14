declare module 'recharts' {
  export const ResponsiveContainer: any
  export const LineChart: any
  export const Line: any
  export const BarChart: any
  export const Bar: any
  export const PieChart: any
  export const Pie: any
  export const Cell: any
  export const XAxis: any
  export const YAxis: any
  export const CartesianGrid: any
  export const Tooltip: any
  export const Legend: any
  export const AreaChart: any
  export const Area: any
  export const RadarChart: any
  export const Radar: any
  export const PolarGrid: any
  export const PolarAngleAxis: any
  export const PolarRadiusAxis: any
  export const ComposedChart: any
  export const Scatter: any
  export const ScatterChart: any
  export const ReferenceLine: any
  export const ReferenceArea: any
  export const ReferenceDot: any
  export const Brush: any
  export const ErrorBar: any
}

declare module 'react-router' {
  export function useNavigate(): (path: string) => void
  export function useLocation(): { pathname: string; search: string; hash: string }
  export function useParams(): Record<string, string | undefined>
  export function useSearchParams(): [URLSearchParams, (params: URLSearchParams) => void]
  export function Link(props: any): any
  export function NavLink(props: any): any
  export function Navigate(props: any): any
  export function Outlet(): any
  export function Routes(props: any): any
  export function Route(props: any): any
  export function BrowserRouter(props: any): any
  export function useMatch(pattern: any): any
  export const createBrowserRouter: any
  export const RouterProvider: any
}

declare module 'react-router-dom' {
  export * from 'react-router'
}

declare module 'motion/react' {
  export const motion: any
  export const AnimatePresence: any
  export function useAnimation(): any
  export function useInView(ref: any, options?: any): any
}

declare module '@sentry/react' {
  export function init(options: any): void
  export function captureException(error: any, options?: any): string
  export function captureMessage(msg: string, options?: any): string
  export function setUser(user: any): void
  export function setTag(key: string, value: string): void
  export function setContext(name: string, ctx: any): void
  export function addBreadcrumb(breadcrumb: any): void
  export function withScope(fn: (scope: any) => void): void
  export const ErrorBoundary: any
  export const ReactRouterInstrumentation: any
  export type SeverityLevel = 'fatal' | 'error' | 'warning' | 'info' | 'debug'
  export interface Breadcrumb {
    type?: string
    category?: string
    message?: string
    timestamp?: number
    data?: Record<string, unknown>
    level?: SeverityLevel
  }
  export interface Span { spanId: string; traceId: string }
  export function browserTracingIntegration(): any
  export function replayIntegration(options?: Record<string, unknown>): any
  export function startSpan(options: any, callback?: (span: Span) => any): any
  export function close(): Promise<boolean>
}

declare module 'jszip' {
  export default class JSZip {
    static loadAsync(data: any, options?: any): Promise<JSZip>
    file(name: string, data?: any, options?: any): JSZip | null
    folder(name: string): JSZip
    forEach(callback: (relativePath: string, file: any) => void): void
    generateAsync(options?: any): Promise<any>
    files: Record<string, { dir: boolean; async(type: string): Promise<string> }>
  }
}

declare module 'file-saver' {
  export function saveAs(data: any, filename: string, options?: any): void
}

declare module 'lowlight' {
  export function createLowlight(options?: any): any
  export const common: any
}

declare module 'react-dnd' {
  export function useDrag(spec: any, deps?: any[]): any
  export function useDrop(spec: any, deps?: any[]): any
  export const DndProvider: any
}

declare module 'react-dnd-html5-backend' {
  export const HTML5Backend: any
}

declare module 'react-window' {
  export const FixedSizeList: any
  export const VariableSizeList: any
  export const FixedSizeGrid: any
}

declare module 'monaco-editor' {
  export const editor: any
  export const languages: any
  export const Uri: any
  export const Range: any
  export const Selection: any
  export const KeyCode: any
  export const KeyMod: any
  export function create(...args: any[]): any
}

declare module '@monaco-editor/react' {
  export default function MonacoEditor(props: any): any
  export const loader: any
  export function useMonaco(): any
  export type OnMount = (editor: any, monaco: any) => void
}

declare module '@codesandbox/sandpack-react' {
  export const SandpackProvider: any
  export const SandpackLayout: any
  export const SandpackCodeEditor: any
  export const SandpackPreview: any
  export const SandpackConsole: any
  export const SandpackThemeProvider: any
  export function useSandpack(): any
}

declare module '@tiptap/react' {
  export function useEditor(options: any): any
  export const EditorContent: any
}

declare module '@tiptap/starter-kit' {
  const StarterKit: { configure: (options?: Record<string, unknown>) => any }
  export default StarterKit
}

declare module '@tiptap/extension-placeholder' {
  const Placeholder: { configure: (options?: Record<string, unknown>) => any }
  export default Placeholder
}

declare module '@tiptap/extension-link' {
  const Link: { configure: (options?: Record<string, unknown>) => any }
  export default Link
}

declare module '@tiptap/extension-image' {
  const Image: { configure: (options?: Record<string, unknown>) => any }
  export default Image
}

declare module '@tiptap/extension-table' {
  export const Table: any
}

declare module '@tiptap/extension-table-row' {
  export const TableRow: any
}

declare module '@tiptap/extension-table-cell' {
  export const TableCell: any
}

declare module '@tiptap/extension-table-header' {
  export const TableHeader: any
}

declare module '@tiptap/extension-code-block-lowlight' {
  export const CodeBlockLowlight: any
}

declare module '*.png' {
  const value: string
  export default value
}

interface ImportMeta {
  env: Record<string, string>
}

declare module '*.svg' {
  const value: string
  export default value
}

declare module '*.css' {
  const value: string
  export default value
}
