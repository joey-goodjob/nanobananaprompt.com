"use client";

import styles from "./index.module.css";

const faqs = [
  {
    question: "Prompt Atlas 会多久更新一次？",
    answer:
      "Atlas 与 Nanobanana CMS 同步，通常每周会更新 3-5 篇内容。当新的 Prompt 被审核通过，就会自动显示在这里。",
  },
  {
    question: "可以下载或导出这些 Prompt 吗？",
    answer:
      "可以，在每篇文章中复制结构化文本或 JSON 模板即可，也可在 Prompt 导航页批量导出为 CSV/Notion（即将上线）。",
  },
  {
    question: "如何提交自己的提示词？",
    answer:
      "加入 Nanobanana Community，在 Showcase 区域提交案例，审核通过后会收录到 Atlas 并注明贡献者。",
  },
];

export default function FaqSection() {
  return (
    <section className={styles.section}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>FAQ</p>
          <h2 className={styles.title}>常见问题</h2>
        </div>
        <p className={styles.description}>
          如果你第一次接触 Nanobanana Prompt Atlas，可以先阅读常见问题了解更新频率与使用方式。
        </p>
      </header>

      <div className={styles.list}>
        {faqs.map((item) => (
          <article key={item.question} className={styles.card}>
            <h3>{item.question}</h3>
            <p>{item.answer}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
