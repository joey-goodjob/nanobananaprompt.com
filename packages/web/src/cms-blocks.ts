/**
 * @repo/web - CMS Block System
 * 统一导出入口
 *
 * 提供完整的 CMS Block 渲染系统，支持：
 * - blockType + blockName 组合匹配
 * - 懒加载组件
 * - 通用渲染器
 * - 类型安全
 */

// ==================== 核心系统 ====================
export { blockRegistry, BlockRegistry } from "./registry/block-registry";
export {
  BlockRenderer,
  BlockRendererSimple,
  DefaultFallback,
} from "./render/BlockRenderer";

// ==================== 组件注册表 ====================
export {
  getComponent,
  registerComponent,
  registerComponents,
  getRegisteredKeys,
  hasComponent,
  getComponentRegistry,
  componentRegistry,
} from "./blocks/ComponentRegistry";

// ==================== 工具函数 ====================
export { cn } from "./lib/utils/utils";

// ==================== 类型定义 ====================
export type {
  CMSBlock,
  ComponentType,
  BaseBlockProps,
  FeaturesCardsBlockProps,
  HeroBlockProps,
  FAQBlockProps,
  TestimonialsBlockProps,
  StepBlockProps,
  CTABlockProps,
  ContactBlockProps,
  BlockComponent,
  BlockKey,
  ComponentRegistry,
  BlockRendererProps,
  BlockRenderOptions,
  BlockMatchResult,
} from "./types";

// ==================== 工具函数 ====================

/**
 * 初始化 Block Registry
 * 将 ComponentRegistry 中的所有组件注册到 blockRegistry
 *
 * @example
 * ```tsx
 * // 在应用入口或 layout 中调用
 * import { initializeBlockRegistry } from "@repo/web";
 *
 * initializeBlockRegistry();
 * ```
 */
export function initializeBlockRegistry(): void {
  const { blockRegistry } = require("./registry/block-registry");
  const { getComponentRegistry } = require("./blocks/ComponentRegistry");

  const registry = getComponentRegistry();
  blockRegistry.registerMany(registry);
}

/**
 * 打印注册表状态
 */
export function printBlockRegistry(): void {
  const { blockRegistry } = require("./registry/block-registry");
  blockRegistry.printRegistry();
}
