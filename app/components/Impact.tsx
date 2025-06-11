'use client'

import { motion } from 'framer-motion'
import { GraduationCap, Home, Droplets, Utensils } from 'lucide-react'

const impactAreas = [
  {
    icon: GraduationCap,
    title: 'Education',
    description: 'Building schools and providing scholarships',
    image: 'https://images.pexels.com/photos/8613089/pexels-photo-8613089.jpeg?auto=compress&cs=tinysrgb&w=600',
    stats: '15,000+ students supported'
  },
  {
    icon: Home,
    title: 'Housing',
    description: 'Constructing safe homes for families',
    image: 'https://images.pexels.com/photos/8293778/pexels-photo-8293778.jpeg?auto=compress&cs=tinysrgb&w=600',
    stats: '2,500+ homes built'
  },
  {
    icon: Droplets,
    title: 'Clean Water',
    description: 'Installing wells and water systems',
    image: 'https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg?auto=compress&cs=tinysrgb&w=600',
    stats: '100+ wells installed'
  },
  {
    icon: Utensils,
    title: 'Nutrition',
    description: 'Feeding programs and food security',
    image: 'https://images.pexels.com/photos/6995247/pexels-photo-6995247.jpeg?auto=compress&cs=tinysrgb&w=600',
    stats: '25,000+ meals served monthly'
  }
]

export default function Impact() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Areas of Impact
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We focus on four key areas where we can make the most significant difference in people's lives
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {impactAreas.map((area, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl shadow-lg overflow-hidden card-hover"
            >
              <div className="relative h-48">
                <img
                  src={area.image}
                  alt={area.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                  <area.icon className="h-12 w-12 text-white" />
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{area.title}</h3>
                <p className="text-gray-600 mb-4">{area.description}</p>
                <div className="bg-primary-50 p-3 rounded-lg">
                  <p className="text-primary-800 font-semibold text-sm">{area.stats}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Success Story */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-20 bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-8 lg:p-12">
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                Success Story: Maria's Village
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                In 2022, we partnered with Maria's village in rural Guatemala to address their 
                water crisis. What started as a single well project grew into a comprehensive 
                community development initiative.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                  <span className="text-gray-700">Clean water access for 500+ families</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                  <span className="text-gray-700">New school serving 200 children</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                  <span className="text-gray-700">Healthcare clinic established</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                  <span className="text-gray-700">50+ jobs created through micro-loans</span>
                </div>
              </div>
            </div>
            <div className="relative h-64 lg:h-auto">
              <img
                src="https://images.pexels.com/photos/8293778/pexels-photo-8293778.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Maria's Village"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}