'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Product } from '@/lib/supabase'

interface LeaderboardProps {
  products: Product[]
  votedProducts: Record<string, boolean>
  loadingVote: string | null
  onVote: (id: string) => void
}

export default function Leaderboard({
  products,
  votedProducts,
  loadingVote,
  onVote,
}: LeaderboardProps) {
  const maxVotes = products[0]?.vote_count ?? 1

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8 text-center">
        <h2
          className="text-3xl font-black"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink)' }}
        >
          Live Leaderboard
        </h2>
        <p className="text-sm mt-1" style={{ color: '#888', fontFamily: 'var(--font-body)' }}>
          Rankings update in real time
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {products.map((product, index) => {
          const rank = index + 1
          const pct = maxVotes > 0 ? (product.vote_count / maxVotes) * 100 : 0
          const hasVoted = !!votedProducts[product.id]
          const isLoading = loadingVote === product.id

          const rankColor =
            rank === 1
              ? 'var(--color-gold)'
              : rank === 2
              ? '#9E9E9E'
              : rank === 3
              ? '#A0522D'
              : 'var(--color-ink)'

          return (
            <div
              key={product.id}
              className="flex items-center gap-4 bg-white rounded-xl border-2 border-ink/8 p-4 transition-all"
              style={{
                boxShadow: rank <= 3 ? `0 2px 0 ${rankColor}30` : undefined,
                animation: `fadeUp 0.4s ease ${index * 40}ms both`,
              }}
            >
              {/* Rank */}
              <div
                className="text-2xl font-black w-10 text-center shrink-0"
                style={{ fontFamily: 'var(--font-display)', color: rankColor }}
              >
                {rank <= 3 ? (rank === 1 ? '🥇' : rank === 2 ? '🥈' : '🥉') : rank}
              </div>

              {/* Thumbnail */}
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-ink/5 shrink-0">
                {product.image_url ? (
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    width={48}
                    height={48}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xl">📦</div>
                )}
              </div>

              {/* Info + bar */}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-2">
                  <p
                    className="font-bold text-sm truncate"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {product.name}
                  </p>
                  <span
                    className="text-xs shrink-0"
                    style={{ color: '#888', fontFamily: 'var(--font-body)' }}
                  >
                    {product.category}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="mt-1.5 h-1.5 rounded-full bg-ink/8 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${pct}%`,
                      background:
                        rank === 1
                          ? 'linear-gradient(90deg, var(--color-gold), var(--color-gold-light))'
                          : 'var(--color-ink)',
                    }}
                  />
                </div>

                <p
                  className="text-xs mt-0.5 font-semibold tabular-nums"
                  style={{ color: '#555', fontFamily: 'var(--font-body)' }}
                >
                  {product.vote_count.toLocaleString()} votes
                </p>
              </div>

              {/* Vote button */}
              <button
                onClick={() => onVote(product.id)}
                disabled={hasVoted || !!isLoading}
                className="vote-btn shrink-0 px-4 py-2 rounded-lg text-xs font-semibold"
                style={{
                  fontFamily: 'var(--font-body)',
                  background: hasVoted
                    ? 'var(--color-paper)'
                    : isLoading
                    ? 'var(--color-gold-light)'
                    : 'var(--color-ink)',
                  color: hasVoted ? '#aaa' : 'var(--color-paper)',
                  border: hasVoted ? '1.5px solid #ddd' : '1.5px solid transparent',
                  cursor: hasVoted || isLoading ? 'not-allowed' : 'pointer',
                }}
              >
                {isLoading ? '…' : hasVoted ? '✓ Voted' : '↑ Vote'}
              </button>
            </div>
          )
        })}

        {products.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-3">📊</p>
            <p style={{ fontFamily: 'var(--font-display)' }}>No products match your filters.</p>
          </div>
        )}
      </div>
    </div>
  )
}
