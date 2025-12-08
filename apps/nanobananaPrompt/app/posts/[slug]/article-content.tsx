"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchPostClient } from "@/lib/cms-client";
import { formatArticleDate } from "@/lib/article-utils";
import type { Article, ArticleBlock } from "@/types/cms";
import styles from "./page.module.css";
import { useLanguage } from "../../_components/language-provider";
import parse, {
  type Element,
  type HTMLReactParserOptions,
} from "html-react-parser";
import { normalizeImageSrc } from "@/lib/rich-text";

type ArticleContentProps = {
  slug: string;
  initialArticle: Article;
};

function blockHeading(block: ArticleBlock) {
  if (typeof block === "string") return undefined;
  return (
    (typeof block.heading === "string" && block.heading) ||
    (typeof block.subheading === "string" && block.subheading) ||
    (typeof block.blockName === "string" && block.blockName) ||
    (typeof block.title === "string" && block.title)
  );
}

function gatherTextChunks(value: unknown): string[] {
  if (!value) return [];

  if (typeof value === "string") {
    return [value];
  }

  if (Array.isArray(value)) {
    return value.flatMap((entry) => gatherTextChunks(entry));
  }

  if (typeof value === "object") {
    const data = value as Record<string, unknown>;

    if (typeof data.html === "string") {
      return [data.html];
    }

    if (typeof data.text === "string") {
      return [data.text];
    }

    if (typeof data.content === "string") {
      return [data.content];
    }

    if (Array.isArray(data.children)) {
      return gatherTextChunks(data.children);
    }

    if (data.root) {
      return gatherTextChunks(data.root);
    }

    if (data.value) {
      return gatherTextChunks(data.value);
    }
  }

  return [];
}

function blockParagraphs(block: ArticleBlock): string[] {
  if (typeof block === "string") {
    return [block];
  }

  const keys: Array<keyof typeof block> = [
    "content",
    "text",
    "body",
    "html",
    "richText",
  ];

  const paragraphs = keys.flatMap((key) => gatherTextChunks(block[key]));

  return Array.from(
    new Set(paragraphs.map((text) => text.trim()).filter(Boolean))
  );
}

function blockImage(block: ArticleBlock) {
  if (typeof block === "string") return undefined;

  const candidates = [
    block.coverImage,
    block.image,
    block.media,
    block.asset,
    block.heroImage,
  ];

  for (const candidate of candidates) {
    if (!candidate) continue;
    if (typeof candidate === "string") {
      return candidate;
    }

    if (
      candidate &&
      typeof candidate === "object" &&
      typeof (candidate as Record<string, unknown>).url === "string"
    ) {
      return (candidate as Record<string, string>).url;
    }
  }

  if (
    typeof block.blockType === "string" &&
    block.blockType.toLowerCase().includes("image") &&
    typeof (block as Record<string, unknown>).url === "string"
  ) {
    return (block as Record<string, string>).url;
  }

  return undefined;
}

const richTextParserOptions: HTMLReactParserOptions = {
  replace(domNode) {
    if (domNode.type !== "tag" || domNode.name !== "img") {
      return undefined;
    }

    const element = domNode as Element;
    const attribs = element.attribs ?? {};
    const normalizedSrc =
      normalizeImageSrc(attribs.src) || normalizeImageSrc(attribs["data-src"]);

    if (!normalizedSrc) {
      return null;
    }

    attribs.src = normalizedSrc;
    attribs.alt = attribs.alt || "文章插图";
    attribs.loading = attribs.loading || "lazy";
    attribs.decoding = attribs.decoding || "async";
    attribs.style = attribs.style
      ? `${attribs.style};max-width:100%;height:auto;`
      : "max-width:100%;height:auto;";

    element.attribs = attribs;

    return undefined;
  },
};

