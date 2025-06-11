import { supabase } from './supabase'
import type { User, Donation, Blog, Event, Testimonial, Content } from './supabase'

interface ApiResponse<T = any> {
  success: boolean
  message?: string
  data?: T
  error?: string
}

class SupabaseApiClient {
  // Auth methods
  async signUp(userData: {
    email: string
    password: string
    firstName: string
    lastName: string
    phone?: string
    country?: string
  }): Promise<ApiResponse<{ user: User }>> {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            first_name: userData.firstName,
            last_name: userData.lastName,
            phone: userData.phone,
            country: userData.country,
          }
        }
      })

      if (authError) throw authError

      if (authData.user) {
        // Insert user profile
        const { data: profileData, error: profileError } = await supabase
          .from('users')
          .insert({
            id: authData.user.id,
            email: userData.email,
            first_name: userData.firstName,
            last_name: userData.lastName,
            phone: userData.phone,
            country: userData.country,
          })
          .select()
          .single()

        if (profileError) throw profileError

        return {
          success: true,
          message: 'User registered successfully',
          data: { user: profileData }
        }
      }

      throw new Error('User creation failed')
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Registration failed',
        error: error.message
      }
    }
  }

  async signIn(email: string, password: string): Promise<ApiResponse<{ user: User }>> {
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (authError) throw authError

      if (authData.user) {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', authData.user.id)
          .single()

        if (userError) throw userError

        return {
          success: true,
          message: 'Login successful',
          data: { user: userData }
        }
      }

      throw new Error('Login failed')
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Login failed',
        error: error.message
      }
    }
  }

  async signOut(): Promise<ApiResponse> {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error

      return {
        success: true,
        message: 'Logged out successfully'
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Logout failed',
        error: error.message
      }
    }
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      if (authError) throw authError
      if (!user) throw new Error('No user found')

      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

      if (userError) throw userError

      return {
        success: true,
        data: userData
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Failed to get user',
        error: error.message
      }
    }
  }

  // Donation methods
  async createDonation(donationData: Omit<Donation, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<Donation>> {
    try {
      const { data, error } = await supabase
        .from('donations')
        .insert(donationData)
        .select()
        .single()

      if (error) throw error

      return {
        success: true,
        message: 'Donation created successfully',
        data
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Failed to create donation',
        error: error.message
      }
    }
  }

  async getUserDonations(userId: string, page = 1, limit = 10): Promise<ApiResponse<{ donations: Donation[], total: number }>> {
    try {
      const offset = (page - 1) * limit

      const { data: donations, error: donationsError } = await supabase
        .from('donations')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

      if (donationsError) throw donationsError

      const { count, error: countError } = await supabase
        .from('donations')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)

      if (countError) throw countError

      return {
        success: true,
        data: {
          donations: donations || [],
          total: count || 0
        }
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Failed to get donations',
        error: error.message
      }
    }
  }

  // Blog methods
  async getBlogs(page = 1, limit = 10, search = ''): Promise<ApiResponse<{ blogs: Blog[], total: number }>> {
    try {
      const offset = (page - 1) * limit
      let query = supabase
        .from('blogs')
        .select('*')
        .eq('status', 'published')

      if (search) {
        query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%,excerpt.ilike.%${search}%`)
      }

      const { data: blogs, error: blogsError } = await query
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

      if (blogsError) throw blogsError

      let countQuery = supabase
        .from('blogs')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'published')

      if (search) {
        countQuery = countQuery.or(`title.ilike.%${search}%,content.ilike.%${search}%,excerpt.ilike.%${search}%`)
      }

      const { count, error: countError } = await countQuery

      if (countError) throw countError

      return {
        success: true,
        data: {
          blogs: blogs || [],
          total: count || 0
        }
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Failed to get blogs',
        error: error.message
      }
    }
  }

  async getBlogBySlug(slug: string): Promise<ApiResponse<Blog>> {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single()

      if (error) throw error

      return {
        success: true,
        data
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Blog not found',
        error: error.message
      }
    }
  }

  // Content methods
  async getContent(key: string): Promise<ApiResponse<Content>> {
    try {
      const { data, error } = await supabase
        .from('content')
        .select('*')
        .eq('key_name', key)
        .eq('is_active', true)
        .single()

      if (error) throw error

      return {
        success: true,
        data
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Content not found',
        error: error.message
      }
    }
  }

  // Testimonials methods
  async getTestimonials(): Promise<ApiResponse<Testimonial[]>> {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false })

      if (error) throw error

      return {
        success: true,
        data: data || []
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Failed to get testimonials',
        error: error.message
      }
    }
  }

  // Events methods
  async getEvents(): Promise<ApiResponse<Event[]>> {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: true })

      if (error) throw error

      return {
        success: true,
        data: data || []
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Failed to get events',
        error: error.message
      }
    }
  }

  // Admin methods
  async getDashboardStats(): Promise<ApiResponse<any>> {
    try {
      // Get donation stats
      const { data: donationStats, error: donationError } = await supabase
        .rpc('get_donation_stats')

      if (donationError) throw donationError

      // Get user stats
      const { data: userStats, error: userError } = await supabase
        .rpc('get_user_stats')

      if (userError) throw userError

      // Get recent donations
      const { data: recentDonations, error: recentError } = await supabase
        .from('donations')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10)

      if (recentError) throw recentError

      return {
        success: true,
        data: {
          overview: {
            ...donationStats,
            ...userStats
          },
          recentDonations: recentDonations || []
        }
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Failed to get dashboard stats',
        error: error.message
      }
    }
  }
}

export const supabaseApi = new SupabaseApiClient()