import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://anrsqqjmxzwhajhsifgv.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFucnNxcWpteHp3aGFqaHNpZmd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgwMjI0NTksImV4cCI6MjA5MzU5ODQ1OX0.1FhNKMMwpHWf90aY2eqRjbAGZUtkLqQArve1wuokM-s'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const createServerClient = () =>
  createClient(supabaseUrl, supabaseAnonKey)