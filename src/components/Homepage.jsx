import React from 'react';
import MovieCard from './MovieCard';

const Homepage = ({ featuredMovies, onMovieClick }) => {
  return (
    <div className="max-w-7xl mx-auto px-6 pb-20">
      <h2 className="text-4xl font-bold mb-10">Trending Right Now</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {featuredMovies.map(movie => (
          <MovieCard 
            key={movie.imdbID} 
            movie={movie} 
            onClick={() => onMovieClick(movie)} 
          />
        ))}
      </div>
    </div>
  );
};

export default Homepage;