import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "RSVP",
};

export default function TripLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
