import Hero from './components/Hero'
import Stats from './components/Stats'
import Mission from './components/Mission'
import Impact from './components/Impact'
import Testimonials from './components/Testimonials'
import CallToAction from './components/CallToAction'

export default function Home() {
  return (
    <div className="overflow-hidden">
      <Hero />
      <Stats />
      <Mission />
      <Impact />
      <Testimonials />
      <CallToAction />
    </div>
  )
}