'use client'

import { motion } from 'framer-motion'
import { Target, Eye, Heart } from 'lucide-react'

const values = [
  {
    icon: Target,
    title: 'Our Mission',
    description: 'To empower communities worldwide by providing essential resources, education, and support to those in need, creating sustainable positive change that lasts for generations.'
  },
  {
    icon: Eye,
    title: 'Our Vision',
    description: 'A world where every person has access to basic necessities, quality education, and opportunities to thrive, regardless of their background or circumstances.'
  },
  {
    icon: Heart,
    title: 'Our Values',
    description: 'Compassion, transparency, integrity, and community-driven solutions guide everything we do. We believe in the power of collective action to transform lives.'
  }
]

export default function Mission() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Who We Are
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Chimbo Helping Hands is dedicated to creating lasting positive change in communities around the world
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-100 text-primary-600 rounded-full mb-6">
                <value.icon className="h-10 w-10" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{value.title}</h3>
              <p className="text-gray-600 leading-relaxed">{value.description}</p>
            </motion.div>
          ))}
        </div>

        {/* About Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
        >
          <div>
            <h3 className="text-3xl font-bold text-gray-900 mb-6">
              Building Bridges, Changing Lives
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Founded in 2015, Chimbo Helping Hands has grown from a small community initiative 
              to a global movement. We work directly with local communities to identify their 
              most pressing needs and develop sustainable solutions.
            </p>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Our approach is simple: listen, learn, and act. We believe that the people who 
              live in these communities know best what they need, and our role is to provide 
              the resources and support to make their vision a reality.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="bg-primary-50 p-4 rounded-lg">
                <h4 className="font-semibold text-primary-800 mb-1">Transparency</h4>
                <p className="text-sm text-primary-600">100% of donations go directly to programs</p>
              </div>
              <div className="bg-secondary-50 p-4 rounded-lg">
                <h4 className="font-semibold text-secondary-800 mb-1">Impact</h4>
                <p className="text-sm text-secondary-600">Measurable results in every project</p>
              </div>
            </div>
          </div>
          <div className="relative">
            <img
              src="https://images.pexels.com/photos/6646917/pexels-photo-6646917.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="Community helping"
              className="rounded-xl shadow-2xl"
            />
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-lg">
              <h4 className="text-2xl font-bold text-primary-600">8 Years</h4>
              <p className="text-gray-600">of dedicated service</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}