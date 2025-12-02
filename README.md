# Nanobanana Prompt Monorepo

本仓库是一个 Turborepo，包含多个 Next.js 应用与共享包。其中我们重点维护 `apps/nanobananaPrompt`，亦即 **Nanobanana Prompt Atlas** 的前端项目。

## 目录结构

- `apps/nanobananaPrompt`：Nanobanana Prompt Atlas 主站（Next.js 16 + React 19）
- `packages/ui`：共享 UI 组件
- `packages/eslint-config` / `packages/typescript-config`：统一的 lint 与 TS 配置

## 运行 nanobananaPrompt

1. 安装依赖（建议使用 pnpm）：
   ```bash
   pnpm install
   ```
2. 切换到项目根目录后运行开发服务器：
   ```bash
   pnpm --filter nanobananaPrompt dev
   ```
3. 浏览器访问 `http://localhost:3000` 即可预览。

### 环境变量

`apps/nanobananaPrompt/.env.local` 中需要配置 CMS 相关变量：

```
NEXT_PUBLIC_CMS_HOST=...
NEXT_PUBLIC_CMS_SECRET=...
NEXT_PUBLIC_CMS_TENANT_ID=...
```

本地开发可复制 `.env.example`（若存在）或联系维护者获取。

## 常用脚本

在 monorepo 根目录执行：

- 启动开发环境：`pnpm --filter nanobananaPrompt dev`
- 构建：`pnpm --filter nanobananaPrompt build`
- 生产预览：`pnpm --filter nanobananaPrompt start`
- Lint：`pnpm --filter nanobananaPrompt lint`

## 其他说明

- 项目默认使用 Apps Router，页面入口位于 `apps/nanobananaPrompt/app`。
- 若需修改 header/footer 等布局组件，请查看 `app/_components/layout`。
- 文章数据来自 Nanobanana CMS，详情实现见 `app/_components/article`、`lib/cms-client.ts`。
