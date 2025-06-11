'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { AlertTriangle, Home, RefreshCw, Mail } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-16">
      <div className="max-w-md w-full space-y-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-red-100">
            <AlertTriangle className="h-10 w-10 text-red-600" />
          </div>
          
          <h1 className="mt-6 text-3xl font-bold text-gray-900">
            Oops! Something went wrong
          </h1>
          
          <p className="mt-4 text-lg text-gray-600">
            We encountered an unexpected error. Don't worry, our team has been notified and we're working to fix it.
          </p>
          
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-left">
              <h3 className="text-sm font-medium text-red-800 mb-2">Error Details (Development):</h3>
              <p className="text-sm text-red-700 font-mono break-all">
                {error.message}
              </p>
              {error.digest && (
                <p className="text-xs text-red-600 mt-2">
                  Error ID: {error.digest}
                </p>
              )}
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-4"
        >
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={reset}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
            >
              <RefreshCw className="h-5 w-5" />
              Try Again
            </button>
            
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
            >
              <Home className="h-5 w-5" />
              Go Home
            </Link>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-2">
              Still having trouble? Contact our support team
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-1 text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              <Mail className="h-4 w-4" />
              Contact Support
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-xs text-gray-400"
        >
          <p>Error occurred at: {new Date().toLocaleString()}</p>
        </motion.div>
      </div>
    </div>
  )
}