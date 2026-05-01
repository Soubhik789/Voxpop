'use client'

interface SearchFilterProps {
  searchQuery: string
  onSearchChange: (q: string) => void
  categories: string[]
  activeCategory: string
  onCategoryChange: (cat: string) => void
  resultCount: number
}

export default function SearchFilter({
  searchQuery,
  onSearchChange,
  categories,
  activeCategory,
  onCategoryChange,
  resultCount,
}: SearchFilterProps) {
  return (
    <div
      className="border-b border-ink/10 py-4 sticky top-[73px] z-30"
      style={{ background: 'var(--color-paper)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          {/* Search input */}
          <div className="relative flex-1 max-w-sm">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
              style={{ color: '#888' }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search products…"
              value={searchQuery}
              onChange={e => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border-2 border-ink/15 focus:border-ink focus:outline-none bg-white"
              style={{ fontFamily: 'var(--font-body)', color: 'var(--color-ink)' }}
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink transition-colors"
              >
                ✕
              </button>
            )}
          </div>

          {/* Category pills */}
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => onCategoryChange(cat)}
                className="px-3 py-1.5 text-xs font-semibold rounded-full border-2 transition-all"
                style={{
                  fontFamily: 'var(--font-body)',
                  background:
                    activeCategory === cat ? 'var(--color-ink)' : 'transparent',
                  color:
                    activeCategory === cat ? 'var(--color-paper)' : 'var(--color-ink)',
                  borderColor:
                    activeCategory === cat ? 'var(--color-ink)' : 'rgba(13,13,13,0.2)',
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Result count */}
          <span
            className="text-xs ml-auto shrink-0"
            style={{ color: '#888', fontFamily: 'var(--font-body)' }}
          >
            {resultCount} product{resultCount !== 1 ? 's' : ''}
          </span>
        </div>
      </div>
    </div>
  )
}
