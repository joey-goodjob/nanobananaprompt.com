"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchArticlesClient } from "@/lib/cms-client";
import type { ArticleListItem } from "@/types/cms";
import styles from "./page.module.css";
import { useLanguage } from "../_components/language-provider";
import ArticleList from "../_components/article-list";

type PromptNavigatorProps = {
  initialArticles: ArticleListItem[];
  categories: string[];
  pageSize: number;
  totalPages: number;
  initialPage: number;
};

const DEFAULT_CATEGORY = "全部";

export default function PromptNavigator({
  initialArticles,
  categories,
  pageSize,
  totalPages,
  initialPage,
}: PromptNavigatorProps) {
  const { language } = useLanguage();
  const [articles, setArticles] = useState<ArticleListItem[]>(initialArticles);
  const [page, setPage] = useState(initialPage);
  const [totalPageCount, setTotalPageCount] = useState(totalPages);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const normalizedCategories = [DEFAULT_CATEGORY, ...categories];

  const fetchPage = useCallback(
    async (targetPage: number, category: string | null, append = false) => {
      const params: Record<string, string | number | undefined> = {
        page: targetPage,
        limit: pageSize,
        locale: language.locale,
      };
      if (category) {
        params.category = category;
      }

      const response = await fetchArticlesClient(
        params.category
          ? {
              page: targetPage,
              limit: pageSize,
              category: params.category as string,
              locale: params.locale as string,
            }
          : { page: targetPage, limit: pageSize, locale: params.locale as string }
      );

      if (response) {
        setTotalPageCount(response.totalPages ?? response.page ?? targetPage);
        setPage(response.page);
        setError(null);
        setArticles((prev) =>
          append ? [...prev, ...response.items] : response.items
        );
      } else {
        setError("无法获取 Prompt 列表，请稍后再试。");
      }
    },
    [language.locale, pageSize]
  );

  useEffect(() => {
    let cancelled = false;

    async function refresh() {
      setLoading(true);
      try {
        await fetchPage(1, selectedCategory, false);
      } catch (err) {
        console.error("[PromptNavigator] refresh failed:", err);
        if (!cancelled) {
          setError("刷新失败，请稍后再试。");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    refresh();
    return () => {
      cancelled = true;
    };
  }, [fetchPage, selectedCategory]);

  const filteredArticles = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return articles;

    return articles.filter((article) => {
      const source = [
        article.title,
        article.description,
        article.excerpt,
        article.tags?.join(" "),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return source.includes(keyword);
    });
  }, [articles, search]);

  const hasMore = page < totalPageCount;

  const handleLoadMore = useCallback(async () => {
    if (!hasMore) return;
    setLoadingMore(true);
    try {
      await fetchPage(page + 1, selectedCategory, true);
    } catch (err) {
      console.error("[PromptNavigator] load more failed:", err);
      setError("展开更多失败，请稍后再试。");
    } finally {
      setLoadingMore(false);
    }
  }, [fetchPage, hasMore, page, selectedCategory]);

  const handleCategoryChange = (category: string) => {
    const normalized = category === DEFAULT_CATEGORY ? null : category;
    setSelectedCategory(normalized);
    setSearch("");
  };

  return (
    <section className={styles.navigator}>
      <div className={styles.searchRow}>
        <input
          className={styles.searchInput}
          placeholder="模糊搜索提示词、行业、变量..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <button
          type="button"
          className={styles.refreshButton}
          onClick={() => fetchPage(1, selectedCategory, false)}
          disabled={loading}
        >
          {loading ? "刷新中..." : "刷新"}
        </button>
      </div>

      <div className={styles.categoryBar}>
        {normalizedCategories.map((category) => {
          const isActive =
            (!selectedCategory && category === DEFAULT_CATEGORY) ||
            category === selectedCategory;
          return (
            <button
              key={category}
              type="button"
              className={
                isActive ? styles.categoryButtonActive : styles.categoryButton
              }
              onClick={() => handleCategoryChange(category)}
            >
              {category}
            </button>
          );
        })}
      </div>

      {error && <p className={styles.errorMessage}>{error}</p>}

      <ArticleList
        articles={filteredArticles}
        loading={loading && !articles.length}
        loadingMore={loadingMore}
        hasMore={hasMore}
        onLoadMore={handleLoadMore}
        placeholder={
          filteredArticles.length === 0
            ? "没有找到符合条件的提示词，换个关键词试试吧。"
            : null
        }
      />
    </section>
  );
}
