"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchArticlesClient } from "@/lib/cms-client";
import type { ArticleListItem } from "@/types/cms";
import styles from "./page.module.css";
import { useLanguage } from "../_components/language-provider";
import ArticleList from "../_components/article-list";

type Category = {
  name: string;
  slug: string;
};

type CategoryArticlesProps = {
  initialArticles: ArticleListItem[];
  categories: Category[];
  pageSize: number;
  totalPages: number;
  initialPage: number;
  categorySlug: string | null;
  categoryName: string;
};

const DEFAULT_CATEGORY = { name: "全部", slug: "prompts" };

export default function CategoryArticles({
  initialArticles,
  categories,
  pageSize,
  totalPages,
  initialPage,
  categorySlug,
  categoryName,
}: CategoryArticlesProps) {
  const router = useRouter();
  const { language } = useLanguage();
  const [articles, setArticles] = useState<ArticleListItem[]>(initialArticles);
  const [page, setPage] = useState(initialPage);
  const [totalPageCount, setTotalPageCount] = useState(totalPages);
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
        await fetchPage(1, categorySlug ? categoryName : null, false);
      } catch (err) {
        console.error("[CategoryArticles] refresh failed:", err);
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
  }, [fetchPage, categorySlug, categoryName]);

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
      await fetchPage(page + 1, categorySlug ? categoryName : null, true);
    } catch (err) {
      console.error("[CategoryArticles] load more failed:", err);
      setError("展开更多失败，请稍后再试。");
    } finally {
      setLoadingMore(false);
    }
  }, [fetchPage, hasMore, page, categorySlug, categoryName]);

  const handleCategoryChange = (category: Category) => {
    router.push(`/${category.slug}`);
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
          onClick={() => fetchPage(1, categorySlug ? categoryName : null, false)}
          disabled={loading}
        >
          {loading ? "刷新中..." : "刷新"}
        </button>
      </div>

      <div className={styles.categoryBar}>
        {normalizedCategories.map((category) => {
          const isActive =
            (!categorySlug && category.slug === "prompts") ||
            category.slug === categorySlug;
          return (
            <button
              key={category.slug}
              type="button"
              className={
                isActive ? styles.categoryButtonActive : styles.categoryButton
              }
              onClick={() => handleCategoryChange(category)}
            >
              {category.name}
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
