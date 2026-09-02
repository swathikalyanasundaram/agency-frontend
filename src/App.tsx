import ScrubVideo from './ScrubVideo'
import Navbar from './Navbar'
import Hero from './Hero'

export default function App() {
  return (
    <div className="relative min-h-screen bg-black">
      <ScrubVideo />
      <Navbar />
      <Hero />
    </div>
  )
}
