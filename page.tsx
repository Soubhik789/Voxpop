import { supabaseAdmin, Product } from '@/lib/supabase'
import VotingApp from '@/components/VotingApp'

export const dynamic = 'force-dynamic'
export const revalidate = 0

async function getInitialProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from('products')
      .select('*')
      .order('vote_count', { ascending: false })

    if (error) {
      console.error('Initial fetch error:', error)
      return []
    }
    return data ?? []
  } catch {
    return []
  }
}

export default async function Home() {
  const initialProducts = await getInitialProducts()

  return <VotingApp initialProducts={initialProducts} />
}
