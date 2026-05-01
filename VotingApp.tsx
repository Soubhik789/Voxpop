'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { Product } from '@/lib/supabase'
import ProductCard from './ProductCard'
import Leaderboard from './Leaderboard'
import SearchFilter from './SearchFilter'

type VotedMap = Record<string, boolean>

interface VotingAppProps {
  initialProducts: Product[]
}

export default function VotingApp({ initialProducts }: VotingAppProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [votedProducts, setVotedProducts] = useState<VotedMap>({})
  const [loadingVote, setLoadingVote] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [view, setView] = useState<'grid' | 'leaderboard'>('grid')
  const [toastMsg, setToastMsg] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Load voted products from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('voxpop_votes')
      if (stored) setVotedProducts(JSON.parse(stored))
    } catch {}
  }, [])

  // Auto-refresh products every 30 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      await refreshProducts(true)
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  const refreshProducts = async (silent = false) => {
    if (!silent) setIsRefreshing(true)
    try {
      const res = await fetch('/api/products', { cache: 'no-store' })
      if (res.ok) {
        const data = await res.json()
        setProducts(data.products)
      }
    } finally {
      if (!silent) setIsRefreshing(false)
    }
  }

  const showToast = (msg: string) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(null), 3000)
  }

  const handleVote = useCallback(async (productId: string) => {
    if (votedProducts[productId] || loadingVote) return

    setLoadingVote(productId)

    // Optimistic update
    setProducts(prev =>
      prev
        .map(p =>
          p.id === productId ? { ...p, vote_count: p.vote_count + 1 } : p
        )
        .sort((a, b) => b.vote_count - a.vote_count)
    )

    try {
      const res = await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: productId }),
      })

      const data = await res.json()

      if (res.ok) {
        // Confirm with server vote count
        setProducts(prev =>
          prev
            .map(p =>
              p.id === productId ? { ...p, vote_count: data.new_vote_count } : p
            )
            .sort((a, b) => b.vote_count - a.vote_count)
        )

        const newVoted = { ...votedProducts, [productId]: true }
        setVotedProducts(newVoted)
        try {
          localStorage.setItem('voxpop_votes', JSON.stringify(newVoted))
        } catch {}

        showToast('✓ Vote cast! Thanks for your voice.')
      } else if (res.status === 429) {
        // Rollback optimistic update
        setProducts(prev =>
          prev
            .map(p =>
              p.id === productId ? { ...p, vote_count: p.vote_count - 1 } : p
            )
            .sort((a, b) => b.vote_count - a.vote_count)
        )
        showToast('You've already voted for this product.')
      } else {
        // Rollback
        setProducts(prev =>
          prev
            .map(p =>
              p.id === productId ? { ...p, vote_count: p.vote_count - 1 } : p
            )
            .sort((a, b) => b.vote_count - a.vote_count)
        )
        showToast('Something went wrong. Please try again.')
      }
    } catch {
      setProducts(prev =>
        prev
          .map(p =>
            p.id === productId ? { ...p, vote_count: p.vote_count - 1 } : p
          )
          .sort((a, b) => b.vote_count - a.vote_count)
      )
      showToast('Network error. Please check your connection.')
    } finally {
      setLoadingVote(null)
    }
  }, [votedProducts, loadingVote])

  const categories = useMemo(() => {
    const cats = Array.from(new Set(products.map(p => p.category))).sort()
    return ['All', ...cats]
  }, [products])

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch =
        searchQuery === '' ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory =
        activeCategory === 'All' || p.category === activeCategory
      return matchesSearch && matchesCategory
    })
  }, [products, searchQuery, activeCategory])

  const totalVotes = useMemo(
    () => products.reduce((sum, p) => sum + p.vote_count, 0),
    [products]
  )

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-paper)' }}>
      {/* Header */}
      <header
        className="border-b-2 border-ink sticky top-0 z-40"
        style={{ background: 'var(--color-paper)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div>
              <h1
                className="text-3xl sm:text-4xl font-black tracking-tight leading-none"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink)' }}
              >
                Vox<span style={{ color: 'var(--color-gold)' }}>Pop</span>
              </h1>
              <p className="text-xs mt-0.5" style={{ color: '#666', fontFamily: 'var(--font-body)' }}>
                {totalVotes.toLocaleString()} votes cast
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Refresh button */}
              <button
                onClick={() => refreshProducts(false)}
                className="p-2 rounded-full border border-ink/20 hover:border-gold transition-colors"
                title="Refresh"
                style={{ color: isRefreshing ? 'var(--color-gold)' : 'inherit' }}
              >
                <svg
                  className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </button>

              {/* View toggle */}
              <div className="flex rounded border-2 border-ink overflow-hidden">
                <button
                  onClick={() => setView('grid')}
                  className={`px-3 py-1.5 text-xs font-semibold transition-colors ${
                    view === 'grid'
                      ? 'text-paper'
                      : 'hover:bg-ink/5'
                  }`}
                  style={{
                    background: view === 'grid' ? 'var(--color-ink)' : 'transparent',
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  Grid
                </button>
                <button
                  onClick={() => setView('leaderboard')}
                  className={`px-3 py-1.5 text-xs font-semibold transition-colors border-l-2 border-ink ${
                    view === 'leaderboard' ? 'text-paper' : 'hover:bg-ink/5'
                  }`}
                  style={{
                    background: view === 'leaderboard' ? 'var(--color-ink)' : 'transparent',
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  Leaderboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero band */}
      <div
        className="border-b border-ink/10 py-6"
        style={{ background: 'var(--color-ink)', color: 'var(--color-paper)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p
            className="text-lg sm:text-2xl font-medium tracking-wide"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Your vote shapes our next launch.{' '}
            <span style={{ color: 'var(--color-gold)' }}>
              One vote per product, one voice at a time.
            </span>
          </p>
        </div>
      </div>

      {/* Search & Filter */}
      <SearchFilter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        resultCount={filteredProducts.length}
      />

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {view === 'leaderboard' ? (
          <Leaderboard
            products={filteredProducts}
            votedProducts={votedProducts}
            loadingVote={loadingVote}
            onVote={handleVote}
          />
        ) : (
          <>
            {filteredProducts.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-4xl mb-4">🔍</p>
                <p
                  className="text-xl font-semibold"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  No products found
                </p>
                <p className="text-sm mt-2" style={{ color: '#888' }}>
                  Try adjusting your search or category filter.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    rank={products.indexOf(product) + 1}
                    hasVoted={!!votedProducts[product.id]}
                    isLoading={loadingVote === product.id}
                    onVote={handleVote}
                    animDelay={index * 50}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t-2 border-ink mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm" style={{ color: '#888', fontFamily: 'var(--font-body)' }}>
            VoxPop Customer Voting — Built with Next.js &amp; Supabase
          </p>
        </div>
      </footer>

      {/* Toast notification */}
      {toastMsg && (
        <div
          className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-lg shadow-2xl text-sm font-medium animate-fade-up"
          style={{
            background: 'var(--color-ink)',
            color: 'var(--color-paper)',
            fontFamily: 'var(--font-body)',
          }}
        >
          {toastMsg}
        </div>
      )}
    </div>
  )
}