function renderBlock(block: ArticleBlock, index: number) {
  const heading = blockHeading(block);
  const paragraphs = blockParagraphs(block);
  const image = blockImage(block);

  if (!heading && !paragraphs.length && !image) {
    return null;
  }

  return (
    <section key={`block-${index}`} className={styles.contentBlock}>
      {heading && <h3>{heading}</h3>}
      {image && (
        <div
          className={styles.blockImage}
          style={{ backgroundImage: `url(${image})` }}
          aria-label={heading || "文章插图"}
        />
      )}
      {paragraphs.map((text, idx) =>
        /<\w+/.test(text) ? (
          <div key={`block-${index}-p-${idx}`} className={styles.richText}>
            {parse(text, richTextParserOptions)}
          </div>
        ) : (
          <p key={`block-${index}-p-${idx}`}>{text}</p>
        )
      )}
    </section>
  );
}

export default function ArticleContent({
  slug,
  initialArticle,
}: ArticleContentProps) {
  const { language } = useLanguage();
  const [article, setArticle] = useState(initialArticle);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setArticle(initialArticle);
  }, [initialArticle]);

  useEffect(() => {
    let cancelled = false;

    async function refreshArticle() {
      setLoading(true);
      try {
        const latest = await fetchPostClient(slug, language.locale);
        if (!cancelled) {
          if (latest) {
            setArticle(latest);
            setError(null);
          } else {
            setError("CMS 中未找到该 Nanobanana 提示词。");
          }
        }
      } catch (err) {
        console.error("[ArticleContent] Failed to fetch post:", err);
        if (!cancelled) {
          setError("同步文章内容失败，请稍后再试。");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    refreshArticle();

    return () => {
      cancelled = true;
    };
  }, [language.locale, slug]);

  if (!article) {
    return (
      <main className={styles.page}>
        <div className={styles.errorBanner}>
          未找到 Nanobanana 提示词，<Link href="/">返回主页</Link>
        </div>
      </main>
    );
  }

  const showLoading = loading;

  return (
    <main className={styles.page}>
      <div className={styles.breadcrumbs}>
        <Link href="/">Nanobanana 提示词集</Link>
        <span aria-hidden="true">/</span>
        <span>{article.title}</span>
      </div>

      {showLoading && (
        <div className={styles.loadingBanner}>正在同步最新内容…</div>
      )}
      {error && <div className={styles.errorBanner}>{error}</div>}

      <article className={styles.article}>
        <p className={styles.category}>
          {article.category || article.tags?.[0] || "Nanobanana Prompt"}
        </p>
        <h1 className={styles.title}>{article.title}</h1>
        {(article.description || article.excerpt) && (
          <p className={styles.description}>
            {article.description || article.excerpt}
          </p>
        )}

        <div className={styles.metaBar}>
          {article.publishedAt && (
            <time dateTime={article.publishedAt}>
              发布：{formatArticleDate(article.publishedAt, "long")}
            </time>
          )}
          {article.updatedAt && (
            <span>更新：{formatArticleDate(article.updatedAt, "long")}</span>
          )}
          {article.tags?.length ? (
            <span>标签：{article.tags.join(" / ")}</span>
          ) : null}
        </div>

        {article.coverImage && (
          <div
            className={styles.heroImage}
            style={{ backgroundImage: `url(${article.coverImage})` }}
            aria-label="文章封面"
          />
        )}

        <div className={styles.content}>
          {article.blocks.length > 0 ? (
            article.blocks.map(renderBlock)
          ) : article.htmlContent ? (
            <div className={styles.richText}>
              {parse(article.htmlContent, richTextParserOptions)}
            </div>
          ) : (article.description || article.excerpt) ? (
            <p>{article.description || article.excerpt}</p>
          ) : null}
        </div>

        <aside className={styles.sidebar}>
          <div>
            <h4>实用建议</h4>
            <p>
              把提示词拆成「背景 → 指令 → 变量 → 输出格式」，并在 CMS
              中保存为模块，方便团队复用与追踪表现。
            </p>
          </div>
          <ul>
            <li>将变量替换为你业务的具体 KPI 或关键词</li>
            <li>把输出要求写成列表或 JSON，便于自动化处理</li>
            <li>为提示词设置版本号，记录每次实验结果</li>
          </ul>
        </aside>
      </article>

      <div className={styles.backLink}>
        <Link href="/">← 返回 Nanobanana 提示词集</Link>
      </div>
    </main>
  );
}
