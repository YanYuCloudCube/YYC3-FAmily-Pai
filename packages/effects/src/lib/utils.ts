/**
 * cn - className utility (zero-dependency class merge)
 * Used across @yyc3/effects components for conditional class composition
 */
export function cn(...inputs: (string | undefined | null | false)[]): string {
  return inputs.filter(Boolean).join(' ')
}