/**
 * CMS Block 系统类型定义
 * 提供统一的类型约束，支持跨项目复用
 */

import { ComponentType as ReactComponentType, ReactNode } from "react";

// ==================== 基础类型 ====================

/**
 * CMS Block 基础类型
 * 支持字符串或结构化对象
 */
export type CMSBlock =
  | string
  | {
      id?: string;
      blockType?: string;
      blockName?: string;
      [key: string]: unknown;
    };

/**
 * 组件类型标识符
 * 用于 ComponentRegistry 的键
 */
export type ComponentType = string;

// ==================== Block Props 类型 ====================

/**
 * 所有 Block 组件的基础 Props
 */
export interface BaseBlockProps {
  block?: CMSBlock;
  index?: number;
  className?: string;
}

/**
 * Features Cards Block Props
 */
export interface FeaturesCardsBlockProps extends BaseBlockProps {
  title?: string;
  subtitle?: string;
  description?: string;
  theme?: "dark" | "light";
  features?: Array<{
    title: string;
    description: string;
    iconType?: string;
  }>;
}

/**
 * Hero Block Props
 */
export interface HeroBlockProps extends BaseBlockProps {
  title?: string;
  subtitle?: string;
  cta?: string;
  images?: Array<{
    id: number;
    src: string;
    alt: string;
  }>;
  onGetStarted?: () => void;
}

/**
 * FAQ Block Props
 */
export interface FAQBlockProps extends BaseBlockProps {
  title?: string;
  subtitle?: string;
  items?: Array<{
    question: string;
    answer: string;
  }>;
}

/**
 * Testimonials Block Props
 */
export interface TestimonialsBlockProps extends BaseBlockProps {
  title?: string;
  subtitle?: string;
  testimonials?: Array<{
    name: string;
    role?: string;
    avatar?: string;
    content: string;
    rating?: number;
  }>;
}

/**
 * Step Block Props
 */
export interface StepBlockProps extends BaseBlockProps {
  title?: string;
  subtitle?: string;
  steps?: Array<{
    title: string;
    description: string;
    icon?: string;
  }>;
}

/**
 * Call to Action Block Props
 */
export interface CTABlockProps extends BaseBlockProps {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  buttonLink?: string;
  onAction?: () => void;
}

/**
 * Contact Block Props
 */
export interface ContactBlockProps extends BaseBlockProps {
  title?: string;
  subtitle?: string;
  email?: string;
  phone?: string;
  address?: string;
}

// ==================== Registry 类型 ====================

/**
 * Block 组件类型
 * 所有 Block 组件必须符合此签名
 */
export type BlockComponent = ReactComponentType<BaseBlockProps>;

/**
 * Block 注册表键类型
 * 格式: "blockType" | "blockType:blockName" | "*"
 */
export type BlockKey = string;

/**
 * 组件注册表映射类型
 */
export type ComponentRegistry = Record<BlockKey, BlockComponent | ReturnType<typeof import("react").lazy>>;

// ==================== Renderer 类型 ====================

/**
 * Block 渲染器 Props
 */
export interface BlockRendererProps {
  blocks: CMSBlock[];
  fallback?: ReactComponentType<{ block: CMSBlock }>;
  onBlockError?: (error: Error, block: CMSBlock, index: number) => void;
  className?: string;
  wrapperClassName?: string;
}

/**
 * Block 渲染选项
 */
export interface BlockRenderOptions {
  strict?: boolean; // 严格模式：没找到组件时抛出错误
  debug?: boolean; // 调试模式：输出详细日志
  suspenseFallback?: ReactNode; // Suspense 降级内容
}

// ==================== 工具类型 ====================

/**
 * 从 Block 中提取特定字段的工具类型
 */
export type ExtractBlockField<T extends CMSBlock, K extends string> = T extends { [key in K]: infer V }
  ? V
  : undefined;

/**
 * Block 匹配结果
 */
export interface BlockMatchResult {
  component: BlockComponent | null;
  matchType: "exact" | "type" | "fallback" | "none";
  matchKey?: string;
}

// ==================== 导出所有类型 ====================

export type {
  // 从其他地方导入的类型可以在这里重新导出
};
