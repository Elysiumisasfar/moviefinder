import { useState, useEffect } from 'react';

const API_KEY = "da81a772";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [movies, setMovies] = useState([]);
  const [featuredMovies, setFeaturedMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [movieDetails, setMovieDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  // Load Trending movies
  useEffect(() => {
    async function loadFeaturedMovies() {
      const terms = ["Inception", "Dune", "Oppenheimer", "Interstellar"];
      try {
        const promises = terms.map(term => 
          fetch(`https://www.omdbapi.com/?s=${term}&apikey=${API_KEY}`)
            .then(res => res.json())
        );
        const results = await Promise.all(promises);
        const allMovies = results.flatMap(r => r.Search || []).slice(0, 8);
        setFeaturedMovies(allMovies);
      } catch (e) {
        console.error(e);
      }
    }

    loadFeaturedMovies();
  }, []); // Empty array is completely safe here now

  // Live search
  useEffect(() => {
    if (searchTerm.trim().length < 3) {
      setMovies([]);
      return;
    }

    async function searchMovies() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`https://www.omdbapi.com/?s=${searchTerm}&apikey=${API_KEY}`);
        const data = await res.json();
        if (data.Response === "True") {
          setMovies(data.Search);
        } else {
          setError("No results found");
        }
      } catch (err) {
        setError("Failed to load movies");
      } finally {
        setLoading(false);
      }
    }

    const timer = setTimeout(() => {
      searchMovies();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]); // Only depends on searchTerm, which is correct!

  async function openMovie(movie) {
    setSelectedMovie(movie);
    setDetailsLoading(true);
    try {
      const res = await fetch(`https://www.omdbapi.com/?i=${movie.imdbID}&plot=full&apikey=${API_KEY}`);
      const data = await res.json();
      setMovieDetails(data);
    } catch (err) {
      console.error(err);
    } finally {
      setDetailsLoading(false);
    }
  }

  const clearSearch = () => {
    setSearchTerm("");
    setMovies([]);
    setError("");
  };

  return (
    <div className="min-h-screen bg-[#0a1428] text-white">
      <nav className="fixed top-0 w-full bg-black/95 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto px-8 py-5 flex justify-between items-center">
          <h1 className="text-3xl font-bold">MovieFinder</h1>
        </div>
      </nav>

      <div className="pt-32 pb-16 px-6 text-center">
        <h1 className="text-6xl font-bold mb-6">Find Your Next Favorite Movie</h1>
        <p className="text-xl text-gray-400 mb-10">Search by title, actor, or keyword</p>

        <div className="max-w-2xl mx-auto flex gap-3">
          <input
            type="text"
            placeholder="Inception, Leonardo DiCaprio..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-white/10 border border-white/30 rounded-2xl px-8 py-6 text-xl focus:outline-none focus:border-blue-500"
          />
          {searchTerm && (
            <button onClick={clearSearch} className="px-8 py-6 bg-red-600 rounded-2xl font-medium">
              Clear
            </button>
          )}
        </div>
      </div>

      {searchTerm.length > 2 ? (
        <div className="max-w-7xl mx-auto px-6 pb-20">
          <h2 className="text-3xl font-semibold mb-8">Results for "{searchTerm}"</h2>
          {loading && <p className="text-center">Loading...</p>}
          {error && <p className="text-center text-red-500">{error}</p>}
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {movies.map(movie => (
              <div key={movie.imdbID} onClick={() => openMovie(movie)} className="cursor-pointer hover:scale-105 transition-all">
                {movie.Poster !== "N/A" ? (
                  <img src={movie.Poster} alt={movie.Title} className="rounded-2xl w-full h-80 object-cover" />
                ) : (
                  <div className="h-80 bg-slate-800 rounded-2xl flex items-center justify-center text-6xl">🎬</div>
                )}
                <h3 className="mt-3 font-semibold">{movie.Title}</h3>
                <p className="text-slate-400">{movie.Year}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-6 pb-20">
          <h2 className="text-4xl font-bold mb-10">Trending Right Now</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {featuredMovies.map(movie => (
              <div key={movie.imdbID} onClick={() => openMovie(movie)} className="cursor-pointer hover:scale-105 transition-all">
                {movie.Poster !== "N/A" ? (
                  <img src={movie.Poster} alt={movie.Title} className="rounded-2xl w-full h-80 object-cover" />
                ) : (
                  <div className="h-80 bg-slate-800 rounded-2xl flex items-center justify-center text-6xl">🎬</div>
                )}
                <h3 className="mt-3 font-semibold">{movie.Title}</h3>
                <p className="text-slate-400">{movie.Year}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedMovie && (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-6">
          <div className="bg-slate-900 rounded-3xl max-w-4xl w-full p-10">
            {detailsLoading ? (
              <p className="text-center py-20">Loading details...</p>
            ) : movieDetails ? (
              <div className="flex flex-col md:flex-row gap-10">
                {movieDetails.Poster !== "N/A" && (
                  <img src={movieDetails.Poster} alt={movieDetails.Title} className="w-full md:w-80 rounded-2xl" />
                )}
                <div className="flex-1">
                  <h2 className="text-4xl font-bold">{movieDetails.Title}</h2>
                  <p className="text-2xl text-slate-400">{movieDetails.Year} • {movieDetails.Runtime}</p>
                  <p className="mt-8 text-lg leading-relaxed">{movieDetails.Plot}</p>
                  <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-y-4 text-sm">
                    <p><strong>Director:</strong> {movieDetails.Director}</p>
                    <p><strong>Writer:</strong> {movieDetails.Writer}</p>
                    <p><strong>Actors:</strong> {movieDetails.Actors}</p>
                    <p><strong>Genre:</strong> {movieDetails.Genre}</p>
                  </div>
                </div>
              </div>
            ) : null}

            <button 
              onClick={() => {
                setSelectedMovie(null);
                setMovieDetails(null);
              }}
              className="mt-10 w-full py-5 bg-red-600 hover:bg-red-700 rounded-2xl font-bold text-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;