import {Analytics} from '@vercel/analytics/react';
import "@/styles/globals.scss";
import "@/styles/markdown.scss";
import "@/styles/highlight.scss";
import React from "react";
import {ThemeProvider} from "@/components/theme-provider"


export const metadata = {
    title: 'Mojo AI',
    description: 'Generated by neochau@gmail.com',
    viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
}

export default function RootLayout({children,}: { children: React.ReactNode }) {


    return (
        <html lang="en">
        <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
            {children}
        </ThemeProvider>
        <Analytics/>
        </body>
        </html>
    )
}


