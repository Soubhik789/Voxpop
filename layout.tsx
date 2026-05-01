import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'VoxPop — Customer Voting',
  description: 'Vote for your favourite products. Real-time leaderboard updated live.',
  openGraph: {
    title: 'VoxPop — Customer Voting',
    description: 'Your vote shapes our next launch.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
