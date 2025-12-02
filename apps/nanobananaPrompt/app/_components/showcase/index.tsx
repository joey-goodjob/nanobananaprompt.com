"use client";

import styles from "./index.module.css";

const showcases = [
  {
    name: "Growth Guild 社区",
    highlight: "共享增长 Prompt 模板",
    detail: "把 Nanobanana Prompt 嵌入 Notion，成员可提交实验结果并自动同步到 CMS。",
  },
  {
    name: "Nano Banana Prompt Community Showcase",
    highlight: "产品+运营联动",
    detail: "产品经理和运营在同一面板协作，拆解背景/目标/验证方式，保证输出一致。",
  },
  {
    name: "Customer Care Squad",
    highlight: "语气控管",
    detail: "客服团队通过 Prompt 组件化的方式应对不同情绪与语言，响应时间减少 45%。",
  },
];

export default function CommunityShowcaseSection() {
  return (
    <section className={styles.section}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Nano Banana Prompt Community Showcase</p>
          <h2 className={styles.title}>社区展示</h2>
        </div>
        <p className={styles.description}>
          看看社群伙伴如何把 Nanobanana Prompt Atlas 嵌入自己的团队，与产品、营销、客服协作。
        </p>
      </header>
      <div className={styles.grid}>
        {showcases.map((item) => (
          <article key={item.name} className={styles.card}>
            <p className={styles.tag}>{item.highlight}</p>
            <h3>{item.name}</h3>
            <p>{item.detail}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
