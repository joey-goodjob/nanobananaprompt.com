"use client";

import styles from "./index.module.css";

const tutorials = [
  {
    title: "SEO Pillar Prompt Handbook",
    summary: "指导如何为支柱页构建 Prompt，包括关键词调研结构、FAQ Schema 指令以及多语言变体。",
    meta: "教程 · 12 min",
  },
  {
    title: "Product Launch Prompt Workflow",
    summary: "展示如何把 changelog、公告、邮件提示词统一在同一工作流里，并连接 Zapier。",
    meta: "工作流 · 8 min",
  },
  {
    title: "Customer Support Tone Coach",
    summary: "教你如何使用 Nanobanana Prompt 来维持客服语气一致，附带 JSON 输出格式模板。",
    meta: "指南 · 10 min",
  },
];

export default function TutorialsGuidesSection() {
  return (
    <section className={styles.section} id="tutorials">
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>AI Prompt Engineering Tutorials & Guides</p>
          <h2 className={styles.title}>Tutorials & Guides</h2>
        </div>
        <p className={styles.description}>
          这些迷你教程来自 Nanobanana Prompt Engineering 团队，帮助你理解如何组合、测试和迭代提示词。
        </p>
      </header>
      <div className={styles.grid}>
        {tutorials.map((tutorial) => (
          <article key={tutorial.title} className={styles.card}>
            <p className={styles.meta}>{tutorial.meta}</p>
            <h3>{tutorial.title}</h3>
            <p>{tutorial.summary}</p>
            <button type="button">查看指南 →</button>
          </article>
        ))}
      </div>
    </section>
  );
}
