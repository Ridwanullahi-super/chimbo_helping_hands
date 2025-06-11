'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, DollarSign, PieChart, FileText, Download, Eye, TrendingUp } from 'lucide-react'

export default function TransparencyPage() {
  const financialData = {
    totalRevenue: 2500000,
    programExpenses: 2125000,
    adminExpenses: 187500,
    fundraisingExpenses: 187500,
    programPercentage: 85,
    adminPercentage: 7.5,
    fundraisingPercentage: 7.5
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

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
            <Eye className="h-16 w-16 text-white mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Financial Transparency
            </h1>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto">
              We believe in complete transparency. See exactly how your donations are used to create positive change.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

          {/* Financial Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg p-8 mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              2023 Financial Overview
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="text-center">
                <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <DollarSign className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{formatCurrency(financialData.totalRevenue)}</h3>
                <p className="text-gray-600">Total Revenue</p>
              </div>
              
              <div className="text-center">
                <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <TrendingUp className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{financialData.programPercentage}%</h3>
                <p className="text-gray-600">Program Expenses</p>
              </div>
              
              <div className="text-center">
                <div className="bg-purple-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <PieChart className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{financialData.adminPercentage}%</h3>
                <p className="text-gray-600">Administrative</p>
              </div>
              
              <div className="text-center">
                <div className="bg-orange-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <FileText className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{financialData.fundraisingPercentage}%</h3>
                <p className="text-gray-600">Fundraising</p>
              </div>
            </div>

            {/* Expense Breakdown */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Expense Breakdown</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Program Expenses</span>
                  <div className="flex items-center gap-3">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${financialData.programPercentage}%` }}
                      ></div>
                    </div>
                    <span className="font-semibold text-gray-900 w-20 text-right">
                      {formatCurrency(financialData.programExpenses)}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Administrative Expenses</span>
                  <div className="flex items-center gap-3">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full" 
                        style={{ width: `${financialData.adminPercentage}%` }}
                      ></div>
                    </div>
                    <span className="font-semibold text-gray-900 w-20 text-right">
                      {formatCurrency(financialData.adminExpenses)}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Fundraising Expenses</span>
                  <div className="flex items-center gap-3">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-orange-600 h-2 rounded-full" 
                        style={{ width: `${financialData.fundraisingPercentage}%` }}
                      ></div>
                    </div>
                    <span className="font-semibold text-gray-900 w-20 text-right">
                      {formatCurrency(financialData.fundraisingExpenses)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Program Impact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-8 mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Where Your Money Goes
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Education Programs</h3>
                  <p className="text-3xl font-bold text-blue-600 mb-2">35%</p>
                  <p className="text-sm text-gray-600">Building schools, providing scholarships, and training teachers</p>
                </div>
              </div>
              
              <div className="text-center">
                <div className="bg-green-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Clean Water</h3>
                  <p className="text-3xl font-bold text-green-600 mb-2">25%</p>
                  <p className="text-sm text-gray-600">Installing wells, water systems, and sanitation facilities</p>
                </div>
              </div>
              
              <div className="text-center">
                <div className="bg-purple-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Healthcare</h3>
                  <p className="text-3xl font-bold text-purple-600 mb-2">20%</p>
                  <p className="text-sm text-gray-600">Mobile clinics, medical supplies, and health education</p>
                </div>
              </div>
              
              <div className="text-center">
                <div className="bg-orange-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Emergency Relief</h3>
                  <p className="text-3xl font-bold text-orange-600 mb-2">20%</p>
                  <p className="text-sm text-gray-600">Disaster response, food aid, and emergency shelter</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Financial Documents */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white rounded-xl shadow-lg p-8 mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Financial Documents
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: 'Annual Report 2023',
                  description: 'Complete overview of our programs, impact, and financials',
                  type: 'PDF',
                  size: '2.4 MB'
                },
                {
                  title: 'Audited Financial Statements 2023',
                  description: 'Independent audit of our financial records',
                  type: 'PDF',
                  size: '1.8 MB'
                },
                {
                  title: 'IRS Form 990',
                  description: 'Tax-exempt organization annual filing',
                  type: 'PDF',
                  size: '1.2 MB'
                },
                {
                  title: 'Quarterly Report Q4 2023',
                  description: 'Latest quarterly financial and program update',
                  type: 'PDF',
                  size: '950 KB'
                },
                {
                  title: 'Program Impact Report',
                  description: 'Detailed analysis of program outcomes and metrics',
                  type: 'PDF',
                  size: '3.1 MB'
                },
                {
                  title: 'Donor Impact Summary',
                  description: 'How donations were used to create change',
                  type: 'PDF',
                  size: '1.5 MB'
                }
              ].map((document, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <FileText className="h-8 w-8 text-primary-600" />
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                      {document.type}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{document.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{document.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{document.size}</span>
                    <button className="inline-flex items-center gap-1 text-primary-600 hover:text-primary-700 text-sm font-medium">
                      <Download className="h-4 w-4" />
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Accountability */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white rounded-xl shadow-lg p-8"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Our Commitment to Accountability
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Independent Oversight</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Annual independent financial audits</li>
                  <li>• Board of Directors with diverse expertise</li>
                  <li>• Regular program evaluations by third parties</li>
                  <li>• Compliance with all regulatory requirements</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Transparency Standards</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Quarterly financial reporting</li>
                  <li>• Public access to all financial documents</li>
                  <li>• Regular donor updates and impact reports</li>
                  <li>• Open communication channels for questions</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-8 p-6 bg-primary-50 rounded-lg">
              <h3 className="text-lg font-semibold text-primary-900 mb-2">Questions About Our Finances?</h3>
              <p className="text-primary-800 mb-4">
                We're committed to transparency and welcome any questions about how we use your donations.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
              >
                Contact Our Finance Team
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}