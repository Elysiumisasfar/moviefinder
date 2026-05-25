import React, { useState, useEffect } from 'react';
import './App.css';
import TrendingRow from './components/TrendingRow';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. CHOOSE A TRENDING/HOMEPAGE SEARCH TERM
  // Since OMDb doesn't have a trending list, searching a major keyword like "Marvel", 
  // "Star Wars", or "Batman" works great to populate a stunning homepage grid instantly!
  const HOMEPAGE_KEYWORD = "Marvel"; 
  const API_KEY = "da81a772"; // 👈 Put your actual OMDb API key here

  // Fetch Homepage/Trending Content on Load
  useEffect(() => {
    const fetchHomepageData = async () => {
      try {
        const response = await fetch(`https://www.omdbapi.com/?s=${HOMEPAGE_KEYWORD}&type=movie&apikey=${API_KEY}`);
        const data = await response.json();
        if (data.Search) {
          setTrendingMovies(data.Search);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching homepage movies:", error);
        setLoading(false);
      }
    };

    fetchHomepageData();
  }, []);

  // Handle Live Search Input
  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim() === '') {
      setSearchResults([]);
      return;
    }

    try {
      const response = await fetch(`https://www.omdbapi.com/?s=${query}&type=movie&apikey=${API_KEY}`);
      const data = await response.json();
      if (data.Search) {
        setSearchResults(data.Search);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Error searching movies:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      {/* Navbar Header */}
      <header className="p-6 bg-gray-800/50 backdrop-blur shadow-md sticky top-0 z-50 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl font-bold text-red-500 tracking-wider cursor-pointer" onClick={() => setSearchQuery('')}>
          🎬 MovieFinder
        </h1>
        <input
          type="text"
          placeholder="Search for movies..."
          value={searchQuery}
          onChange={handleSearch}
          className="px-4 py-2 w-full sm:w-80 bg-gray-700 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 transition"
        />
      </header>

      {/* Main Container */}
      <main className="p-6 max-w-7xl mx-auto">
        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading blockbusters...</div>
        ) : searchQuery === '' ? (
          /* HOMEPAGE VIEW */
          <div>
            {/* Big Hero Banner (Using the first item from our array) */}
            {trendingMovies.length > 0 && (
              <div 
                className="relative h-64 sm:h-96 rounded-2xl overflow-hidden mb-10 bg-cover bg-center flex items-end p-6 sm:p-8 shadow-2xl"
                style={{ 
                  backgroundImage: `linear-gradient(to top, rgba(17,24,39,0.95), rgba(17,24,39,0.3)), url(${trendingMovies[0].Poster})` 
                }}
              >
                <div>
                  <span className="bg-red-600 text-xs uppercase px-2 py-1 rounded font-bold mb-2 inline-block tracking-wide">
                    Featured Today
                  </span>
                  <h2 className="text-2xl sm:text-4xl font-extrabold mb-1">{trendingMovies[0].Title}</h2>
                  <p className="text-sm text-gray-300">Released: {trendingMovies[0].Year}</p>
                </div>
              </div>
            )}

            {/* Trending Section Row */}
            <section className="mb-10">
              <h3 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2 flex items-center gap-2">
                🔥 Hot Picks right now
              </h3>
              <TrendingRow movies={trendingMovies} />
            </section>
          </div>
        ) : (
          /* SEARCH RESULTS VIEW */
          <section>
            <h3 className="text-xl font-bold mb-6 text-gray-300">
              Search Results for <span className="text-white">"{searchQuery}"</span>
            </h3>
            {searchResults.length === 0 ? (
              <div className="text-gray-500 text-center py-10">No movies found. Try typing something else!</div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {searchResults.map((movie) => (
                  <div key={movie.imdbID} className="bg-gray-800 rounded-lg overflow-hidden hover:scale-105 transition duration-300 shadow-lg">
                    <img 
                      src={movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/300x450?text=No+Poster"} 
                      alt={movie.Title} 
                      className="w-full h-64 sm:h-72 object-cover" 
                    />
                    <div className="p-3">
                      <h4 className="font-semibold text-sm truncate">{movie.Title}</h4>
                      <p className="text-xs text-gray-400">{movie.Year}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}

export default App;