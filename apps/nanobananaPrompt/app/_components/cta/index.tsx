"use client";

import Link from "next/link";
import styles from "./index.module.css";
import buttonStyles from "../../page.module.css";

export default function CtaSection() {
  return (
    <section className={styles.wrapper}>
      <div className={styles.section}>
        <div className={styles.card}>
          <p className={buttonStyles.sectionEyebrow}>Ready to build</p>
          <h2>把 Nanobanana Prompt Atlas 带到你的工作流</h2>
          <p>
            立即浏览 Prompt 导航或选一篇文章开始复制结构化模板。官方团队会持续为
            Atlas 添加示例与教程，确保你总能获取最新的提示词方法论。
          </p>
          <div className={styles.buttons}>
            <Link href="/prompts" className={buttonStyles.primaryButton}>
              进入 Prompt 导航
            </Link>
            <Link href="#article-list" className={buttonStyles.secondaryButton}>
              查看最新文章
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
