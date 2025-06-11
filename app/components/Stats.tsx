'use client'

import { motion } from 'framer-motion'
import { Users, Heart, Globe, Award } from 'lucide-react'

const stats = [
  {
    icon: Users,
    number: '50,000+',
    label: 'Lives Impacted',
    description: 'People helped through our programs'
  },
  {
    icon: Heart,
    number: '$2.5M+',
    label: 'Funds Raised',
    description: 'Total donations received'
  },
  {
    icon: Globe,
    number: '25+',
    label: 'Countries',
    description: 'Global reach and impact'
  },
  {
    icon: Award,
    number: '100+',
    label: 'Projects',
    description: 'Successful initiatives completed'
  }
]

export default function Stats() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Impact in Numbers
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See how your support has helped us create meaningful change across the globe
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center bg-white p-8 rounded-xl shadow-lg card-hover"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-full mb-4">
                <stat.icon className="h-8 w-8" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</h3>
              <h4 className="text-lg font-semibold text-gray-800 mb-2">{stat.label}</h4>
              <p className="text-gray-600">{stat.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}