# @repo/web - CMS Block System

> 完整的 CMS 驱动组件系统，支持 blockType + blockName 组合匹配

## 📦 安装

在你的 app 的 `package.json` 中添加依赖：

```json
{
  "dependencies": {
    "@repo/web": "workspace:*"
  }
}
```

## 🎯 核心概念

### 1. Block 匹配规则

组件通过 `blockType` 和 `blockName` 的组合进行匹配，优先级如下：

| 优先级 | 匹配规则              | 示例             | 说明       |
| ------ | --------------------- | ---------------- | ---------- |
| 1      | `blockType:blockName` | `features:cards` | 精确匹配   |
| 2      | `blockType`           | `features`       | 类型级匹配 |
| 3      | `*`                   | 任意             | 降级组件   |

### 2. CMS 数据结构

```typescript
// CMS 返回的 Block 数据
{
  blockType: "features",    // 组件类型
  blockName: "cards",       // 组件变体
  title: "核心功能",
  subtitle: "我们提供的服务",
  features: [...]
}
```

匹配流程：

1. 首先尝试匹配 `features:cards`
2. 如果没找到，尝试匹配 `features`
3. 如果还没找到，使用降级组件 `*`

## 🚀 快速开始

### 步骤 1: 在应用入口初始化

在 `app/layout.tsx` 中初始化 Block Registry：

```tsx
// apps/nanobananaPrompt/app/layout.tsx
"use client";

import { useEffect } from "react";
import { initializeBlockRegistry } from "@repo/web";

function BlockRegistryInitializer() {
  useEffect(() => {
    initializeBlockRegistry();
  }, []);

  return null;
}

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <BlockRegistryInitializer />
        {children}
      </body>
    </html>
  );
}
```

### 步骤 2: 使用 BlockRenderer 渲染

```tsx
// apps/nanobananaPrompt/app/posts/[slug]/page.tsx
"use client";

import { BlockRenderer } from "@repo/web";
import type { CMSBlock } from "@repo/web/types";

export default function ArticlePage({ article }) {
  return (
    <article>
      <h1>{article.title}</h1>

      <BlockRenderer
        blocks={article.blocks}
        className="my-8"
        onBlockError={(error, block, index) => {
          console.error(`Block ${index} error:`, error);
        }}
      />
    </article>
  );
}
```

## 📚 详细用法

### 注册自定义组件

```tsx
// apps/yourApp/lib/block-setup.ts
import { blockRegistry } from "@repo/web";
import { MyCustomHero } from "@/components/blocks/custom-hero";

export function setupCustomBlocks() {
  // 注册自定义组件（会覆盖默认组件）
  blockRegistry.register("hero:custom", MyCustomHero);

  // 批量注册
  blockRegistry.registerMany({
    "hero:animated": MyAnimatedHero,
    "features:pricing": MyPricingFeatures,
  });
}
```

### 自定义降级组件

```tsx
import { BlockRenderer } from "@repo/web";

function MyFallback({ block }) {
  return (
    <div className="p-4 bg-yellow-50 border border-yellow-200">
      <p>⚠️ 组件正在开发中</p>
      <pre>{JSON.stringify(block, null, 2)}</pre>
    </div>
  );
}

<BlockRenderer blocks={blocks} fallback={MyFallback} />;
```

### 错误处理

```tsx
<BlockRenderer
  blocks={blocks}
  onBlockError={(error, block, index) => {
    // 发送到错误追踪服务
    console.error("Block render error:", {
      error,
      blockType: block.blockType,
      blockName: block.blockName,
      index,
    });
  }}
/>
```

### 调试模式

```tsx
import { printBlockRegistry } from "@repo/web";

// 打印当前注册的所有组件
printBlockRegistry();
```

## 🎨 已注册的组件

### Hero 组件

- `hero:01` / `hero` → hero/01.tsx

### Features 组件

- `features:cards` → features/01.tsx
- `features:grid` → features/02.tsx
- `features:why-choose` → features/03.tsx
- `features` → features/01.tsx (降级)

### FAQ 组件

- `faq:accordion` → faq/02.tsx
- `faq:simple` → faq/03.tsx
- `faq:minimal` → faq/03.tsx
- `faq` → faq/02.tsx (降级)

### Testimonials 组件

- `testimonials:marquee` → testimonials/01.tsx
- `testimonials` → testimonials/01.tsx (降级)

### Step 组件

- `step:how-it-works` → step/01.tsx
- `step:how-it-works-v2` → step/02.tsx
- `step` → step/01.tsx (降级)

### CTA 组件

- `cta:default` → call-to-action/01.tsx
- `cta` → call-to-action/01.tsx (降级)

### Contact 组件

- `contact:default` → contact/index.tsx
- `contact` → contact/index.tsx (降级)

## 💡 CMS 配置指南

### Payload CMS 配置示例

