import React from 'react';
import { Heart, MessageCircle } from 'lucide-react';
import { StarRating } from './StarRating';
import { getImageUrl } from '../services/tmdbApi';

export function MovieCard({ 
  movie, 
  userRating = 0,
  isFavorite = false,
  commentsCount = 0,
  onMovieClick,
  onRatingChange,
  onToggleFavorite 
}) {
  return (
    <div className="group relative bg-gray-900/30 backdrop-blur-lg border border-gray-700/50 rounded-2xl overflow-hidden 
                  hover:border-purple-500/50 transition-all duration-300 hover:scale-105 max-w-full">

      {/* Poster Image */}
      <div className="relative aspect-[2/3] overflow-hidden w-full">
        <img
          src={getImageUrl(movie.poster_path)}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          onError={(e) => {
            e.target.src = 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=400';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 
                      group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(movie.id);
          }}
          className="absolute top-3 right-3 p-2 bg-black/50 backdrop-blur-sm rounded-full 
                   hover:bg-black/70 transition-all duration-200 hover:scale-110"
        >
          <Heart 
            className={`w-5 h-5 transition-colors ${
              isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-300 hover:text-red-400'
            }`} 
          />
        </button>
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4">
        {/* Title */}
        <button
          onClick={() => onMovieClick(movie)}
          className="w-full text-left group"
        >
          <h3 className="text-base sm:text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-purple-300 
                       transition-colors duration-200">
            {movie.title}
          </h3>
        </button>

        {/* Release Date & Rating */}
        <div className="flex items-center justify-between mb-3 text-xs sm:text-sm">
          <span className="text-gray-400">
            {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
          </span>
          <div className="flex items-center space-x-1">
            <span className="text-yellow-400 font-semibold">
              {movie.vote_average.toFixed(1)}
            </span>
            <span className="text-gray-500 text-[10px] sm:text-xs">
              ({movie.vote_count})
            </span>
          </div>
        </div>

        {/* User Rating */}
        <div className="mb-3">
          <p className="text-[10px] sm:text-xs text-gray-400 mb-1">Your Rating:</p>
          <StarRating
            rating={userRating}
            onRatingChange={(rating) => onRatingChange(movie.id, rating)}
            size="sm"
          />
        </div>

        {/* Overview */}
        <p className="text-xs sm:text-sm text-gray-300 line-clamp-3 mb-3">
          {movie.overview}
        </p>

        {/* Comments indicator */}
        {commentsCount > 0 && (
          <div className="flex items-center space-x-1 text-[10px] sm:text-xs text-purple-400">
            <MessageCircle className="w-3 h-3" />
            <span>{commentsCount} comment{commentsCount !== 1 ? 's' : ''}</span>
          </div>
        )}
      </div>
    </div>
  );
}
