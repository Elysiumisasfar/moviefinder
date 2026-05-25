import React from 'react';

const MovieCard = ({ movie, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="bg-slate-900 rounded-2xl overflow-hidden hover:scale-105 transition-all cursor-pointer"
    >
      {movie.Poster !== "N/A" ? (
        <img 
          src={movie.Poster} 
          alt={movie.Title}
          className="w-full h-80 object-cover"
        />
      ) : (
        <div className="h-80 bg-slate-800 flex items-center justify-center text-6xl">🎬</div>
      )}
      <div className="p-4">
        <h3 className="font-semibold line-clamp-2">{movie.Title}</h3>
        <p className="text-slate-400 text-sm">{movie.Year}</p>
      </div>
    </div>
  );
};

export default MovieCard;