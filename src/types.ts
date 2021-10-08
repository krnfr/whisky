import { ViteSSGContext } from 'vite-ssg'
import { definitions as supabase } from 'types/supabase'

type Modify<T, R> = Omit<T, keyof R> & R;

export type UserModule = (ctx: ViteSSGContext) => void

export type Category = supabase['category']
export type Label = supabase['label']
export type Package = supabase['package']
export type Currency = supabase['currency']
export type Owner = supabase['owner']
export type Picture = supabase['picture']
export type Price = supabase['price']
export type Liquor = Modify<supabase['liquor'], {
    category?: Category | number,
    label?: Label | number
}>
export type Storage = Modify<supabase['storage'], {
    location?: Storage | string
}>
export type CollectionItem = Modify<supabase['collection'], {
    label?: Label | number,
    liquor?: Liquor | number,
    purchase_currency?: Currency | number,
    storage?: Storage | string,
    owner?: Owner | string
}>
