// app/layout.js

export const metadata = {
  title: 'UpgradedPoints Title Assistant',
  description: 'Generate optimized headlines for Google Discover',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