```typescript
// cms/collections/LandingPages.ts
{
  slug: 'landing-pages',
  fields: [
    {
      name: 'blocks',
      type: 'blocks',
      blocks: [
        {
          slug: 'hero',
          fields: [
            { name: 'blockName', type: 'text' }, // 可选：cards, grid 等
            { name: 'title', type: 'text' },
            { name: 'subtitle', type: 'text' },
            // ...
          ]
        },
        {
          slug: 'features',
          fields: [
            {
              name: 'blockName',
              type: 'select',
              options: ['cards', 'grid', 'why-choose']
            },
            { name: 'title', type: 'text' },
            { name: 'features', type: 'array', fields: [...] },
          ]
        }
      ]
    }
  ]
}
```

### CMS 数据示例

```json
{
  "blocks": [
    {
      "blockType": "hero",
      "blockName": "01",
      "title": "欢迎来到 Nanobanana",
      "subtitle": "强大的 AI 提示词平台"
    },
    {
      "blockType": "features",
      "blockName": "cards",
      "title": "核心功能",
      "features": [
        {
          "title": "智能匹配",
          "description": "自动匹配最佳组件",
          "iconType": "zap"
        }
      ]
    },
    {
      "blockType": "faq",
      "blockName": "accordion",
      "title": "常见问题",
      "items": [...]
    }
  ]
}
```

## 🔧 高级用法

### 类型安全

```tsx
import type { FeaturesCardsBlockProps } from "@repo/web/types";

function MyCustomFeatures(props: FeaturesCardsBlockProps) {
  const { title, subtitle, features } = props;
  // TypeScript 会自动提示类型
}
```

### 动态注册

```tsx
// 运行时动态加载组件
import { blockRegistry } from "@repo/web";

async function loadCustomBlock() {
  const { CustomBlock } = await import("@/components/custom-block");
  blockRegistry.register("custom:special", CustomBlock);
}
```

### 条件注册

```tsx
// 根据环境注册不同组件
import { blockRegistry } from "@repo/web";

if (process.env.NODE_ENV === "development") {
  blockRegistry.register("*", DevFallback);
} else {
  blockRegistry.register("*", ProductionFallback);
}
```

## 🎬 完整示例

### nanobananaPrompt 项目集成

```tsx
// 1. 在 app/layout.tsx 初始化
"use client";

import { useEffect } from "react";
import { initializeBlockRegistry } from "@repo/web";

export default function RootLayout({ children }) {
  useEffect(() => {
    initializeBlockRegistry();
  }, []);

  return (
    <html>
      <body>{children}</body>
    </html>
  );
}

// 2. 在文章页使用
// app/posts/[slug]/article-content.tsx
("use client");

import { BlockRenderer, DefaultFallback } from "@repo/web";
import type { Article } from "@/types/cms";

export default function ArticleContent({ article }: { article: Article }) {
  return (
    <article className="article-content">
      <header>
        <h1>{article.title}</h1>
        <p>{article.description}</p>
      </header>

      {/* 使用 BlockRenderer 渲染所有 blocks */}
      <BlockRenderer
        blocks={article.blocks}
        fallback={DefaultFallback}
        className="my-8"
        wrapperClassName="space-y-12"
        onBlockError={(error, block, index) => {
          console.error(`Block ${index} render error:`, {
            error: error.message,
            blockType: typeof block === "object" ? block.blockType : "string",
            blockName: typeof block === "object" ? block.blockName : undefined,
          });
        }}
      />
    </article>
  );
}
```

## 📂 项目结构

```
packages/web/
├── src/
│   ├── blocks/                    # 所有 Block 组件
│   │   ├── hero/
│   │   │   └── 01.tsx
│   │   ├── features/
│   │   │   ├── 01.tsx             # features:cards
│   │   │   ├── 02.tsx             # features:grid
│   │   │   └── 03.tsx             # features:why-choose
│   │   ├── faq/
│   │   ├── testimonials/
│   │   ├── step/
│   │   ├── call-to-action/
│   │   ├── contact/
│   │   └── ComponentRegistry.ts   # 组件映射表
│   ├── registry/
│   │   └── block-registry.ts      # 核心注册表逻辑
│   ├── render/
│   │   └── BlockRenderer.tsx      # 通用渲染器
│   ├── types/
│   │   └── index.ts               # 类型定义
│   └── cms-blocks.ts              # 统一导出
└── package.json
```

## 🐛 故障排查

### 1. 组件没有渲染

```tsx
// 检查是否初始化
import { printBlockRegistry } from "@repo/web";
printBlockRegistry();

// 检查 block 数据结构
console.log("Block data:", article.blocks);
```

### 2. 类型错误

确保导入正确的类型：

```tsx
// ✅ 正确
import type { CMSBlock } from "@repo/web/types";

// ❌ 错误
import type { CMSBlock } from "@repo/web";
```

### 3. 组件未找到

检查 `blockType` 和 `blockName` 是否正确：

```tsx
// CMS 数据
{
  blockType: "features",  // 确保拼写正确
  blockName: "cards",     // 确保已注册
}
```

## 🚀 未来计划

- [ ] 支持服务端渲染 (SSR)
- [ ] 添加组件预览功能
- [ ] 支持组件版本管理
- [ ] 可视化组件注册表管理
- [ ] 性能监控和分析

## 📄 许可证

Private - Internal Use Only
