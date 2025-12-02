import type { Metadata } from "next";
import localFont from "next/font/local";
import SiteHeader from "./_components/layout/header";
import SiteFooter from "./_components/layout/footer";
import { LanguageProvider } from "./_components/language-provider";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: "Nanobanana Prompt Atlas",
      template: "%s | Nanobanana Prompt Atlas",
    },
    description:
      "Nanobanana Prompt Atlas 收集并拆解高转化的提示词模板，为 AI 生成式工作流提供灵感、结构化示例与 SEO 友好的落地方案。",
    keywords: [
      "Nanobanana",
      "提示词",
      "AI prompt",
      "nanobanana 提示词集",
      "AI 营销",
      "内容创作",
    ],
    openGraph: {
      title: "Nanobanana Prompt Atlas",
      description:
        "精选 Nanobanana 提示词模板，涵盖品牌营销、内容创作与多语言提示策略，帮助团队快速搭建高质量工作流。",
      type: "website",
      locale: "zh_CN",
      url: baseUrl,
    },
    twitter: {
      card: "summary_large_image",
      title: "Nanobanana Prompt Atlas",
      description: "Nanobanana 提示词集与 SEO 指南，持续更新的高质量 prompts。",
    },
    alternates: {
      canonical: "/",
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <LanguageProvider>
          <SiteHeader />
          <div className="site-shell">
            <div className="page-container">{children}</div>
          </div>
          <SiteFooter />
        </LanguageProvider>
      </body>
    </html>
  );
}
