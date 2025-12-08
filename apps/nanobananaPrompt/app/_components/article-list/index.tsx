"use client";

import Link from "next/link";
import Image from "next/image";
import {
  extractFirstImageFromHtml,
  extractImageFromBlocks,
} from "@/lib/rich-text";
import type { ArticleListItem } from "@/types/cms";
import styles from "../../page.module.css";

export interface ArticleListProps {
  articles?: ArticleListItem[];
  loading?: boolean;
  loadingMore?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  placeholder?: string | null;
}

export default function ArticleList({
  articles,
  loading,
  loadingMore,
  hasMore,
  onLoadMore,
  placeholder,
}: ArticleListProps) {
  const items = articles ?? [];
  const hasArticles = items.length > 0;

  return (
    <section
      className={`${styles.articleSection} page-container`}
      id="article-list"
    >
      {(!hasArticles || loading) && (
        <div className={styles.loadingState}>
          <span className={styles.loadingDot} aria-hidden="true" />
          <p>{placeholder || "正在加载..."}</p>
        </div>
      )}

      {hasArticles && (
        <>
          <div className={styles.waterfallGrid}>
            {items.map((article) => {
              // 提取图片 URL（优先使用封面图，否则从内容中提取）
              const fallbackImage =
                extractFirstImageFromHtml(article.htmlContent) ||
                extractImageFromBlocks(article.blocks);
              const cardImage = article.coverImage || fallbackImage;

              // 如果没有图片，跳过这篇文章
              if (!cardImage) return null;

              return (
                <Link
                  key={article.id}
                  href={`/posts/${article.slug}`}
                  className={styles.imageCard}
                >
                  <Image
                    className={styles.cardImage}
                    src={cardImage}
                    alt={article.title || "提示词图片"}
                    width={400}
                    height={400}
                    sizes="(max-width: 640px) 100vw, (max-width: 960px) 50vw, 33vw"
                    unoptimized
                  />
                </Link>
              );
            })}
          </div>

          <div className={styles.loadMoreRow}>
            <button
              type="button"
              className={styles.loadMoreButton}
              onClick={onLoadMore}
              disabled={loadingMore || !hasMore}
            >
              {loadingMore ? "加载中..." : hasMore ? "展开更多" : "已经到底啦"}
            </button>
          </div>
        </>
      )}
    </section>
  );
}
