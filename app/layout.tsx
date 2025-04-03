import type React from "react"
import "@/app/globals.css"
import { Toaster } from "@/components/ui/toaster"
import { Inter } from "next/font/google"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata = {
  generator: "v0.dev",
  title: "UpgradedPoints Title Assistant",
  description: "Optimize titles for Google Discover.",
  icons: {
    icon: "/favicon.png", // Make sure this file exists in /public
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans">
        {children}
        <Toaster />
      </body>
    </html>
  )
}
