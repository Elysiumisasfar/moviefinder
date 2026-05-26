import React, { useState, useEffect } from 'react';
import './App.css';
import TrendingRow from './components/TrendingRow';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('none');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [movieDetails, setMovieDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const API_KEY = "da81a772";
  const HOMEPAGE_KEYWORD = "Marvel";

  // Fetch Homepage Trending
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

  // Live Search
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

  // Open Movie Details (Second API Call)
  const openMovieDetails = async (movie) => {
    setSelectedMovie(movie);
    setDetailsLoading(true);
    try {
      const response = await fetch(`https://www.omdbapi.com/?i=${movie.imdbID}&plot=full&apikey=${API_KEY}`);
      const data = await response.json();
      setMovieDetails(data);
    } catch (error) {
      console.error("Error fetching details:", error);
    } finally {
      setDetailsLoading(false);
    }
  };

  const closeModal = () => {
    setSelectedMovie(null);
    setMovieDetails(null);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      {/* Proper Navigation */}
      <header className="p-6 bg-gray-800/90 backdrop-blur shadow-md sticky top-0 z-50 flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-gray-700">
        <h1 
          className="text-3xl font-bold text-red-500 tracking-wider cursor-pointer" 
          onClick={() => setSearchQuery('')}
        >
          🎬 MovieFinder
        </h1>

        <nav className="flex items-center gap-6 text-lg">
          <span onClick={() => setSearchQuery('')} className="cursor-pointer hover:text-red-400 transition">Home</span>
          <span className="cursor-pointer hover:text-red-400 transition">Browse</span>
          <span className="cursor-pointer hover:text-red-400 transition">Top Rated</span>
        </nav>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search for movies..."
            value={searchQuery}
            onChange={handleSearch}
            className="px-5 py-3 w-full sm:w-80 bg-gray-800 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 transition"
          />
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3 bg-gray-800 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 text-sm cursor-pointer"
          >
            <option value="none">Sort By</option>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6 max-w-7xl mx-auto">
        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading blockbusters...</div>
        ) : searchQuery === '' ? (
          /* HOMEPAGE */
          <div>
            {/* Hero Banner */}
            {trendingMovies.length > 0 && (
              <div 
                className="relative h-80 sm:h-[500px] rounded-3xl overflow-hidden mb-12 bg-cover bg-center flex items-end p-8 shadow-2xl"
                style={{ 
                  backgroundImage: `linear-gradient(to top, rgba(17,24,39,0.95), rgba(17,24,39,0.4)), url(${trendingMovies[0].Poster})` 
                }}
              >
                <div>
                  <span className="bg-red-600 text-xs uppercase px-4 py-2 rounded font-bold mb-3 inline-block">Featured Today</span>
                  <h2 className="text-4xl sm:text-5xl font-extrabold mb-2">{trendingMovies[0].Title}</h2>
                  <p className="text-lg text-gray-300">Released: {trendingMovies[0].Year}</p>
                </div>
              </div>
            )}

            {/* Trending Section */}
            <section>
              <h3 className="text-2xl font-bold mb-6 border-b border-gray-700 pb-3">🔥 Trending Right Now</h3>
              <TrendingRow movies={trendingMovies} onMovieClick={openMovieDetails} />
            </section>
          </div>
        ) : (
          /* SEARCH RESULTS */
          <section>
            <h3 className="text-2xl font-bold mb-6 text-gray-300">
              Search Results for <span className="text-white">"{searchQuery}"</span>
            </h3>
            {searchResults.length === 0 ? (
              <div className="text-gray-500 text-center py-10">No movies found. Try something else!</div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {[...searchResults]
                  .sort((a, b) => {
                    const yearA = parseInt(a.Year) || 0;
                    const yearB = parseInt(b.Year) || 0;
                    if (sortBy === 'newest') return yearB - yearA;
                    if (sortBy === 'oldest') return yearA - yearB;
                    return 0;
                  })
                  .map((movie) => (
                    <div 
                      key={movie.imdbID} 
                      onClick={() => openMovieDetails(movie)}
                      className="bg-gray-800 rounded-lg overflow-hidden hover:scale-105 transition duration-300 shadow-lg cursor-pointer"
                    >
                      <img 
                        src={movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/300x450?text=No+Poster"} 
                        alt={movie.Title} 
                        className="w-full h-64 sm:h-72 object-cover" 
                      />
                      <div className="p-4">
                        <h4 className="font-semibold truncate">{movie.Title}</h4>
                        <p className="text-xs text-gray-400">{movie.Year}</p>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </section>
        )}
      </main>

      {/* Movie Details Modal */}
      {selectedMovie && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-6 overflow-auto">
          <div className="bg-gray-900 rounded-2xl max-w-4xl w-full p-8">
            {detailsLoading ? (
              <p className="text-center py-20">Loading full details...</p>
            ) : movieDetails ? (
              <div className="flex flex-col md:flex-row gap-8">
                {movieDetails.Poster !== "N/A" && (
                  <img src={movieDetails.Poster} alt={movieDetails.Title} className="w-full md:w-80 rounded-xl" />
                )}
                <div className="flex-1">
                  <h2 className="text-4xl font-bold">{movieDetails.Title}</h2>
                  <p className="text-xl text-gray-400">{movieDetails.Year} • {movieDetails.Runtime}</p>
                  
                  <p className="mt-6 text-lg leading-relaxed">{movieDetails.Plot}</p>

                  <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <p><strong>Director:</strong> {movieDetails.Director}</p>
                    <p><strong>Writer:</strong> {movieDetails.Writer}</p>
                    <p><strong>Actors:</strong> {movieDetails.Actors}</p>
                    <p><strong>Genre:</strong> {movieDetails.Genre}</p>
                  </div>
                </div>
              </div>
            ) : null}

            <button 
              onClick={closeModal}
              className="mt-10 w-full py-4 bg-red-600 hover:bg-red-700 rounded-xl font-bold text-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 py-8 text-center text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} MovieFinder. Built for learning.</p>
        <p className="mt-1 text-xs">Data provided by OMDb API</p>
      </footer>
    </div>
  );
}

export default App;