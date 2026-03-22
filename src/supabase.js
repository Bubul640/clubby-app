import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://ywscjmxetqmxhldxixjc.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_U58EfzZE3VpWkhk2WM2e4A_HLDBot4J'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
