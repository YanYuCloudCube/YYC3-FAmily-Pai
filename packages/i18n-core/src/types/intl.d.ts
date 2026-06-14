/**
 * file intl.d.ts
 * description Intl API 类型补丁 — 为不支持 ES2022.Intl lib 的旧版 TS Server 提供 getCanonicalLocales 类型
 * module @yyc3/i18n-core
 * author YanYuCloudCube Team <admin@0379.email>
 * version 2.4.0
 * created 2026-06-09
 * updated 2026-06-09
 * status active
 * tags [types, polyfill]
 *
 * copyright YanYuCloudCube Team
 * license MIT
 */

declare namespace Intl {
  /**
   * Returns an array containing the canonical locale names.
   * Duplicates will be omitted and elements will be validated as
   * structurally valid language tags.
   * @see https://tc39.es/ecma402/#sec-intl.getcanonicallocales
   */
  function getCanonicalLocales(locales?: string | readonly string[]): string[];
}