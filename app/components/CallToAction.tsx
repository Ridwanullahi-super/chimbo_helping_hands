'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Users, Heart } from 'lucide-react'

export default function CallToAction() {
  return (
    <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl text-primary-100 mb-12 max-w-3xl mx-auto">
            Join thousands of supporters who are helping us create positive change around the world. 
            Every contribution, no matter the size, makes a real impact.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white bg-opacity-10 backdrop-blur-sm p-8 rounded-xl"
            >
              <Heart className="h-12 w-12 text-white mb-4 mx-auto" />
              <h3 className="text-2xl font-bold text-white mb-4">Donate Today</h3>
              <p className="text-primary-100 mb-6">
                Your donation directly funds our programs and helps us reach more communities in need.
              </p>
              <Link
                href="/donate"
                className="inline-flex items-center gap-2 bg-white text-primary-600 px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
              >
                Start Donating
                <ArrowRight className="h-5 w-5" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="bg-white bg-opacity-10 backdrop-blur-sm p-8 rounded-xl"
            >
              <Users className="h-12 w-12 text-white mb-4 mx-auto" />
              <h3 className="text-2xl font-bold text-white mb-4">Get Involved</h3>
              <p className="text-primary-100 mb-6">
                Volunteer your time, share our mission, or partner with us to amplify our impact.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 border-2 border-white text-white px-6 py-3 rounded-lg hover:bg-white hover:text-primary-600 transition-colors font-semibold"
              >
                Learn More
                <ArrowRight className="h-5 w-5" />
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <p className="text-primary-100 text-lg">
              Together, we can build a better world for everyone.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}