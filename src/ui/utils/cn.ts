import { clsx, type ClassValue } from 'clsx';

/**
 * クラス名を結合するユーティリティ関数
 * Tailwind CSSのクラスをマージする際に使用
 *
 * @example
 * cn('text-red-500', isActive && 'bg-blue-500')
 * // => 'text-red-500 bg-blue-500' (if isActive is true)
 */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}
