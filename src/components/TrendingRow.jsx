import React from 'react';

function TrendingRow({ movies }) {
  return (
    <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent snap-x">
      {movies.map((movie) => (
        <div 
          key={movie.imdbID} 
          className="min-w-[180px] sm:min-w-[220px] bg-gray-800 rounded-xl overflow-hidden snap-start hover:scale-105 transition-transform duration-300 shadow-md group relative cursor-pointer"
        >
          {/* Fallback image if poster is missing */}
          <img 
            src={movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/300x450?text=No+Poster"} 
            alt={movie.Title} 
            className="w-full h-64 sm:h-80 object-cover"
          />
          
          <div className="p-3 bg-gray-800">
            <h4 className="font-medium text-sm truncate group-hover:text-red-400 transition-colors">
              {movie.Title}
            </h4>
            <p className="text-xs text-gray-400">{movie.Year}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default TrendingRow;