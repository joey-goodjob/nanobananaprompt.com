/**
 * 统一的 CMS 页面渲染器
 * 支持 Post 和 Landing Page 两种类型
 */

"use client";

import Link from "next/link";
import type { Article } from "@/types/cms";
import { formatArticleDate } from "@/lib/article-utils";
import styles from "./page-renderer.module.css";

// 导入 @repo/web 的 BlockRenderer
import {
  BlockRenderer,
  initializeBlockRegistry,
  blockRegistry,
} from "@repo/web";

// ==================== 初始化 Block Registry ====================
// 在模块顶层初始化，确保服务端和客户端都执行
let registryInitialized = false;

function ensureBlockRegistryInitialized() {
  if (registryInitialized) return;

  initializeBlockRegistry();

  // 注册自定义映射：你的 CMS 使用 feature:01，需要映射到现有的组件
  // 直接复用 features:cards 的组件
  const featuresCardsComponent = blockRegistry.resolve({
    blockType: "features",
    blockName: "cards",
  } as any);
  if (featuresCardsComponent) {
    blockRegistry.register("feature:01", featuresCardsComponent);
  }

  // 也可以将 feature 类型映射到 features
  const featuresComponent = blockRegistry.resolve({
    blockType: "features",
  } as any);
  if (featuresComponent) {
    blockRegistry.register("feature", featuresComponent);
  }

  // 启用调试模式
  if (process.env.NODE_ENV === "development") {
    blockRegistry.setDebug(true);
  }

  registryInitialized = true;
}

// 立即初始化
ensureBlockRegistryInitialized();

export type PageType = "post" | "landing-page";

type PageRendererProps = {
  page: Article;
  pageType: PageType;
  showMeta?: boolean; // 是否显示元数据(发布时间等)
  showBreadcrumb?: boolean; // 是否显示面包屑
  showHeader?: boolean; // 是否显示标题和描述
  className?: string;
};

/**
 * 统一的页面渲染器
 * 根据页面类型自动调整布局和样式
 */
export default function PageRenderer({
  page,
  pageType,
  showMeta = true,
  showBreadcrumb = true,
  showHeader = true,
  className = "",
}: PageRendererProps) {

  if (!page) {
    return (
      <main className={styles.page}>
        <div className={styles.errorBanner}>
          页面未找到，<Link href="/">返回主页</Link>
        </div>
      </main>
    );
  }

  // 根据页面类型设置不同的样式
  const pageClassName = `${styles.page} ${
    pageType === "landing-page" ? styles.landingPage : styles.postPage
  } ${className}`;

  // 返回链接
  const backLink =
    pageType === "post" ? "/" : pageType === "landing-page" ? "/" : "/";

  return (
    <main className={pageClassName}>
      {/* 面包屑导航 */}
      {showBreadcrumb && (
        <div className={styles.breadcrumbs}>
          <Link href="/">首页</Link>
          <span aria-hidden="true">/</span>
          {pageType === "post" && <span>文章</span>}
          {pageType === "landing-page" && <span>页面</span>}
          <span aria-hidden="true">/</span>
          <span>{page.title}</span>
        </div>
      )}

      <article className={styles.article}>
        {/* Post 类型显示分类和元数据 */}
        {showHeader && pageType === "post" && showMeta && (
          <>
            {page.category && (
              <p className={styles.category}>{page.category}</p>
            )}
          </>
        )}

        {/* 标题 */}
        {showHeader && <h1 className={styles.title}>{page.title}</h1>}

        {/* 描述/摘要 */}
        {showHeader && (page.description || page.excerpt) && (
          <p className={styles.description}>
            {page.description || page.excerpt}
          </p>
        )}

        {/* Post 类型显示元数据栏 */}
        {showHeader && pageType === "post" && showMeta && (
          <div className={styles.metaBar}>
            {page.publishedAt && (
              <time dateTime={page.publishedAt}>
                发布：{formatArticleDate(page.publishedAt, "long")}
              </time>
            )}
            {page.updatedAt && (
              <span>更新：{formatArticleDate(page.updatedAt, "long")}</span>
            )}
            {page.tags?.length ? (
              <span>标签：{page.tags.join(" / ")}</span>
            ) : null}
          </div>
        )}

        {/* 封面图 */}
        {page.coverImage && (
          <div
            className={styles.heroImage}
            style={{ backgroundImage: `url(${page.coverImage})` }}
            aria-label="页面封面"
          />
        )}

        {/* ==================== 核心：使用 BlockRenderer 渲染 ==================== */}
        <div className={styles.content}>
          {page.blocks && page.blocks.length > 0 ? (
            <BlockRenderer
              blocks={page.blocks.map((block) => {
                // 将 componentName 转换为 blockName（适配 blockRegistry 的匹配逻辑）
                if (
                  typeof block === "object" &&
                  "componentName" in block &&
                  !("blockName" in block)
                ) {
                  return { ...block, blockName: block.componentName };
                }
                return block;
              })}
            />
          ) : page.htmlContent ? (
            // 降级到 HTML 内容
            <div
              className={styles.richText}
              dangerouslySetInnerHTML={{ __html: page.htmlContent }}
            />
          ) : page.description || page.excerpt ? (
            // 最终降级到纯文本
            <p>{page.description || page.excerpt}</p>
          ) : null}
        </div>

        {/* Post 类型显示侧边栏 */}
        {pageType === "post" && (
          <aside className={styles.sidebar}>
            <div>
              <h4>实用建议</h4>
              <p>
                这篇文章通过 CMS 管理，内容会实时同步。使用 BlockRenderer
                自动渲染不同类型的内容块。
              </p>
            </div>
          </aside>
        )}
      </article>

      {/* 返回链接 */}
      <div className={styles.backLink}>
        <Link href={backLink}>
          ← 返回{pageType === "post" ? "文章列表" : "主页"}
        </Link>
      </div>
    </main>
  );
}
