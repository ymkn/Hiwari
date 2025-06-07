import type { Metadata } from "next";
import { DataProvider } from "@/context/DataContext";
import Layout from "@/components/Layout";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hiwari - 1日あたりコスト計算アプリ",
  description: "モノやサービスの取得価格を1日あたりのコストに換算して比較できるアプリです",
  keywords: ["コスト計算", "家計管理", "節約", "比較"],
  authors: [{ name: "Hiwari" }],
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#1976d2",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <DataProvider>
          <Layout>
            {children}
          </Layout>
        </DataProvider>
      </body>
    </html>
  );
}
