import { motion } from 'framer-motion'
import { Users, Target, Award, Globe } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white pt-16">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            About Chimbo Helping Hands
          </h1>
          <p className="text-xl text-primary-100 max-w-3xl mx-auto">
            Learn about our journey, mission, and the dedicated team working to create positive change worldwide
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Chimbo Helping Hands was founded in 2015 by a group of passionate individuals who 
                witnessed firsthand the challenges faced by underserved communities around the world. 
                What started as a small local initiative has grown into a global movement for positive change.
              </p>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Our name "Chimbo" comes from a local word meaning "unity" in one of the first 
                communities we served. It represents our core belief that when people come together 
                with a shared purpose, incredible things can happen.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Today, we operate in over 25 countries, but our approach remains the same: 
                listen to communities, understand their needs, and work together to create 
                sustainable solutions that last.
              </p>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/6646917/pexels-photo-6646917.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Our story"
                className="rounded-xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These principles guide everything we do and shape how we approach our work
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Target,
                title: 'Purpose-Driven',
                description: 'Every action we take is guided by our mission to create lasting positive change.'
              },
              {
                icon: Users,
                title: 'Community-Centered',
                description: 'We believe communities know their needs best and work as partners, not saviors.'
              },
              {
                icon: Award,
                title: 'Excellence',
                description: 'We strive for the highest standards in everything we do, from programs to transparency.'
              },
              {
                icon: Globe,
                title: 'Global Impact',
                description: 'We think globally while acting locally, creating solutions that can scale worldwide.'
              }
            ].map((value, index) => (
              <div key={index} className="text-center bg-white p-8 rounded-xl shadow-lg">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-full mb-4">
                  <value.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Dedicated professionals working tirelessly to make a difference
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Sarah Johnson',
                role: 'Executive Director',
                image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
                bio: '15+ years in international development with a passion for sustainable community solutions.'
              },
              {
                name: 'Michael Chen',
                role: 'Program Director',
                image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
                bio: 'Former Peace Corps volunteer with expertise in education and healthcare programs.'
              },
              {
                name: 'Dr. Amara Okafor',
                role: 'Impact Assessment Lead',
                image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
                bio: 'PhD in Development Economics, ensuring our programs create measurable, lasting impact.'
              }
            ].map((member, index) => (
              <div key={index} className="text-center bg-white rounded-xl shadow-lg overflow-hidden">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                  <p className="text-primary-600 font-medium mb-4">{member.role}</p>
                  <p className="text-gray-600 text-sm">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Timeline */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Journey</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Key milestones in our mission to create positive change
            </p>
          </div>

          <div className="space-y-8">
            {[
              {
                year: '2015',
                title: 'Foundation',
                description: 'Chimbo Helping Hands was founded with our first project in rural Guatemala.'
              },
              {
                year: '2017',
                title: 'Expansion',
                description: 'Expanded operations to 5 countries across Africa and Latin America.'
              },
              {
                year: '2019',
                title: 'Major Milestone',
                description: 'Reached 10,000 people impacted and launched our education initiative.'
              },
              {
                year: '2021',
                title: 'Global Reach',
                description: 'Operations in 15 countries with focus on sustainable development goals.'
              },
              {
                year: '2023',
                title: 'Innovation',
                description: 'Launched technology-driven solutions and reached 50,000 people impacted.'
              }
            ].map((milestone, index) => (
              <div key={index} className="flex items-center gap-8">
                <div className="flex-shrink-0 w-24 text-right">
                  <span className="text-2xl font-bold text-primary-600">{milestone.year}</span>
                </div>
                <div className="flex-shrink-0 w-4 h-4 bg-primary-600 rounded-full"></div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{milestone.title}</h3>
                  <p className="text-gray-600">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}