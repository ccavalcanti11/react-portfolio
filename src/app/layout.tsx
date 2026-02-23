import type { Metadata } from "next";
import "./globals.css";
import ApolloWrapper from "@/components/ApolloWrapper";

export const metadata: Metadata = {
  title: {
    default: "GitHub Profile Explorer",
    template: "%s — GitHub Profile Explorer",
  },
  description:
    "Look up any GitHub user — browse their public repositories, languages, stars, and activity.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ApolloWrapper>{children}</ApolloWrapper>
      </body>
    </html>
  );
}
