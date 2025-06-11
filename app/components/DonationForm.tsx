'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { CreditCard, User, Mail, Phone } from 'lucide-react'

interface DonationFormProps {
  amount: number
  currency: { code: string; symbol: string; name: string }
  frequency: 'one-time' | 'monthly'
  country: string
  paymentMethod: 'stripe' | 'paypal' | 'flutterwave'
}

interface FormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  zipCode: string
  anonymous: boolean
}

export default function DonationForm({ 
  amount, 
  currency, 
  frequency, 
  country, 
  paymentMethod 
}: DonationFormProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>()

  const onSubmit = async (data: FormData) => {
    if (amount <= 0) {
      toast.error('Please select a donation amount')
      return
    }

    if (!country) {
      toast.error('Please select your country')
      return
    }

    setIsProcessing(true)

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Here you would integrate with actual payment processors
      console.log('Donation data:', {
        ...data,
        amount,
        currency,
        frequency,
        country,
        paymentMethod
      })

      toast.success('Thank you for your donation! Redirecting to payment...')
      
      // Redirect to success page or payment processor
      setTimeout(() => {
        window.location.href = '/donate/success'
      }, 1500)
      
    } catch (error) {
      toast.error('Payment processing failed. Please try again.')
      console.error('Payment error:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  if (amount <= 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Please select a donation amount to continue</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            First Name *
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              {...register('firstName', { required: 'First name is required' })}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="John"
            />
          </div>
          {errors.firstName && (
            <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Last Name *
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              {...register('lastName', { required: 'Last name is required' })}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Doe"
            />
          </div>
          {errors.lastName && (
            <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email Address *
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="email"
            {...register('email', { 
              required: 'Email is required',
              pattern: {
                value: /^\S+@\S+$/i,
                message: 'Invalid email address'
              }
            })}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="john@example.com"
          />
        </div>
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Phone Number
        </label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="tel"
            {...register('phone')}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="+1 (555) 123-4567"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Address
        </label>
        <input
          type="text"
          {...register('address')}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="123 Main Street"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            City
          </label>
          <input
            type="text"
            {...register('city')}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="New York"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ZIP/Postal Code
          </label>
          <input
            type="text"
            {...register('zipCode')}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="10001"
          />
        </div>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          {...register('anonymous')}
          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
        />
        <label className="ml-2 block text-sm text-gray-700">
          Make this donation anonymous
        </label>
      </div>

      <button
        type="submit"
        disabled={isProcessing}
        className="w-full bg-primary-600 text-white py-4 px-6 rounded-lg hover:bg-primary-700 transition-colors font-semibold text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isProcessing ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            Processing...
          </>
        ) : (
          <>
            <CreditCard className="h-5 w-5" />
            Donate {currency.symbol}{amount} {frequency === 'monthly' ? '/month' : ''}
          </>
        )}
      </button>

      <p className="text-xs text-gray-500 text-center">
        By clicking "Donate", you agree to our terms of service and privacy policy. 
        Your payment information is secure and encrypted.
      </p>
    </form>
  )
}