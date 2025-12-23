/**
 * Block Registry - 组件注册表核心
 * 负责维护 blockType + blockName → React 组件的映射关系
 *
 * 匹配优先级：
 * 1. blockType:blockName (精确匹配)
 * 2. blockType (类型匹配)
 * 3. * (降级组件)
 */

import type {
  BlockComponent,
  BlockKey,
  CMSBlock,
  BlockMatchResult,
} from "../types";

class BlockRegistry {
  private registry = new Map<BlockKey, BlockComponent>();
  private debug = false;

  /**
   * 启用/禁用调试模式
   */
  setDebug(enabled: boolean): void {
    this.debug = enabled;
  }

  /**
   * 注册单个组件
   * @param key - 格式: "hero" | "features:cards" | "faq:accordion" | "*"
   * @param component - React 组件
   */
  register(key: BlockKey, component: BlockComponent): void {
    this.registry.set(key, component);
  }

  /**
   * 批量注册组件
   * @param entries - 组件映射对象
   */
  registerMany(entries: Record<BlockKey, BlockComponent>): void {
    Object.entries(entries).forEach(([key, component]) => {
      this.register(key, component);
    });
  }

  /**
   * 根据 block 解析匹配的组件
   * @param block - CMS Block 数据
   * @returns 匹配的组件 | null
   */
  resolve(block: CMSBlock): BlockComponent | null {
    const result = this.match(block);
    return result.component;
  }

  /**
   * 完整的匹配逻辑（带匹配详情）
   * @param block - CMS Block 数据
   * @returns 匹配结果
   */
  match(block: CMSBlock): BlockMatchResult {
    // 字符串 block 只能匹配降级组件
    if (typeof block === "string") {
      const fallback = this.registry.get("*");
      if (fallback) {
        return {
          component: fallback,
          matchType: "fallback",
          matchKey: "*",
        };
      }
      return { component: null, matchType: "none" };
    }

    const { blockType, blockName } = block;

    // 优先级 1: 精确匹配 "blockType:blockName"
    if (blockType && blockName) {
      const exactKey = `${blockType}:${blockName}`;
      const exact = this.registry.get(exactKey);

      if (exact) {
        return {
          component: exact,
          matchType: "exact",
          matchKey: exactKey,
        };
      }
    }

    // 优先级 2: 类型匹配 "blockType"
    if (blockType) {
      const typeMatch = this.registry.get(blockType);

      if (typeMatch) {
        return {
          component: typeMatch,
          matchType: "type",
          matchKey: blockType,
        };
      }
    }

    // 优先级 3: 降级组件 "*"
    const fallback = this.registry.get("*");
    if (fallback) {
      return {
        component: fallback,
        matchType: "fallback",
        matchKey: "*",
      };
    }

    return { component: null, matchType: "none" };
  }

  /**
   * 检查组件是否已注册
   * @param key - 组件键
   * @returns boolean
   */
  has(key: BlockKey): boolean {
    return this.registry.has(key);
  }

  /**
   * 获取所有已注册的键
   * @returns 键数组
   */
  keys(): string[] {
    return Array.from(this.registry.keys());
  }

  /**
   * 获取注册表大小
   * @returns 已注册组件数量
   */
  size(): number {
    return this.registry.size;
  }

  /**
   * 清空注册表
   */
  clear(): void {
    this.registry.clear();
  }

  /**
   * 取消注册组件
   * @param key - 组件键
   * @returns 是否成功删除
   */
  unregister(key: BlockKey): boolean {
    const result = this.registry.delete(key);

    return result;
  }
}

// 导出单例实例
export const blockRegistry = new BlockRegistry();

// 导出类供自定义实例
export { BlockRegistry };
