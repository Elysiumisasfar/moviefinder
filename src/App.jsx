import React, { useState, useEffect } from 'react';
import './App.css';
import TrendingRow from './components/TrendingRow';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('none');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [movieDetails, setMovieDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState('home'); // home, browse, toprated

  const API_KEY = "da81a772";

  // Load Homepage Trending & Top Rated lists
  useEffect(() => {
    fetchHomepageData();
    fetchTopRated();
  }, []);

  async function fetchHomepageData() {
    try {
      const response = await fetch(`https://www.omdbapi.com/?s=Marvel&type=movie&apikey=${API_KEY}`);
      const data = await response.json();
      if (data.Search) setTrendingMovies(data.Search);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }

  async function fetchTopRated() {
    const topTerms = ["Inception", "The Dark Knight", "Interstellar", "Oppenheimer", "Parasite", "Joker", "Avengers"];
    try {
      const promises = topTerms.map(term => 
        fetch(`https://www.omdbapi.com/?s=${term}&apikey=${API_KEY}`)
          .then(res => res.json())
      );
      const results = await Promise.all(promises);
      const allMovies = results.flatMap(r => r.Search || []).slice(0, 12);
      setTopRatedMovies(allMovies);
    } catch (e) {
      console.error(e);
    }
  }

  // Live Search Handler
  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setCurrentPage('browse');

    if (query.trim() === '') {
      setSearchResults([]);
      return;
    }

    try {
      const response = await fetch(`https://www.omdbapi.com/?s=${query}&type=movie&apikey=${API_KEY}`);
      const data = await response.json();
      if (data.Search) setSearchResults(data.Search);
      else setSearchResults([]);
    } catch (error) {
      console.error(error);
    }
  };

  // REUSABLE SORTING HELPER FUNCTION 🚀
  const sortMovies = (movieArray) => {
    return [...movieArray].sort((a, b) => {
      const yearA = parseInt(a.Year) || 0;
      const yearB = parseInt(b.Year) || 0;
      if (sortBy === 'newest') return yearB - yearA;
      if (sortBy === 'oldest') return yearA - yearB;
      return 0; // leaves list in default API response order
    });
  };

  const openMovieDetails = async (movie) => {
    setSelectedMovie(movie);
    setDetailsLoading(true);
    try {
      const response = await fetch(`https://www.omdbapi.com/?i=${movie.imdbID}&plot=full&apikey=${API_KEY}`);
      const data = await response.json();
      setMovieDetails(data);
    } catch (error) {
      console.error(error);
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
      {/* Navigation Menu */}
      <header className="p-6 bg-gray-800/90 backdrop-blur shadow-md sticky top-0 z-50 flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-gray-700">
        <h1 
          className="text-3xl font-bold text-red-500 tracking-wider cursor-pointer" 
          onClick={() => { setSearchQuery(''); setCurrentPage('home'); }}
        >
          🎬 MovieFinder
        </h1>

        <nav className="flex items-center gap-8 text-lg font-medium">
          <span onClick={() => { setSearchQuery(''); setCurrentPage('home'); }} className={`cursor-pointer transition ${currentPage === 'home' ? 'text-red-500' : 'hover:text-red-400'}`}>Home</span>
          <span onClick={() => setCurrentPage('browse')} className={`cursor-pointer transition ${currentPage === 'browse' ? 'text-red-500' : 'hover:text-red-400'}`}>Browse</span>
          <span onClick={() => setCurrentPage('toprated')} className={`cursor-pointer transition ${currentPage === 'toprated' ? 'text-red-500' : 'hover:text-red-400'}`}>Top Rated</span>
        </nav>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search for movies..."
            value={searchQuery}
            onChange={handleSearch}
            className="px-5 py-3 w-full sm:w-80 bg-gray-700 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 transition shadow-inner"
          />
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3 bg-gray-700 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 text-sm cursor-pointer"
          >
            <option value="none">Sort By</option>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </header>

      <main className="p-6 max-w-7xl mx-auto">
        {/* HOMEPAGE VIEW */}
        {currentPage === 'home' && (
          <div>
            {loading ? (
              <div className="text-center py-20 text-gray-400">Loading home feed...</div>
            ) : (
              <>
                {trendingMovies.length > 0 && (
                  /* Added onClick execution here to examine the hero movie 🚀 */
                  <div 
                    onClick={() => openMovieDetails(trendingMovies[0])} 
                    className="relative h-80 sm:h-[500px] rounded-3xl overflow-hidden mb-12 bg-cover bg-center flex items-end p-8 shadow-2xl cursor-pointer group hover:scale-[1.01] transition duration-300"
                    style={{ backgroundImage: `linear-gradient(to top, rgba(17,24,39,0.95), rgba(17,24,39,0.4)), url(${trendingMovies[0].Poster})` }}
                  >
                    <div className="transform group-hover:translate-x-2 transition duration-300">
                      <span className="bg-red-600 text-xs uppercase px-4 py-2 rounded font-bold mb-3 inline-block shadow">Featured Today</span>
                      <h2 className="text-4xl sm:text-5xl font-extrabold mb-2 group-hover:text-red-400 transition">{trendingMovies[0].Title}</h2>
                      <p className="text-lg text-gray-300">Released: {trendingMovies[0].Year} <span className="text-xs text-gray-400 ml-2">(Click to inspect)</span></p>
                    </div>
                  </div>
                )}
                
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">🔥 Hot Picks right now</h3>
                <TrendingRow movies={sortMovies(trendingMovies)} onMovieClick={openMovieDetails} />
              </>
            )}
          </div>
        )}

        {/* BROWSE VIEW */}
        {currentPage === 'browse' && (
          <section>
            <h3 className="text-2xl font-bold mb-6 text-gray-300">Browse Movies</h3>
            {searchResults.length === 0 && searchQuery === '' ? (
              <div className="text-center py-20 text-gray-500">Start typing in the search bar above to browse...</div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {sortMovies(searchResults).map((movie) => (
                  <div key={movie.imdbID} onClick={() => openMovieDetails(movie)} className="bg-gray-800 rounded-xl overflow-hidden hover:scale-105 transition duration-300 cursor-pointer shadow-lg">
                    <img src={movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/300x450?text=No+Poster"} alt={movie.Title} className="w-full h-64 sm:h-72 object-cover" />
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

        {/* TOP RATED VIEW */}
        {currentPage === 'toprated' && (
          <section>
            <h3 className="text-2xl font-bold mb-6 text-gray-300">Top Rated Movies</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {topRatedMovies.length > 0 ? (
                /* Wrapped array loop with sorting helper function 🚀 */
                sortMovies(topRatedMovies).map((movie) => (
                  <div key={movie.imdbID} onClick={() => openMovieDetails(movie)} className="bg-gray-800 rounded-xl overflow-hidden hover:scale-105 transition duration-300 cursor-pointer shadow-lg">
                    <img src={movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/300x450?text=No+Poster"} alt={movie.Title} className="w-full h-64 sm:h-72 object-cover" />
                    <div className="p-4">
                      <h4 className="font-semibold truncate">{movie.Title}</h4>
                      <p className="text-xs text-gray-400">{movie.Year}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-400">Loading masterclass collection...</p>
              )}
            </div>
          </section>
        )}
      </main>

      {/* Movie Details Modal Pop-up Container */}
      {selectedMovie && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-6 overflow-y-auto">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl max-w-4xl w-full p-6 sm:p-8 relative my-auto shadow-2xl">
            {detailsLoading ? (
              <p className="text-center py-20 text-xl text-gray-400 animate-pulse">Loading production secrets...</p>
            ) : movieDetails ? (
              <div className="flex flex-col md:flex-row gap-8">
                {movieDetails.Poster !== "N/A" && (
                  <img src={movieDetails.Poster} alt={movieDetails.Title} className="w-full md:w-80 rounded-xl shadow-md object-cover h-[400px] md:h-auto" />
                )}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">{movieDetails.Title}</h2>
                    <p className="text-md text-gray-400 font-medium mb-4">{movieDetails.Year} • {movieDetails.Runtime} • {movieDetails.Rated}</p>
                    <hr className="border-gray-700 my-4" />
                    <p className="text-gray-300 text-base leading-relaxed">{movieDetails.Plot}</p>
                  </div>
                  
                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-300 bg-gray-900/40 p-4 rounded-xl border border-gray-700/50">
                    <p><strong>Director:</strong> {movieDetails.Director}</p>
                    <p><strong>Writer:</strong> {movieDetails.Writer}</p>
                    <p><strong>Actors:</strong> {movieDetails.Actors}</p>
                    <p><strong>Genre:</strong> {movieDetails.Genre}</p>
                  </div>
                </div>
              </div>
            ) : null}

            <button onClick={closeModal} className="mt-8 w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-lg transition duration-200 shadow">
              Close Inspection
            </button>
          </div>
        </div>
      )}

      <footer className="bg-gray-900 border-t border-gray-800 py-8 mt-20 text-center text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} MovieFinder. All rights reserved.</p>
        <p className="mt-1 text-xs text-gray-600">Data provided via OMDb API.</p>
      </footer>
    </div>
  );
}

export default App;