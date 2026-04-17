import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://nincxgdepprsvezthqzy.supabase.co'
const supabaseKey = 'sb_publishable_tnhadm2fgJIIzvyvg3bjkw_v7Il8OZv'

export const supabase = createClient(supabaseUrl, supabaseKey)
