/**
 * BlockRenderer - 通用 CMS Block 渲染器
 * 根据 blockType + blockName 自动匹配并渲染对应组件
 */

"use client";

import { Suspense } from "react";
import { blockRegistry } from "../registry/block-registry";
import type { BlockRendererProps, CMSBlock } from "../types";

/**
 * 默认降级组件 - 当找不到匹配组件时显示
 */
export function DefaultFallback({ block }: { block: CMSBlock }) {
  if (typeof block === "string") {
    return (
      <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <p className="text-sm text-gray-600 dark:text-gray-400">{block}</p>
      </div>
    );
  }

  return (
    <div className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
      <div className="text-sm text-gray-500 dark:text-gray-400">
        <p className="font-semibold mb-2">⚠️ 未找到匹配的组件</p>
        {block.blockType && (
          <p>
            <strong>blockType:</strong> {block.blockType}
          </p>
        )}
        {block.blockName && (
          <p>
            <strong>blockName:</strong> {block.blockName}
          </p>
        )}
        <details className="mt-2">
          <summary className="cursor-pointer hover:text-gray-700 dark:hover:text-gray-300">
            查看完整数据
          </summary>
          <pre className="mt-2 text-xs overflow-auto max-h-40 bg-gray-50 dark:bg-gray-900 p-2 rounded">
            {JSON.stringify(block, null, 2)}
          </pre>
        </details>
      </div>
    </div>
  );
}

/**
 * Suspense 降级组件
 */
function SuspenseFallback() {
  return (
    <div className="p-8 flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100" />
    </div>
  );
}

/**
 * 单个 Block 渲染器
 */
function SingleBlockRenderer({
  block,
  index,
  fallback: FallbackComponent = DefaultFallback,
  onBlockError,
}: {
  block: CMSBlock;
  index: number;
  fallback?: React.ComponentType<{ block: CMSBlock }>;
  onBlockError?: (error: Error, block: CMSBlock, index: number) => void;
}) {
  try {
    // 从注册表解析组件
    const Component = blockRegistry.resolve(block);

    if (!Component) {
      return <FallbackComponent block={block} />;
    }

    // 渲染组件
    // 将 block 对象展开传递给组件，同时也保留 block 属性
    return <Component {...block} block={block} index={index} />;
  } catch (error) {
    // 错误处理
    if (onBlockError) {
      onBlockError(error as Error, block, index);
    }

    console.error(`[BlockRenderer] Error rendering block at index ${index}:`, error, block);

    return <FallbackComponent block={block} />;
  }
}

/**
 * BlockRenderer - 主渲染器组件
 *
 * @example
 * ```tsx
 * <BlockRenderer
 *   blocks={article.blocks}
 *   fallback={CustomFallback}
 *   onBlockError={(error, block, index) => {
 *     console.error(`Block ${index} error:`, error);
 *   }}
 *   className="space-y-8"
 * />
 * ```
 */
export function BlockRenderer({
  blocks,
  fallback,
  onBlockError,
  className = "space-y-8",
  wrapperClassName,
}: BlockRendererProps) {
  if (!blocks || blocks.length === 0) {
    return null;
  }

  return (
    <div className={wrapperClassName}>
      {blocks.map((block, index) => (
        <Suspense key={`block-${index}`} fallback={<SuspenseFallback />}>
          <div className={className}>
            <SingleBlockRenderer
              block={block}
              index={index}
              fallback={fallback}
              onBlockError={onBlockError}
            />
          </div>
        </Suspense>
      ))}
    </div>
  );
}

/**
 * 简化版渲染器 - 不带 Suspense 包裹
 * 适用于已经加载完成的组件
 */
export function BlockRendererSimple({
  blocks,
  fallback = DefaultFallback,
  onBlockError,
  className,
}: BlockRendererProps) {
  if (!blocks || blocks.length === 0) {
    return null;
  }

  return (
    <>
      {blocks.map((block, index) => (
        <div key={`block-${index}`} className={className}>
          <SingleBlockRenderer
            block={block}
            index={index}
            fallback={fallback}
            onBlockError={onBlockError}
          />
        </div>
      ))}
    </>
  );
}
