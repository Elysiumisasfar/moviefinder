import React from 'react';

const MovieModal = ({ movie, details, loading, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-6">
      <div className="bg-slate-900 rounded-3xl max-w-4xl w-full p-10">
        {loading ? (
          <p className="text-center py-20 text-xl">Loading details...</p>
        ) : details ? (
          <div className="flex flex-col md:flex-row gap-10">
            {details.Poster !== "N/A" && (
              <img src={details.Poster} alt={details.Title} className="w-full md:w-80 rounded-2xl" />
            )}
            <div className="flex-1">
              <h2 className="text-4xl font-bold">{details.Title}</h2>
              <p className="text-2xl text-slate-400">{details.Year} • {details.Runtime}</p>
              
              <p className="mt-8 text-lg leading-relaxed">{details.Plot}</p>

              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-y-4 text-sm">
                <p><strong>Director:</strong> {details.Director}</p>
                <p><strong>Writer:</strong> {details.Writer}</p>
                <p><strong>Actors:</strong> {details.Actors}</p>
                <p><strong>Genre:</strong> {details.Genre}</p>
              </div>
            </div>
          </div>
        ) : null}

        <button 
          onClick={onClose}
          className="mt-10 w-full py-5 bg-red-600 hover:bg-red-700 rounded-2xl font-bold text-lg"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default MovieModal;