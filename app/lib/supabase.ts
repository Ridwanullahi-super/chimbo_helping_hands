import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface User {
  id: string
  email: string
  first_name: string
  last_name: string
  phone?: string
  country?: string
  role: 'user' | 'admin'
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Donation {
  id: string
  user_id?: string
  amount: number
  currency: string
  frequency: 'one-time' | 'monthly'
  payment_method: 'stripe' | 'paypal' | 'flutterwave'
  payment_status: 'pending' | 'completed' | 'failed' | 'cancelled'
  payment_id?: string
  donor_name: string
  donor_email: string
  donor_phone?: string
  donor_address?: string
  donor_city?: string
  donor_zip?: string
  donor_country?: string
  is_anonymous: boolean
  created_at: string
  updated_at: string
}

export interface Blog {
  id: string
  title: string
  slug: string
  content: string
  excerpt?: string
  featured_image?: string
  author_id: string
  status: 'draft' | 'published'
  tags: string[]
  meta_description?: string
  created_at: string
  updated_at: string
}

export interface Event {
  id: string
  title: string
  description?: string
  event_date: string
  location?: string
  image?: string
  status: 'upcoming' | 'ongoing' | 'completed'
  created_at: string
  updated_at: string
}

export interface Testimonial {
  id: string
  name: string
  role?: string
  content: string
  image?: string
  rating: number
  is_featured: boolean
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  updated_at: string
}

export interface Content {
  id: string
  key_name: string
  title?: string
  content: string
  type: 'text' | 'html' | 'json'
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface PaymentLog {
  id: string
  donation_id: string
  payment_gateway: string
  transaction_id?: string
  gateway_response?: any
  status?: string
  amount?: number
  currency?: string
  created_at: string
}