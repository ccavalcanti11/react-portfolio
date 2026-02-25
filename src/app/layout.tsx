import type { Metadata } from "next";
import "./globals.css";
import ApolloWrapper from "@/components/ApolloWrapper";

export const metadata: Metadata = {
  title: {
    default: "Frontend Portfolio",
    template: "%s — Frontend Portfolio",
  },
  description:
    "A collection of frontend projects demonstrating React, Next.js, GraphQL, TypeScript, and modern web engineering practices.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  /*
   * suppressHydrationWarning on <html> silences the expected class mismatch:
   * the server renders no class; the blocking inline script may add `dark`
   * before React hydrates, causing a benign attribute difference.
   */
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/*
         * Blocking theme-init — runs synchronously before any CSS or JS so
         * there is never a flash of the wrong theme on load.
         * Priority: localStorage → prefers-color-scheme → light default.
         */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem('theme');if(t==='dark'||(t===null&&window.matchMedia('(prefers-color-scheme:dark)').matches)){document.documentElement.classList.add('dark');}})();`,
          }}
        />
      </head>
      <body className="antialiased">
        <ApolloWrapper>{children}</ApolloWrapper>
      </body>
    </html>
  );
}
