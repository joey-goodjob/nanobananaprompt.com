"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import ArticleList, {
  type ArticleListProps,
} from "@/app/_components/article-list";
import { fetchArticlesClient } from "@/lib/cms-client";
import { useLanguage } from "../language-provider";

type ArticleSectionProps = ArticleListProps & {
  initialPage: number;
  totalPages: number;
  pageSize: number;
};

export default function ArticleSection({
  articles: initialArticles,
  initialPage,
  totalPages,
  pageSize,
}: ArticleSectionProps) {
  const { language } = useLanguage();
  const [articles, setArticles] = useState(initialArticles);
  const [page, setPage] = useState(initialPage);
  const [totalPageCount, setTotalPageCount] = useState(totalPages);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasMore = page < totalPageCount;

  const mergeArticles = useCallback((nextItems: ArticleListProps["articles"]) => {
    setArticles((prev) => {
      const existingIds = new Set(prev.map((item) => item.id));
      const appended = nextItems.filter((item) => !existingIds.has(item.id));
      return appended.length ? [...prev, ...appended] : prev;
    });
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function refreshArticles() {
      setLoading(true);
      try {
        const response = await fetchArticlesClient({
          limit: pageSize,
          page: 1,
          locale: language.locale,
        });
        if (!cancelled && response) {
          setArticles(response.items);
          setPage(response.page);
          setTotalPageCount(response.totalPages ?? response.page ?? 1);
          setError(null);
        } else if (!response) {
          setError("无法连接 CMS，请稍后重试。");
        }
      } catch (err) {
        console.error("[ArticleSection] refresh failed", err);
        if (!cancelled) {
          setError("网络异常，暂时无法获取 Nanobanana 文章。");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    refreshArticles();
    return () => {
      cancelled = true;
    };
  }, [language.locale, pageSize]);

  const handleLoadMore = useCallback(async () => {
    if (!hasMore) return;
    setLoadingMore(true);
    try {
      const response = await fetchArticlesClient({
        limit: pageSize,
        page: page + 1,
        locale: language.locale,
      });
      if (response) {
        mergeArticles(response.items);
        setPage(response.page);
        setTotalPageCount(response.totalPages ?? response.page ?? page + 1);
        setError(null);
      } else {
        setError("CMS 暂时没有返回新的文章。");
      }
    } catch (err) {
      console.error("[ArticleSection] Load more failed:", err);
      setError("展开更多失败，请稍后再试。");
    } finally {
      setLoadingMore(false);
    }
  }, [hasMore, language.locale, mergeArticles, page, pageSize]);

  const placeholderMessage = useMemo(() => {
    if (loading) return "正在刷新 Nanobanana 提示词...";
    if (error) return error;
    return "暂时还没有来自 CMS 的文章，先写一篇吧。";
  }, [loading, error]);

  return (
    <ArticleList
      articles={articles}
      loading={loading}
      loadingMore={loadingMore}
      hasMore={hasMore}
      onLoadMore={handleLoadMore}
      placeholder={placeholderMessage}
    />
  );
}
