/**
 * ScadaEditor 公共 Hooks 入口
 *
 * 为避免循环依赖导致的打包警告，核心状态 Hook（useScadaEditor 及其派生）
 * 请直接从 `./useScadaEditor` 导入；此文件仅聚合无循环依赖的 Hooks。
 */
export { useScadaCanvas } from './useScadaCanvas'
export { useScadaBinding, useScadaPolling } from './useScadaBinding'
export { useScadaNavigationGuard } from './useScadaNavigationGuard'
