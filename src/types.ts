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
export type Liquor = supabase['liquor']
export type Storage = Modify<supabase['storage'], {
    location?: Storage
}>
export type CollectionItem = Modify<supabase['collection'], {
    liquor: Liquor,
    purchase_currency: Currency
}>

