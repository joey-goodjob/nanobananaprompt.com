"use client";

import styles from "./index.module.css";

const reasons = [
  {
    title: "官方数据源",
    description: "直接从 Nanobanana CMS 拉取，所有 Prompt 与团队同步，包含发布时间与版本标记。",
  },
  {
    title: "结构化模板",
    description: "每篇文章都有变量提示、输出格式、适配渠道的指导，方便复制到自动化脚本或多语言场景。",
  },
  {
    title: "可追踪更新",
    description: "Atlas 记录更改原因、实验结论与对照示例，可以快速回溯并比较不同版本效果。",
  },
];

export default function WhyChooseSection() {
  return (
    <section className={styles.section}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Why Choose Nanobanana Atlas</p>
          <h2 className={styles.title}>为什么使用 Nanobanana 官方提示词集</h2>
        </div>
        <p className={styles.description}>
          这里的 Prompt 均来自官方团队内部的最佳实践，涵盖需求洞察、语气守护到输出验证，让你按下复制即可上手。
        </p>
      </header>

      <div className={styles.grid}>
        {reasons.map((item) => (
          <article key={item.title} className={styles.card}>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
