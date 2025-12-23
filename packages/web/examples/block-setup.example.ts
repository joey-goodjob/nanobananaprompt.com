/**
 * Block Registry 初始化示例
 * 在 nanobananaPrompt 项目中使用 @repo/web 的完整示例
 *
 * 使用位置: apps/nanobananaPrompt/lib/block-setup.ts
 */

"use client";

// 如果需要自定义组件，可以导入
// import { MyCustomHero } from "@/components/blocks/custom-hero";

/**
 * 初始化 Block Registry
 * 在应用启动时调用一次
 */
export function setupBlockRegistry() {
  // ==================== 可选：注册自定义组件 ====================
  // 示例：覆盖默认的 hero 组件
  // blockRegistry.register("hero:custom", MyCustomHero);
  // 示例：添加新的组件变体
  // blockRegistry.register("features:pricing", MyPricingFeatures);
}

/**
 * 在需要的地方调用 setupBlockRegistry
 * 建议在 RootLayout 的 useEffect 中调用
 *
 * @example
 * ```tsx
 * // apps/nanobananaPrompt/app/layout.tsx
 * "use client";
 *
 * import { useEffect } from "react";
 * import { initializeBlockRegistry } from "@repo/web";
 * import { setupBlockRegistry } from "@/lib/block-setup";
 *
 * export default function RootLayout({ children }) {
 *   useEffect(() => {
 *     // 1. 初始化核心注册表
 *     initializeBlockRegistry();
 *
 *     // 2. 设置项目特定配置
 *     setupBlockRegistry();
 *   }, []);
 *
 *   return <html><body>{children}</body></html>;
 * }
 * ```
 */
