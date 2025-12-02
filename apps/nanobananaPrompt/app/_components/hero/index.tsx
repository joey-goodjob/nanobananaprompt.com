"use client";

import Link from "next/link";
import type { ArticleListItem } from "@/types/cms";
import { formatArticleDate } from "@/lib/article-utils";
import styles from "./index.module.css";
import buttonStyles from "../../page.module.css";

type HeroProps = {
  totalArticles: number;
  featuredArticle?: ArticleListItem;
};

export default function Hero({ totalArticles, featuredArticle }: HeroProps) {
  return (
    <section className={styles.wrapper}>
      <div className={styles.hero}>
        <div className={styles.headline}>
          <span className={styles.badge}>Nanobanana 官方提示词合集</span>
          <h1 className={styles.title}>Nanobanana Prompt Atlas</h1>
          <p className={styles.description}>
            Nanobanana 官方团队整理的 Prompt
            Atlas，收录产品、营销、运营多场景的提示词。
            每篇文章都附结构化模板、变量建议与验证步骤，复制即可投入工作流。
          </p>
        </div>

        <div className={`${styles.actions} ${styles.buttons}`}>
          <Link href="/prompts" className={buttonStyles.primaryButton}>
            浏览 Prompt 导航
          </Link>
          <Link href="#article-list" className={buttonStyles.secondaryButton}>
            查看最新文章
          </Link>
        </div>

        <div className={styles.stats}>
          <div className={styles.stat}>
            <p className={styles.statValue}>{totalArticles}+</p>
            <p className={styles.statLabel}>官方 Prompt 案例</p>
          </div>
          <div className={styles.stat}>
            <p className={styles.statValue}>24</p>
            <p className={styles.statLabel}>覆盖场景</p>
          </div>
          <div className={styles.stat}>
            <p className={styles.statValue}>
              {featuredArticle?.publishedAt
                ? formatArticleDate(featuredArticle.publishedAt)
                : "刚刚更新"}
            </p>
            <p className={styles.statLabel}>最近同步</p>
          </div>
        </div>
      </div>
    </section>
  );
}
