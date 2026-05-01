'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Product } from '@/lib/supabase'

interface ProductCardProps {
  product: Product
  rank: number
  hasVoted: boolean
  isLoading: boolean
  onVote: (id: string) => void
  animDelay?: number
}

export default function ProductCard({
  product,
  rank,
  hasVoted,
  isLoading,
  onVote,
  animDelay = 0,
}: ProductCardProps) {
  const [imgError, setImgError] = useState(false)

  const rankLabel =
    rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`

  return (
    <div
      className="product-card bg-white border-2 border-ink/8 rounded-2xl overflow-hidden flex flex-col"
      style={{
        animationDelay: `${animDelay}ms`,
        animation: `fadeUp 0.5s ease ${animDelay}ms both`,
        boxShadow: '4px 4px 0px rgba(13,13,13,0.08)',
      }}
    >
      {/* Image */}
      <div className="relative h-48 bg-ink/5 overflow-hidden">
        {!imgError && product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgError(true)}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">
            📦
          </div>
        )}

        {/* Rank badge */}
        <div
          className={`absolute top-3 left-3 text-xs font-bold px-2 py-1 rounded-full ${
            rank <= 3 ? `rank-${rank}` : 'bg-white/90 text-ink border border-ink/10'
          }`}
          style={{ fontFamily: 'var(--font-body)' }}
        >
          {rankLabel}
        </div>

        {/* Category chip */}
        <div
          className="absolute top-3 right-3 text-xs px-2 py-1 rounded-full font-medium"
          style={{
            background: 'rgba(245,240,232,0.92)',
            color: 'var(--color-ink)',
            fontFamily: 'var(--font-body)',
            border: '1px solid rgba(13,13,13,0.12)',
          }}
        >
          {product.category}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        <div className="flex-1">
          <h3
            className="font-bold text-base leading-snug mb-1"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink)' }}
          >
            {product.name}
          </h3>
          {product.description && (
            <p
              className="text-xs leading-relaxed line-clamp-2"
              style={{ color: '#666', fontFamily: 'var(--font-body)' }}
            >
              {product.description}
            </p>
          )}
        </div>

        {/* Vote section */}
        <div className="flex items-center justify-between pt-2 border-t border-ink/8">
          <div>
            <span
              className="text-2xl font-black tabular-nums"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink)' }}
            >
              {product.vote_count.toLocaleString()}
            </span>
            <span
              className="text-xs ml-1"
              style={{ color: '#888', fontFamily: 'var(--font-body)' }}
            >
              votes
            </span>
          </div>

          <button
            onClick={() => onVote(product.id)}
            disabled={hasVoted || isLoading}
            className="vote-btn flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
            style={{
              fontFamily: 'var(--font-body)',
              background: hasVoted
                ? 'var(--color-paper)'
                : isLoading
                ? 'var(--color-gold-light)'
                : 'var(--color-ink)',
              color: hasVoted
                ? '#aaa'
                : isLoading
                ? 'var(--color-ink)'
                : 'var(--color-paper)',
              border: hasVoted ? '2px solid #ddd' : '2px solid transparent',
              cursor: hasVoted || isLoading ? 'not-allowed' : 'pointer',
              animation: !hasVoted && !isLoading ? undefined : undefined,
            }}
          >
            {isLoading ? (
              <>
                <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Voting…
              </>
            ) : hasVoted ? (
              <>
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Voted
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                </svg>
                Vote
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
