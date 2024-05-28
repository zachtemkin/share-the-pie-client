"use client";

import { ThemeProvider } from "styled-components";
import { basicTheme } from "./theme.js";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppProvider } from "./AppContext";
import TopOverflowMask from "@/app/components/topOverflowMask";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppProvider>
      <ThemeProvider theme={basicTheme}>
        <html lang="en">
          <head>
            <link rel="manifest" href="/manifest.json" />
          </head>
          <body className={inter.className}>
            <TopOverflowMask />
            {children}
          </body>
        </html>
      </ThemeProvider>
    </AppProvider>
  );
}
