import React, { useState, useEffect } from 'react';
import { X, Calendar, Star, MessageCircle, Send, Trash2 } from 'lucide-react';
import { StarRating } from './StarRating';
import { getImageUrl, getMovieImages } from '../services/tmdbApi';

export function MovieModal({ 
  movie, 
  isOpen, 
  userRating,
  comments,
  onClose, 
  onRatingChange,
  onAddComment,
  onDeleteComment
}) {
  const [images, setImages] = useState({ backdrops: [], posters: [] });
  const [isLoadingImages, setIsLoadingImages] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [activeImageTab, setActiveImageTab] = useState('backdrops');

  useEffect(() => {
    if (movie && isOpen) {
      setIsLoadingImages(true);
      getMovieImages(movie.id).then((data) => {
        setImages(data);
        setIsLoadingImages(false);
      });
    }
  }, [movie, isOpen]);

  const handleAddComment = (e) => {
    e.preventDefault();
    if (newComment.trim() && movie) {
      onAddComment(movie.id, newComment.trim());
      setNewComment('');
    }
  };

  if (!isOpen || !movie) return null;

  const movieComments = comments.filter(c => c.movieId === movie.id);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900/95 backdrop-blur-lg border border-gray-700/50 rounded-3xl max-w-6xl w-full 
                    max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="relative">
          <div 
            className="h-64 bg-cover bg-center"
            style={{
              backgroundImage: `url(${getImageUrl(movie.backdrop_path, 'w1280')})`
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-gray-900/30" />
          </div>
          
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 bg-black/50 backdrop-blur-sm rounded-full 
                     hover:bg-black/70 transition-all duration-200 hover:scale-110"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          <div className="absolute bottom-6 left-6">
            <h2 className="text-4xl font-bold text-white mb-2">{movie.title}</h2>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-gray-300">
                  {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-400" />
                <span className="text-yellow-400 font-semibold">
                  {movie.vote_average.toFixed(1)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-16rem)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Details */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Overview</h3>
              <p className="text-gray-300 mb-6 leading-relaxed">{movie.overview}</p>

              {/* User Rating */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-white mb-2">Your Rating</h4>
                <StarRating
                  rating={userRating}
                  onRatingChange={(rating) => onRatingChange(movie.id, rating)}
                  size="lg"
                />
              </div>

              {/* Comments Section */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                  <MessageCircle className="w-5 h-5" />
                  <span>Comments ({movieComments.length})</span>
                </h4>

                {/* Add Comment */}
                <form onSubmit={handleAddComment} className="mb-4">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add a comment..."
                      className="flex-1 px-4 py-2 bg-gray-800/50 border border-gray-600/50 rounded-xl 
                               text-white placeholder-gray-400 focus:outline-none focus:ring-2 
                               focus:ring-purple-500 focus:border-transparent"
                    />
                    <button
                      type="submit"
                      disabled={!newComment.trim()}
                      className="px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 
                               disabled:opacity-50 disabled:cursor-not-allowed transition-colors
                               flex items-center space-x-1"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </form>

                {/* Comments List */}
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {movieComments.map((comment) => (
                    <div key={comment.id} className="bg-gray-800/30 rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-sm text-purple-400 font-medium">{comment.author}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">
                            {new Date(comment.timestamp).toLocaleDateString()}
                          </span>
                          <button
                            onClick={() => onDeleteComment(comment.id)}
                            className="p-1 text-gray-500 hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-300">{comment.text}</p>
                    </div>
                  ))}
                  {movieComments.length === 0 && (
                    <p className="text-gray-500 text-sm italic">No comments yet. Be the first to comment!</p>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Images */}
            <div>
              <div className="flex space-x-4 mb-4">
                <button
                  onClick={() => setActiveImageTab('backdrops')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    activeImageTab === 'backdrops'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  Backdrops ({images.backdrops.length})
                </button>
                <button
                  onClick={() => setActiveImageTab('posters')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    activeImageTab === 'posters'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  Posters ({images.posters.length})
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                {isLoadingImages ? (
                  Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="aspect-video bg-gray-800/50 rounded-lg animate-pulse" />
                  ))
                ) : (
                  images[activeImageTab]?.slice(0, 12).map((image, index) => (
                    <div key={index} className="relative group overflow-hidden rounded-lg">
                      <img
                        src={getImageUrl(image.file_path, activeImageTab === 'backdrops' ? 'w780' : 'w500')}
                        alt={`${movie.title} ${activeImageTab}`}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 
                                    transition-opacity duration-300" />
                    </div>
                  ))
                )}
              </div>

              {!isLoadingImages && images[activeImageTab]?.length === 0 && (
                <p className="text-gray-500 text-center py-8">No {activeImageTab} available</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}