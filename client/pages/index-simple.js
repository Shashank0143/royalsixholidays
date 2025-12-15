import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          Welcome to <span className="text-blue-600">RoyalSixHolidays</span>
        </h1>
        
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Discover incredible destinations across India with our expertly curated travel experiences.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/auth/login"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Get Started
          </Link>
          
          <Link 
            href="/destinations"
            className="bg-white hover:bg-gray-50 text-gray-900 font-semibold py-3 px-6 rounded-lg border border-gray-300 transition-colors"
          >
            Explore Destinations
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="text-4xl mb-4">🏛️</div>
            <h3 className="text-xl font-semibold mb-2">Rich Culture</h3>
            <p className="text-gray-600">Explore diverse traditions, art, and heritage sites across India.</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="text-4xl mb-4">🍛</div>
            <h3 className="text-xl font-semibold mb-2">Local Cuisine</h3>
            <p className="text-gray-600">Taste authentic regional dishes and culinary specialties.</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="text-4xl mb-4">🏨</div>
            <h3 className="text-xl font-semibold mb-2">Premium Hotels</h3>
            <p className="text-gray-600">Stay in carefully selected accommodations for every budget.</p>
          </div>
        </div>
      </div>
    </div>
  );
}