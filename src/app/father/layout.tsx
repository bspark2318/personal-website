import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "아버지 건강 기록",
  robots: { index: false, follow: false, nocache: true },
};

export default function FatherLayout({ children }: { children: React.ReactNode }) {
  return children;
}
