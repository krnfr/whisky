import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const queries = {}
export const selects = {
  item: `
    id,
    condition,
    cover,
    public,
    purchase_price,
    purchase_currency (
      id,
      symbol,
      to_eur
    ),
    purchase_date,
    purchase_location,
    open,
    notes,
    year,
    version,
    owner (
      id,
      name
    ),
    package_rating,
    package (
      id,
      name
    ),
    liquor (
      id,
      name,
      label (
        id,
        name
      ),
      category (
        id,
        name
      )
    ),
    storage (
      id,
      name,
      notes,
      location (
        id,
        name
      )
    )
    `,
  storage: `
    id,
    name,
    owner,
    notes,
    location (
      id,
      name
    )
    `
}
