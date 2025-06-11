'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Search, Home, ArrowLeft, Heart } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-16">
      <div className="max-w-lg w-full space-y-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-primary-100">
            <Search className="h-10 w-10 text-primary-600" />
          </div>
          
          <h1 className="mt-6 text-6xl font-bold text-gray-900">
            404
          </h1>
          
          <h2 className="mt-2 text-3xl font-bold text-gray-900">
            Page Not Found
          </h2>
          
          <p className="mt-4 text-lg text-gray-600">
            Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or you entered the wrong URL.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-4"
        >
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
            >
              <Home className="h-5 w-5" />
              Go Home
            </Link>
            
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              Go Back
            </button>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-4">
              Looking for something specific? Try these popular pages:
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <Link
                href="/about"
                className="text-primary-600 hover:text-primary-700 text-sm font-medium px-3 py-1 rounded-full bg-primary-50 hover:bg-primary-100 transition-colors"
              >
                About Us
              </Link>
              <Link
                href="/donate"
                className="text-primary-600 hover:text-primary-700 text-sm font-medium px-3 py-1 rounded-full bg-primary-50 hover:bg-primary-100 transition-colors"
              >
                Donate
              </Link>
              <Link
                href="/blog"
                className="text-primary-600 hover:text-primary-700 text-sm font-medium px-3 py-1 rounded-full bg-primary-50 hover:bg-primary-100 transition-colors"
              >
                Blog
              </Link>
              <Link
                href="/contact"
                className="text-primary-600 hover:text-primary-700 text-sm font-medium px-3 py-1 rounded-full bg-primary-50 hover:bg-primary-100 transition-colors"
              >
                Contact
              </Link>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex items-center justify-center gap-2 text-gray-400"
        >
          <Heart className="h-4 w-4" />
          <span className="text-sm">Chimbo Helping Hands</span>
        </motion.div>
      </div>
    </div>
  )
}