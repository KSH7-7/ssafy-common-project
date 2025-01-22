import "./globals.css"
import type { Metadata } from "next"
import PathCheck from "./PathCheck"

export const metadata: Metadata = {
  title: "SMART LockeR",
  description: "Smart locker management system",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <PathCheck>{children}</PathCheck>
      </body>
    </html>
  )
}

