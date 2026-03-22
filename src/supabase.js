import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://ywscjmxetqmxhldxixjc.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl3c2NqbXhldHFteGhsZHhpeGpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQxOTM0ODQsImV4cCI6MjA4OTc2OTQ4NH0.TdcJRGcFhrNJSvWl8oNv8AEmG1ZyjMopyWprkWON-RA'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
