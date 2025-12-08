"use client";

import Link from "next/link";
import Image from "next/image";
import {
  formatArticleDate,
  getArticleDescription,
  readableTag,
} from "@/lib/article-utils";
import { extractFirstImageFromHtml, extractImageFromBlocks } from "@/lib/rich-text";
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

function extractFirstParagraph(html?: string) {
  if (!html) return undefined;
  const match = html.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
  const raw = match?.[1] ?? html;
  const text = raw.replace(/<[^>]+>/g, "").trim();
  return text || undefined;
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
              const fallbackImage =
                extractFirstImageFromHtml(article.htmlContent) ||
                extractImageFromBlocks(article.blocks);
              const cardImage = article.coverImage || fallbackImage;
              return (
                <article key={article.id} className={styles.articleCard}>
                  <Link href={`/posts/${article.slug}`}>
                    <div className={styles.cardHeader}>
                      <span className={styles.cardTag}>
                        {article.category || article.tags?.[0] || "Nanobanana"}
                      </span>
                      <time className={styles.cardDate}>
                        {formatArticleDate(article.publishedAt)}
                      </time>
                    </div>
                    <h3 className={styles.cardTitle}>{article.title}</h3>
                    <p className={styles.cardDescription}>
                      {getArticleDescription(article) ||
                        extractFirstParagraph(article.htmlContent) ||
                        "来自 Nanobanana CMS 的提示词"}
                    </p>
                    {cardImage && (
                      <Image
                        className={styles.cardImage}
                        src={cardImage}
                        alt={article.title}
                        width={400}
                        height={220}
                        sizes="(max-width: 600px) 100vw, 400px"
                        unoptimized
                      />
                    )}
                    <div className={styles.cardFooter}>
                      <div className={styles.tagGroup}>
                        {(article.tags || [])
                          .slice(0, 3)
                          .map((tag) => (
                            <span key={tag} className={styles.tagChip}>
                              {readableTag(tag)}
                            </span>
                          ))}
                      </div>
                      <span className={styles.readingTime}>
                        {article.readingTime || "3 min"}
                      </span>
                    </div>
                  </Link>
                </article>
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
