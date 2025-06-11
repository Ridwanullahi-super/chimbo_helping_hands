'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { CheckCircle, Heart, Share2, Download, Home, Facebook, Twitter, Linkedin } from 'lucide-react'

export default function DonationSuccessPage() {
  const [donationData, setDonationData] = useState({
    amount: 100,
    currency: 'USD',
    transactionId: 'TXN_' + Date.now(),
    date: new Date().toLocaleDateString()
  })

  useEffect(() => {
    // In a real app, you'd get this data from URL params or state
    const urlParams = new URLSearchParams(window.location.search)
    const amount = urlParams.get('amount')
    const currency = urlParams.get('currency')
    
    if (amount && currency) {
      setDonationData(prev => ({
        ...prev,
        amount: parseFloat(amount),
        currency: currency
      }))
    }
  }, [])

  const shareUrl = typeof window !== 'undefined' ? window.location.origin : ''
  const shareText = `I just donated to Chimbo Helping Hands! Join me in making a difference. Every donation counts! 💙`

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&summary=${encodeURIComponent(shareText)}`
  }

  const downloadReceipt = () => {
    // In a real app, this would generate and download a PDF receipt
    const receiptData = `
DONATION RECEIPT
Chimbo Helping Hands

Transaction ID: ${donationData.transactionId}
Date: ${donationData.date}
Amount: ${donationData.currency} ${donationData.amount}

Thank you for your generous donation!
This receipt serves as proof of your contribution.

For questions, contact: info@chimbohelpinghands.org
    `.trim()

    const blob = new Blob([receiptData], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `donation-receipt-${donationData.transactionId}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Thank You for Your Donation!
          </h1>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your generous contribution of <span className="font-semibold text-primary-600">
            {donationData.currency} {donationData.amount}</span> will make a real difference 
            in the lives of those we serve.
          </p>
        </motion.div>

        {/* Donation Details */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-8 mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Donation Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
                Transaction ID
              </h3>
              <p className="text-lg font-mono text-gray-900">{donationData.transactionId}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
                Date
              </h3>
              <p className="text-lg text-gray-900">{donationData.date}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
                Amount
              </h3>
              <p className="text-2xl font-bold text-primary-600">
                {donationData.currency} {donationData.amount}
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
                Status
              </h3>
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                <CheckCircle className="h-4 w-4" />
                Completed
              </span>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={downloadReceipt}
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Download className="h-4 w-4" />
              Download Receipt
            </button>
          </div>
        </motion.div>

        {/* Impact Message */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-primary-50 rounded-xl p-8 mb-8"
        >
          <div className="flex items-start gap-4">
            <Heart className="h-8 w-8 text-primary-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-xl font-bold text-primary-900 mb-3">
                Your Impact
              </h3>
              <p className="text-primary-800 mb-4">
                Your donation of {donationData.currency} {donationData.amount} will help us:
              </p>
              <ul className="space-y-2 text-primary-700">
                {donationData.amount >= 300 && (
                  <li>• Support healthcare for a community for one week</li>
                )}
                {donationData.amount >= 140 && (
                  <li>• Provide nutritious meals for 20 children</li>
                )}
                {donationData.amount >= 60 && (
                  <li>• Fund school supplies for 5 children</li>
                )}
                {donationData.amount >= 30 && (
                  <li>• Provide clean water for a family for one month</li>
                )}
                <li>• Continue our mission to create positive change worldwide</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Share Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="bg-white rounded-xl shadow-lg p-8 mb-8"
        >
          <div className="text-center">
            <Share2 className="h-8 w-8 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Spread the Word
            </h3>
            <p className="text-gray-600 mb-6">
              Help us reach more people by sharing your donation on social media
            </p>
            
            <div className="flex justify-center gap-4">
              <a
                href={shareLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Facebook className="h-4 w-4" />
                Facebook
              </a>
              <a
                href={shareLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-colors"
              >
                <Twitter className="h-4 w-4" />
                Twitter
              </a>
              <a
                href={shareLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
              >
                <Linkedin className="h-4 w-4" />
                LinkedIn
              </a>
            </div>
          </div>
        </motion.div>

        {/* Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-4">What's Next?</h3>
          <p className="text-gray-600 mb-6">
            You'll receive a confirmation email shortly with your receipt and updates on how your donation is being used.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
            >
              <Home className="h-5 w-5" />
              Return Home
            </Link>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Read Our Stories
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}