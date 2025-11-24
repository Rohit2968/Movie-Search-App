import React from 'react';
import { MovieCard } from './MovieCard';

export function MovieGrid({ 
  movies, 
  userRatings, 
  favorites, 
  comments,
  onMovieClick, 
  onRatingChange, 
  onToggleFavorite 
}) {
  if (movies.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-5xl sm:text-6xl mb-4">🎬</div>
        <p className="text-lg sm:text-xl text-gray-400 mb-2">No movies found</p>
        <p className="text-sm sm:text-base text-gray-500">Try searching for something else</p>
      </div>
    );
  }

  return (
    <div
      className="grid 
                 grid-cols-1 
                 xs:grid-cols-2 
                 sm:grid-cols-2 
                 md:grid-cols-3 
                 lg:grid-cols-3 
                 xl:grid-cols-4 
                 gap-4 sm:gap-6 px-2 sm:px-0"
    >
      {movies.map((movie) => {
        const userRating = userRatings.find(r => r.movieId === movie.id)?.rating || 0;
        const isFavorite = favorites.some(f => f.movieId === movie.id);
        const commentsCount = comments.filter(c => c.movieId === movie.id).length;

        return (
          <MovieCard
            key={movie.id}
            movie={movie}
            userRating={userRating}
            isFavorite={isFavorite}
            commentsCount={commentsCount}
            onMovieClick={onMovieClick}
            onRatingChange={onRatingChange}
            onToggleFavorite={onToggleFavorite}
          />
        );
      })}
    </div>
  );
}