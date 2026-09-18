export default function HomeFixed() {
  return (
    <main className="relative">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center px-6" data-testid="hero-section">
          <div className="mb-8" data-testid="hero-logo">
            <img 
              src="/images/glibra-logo-alt.png" 
              alt="GLIBRA" 
              className="h-24 md:h-28 lg:h-32 mx-auto drop-shadow-lg hover:drop-shadow-xl transition-all duration-300"
              data-testid="brand-logo"
              style={{ filter: 'brightness(1.3) contrast(1.4) saturate(1.1)' }}
            />
          </div>
          <h1 className="text-6xl md:text-8xl xl:text-9xl mb-6 font-bold text-gray-900" data-testid="hero-title">
            Travel, Bundled Intelligently.
          </h1>
          <p className="text-xl md:text-2xl xl:text-3xl text-gray-600 max-w-4xl mx-auto" data-testid="hero-subtitle">
            One trip, four essentials — stays, rides, dining, and photography — all powered by AI. Launching first in Upstate New York.
          </p>
        </div>
      </section>

      {/* Problem Section */}
      <section className="min-h-screen flex items-center bg-gradient-to-br from-gray-100 to-gray-200">
        <div className="grid md:grid-cols-2 gap-8 items-center max-w-7xl mx-auto px-6">
          <div className="space-y-6">
            <h2 className="text-4xl md:text-6xl xl:text-7xl font-semibold text-gray-900">
              Travel shouldn't feel this hard
            </h2>
            <p className="text-xl md:text-2xl text-gray-600">
              Hosts cancel. Cars get double-booked. Dinner reservations vanish. Planning a trip across multiple apps leads to stress, wasted time, and missed moments.
            </p>
          </div>
          <div className="relative overflow-hidden rounded-lg">
            <img 
              src="/images/travel-couple.jpg"
              alt="Frustrated couple with luggage dealing with travel planning stress"
              className="w-full h-[70vh] object-cover"
            />
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="min-h-screen flex items-center bg-gradient-to-br from-gray-200 to-gray-100">
        <div className="max-w-5xl mx-auto px-6 space-y-8">
          <h2 className="text-5xl md:text-7xl xl:text-8xl font-semibold tracking-tight text-gray-900 text-center">
            AI that plans — and protects — your trip
          </h2>
          <div className="space-y-6 text-center">
            <p className="text-xl md:text-2xl text-gray-600">
              Glibra bundles your stay, ride, dining, and photography into one seamless flow.
            </p>
            <p className="text-xl md:text-2xl text-gray-600">
              Our Trust Engine monitors every booking and rebooks automatically when plans change.
            </p>
            <p className="text-xl md:text-2xl text-gray-600">
              So your trip never falls apart.
            </p>
          </div>
        </div>
      </section>

      {/* Navigation Section */}
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-white/10 z-10"></div>
        <img 
          src="/images/sailboat.webp"
          alt="Sailboat on calm water representing smooth travel navigation"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 text-center px-6 max-w-4xl mx-auto text-gray-900">
          <h2 className="text-5xl md:text-7xl xl:text-8xl font-semibold mb-6">
            Navigate with confidence
          </h2>
          <p className="text-xl md:text-2xl text-gray-700">
            Like skilled sailors charting unknown waters, we guide you to discover new destinations with confidence and ease.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
        <div className="text-center px-6 space-y-8">
          <h2 className="text-5xl md:text-7xl xl:text-8xl font-semibold text-gray-900">
            Ready to travel smarter?
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
            Join thousands who've discovered the joy of effortless travel planning.
          </p>
          <button className="bg-blue-600 text-white px-8 py-4 text-lg font-semibold rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105">
            Join the Waitlist
          </button>
        </div>
      </section>
    </main>
  );
}