"use client";

import Link from "next/link";
import styles from "./index.module.css";

export default function SiteFooter() {
  return (
    <footer className={styles.footerWrapper}>
      <div className={styles.footer}>
        <div className={styles.columns}>
          <div className={styles.brand}>
            <p className={styles.logo}>Nanobanana Prompt Atlas</p>
            <p>Nanobanana 官方提示词合集 · 每周更新。</p>
          </div>
          <div className={styles.links}>
            <strong>导航</strong>
            <Link href="/">首页</Link>
            <Link href="/prompts">Prompt 导航</Link>
          </div>
          <div className={styles.links}>
            <strong>资源</strong>
            <Link href="#article-list">文章瀑布流</Link>
            <Link href="#tutorials">教程 & 指南</Link>
          </div>
        </div>
        <div className={styles.bottom}>
          <span>© {new Date().getFullYear()} Nanobanana</span>
          <span>Prompt Atlas · 官方提示词合集</span>
        </div>
      </div>
    </footer>
  );
}
