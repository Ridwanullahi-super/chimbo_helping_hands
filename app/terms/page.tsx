'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Shield, FileText, Users, Globe } from 'lucide-react'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Header */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <FileText className="h-16 w-16 text-white mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Terms of Service
            </h1>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto">
              Please read these terms carefully before using our services
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 transition-colors mb-8"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg p-8 md:p-12"
          >
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-600 mb-8">
                <strong>Last updated:</strong> {new Date().toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-600 mb-6">
                By accessing and using the Chimbo Helping Hands website and services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. About Our Organization</h2>
              <p className="text-gray-600 mb-6">
                Chimbo Helping Hands is a registered non-profit organization dedicated to creating positive change in communities worldwide. We operate with full transparency and accountability in all our programs and initiatives.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Use of Our Services</h2>
              <p className="text-gray-600 mb-4">
                You may use our website and services for lawful purposes only. You agree not to use the service:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-6">
                <li>In any way that violates any applicable federal, state, local, or international law or regulation</li>
                <li>To transmit, or procure the sending of, any advertising or promotional material, or any other form of similar solicitation</li>
                <li>To impersonate or attempt to impersonate the organization, an employee, another user, or any other person or entity</li>
                <li>To engage in any other conduct that restricts or inhibits anyone's use or enjoyment of the website</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Donations and Payments</h2>
              <p className="text-gray-600 mb-4">
                When making donations through our platform:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-6">
                <li>All donations are voluntary and non-refundable unless required by law</li>
                <li>We use secure, third-party payment processors to handle all transactions</li>
                <li>You will receive a receipt for tax-deductible donations as applicable</li>
                <li>We reserve the right to refuse or return any donation at our discretion</li>
                <li>Recurring donations can be cancelled at any time by contacting us</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. User Accounts</h2>
              <p className="text-gray-600 mb-4">
                When you create an account with us:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-6">
                <li>You are responsible for safeguarding your password and all activities under your account</li>
                <li>You must provide accurate and complete information</li>
                <li>You must promptly update your account information if it changes</li>
                <li>We reserve the right to suspend or terminate accounts that violate these terms</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Privacy and Data Protection</h2>
              <p className="text-gray-600 mb-6">
                Your privacy is important to us. Please review our Privacy Policy, which also governs your use of our services, to understand our practices regarding the collection and use of your personal information.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Intellectual Property Rights</h2>
              <p className="text-gray-600 mb-6">
                The service and its original content, features, and functionality are and will remain the exclusive property of Chimbo Helping Hands and its licensors. The service is protected by copyright, trademark, and other laws. Our trademarks and trade dress may not be used in connection with any product or service without our prior written consent.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Disclaimer of Warranties</h2>
              <p className="text-gray-600 mb-6">
                The information on this website is provided on an "as is" basis. To the fullest extent permitted by law, this organization excludes all representations, warranties, conditions and terms whether express or implied, statutory or otherwise.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Limitation of Liability</h2>
              <p className="text-gray-600 mb-6">
                In no event shall Chimbo Helping Hands, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the service.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Governing Law</h2>
              <p className="text-gray-600 mb-6">
                These terms shall be interpreted and governed by the laws of the jurisdiction in which our organization is registered, without regard to its conflict of law provisions.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Changes to Terms</h2>
              <p className="text-gray-600 mb-6">
                We reserve the right, at our sole discretion, to modify or replace these terms at any time. If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Contact Information</h2>
              <p className="text-gray-600 mb-4">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-600 mb-2">
                  <strong>Email:</strong> legal@chimbohelpinghands.org
                </p>
                <p className="text-gray-600 mb-2">
                  <strong>Phone:</strong> +1 (555) 123-4567
                </p>
                <p className="text-gray-600">
                  <strong>Address:</strong> 123 Hope Street, Community Center, New York, NY 10001
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}