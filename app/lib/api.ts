const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: any[];
}

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    
    // Get token from localStorage if available
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
    }
  }

  setToken(token: string | null) {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('auth_token', token);
      } else {
        localStorage.removeItem('auth_token');
      }
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      // Handle non-JSON responses
      const contentType = response.headers.get('content-type');
      let data;
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        data = { message: text };
      }

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request error:', error);
      
      // Return mock responses for development when backend is not available
      if (process.env.NODE_ENV === 'development') {
        return this.getMockResponse<T>(endpoint, options.method || 'GET');
      }
      
      // For production, return a proper error response
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Network error occurred',
        errors: [error]
      };
    }
  }

  private getMockResponse<T>(endpoint: string, method: string): ApiResponse<T> {
    // Mock responses for development
    if (endpoint.includes('/auth/login') && method === 'POST') {
      return {
        success: true,
        message: 'Login successful',
        data: {
          token: 'mock-jwt-token-' + Date.now(),
          user: {
            id: 1,
            email: 'admin@chimbohelpinghands.org',
            first_name: 'Admin',
            last_name: 'User',
            role: 'admin',
            phone: '+1234567890',
            country: 'United States',
            is_active: true,
            created_at: new Date().toISOString()
          }
        } as T
      };
    }

    if (endpoint.includes('/auth/register') && method === 'POST') {
      return {
        success: true,
        message: 'Registration successful',
        data: {
          token: 'mock-jwt-token-' + Date.now(),
          user: {
            id: Date.now(),
            email: 'user@example.com',
            first_name: 'John',
            last_name: 'Doe',
            role: 'user',
            phone: '',
            country: '',
            is_active: true,
            created_at: new Date().toISOString()
          }
        } as T
      };
    }

    if (endpoint.includes('/auth/me')) {
      return {
        success: true,
        data: {
          id: 1,
          email: 'admin@chimbohelpinghands.org',
          first_name: 'Admin',
          last_name: 'User',
          role: 'admin',
          phone: '+1234567890',
          country: 'United States',
          is_active: true,
          created_at: new Date().toISOString()
        } as T
      };
    }

    if (endpoint.includes('/blogs')) {
      return {
        success: true,
        data: {
          blogs: [
            {
              id: 1,
              title: 'Building Wells in Rural Kenya',
              slug: 'building-wells-rural-kenya',
              excerpt: 'Learn about our successful water well project that brought clean water to 500+ families in rural Kenya.',
              featured_image: 'https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg?auto=compress&cs=tinysrgb&w=800',
              author: 'Admin User',
              created_at: '2024-01-15T10:00:00Z',
              tags: ['water', 'kenya', 'community'],
              status: 'published',
              content: '<p>Our latest water project in rural Kenya has been a tremendous success...</p>'
            },
            {
              id: 2,
              title: 'Education Changes Everything',
              slug: 'education-changes-everything',
              excerpt: 'Discover how our education programs are transforming communities and creating lasting change.',
              featured_image: 'https://images.pexels.com/photos/8613089/pexels-photo-8613089.jpeg?auto=compress&cs=tinysrgb&w=800',
              author: 'Admin User',
              created_at: '2024-01-10T10:00:00Z',
              tags: ['education', 'community', 'development'],
              status: 'published',
              content: '<p>Education is the foundation of sustainable development...</p>'
            }
          ],
          pagination: {
            totalPages: 1,
            currentPage: 1,
            total: 2
          }
        } as T
      };
    }

    if (endpoint.includes('/admin/dashboard')) {
      return {
        success: true,
        data: {
          overview: {
            total_donations: 150,
            total_raised: 125000,
            successful_donations: 145,
            pending_donations: 5,
            total_users: 1250,
            admin_users: 3,
            new_users_30d: 45,
            total_blogs: 12,
            published_blogs: 10,
            draft_blogs: 2
          },
          recentDonations: [
            {
              id: 1,
              donor_name: 'John Doe',
              donor_email: 'john@example.com',
              amount: 100,
              currency: 'USD',
              payment_status: 'completed',
              created_at: '2024-01-15T10:00:00Z'
            },
            {
              id: 2,
              donor_name: 'Jane Smith',
              donor_email: 'jane@example.com',
              amount: 250,
              currency: 'USD',
              payment_status: 'completed',
              created_at: '2024-01-14T15:30:00Z'
            }
          ]
        } as T
      };
    }

    // Default mock response
    return {
      success: true,
      message: 'Mock response - Backend not connected',
      data: {} as T
    };
  }

  // Auth methods
  async register(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    country?: string;
  }) {
    const response = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email: userData.email,
        password: userData.password,
        first_name: userData.firstName,
        last_name: userData.lastName,
        phone: userData.phone,
        country: userData.country
      }),
    });

    if (response.success && response.data?.token) {
      this.setToken(response.data.token);
    }

    return response;
  }

  async login(credentials: { email: string; password: string }) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (response.success && response.data?.token) {
      this.setToken(response.data.token);
    }

    return response;
  }

  async logout() {
    this.setToken(null);
    return { success: true, message: 'Logged out successfully' };
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  async updateProfile(profileData: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    country?: string;
  }) {
    return this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify({
        first_name: profileData.firstName,
        last_name: profileData.lastName,
        phone: profileData.phone,
        country: profileData.country
      }),
    });
  }

  // Blog methods
  async getBlogs(page = 1, limit = 10, search = '') {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
    });
    return this.request(`/blogs?${params}`);
  }

  async getBlog(slug: string) {
    return this.request(`/blogs/${slug}`);
  }

  async createBlog(blogData: {
    title: string;
    content: string;
    excerpt?: string;
    featuredImage?: string;
    tags?: string[];
    status?: 'draft' | 'published';
    metaDescription?: string;
  }) {
    return this.request('/blogs', {
      method: 'POST',
      body: JSON.stringify({
        title: blogData.title,
        content: blogData.content,
        excerpt: blogData.excerpt,
        featured_image: blogData.featuredImage,
        tags: blogData.tags,
        status: blogData.status || 'draft',
        meta_description: blogData.metaDescription
      }),
    });
  }

  async updateBlog(id: number, blogData: Partial<{
    title: string;
    content: string;
    excerpt: string;
    featuredImage: string;
    tags: string[];
    status: 'draft' | 'published';
    metaDescription: string;
  }>) {
    return this.request(`/blogs/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        title: blogData.title,
        content: blogData.content,
        excerpt: blogData.excerpt,
        featured_image: blogData.featuredImage,
        tags: blogData.tags,
        status: blogData.status,
        meta_description: blogData.metaDescription
      }),
    });
  }

  async deleteBlog(id: number) {
    return this.request(`/blogs/${id}`, {
      method: 'DELETE',
    });
  }

  // Admin methods
  async getDashboardStats() {
    return this.request('/admin/dashboard');
  }

  // Donation methods
  async createDonation(donationData: {
    amount: number;
    currency: string;
    frequency: 'one-time' | 'monthly';
    paymentMethod: string;
    donorName: string;
    donorEmail: string;
    donorPhone?: string;
    donorAddress?: string;
    donorCity?: string;
    donorZip?: string;
    donorCountry?: string;
    isAnonymous?: boolean;
  }) {
    return this.request('/donations', {
      method: 'POST',
      body: JSON.stringify({
        amount: donationData.amount,
        currency: donationData.currency,
        frequency: donationData.frequency,
        payment_method: donationData.paymentMethod,
        donor_name: donationData.donorName,
        donor_email: donationData.donorEmail,
        donor_phone: donationData.donorPhone,
        donor_address: donationData.donorAddress,
        donor_city: donationData.donorCity,
        donor_zip: donationData.donorZip,
        donor_country: donationData.donorCountry,
        is_anonymous: donationData.isAnonymous || false
      }),
    });
  }

  async getUserDonations(page = 1, limit = 10) {
    return this.request(`/donations/my-donations?page=${page}&limit=${limit}`);
  }

  async getDonationStats() {
    return this.request('/donations/stats');
  }

  // Payment methods
  async createStripePaymentIntent(data: {
    donationId: number;
    amount: number;
    currency: string;
  }) {
    return this.request('/payments/stripe/create-intent', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getPaymentMethods(country: string) {
    return this.request(`/payments/methods/${country}`);
  }

  async getUsers(page = 1, limit = 20, search = '') {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
    });
    return this.request(`/admin/users?${params}`);
  }

  async getAllDonations(page = 1, limit = 20, status = '') {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(status && { status }),
    });
    return this.request(`/admin/donations?${params}`);
  }

  async updateUserStatus(id: number, isActive: boolean) {
    return this.request(`/admin/users/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ is_active: isActive }),
    });
  }

  async updateUserRole(id: number, role: 'user' | 'admin') {
    return this.request(`/admin/users/${id}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role }),
    });
  }

  async deleteUser(id: number) {
    return this.request(`/admin/users/${id}`, {
      method: 'DELETE',
    });
  }

  // Content methods
  async getContent(key: string) {
    return this.request(`/content/${key}`);
  }

  async getAllContent() {
    return this.request('/content');
  }

  async saveContent(contentData: {
    keyName: string;
    title?: string;
    content: any;
    type?: 'text' | 'html' | 'json';
    isActive?: boolean;
  }) {
    return this.request('/content', {
      method: 'POST',
      body: JSON.stringify({
        key_name: contentData.keyName,
        title: contentData.title,
        content: contentData.content,
        type: contentData.type || 'text',
        is_active: contentData.isActive !== false
      }),
    });
  }

  async updateContentStatus(key: string, isActive: boolean) {
    return this.request(`/content/${key}/status`, {
      method: 'PUT',
      body: JSON.stringify({ is_active: isActive }),
    });
  }

  async deleteContent(key: string) {
    return this.request(`/content/${key}`, {
      method: 'DELETE',
    });
  }

  async bulkUpdateContent(updates: Array<{
    keyName: string;
    title?: string;
    content: any;
    type?: 'text' | 'html' | 'json';
    isActive?: boolean;
  }>) {
    return this.request('/content/bulk-update', {
      method: 'POST',
      body: JSON.stringify({ 
        updates: updates.map(update => ({
          key_name: update.keyName,
          title: update.title,
          content: update.content,
          type: update.type || 'text',
          is_active: update.isActive !== false
        }))
      }),
    });
  }

  // Testimonials methods
  async getTestimonials() {
    return this.request('/testimonials');
  }

  // Events methods
  async getEvents() {
    return this.request('/events');
  }
}

// Create and export API client instance
export const api = new ApiClient(API_BASE_URL);

// Export types
export type { ApiResponse };