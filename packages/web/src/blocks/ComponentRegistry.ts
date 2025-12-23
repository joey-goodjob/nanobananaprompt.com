/**
 * 组件注册表
 * 负责维护 blockType:blockName → React组件 的映射关系
 *
 * 新架构说明：
 * - 使用 blockRegistry 进行统一管理
 * - 支持 blockType + blockName 组合匹配
 * - 使用 lazy 实现按需加载
 *
 * 📋 映射规则示例：
 * - "features:cards" → features/01.tsx
 * - "features:grid" → features/02.tsx
 * - "features" → 通用 features 组件（类型级匹配）
 * - "*" → 降级组件
 */

import { lazy, ComponentType as ReactComponentType } from "react";

/**
 * 组件注册表类型
 */
type ComponentRegistry = Record<
  string,
  ReactComponentType<any> | ReturnType<typeof lazy>
>;

/**
 * 组件注册表
 * 使用 blockType:blockName 的格式进行注册
 *
 * 格式规范：
 * - "blockType:blockName" - 精确匹配
 * - "blockType" - 类型匹配
 * - "*" - 降级组件
 */
const componentRegistry: ComponentRegistry = {
  // ==================== Hero 组件 ====================
  "hero:01": lazy(() => import("./hero/01")),
  hero: lazy(() => import("./hero/01")), // 类型级降级

  // ==================== Feature 组件 ====================
  "features:cards": lazy(() => import("./features/01")),
  "features:grid": lazy(() => import("./features/02")),
  "features:why-choose": lazy(() => import("./features/03")),
  features: lazy(() => import("./features/01")), // 类型级降级
  // CMS 单数形式支持
  "feature:01": lazy(() => import("./features/01")),
  feature: lazy(() => import("./features/01")),

  // ==================== FAQ 组件 ====================
  "faq:accordion": lazy(() => import("./faq/02")),
  "faq:simple": lazy(() => import("./faq/03")),
  "faq:minimal": lazy(() => import("./faq/03")),
  faq: lazy(() => import("./faq/02")), // 类型级降级
  // CMS 数字形式支持
  "faq:01": lazy(() => import("./faq/01")),

  // ==================== Testimonial 组件 ====================
  "testimonials:marquee": lazy(() => import("./testimonials/01")),
  testimonials: lazy(() => import("./testimonials/01")), // 类型级降级
  // CMS 单数形式支持
  "testimonial:01": lazy(() => import("./testimonials/01")),
  testimonial: lazy(() => import("./testimonials/01")),

  // ==================== Step 组件 ====================
  "step:how-it-works": lazy(() => import("./step/01")),
  "step:how-it-works-v2": lazy(() => import("./step/02")),
  step: lazy(() => import("./step/01")), // 类型级降级
  // CMS 数字形式支持
  "step:01": lazy(() => import("./step/01")),
  "step:02": lazy(() => import("./step/02")),

  // ==================== Call to Action 组件 ====================
  "cta:default": lazy(() => import("./call-to-action/01")),
  cta: lazy(() => import("./call-to-action/01")), // 类型级降级
  // CMS 完整形式支持
  "call-to-action:01": lazy(() => import("./call-to-action/01")),
  "call-to-action": lazy(() => import("./call-to-action/01")),

  // ==================== Contact 组件 ====================
  "contact:default": lazy(() => import("./contact/index")),
  contact: lazy(() => import("./contact/index")), // 类型级降级

  // ==================== Tool 工具组件 (如果存在) ====================
  // "tool:text-to-image": lazy(() => import("../tool/TextToImage")),
  // "tool:image-edit": lazy(() => import("../tool/ImageEdit")),
  // "tool:image-to-image": lazy(() => import("../tool/ImageToImage")),
  // "tool:image-to-upscale": lazy(() => import("../tool/ImageToUpscale")),
  // "tool:midjourney-studio": lazy(() => import("../tool/MidjourneyStudio")),
  // "tool:video-edit": lazy(() => import("../tool/VideoEdit")),
  // "tool:video-transform": lazy(() => import("../tool/VideoTransform")),
};

/**
 * 获取组件
 * @param key - 组件键 (blockType 或 blockType:blockName)
 * @returns React组件 | null
 */
export function getComponent(
  key: string
): ReactComponentType<any> | ReturnType<typeof lazy> | null {
  const component = componentRegistry[key];

  if (!component) {
    console.warn(`[ComponentRegistry] Unknown component key: ${key}`);
    return null;
  }

  return component;
}

/**
 * 注册新组件（用于动态扩展）
 * @param key - 组件键 (blockType 或 blockType:blockName)
 * @param component - React组件
 */
export function registerComponent(
  key: string,
  component: ReactComponentType<any>
): void {
  if (componentRegistry[key]) {
    console.warn(
      `[ComponentRegistry] Component "${key}" already exists, overwriting...`
    );
  }

  componentRegistry[key] = component;
}

/**
 * 批量注册组件
 * @param components - 组件映射对象
 */
export function registerComponents(
  components: Record<string, ReactComponentType<any>>
): void {
  Object.entries(components).forEach(([key, component]) => {
    registerComponent(key, component);
  });
}

/**
 * 获取所有已注册的组件键
 * @returns 组件键数组
 */
export function getRegisteredKeys(): string[] {
  return Object.keys(componentRegistry);
}

/**
 * 检查组件是否已注册
 * @param key - 组件键
 * @returns boolean
 */
export function hasComponent(key: string): boolean {
  return key in componentRegistry;
}

/**
 * 获取完整的组件注册表（用于初始化 blockRegistry）
 * @returns 组件注册表
 */
export function getComponentRegistry(): ComponentRegistry {
  return componentRegistry;
}

// 导出组件注册表供外部使用
export { componentRegistry };
