'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Save, Eye, Image, Tag, FileText } from 'lucide-react'
import { useAuth } from '../../../../context/AuthContext'
import { api } from '../../../../lib/api'
import toast from 'react-hot-toast'

interface BlogData {
  id: number
  title: string
  content: string
  excerpt: string
  featured_image: string
  tags: string[]
  status: 'draft' | 'published'
  meta_description: string
}

export default function EditBlogPage() {
  const { user, isAdmin, loading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    featuredImage: '',
    tags: '',
    status: 'draft' as 'draft' | 'published',
    metaDescription: ''
  })

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.push('/')
      toast.error('Access denied. Admin privileges required.')
      return
    }

    if (isAdmin && params.id) {
      loadBlog(params.id as string)
    }
  }, [loading, isAdmin, router, params.id])

  const loadBlog = async (id: string) => {
    try {
      setIsLoading(true)
      // Note: You'll need to implement getBlogById in your API
      const response = await api.getBlog(id)
      
      if (response.success && response.data) {
        const blog = response.data
        setFormData({
          title: blog.title || '',
          content: blog.content || '',
          excerpt: blog.excerpt || '',
          featuredImage: blog.featured_image || '',
          tags: blog.tags ? blog.tags.join(', ') : '',
          status: blog.status || 'draft',
          metaDescription: blog.meta_description || ''
        })
      } else {
        toast.error('Blog post not found')
        router.push('/admin/blogs')
      }
    } catch (error) {
      console.error('Failed to load blog:', error)
      toast.error('Failed to load blog post')
      router.push('/admin/blogs')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error('Title and content are required')
      return
    }

    setIsSubmitting(true)

    try {
      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0)

      const response = await api.updateBlog(parseInt(params.id as string), {
        title: formData.title,
        content: formData.content,
        excerpt: formData.excerpt || undefined,
        featuredImage: formData.featuredImage || undefined,
        tags: tagsArray.length > 0 ? tagsArray : undefined,
        status: formData.status,
        metaDescription: formData.metaDescription || undefined
      })

      if (response.success) {
        toast.success('Blog post updated successfully!')
        router.push('/admin/blogs')
      } else {
        toast.error(response.message || 'Failed to update blog post')
      }
    } catch (error) {
      console.error('Update blog error:', error)
      toast.error('Failed to update blog post')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  if (loading || !isAdmin || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/admin/blogs')}
              className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit Blog Post</h1>
              <p className="text-gray-600 mt-1">Update your blog post content and settings</p>
            </div>
          </div>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg p-8"
          >
            {/* Title */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg"
                placeholder="Enter blog post title..."
              />
            </div>

            {/* Excerpt */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Excerpt
              </label>
              <textarea
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Brief description of the blog post..."
              />
              <p className="text-sm text-gray-500 mt-1">
                This will be shown in blog listings and search results
              </p>
            </div>

            {/* Content */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content *
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                required
                rows={15}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono text-sm"
                placeholder="Write your blog post content here... You can use HTML tags for formatting."
              />
              <p className="text-sm text-gray-500 mt-1">
                You can use HTML tags for formatting (e.g., &lt;p&gt;, &lt;h2&gt;, &lt;strong&gt;, &lt;em&gt;, etc.)
              </p>
            </div>
          </motion.div>

          {/* Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {/* SEO Settings */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  SEO Settings
                </h3>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Description
                  </label>
                  <textarea
                    name="metaDescription"
                    value={formData.metaDescription}
                    onChange={handleChange}
                    rows={3}
                    maxLength={160}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Brief description for search engines (max 160 characters)..."
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    {formData.metaDescription.length}/160 characters
                  </p>
                </div>
              </motion.div>
            </div>

            <div className="space-y-6">
              {/* Publish Settings */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Publish</h3>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Updating...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Update Post
                      </>
                    )}
                  </button>
                </div>
              </motion.div>

              {/* Featured Image */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Image className="h-5 w-5" />
                  Featured Image
                </h3>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image URL
                  </label>
                  <input
                    type="url"
                    name="featuredImage"
                    value={formData.featuredImage}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                {formData.featuredImage && (
                  <div className="mt-4">
                    <img
                      src={formData.featuredImage}
                      alt="Featured image preview"
                      className="w-full h-32 object-cover rounded-lg"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                  </div>
                )}
              </motion.div>

              {/* Tags */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  Tags
                </h3>
                
                <div className="mb-4">
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="education, health, community"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Separate tags with commas
                  </p>
                </div>

                {formData.tags && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.split(',').map((tag, index) => {
                      const trimmedTag = tag.trim()
                      if (!trimmedTag) return null
                      return (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-primary-100 text-primary-700 text-sm rounded-full"
                        >
                          <Tag className="h-3 w-3" />
                          {trimmedTag}
                        </span>
                      )
                    })}
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}