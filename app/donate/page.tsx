'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, CreditCard, Repeat, Globe, Shield, CheckCircle } from 'lucide-react'
import DonationForm from '../components/DonationForm'

const presetAmounts = [600, 300, 140, 60, 35, 30]

const currencies = [
  { code: 'USD', symbol: '$', name: 'US Dollar', countries: ['United States', 'Ecuador', 'El Salvador'] },
  { code: 'EUR', symbol: '€', name: 'Euro', countries: ['Germany', 'France', 'Italy', 'Spain', 'Netherlands', 'Belgium', 'Austria', 'Portugal', 'Ireland', 'Greece', 'Finland', 'Luxembourg', 'Slovenia', 'Cyprus', 'Malta', 'Slovakia', 'Estonia', 'Latvia', 'Lithuania'] },
  { code: 'GBP', symbol: '£', name: 'British Pound', countries: ['United Kingdom', 'England', 'Scotland', 'Wales', 'Northern Ireland'] },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', countries: ['Canada'] },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', countries: ['Australia'] },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', countries: ['Japan'] },
  { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc', countries: ['Switzerland', 'Liechtenstein'] },
  { code: 'SEK', symbol: 'kr', name: 'Swedish Krona', countries: ['Sweden'] },
  { code: 'NOK', symbol: 'kr', name: 'Norwegian Krone', countries: ['Norway'] },
  { code: 'DKK', symbol: 'kr', name: 'Danish Krone', countries: ['Denmark'] },
  { code: 'PLN', symbol: 'zł', name: 'Polish Złoty', countries: ['Poland'] },
  { code: 'CZK', symbol: 'Kč', name: 'Czech Koruna', countries: ['Czech Republic'] },
  { code: 'HUF', symbol: 'Ft', name: 'Hungarian Forint', countries: ['Hungary'] },
  { code: 'RON', symbol: 'lei', name: 'Romanian Leu', countries: ['Romania'] },
  { code: 'BGN', symbol: 'лв', name: 'Bulgarian Lev', countries: ['Bulgaria'] },
  { code: 'HRK', symbol: 'kn', name: 'Croatian Kuna', countries: ['Croatia'] },
  { code: 'NGN', symbol: '₦', name: 'Nigerian Naira', countries: ['Nigeria'] },
  { code: 'ZAR', symbol: 'R', name: 'South African Rand', countries: ['South Africa', 'Lesotho', 'Eswatini'] },
  { code: 'KES', symbol: 'KSh', name: 'Kenyan Shilling', countries: ['Kenya'] },
  { code: 'GHS', symbol: '₵', name: 'Ghanaian Cedi', countries: ['Ghana'] },
  { code: 'EGP', symbol: '£', name: 'Egyptian Pound', countries: ['Egypt'] },
  { code: 'MAD', symbol: 'DH', name: 'Moroccan Dirham', countries: ['Morocco'] },
  { code: 'TND', symbol: 'د.ت', name: 'Tunisian Dinar', countries: ['Tunisia'] },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', countries: ['India', 'Bhutan'] },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', countries: ['China'] },
  { code: 'KRW', symbol: '₩', name: 'South Korean Won', countries: ['South Korea'] },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', countries: ['Singapore'] },
  { code: 'HKD', symbol: 'HK$', name: 'Hong Kong Dollar', countries: ['Hong Kong'] },
  { code: 'TWD', symbol: 'NT$', name: 'Taiwan Dollar', countries: ['Taiwan'] },
  { code: 'THB', symbol: '฿', name: 'Thai Baht', countries: ['Thailand'] },
  { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit', countries: ['Malaysia'] },
  { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah', countries: ['Indonesia'] },
  { code: 'PHP', symbol: '₱', name: 'Philippine Peso', countries: ['Philippines'] },
  { code: 'VND', symbol: '₫', name: 'Vietnamese Dong', countries: ['Vietnam'] },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real', countries: ['Brazil'] },
  { code: 'ARS', symbol: '$', name: 'Argentine Peso', countries: ['Argentina'] },
  { code: 'CLP', symbol: '$', name: 'Chilean Peso', countries: ['Chile'] },
  { code: 'COP', symbol: '$', name: 'Colombian Peso', countries: ['Colombia'] },
  { code: 'PEN', symbol: 'S/', name: 'Peruvian Sol', countries: ['Peru'] },
  { code: 'MXN', symbol: '$', name: 'Mexican Peso', countries: ['Mexico'] },
  { code: 'RUB', symbol: '₽', name: 'Russian Ruble', countries: ['Russia'] },
  { code: 'TRY', symbol: '₺', name: 'Turkish Lira', countries: ['Turkey'] },
  { code: 'ILS', symbol: '₪', name: 'Israeli Shekel', countries: ['Israel'] },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham', countries: ['United Arab Emirates'] },
  { code: 'SAR', symbol: '﷼', name: 'Saudi Riyal', countries: ['Saudi Arabia'] },
  { code: 'QAR', symbol: '﷼', name: 'Qatari Riyal', countries: ['Qatar'] },
  { code: 'KWD', symbol: 'د.ك', name: 'Kuwaiti Dinar', countries: ['Kuwait'] },
  { code: 'BHD', symbol: '.د.ب', name: 'Bahraini Dinar', countries: ['Bahrain'] },
  { code: 'OMR', symbol: '﷼', name: 'Omani Rial', countries: ['Oman'] },
  { code: 'JOD', symbol: 'د.ا', name: 'Jordanian Dinar', countries: ['Jordan'] },
  { code: 'LBP', symbol: '£', name: 'Lebanese Pound', countries: ['Lebanon'] }
]

const countries = [
  // North America
  'United States', 'Canada', 'Mexico',
  
  // Europe
  'United Kingdom', 'Germany', 'France', 'Italy', 'Spain', 'Netherlands', 'Belgium', 'Austria', 'Portugal', 'Ireland', 'Greece', 'Finland', 'Luxembourg', 'Slovenia', 'Cyprus', 'Malta', 'Slovakia', 'Estonia', 'Latvia', 'Lithuania', 'Poland', 'Czech Republic', 'Hungary', 'Romania', 'Bulgaria', 'Croatia', 'Sweden', 'Norway', 'Denmark', 'Switzerland', 'Iceland', 'Serbia', 'Bosnia and Herzegovina', 'Montenegro', 'North Macedonia', 'Albania', 'Moldova', 'Ukraine', 'Belarus',
  
  // Africa
  'Nigeria', 'South Africa', 'Kenya', 'Ghana', 'Egypt', 'Morocco', 'Tunisia', 'Algeria', 'Libya', 'Sudan', 'Ethiopia', 'Tanzania', 'Uganda', 'Rwanda', 'Zambia', 'Zimbabwe', 'Botswana', 'Namibia', 'Lesotho', 'Eswatini', 'Malawi', 'Mozambique', 'Madagascar', 'Mauritius', 'Seychelles', 'Cameroon', 'Ivory Coast', 'Senegal', 'Mali', 'Burkina Faso', 'Niger', 'Chad', 'Central African Republic', 'Democratic Republic of Congo', 'Republic of Congo', 'Gabon', 'Equatorial Guinea', 'São Tomé and Príncipe', 'Angola', 'Benin', 'Togo', 'Guinea', 'Guinea-Bissau', 'Sierra Leone', 'Liberia', 'Gambia', 'Cape Verde', 'Mauritania', 'Western Sahara', 'Somalia', 'Djibouti', 'Eritrea', 'Comoros',
  
  // Asia
  'India', 'China', 'Japan', 'South Korea', 'Singapore', 'Hong Kong', 'Taiwan', 'Thailand', 'Malaysia', 'Indonesia', 'Philippines', 'Vietnam', 'Cambodia', 'Laos', 'Myanmar', 'Bangladesh', 'Pakistan', 'Sri Lanka', 'Nepal', 'Bhutan', 'Maldives', 'Afghanistan', 'Iran', 'Iraq', 'Syria', 'Lebanon', 'Jordan', 'Israel', 'Palestine', 'Turkey', 'Cyprus', 'Georgia', 'Armenia', 'Azerbaijan', 'Kazakhstan', 'Kyrgyzstan', 'Tajikistan', 'Turkmenistan', 'Uzbekistan', 'Mongolia', 'North Korea',
  
  // Middle East
  'United Arab Emirates', 'Saudi Arabia', 'Qatar', 'Kuwait', 'Bahrain', 'Oman', 'Yemen',
  
  // Oceania
  'Australia', 'New Zealand', 'Fiji', 'Papua New Guinea', 'Solomon Islands', 'Vanuatu', 'Samoa', 'Tonga', 'Kiribati', 'Tuvalu', 'Nauru', 'Palau', 'Marshall Islands', 'Micronesia',
  
  // South America
  'Brazil', 'Argentina', 'Chile', 'Colombia', 'Peru', 'Venezuela', 'Ecuador', 'Bolivia', 'Paraguay', 'Uruguay', 'Guyana', 'Suriname', 'French Guiana',
  
  // Central America & Caribbean
  'Guatemala', 'Belize', 'El Salvador', 'Honduras', 'Nicaragua', 'Costa Rica', 'Panama', 'Cuba', 'Jamaica', 'Haiti', 'Dominican Republic', 'Puerto Rico', 'Trinidad and Tobago', 'Barbados', 'Saint Lucia', 'Grenada', 'Saint Vincent and the Grenadines', 'Antigua and Barbuda', 'Dominica', 'Saint Kitts and Nevis', 'Bahamas',
  
  // Other
  'Other'
].sort()

export default function DonatePage() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null)
  const [customAmount, setCustomAmount] = useState('')
  const [frequency, setFrequency] = useState<'one-time' | 'monthly'>('one-time')
  const [currency, setCurrency] = useState(currencies[0])
  const [country, setCountry] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'paypal' | 'flutterwave'>('stripe')

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount)
    setCustomAmount('')
  }

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value)
    setSelectedAmount(null)
  }

  const handleCountryChange = (selectedCountry: string) => {
    setCountry(selectedCountry)
    
    // Auto-select currency based on country
    const matchingCurrency = currencies.find(curr => 
      curr.countries.includes(selectedCountry)
    )
    if (matchingCurrency) {
      setCurrency(matchingCurrency)
    }
  }

  const getFinalAmount = () => {
    return selectedAmount || parseFloat(customAmount) || 0
  }

  const getAvailablePaymentMethods = () => {
    const methods = [
      {
        id: 'stripe' as const,
        name: 'Stripe (Credit/Debit Card)',
        description: 'Secure payment with Visa, Mastercard, American Express',
        icon: CreditCard,
        color: 'blue',
        available: true
      },
      {
        id: 'paypal' as const,
        name: 'PayPal',
        description: 'Pay with your PayPal account or card',
        icon: CreditCard,
        color: 'blue',
        available: true
      }
    ]

    // Add Flutterwave for African countries
    const africanCountries = [
      'Nigeria', 'Ghana', 'Kenya', 'South Africa', 'Egypt', 'Morocco', 'Tunisia', 
      'Algeria', 'Libya', 'Sudan', 'Ethiopia', 'Tanzania', 'Uganda', 'Rwanda',
      'Zambia', 'Zimbabwe', 'Botswana', 'Namibia', 'Cameroon', 'Ivory Coast',
      'Senegal', 'Mali', 'Burkina Faso'
    ]

    if (africanCountries.includes(country)) {
      methods.push({
        id: 'flutterwave' as const,
        name: 'Flutterwave',
        description: 'African payment methods (Mobile Money, Bank Transfer)',
        icon: CreditCard,
        color: 'orange',
        available: true
      })
    }

    return methods
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Heart className="h-16 w-16 text-white mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Make a Donation
            </h1>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto">
              Your generosity helps us create lasting change in communities worldwide. 
              Every donation, no matter the size, makes a real difference.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Donation Form Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Form Side */}
              <div className="p-8 lg:p-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-8">Choose Your Donation</h2>
                
                {/* Country Selection */}
                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    <Globe className="inline h-4 w-4 mr-2" />
                    Select Your Country
                  </label>
                  <select
                    value={country}
                    onChange={(e) => handleCountryChange(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Choose your country</option>
                    {countries.map((countryName) => (
                      <option key={countryName} value={countryName}>
                        {countryName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Currency Selection */}
                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Currency
                  </label>
                  <select
                    value={currency.code}
                    onChange={(e) => setCurrency(currencies.find(c => c.code === e.target.value) || currencies[0])}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    {currencies.map((curr) => (
                      <option key={curr.code} value={curr.code}>
                        {curr.symbol} {curr.name} ({curr.code})
                      </option>
                    ))}
                  </select>
                  <p className="text-sm text-gray-500 mt-1">
                    Supported in: {currency.countries.slice(0, 3).join(', ')}
                    {currency.countries.length > 3 && ` and ${currency.countries.length - 3} more`}
                  </p>
                </div>
                
                {/* Amount Selection */}
                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Select Amount ({currency.symbol})
                  </label>
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {presetAmounts.map((amount) => (
                      <button
                        key={amount}
                        onClick={() => handleAmountSelect(amount)}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          selectedAmount === amount
                            ? 'border-primary-600 bg-primary-50 text-primary-700'
                            : 'border-gray-200 hover:border-primary-300'
                        }`}
                      >
                        {currency.symbol}{amount}
                      </button>
                    ))}
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      {currency.symbol}
                    </span>
                    <input
                      type="number"
                      placeholder="Custom amount"
                      value={customAmount}
                      onChange={(e) => handleCustomAmountChange(e.target.value)}
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Frequency Selection */}
                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Donation Frequency
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setFrequency('one-time')}
                      className={`p-4 rounded-lg border-2 transition-all flex items-center justify-center gap-2 ${
                        frequency === 'one-time'
                          ? 'border-primary-600 bg-primary-50 text-primary-700'
                          : 'border-gray-200 hover:border-primary-300'
                      }`}
                    >
                      <CreditCard className="h-5 w-5" />
                      One-Time
                    </button>
                    <button
                      onClick={() => setFrequency('monthly')}
                      className={`p-4 rounded-lg border-2 transition-all flex items-center justify-center gap-2 ${
                        frequency === 'monthly'
                          ? 'border-primary-600 bg-primary-50 text-primary-700'
                          : 'border-gray-200 hover:border-primary-300'
                      }`}
                    >
                      <Repeat className="h-5 w-5" />
                      Monthly
                    </button>
                  </div>
                </div>

                {/* Payment Method Selection */}
                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Payment Method
                  </label>
                  <div className="space-y-3">
                    {getAvailablePaymentMethods().map((method) => (
                      <button
                        key={method.id}
                        onClick={() => setPaymentMethod(method.id)}
                        className={`w-full p-4 rounded-lg border-2 transition-all flex items-center gap-3 text-left ${
                          paymentMethod === method.id
                            ? 'border-primary-600 bg-primary-50'
                            : 'border-gray-200 hover:border-primary-300'
                        }`}
                      >
                        <div className={`w-8 h-8 bg-${method.color}-600 rounded flex items-center justify-center`}>
                          <method.icon className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <div className="font-medium">{method.name}</div>
                          <div className="text-sm text-gray-500">{method.description}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Donation Summary */}
                {getFinalAmount() > 0 && (
                  <div className="bg-gray-50 p-6 rounded-lg mb-8">
                    <h3 className="font-semibold text-gray-900 mb-2">Donation Summary</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Amount:</span>
                        <span className="font-medium">{currency.symbol}{getFinalAmount()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Frequency:</span>
                        <span className="font-medium capitalize">{frequency}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Currency:</span>
                        <span className="font-medium">{currency.name}</span>
                      </div>
                      {country && (
                        <div className="flex justify-between">
                          <span>Country:</span>
                          <span className="font-medium">{country}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <DonationForm
                  amount={getFinalAmount()}
                  currency={currency}
                  frequency={frequency}
                  country={country}
                  paymentMethod={paymentMethod}
                />
              </div>

              {/* Info Side */}
              <div className="bg-gray-50 p-8 lg:p-12">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Your Impact</h3>
                
                <div className="space-y-6 mb-8">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="h-4 w-4 text-primary-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">{currency.symbol}30 Impact</h4>
                      <p className="text-gray-600 text-sm">Provides clean water for a family for one month</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="h-4 w-4 text-primary-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">{currency.symbol}60 Impact</h4>
                      <p className="text-gray-600 text-sm">Funds school supplies for 5 children</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="h-4 w-4 text-primary-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">{currency.symbol}140 Impact</h4>
                      <p className="text-gray-600 text-sm">Provides nutritious meals for 20 children</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="h-4 w-4 text-primary-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">{currency.symbol}300 Impact</h4>
                      <p className="text-gray-600 text-sm">Supports healthcare for a community for one week</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Shield className="h-6 w-6 text-green-600" />
                    <h4 className="font-semibold text-gray-900">Secure & Transparent</h4>
                  </div>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• 100% of donations go directly to programs</li>
                    <li>• SSL encrypted secure payment processing</li>
                    <li>• Regular impact reports and updates</li>
                    <li>• Tax-deductible receipts provided</li>
                    <li>• Multiple payment methods available</li>
                    <li>• Global currency support</li>
                  </ul>
                </div>

                <div className="bg-primary-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-primary-800 mb-2">Global Reach</h4>
                  <p className="text-sm text-primary-700">
                    We accept donations from {countries.length - 1}+ countries worldwide with support for {currencies.length} major currencies.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}