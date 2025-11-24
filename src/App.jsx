import React, { useState, useEffect, useCallback } from 'react';
import { searchMovies, getPopularMovies } from './services/tmdbApi';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { MovieGrid } from './components/MovieGrid';
import { MovieModal } from './components/MovieModal';

function App() {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('search');

  // Local storage
  const [userRatings, setUserRatings] = useLocalStorage('movieRatings', []);
  const [favorites, setFavorites] = useLocalStorage('movieFavorites', []);
  const [comments, setComments] = useLocalStorage('movieComments', []);

  // Load movies when tab = search
  useEffect(() => {
    if (activeTab !== 'search') return;

    setIsLoading(true);
    getPopularMovies()
      .then((data) => setMovies(data))
      .finally(() => setIsLoading(false));
  }, [activeTab]);

  // Search handler
  const handleSearch = useCallback(
    async (query) => {
      if (activeTab !== 'search') return;

      setIsLoading(true);
      try {
        const results = query.trim()
          ? await searchMovies(query)
          : await getPopularMovies();

        setMovies(results);
      } finally {
        setIsLoading(false);
      }
    },
    [activeTab]
  );

  // When user opens movie modal
  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);

    // Disable background scroll on mobile
    document.body.style.overflow = 'hidden';
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'auto';
  };

  // Rating handler
  const handleRatingChange = (movieId, rating) => {
    setUserRatings((prev) => {
      const index = prev.findIndex((r) => r.movieId === movieId);

      const newRating = {
        movieId,
        rating,
        timestamp: Date.now()
      };

      if (index >= 0) {
        const updated = [...prev];
        updated[index] = newRating;
        return updated;
      }

      return [...prev, newRating];
    });
  };

  // Favorite toggle
  const handleToggleFavorite = (movieId) => {
    setFavorites((prev) => {
      const exists = prev.some((f) => f.movieId === movieId);
      if (exists) {
        return prev.filter((f) => f.movieId !== movieId);
      }
      return [...prev, { movieId, timestamp: Date.now() }];
    });
  };

  // Add comment
  const handleAddComment = (movieId, text) => {
    const newComment = {
      id: Date.now().toString(),
      movieId,
      text,
      timestamp: Date.now(),
      author: 'You'
    };

    setComments((prev) => [newComment, ...prev]);
  };

  // Delete comment
  const handleDeleteComment = (commentId) => {
    setComments((prev) => prev.filter((c) => c.id !== commentId));
  };

  // Movies depending on tab
  const getFilteredMovies = () => {
    if (activeTab === 'favorites') {
      return movies.filter((m) => favorites.some((f) => f.movieId === m.id));
    }

    if (activeTab === 'rated') {
      return movies.filter((m) => userRatings.some((r) => r.movieId === m.id));
    }

    return movies;
  };

  const selectedMovieRating =
    selectedMovie?.id &&
    userRatings.find((r) => r.movieId === selectedMovie.id)?.rating
      ? userRatings.find((r) => r.movieId === selectedMovie.id).rating
      : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
      
      {/* Background patterns */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] 
                      from-purple-900/20 via-gray-900 to-gray-900 pointer-events-none" />

      <div className="fixed inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%239C92AC%22 fill-opacity=%220.02%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] 
                      pointer-events-none" />

      <div className="relative z-10">
        <Header
          activeTab={activeTab}
          onTabChange={setActiveTab}
          favoritesCount={favorites.length}
          ratedCount={userRatings.length}
        />

        <main className="container mx-auto px-4 py-8">
          
          {/* SEARCH TAB */}
          {activeTab === 'search' && (
            <div className="mb-8">
              <SearchBar onSearch={handleSearch} isLoading={isLoading} />
            </div>
          )}

          {/* FAVORITES HEADER */}
          {activeTab === 'favorites' && (
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Your Favorites</h2>
              <p className="text-gray-400">Movies you've marked as favorites</p>
            </div>
          )}

          {/* RATED HEADER */}
          {activeTab === 'rated' && (
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Your Ratings</h2>
              <p className="text-gray-400">Movies you've rated</p>
            </div>
          )}

          {/* LOADING SKELETON */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="bg-gray-800/30 rounded-2xl overflow-hidden animate-pulse">
                  <div className="aspect-[2/3] bg-gray-700/50" />
                  <div className="p-4">
                    <div className="h-4 bg-gray-700/50 rounded mb-2" />
                    <div className="h-3 bg-gray-700/50 rounded w-3/4 mb-2" />
                    <div className="h-3 bg-gray-700/50 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <MovieGrid
              movies={getFilteredMovies()}
              userRatings={userRatings}
              favorites={favorites}
              comments={comments}
              onMovieClick={handleMovieClick}
              onRatingChange={handleRatingChange}
              onToggleFavorite={handleToggleFavorite}
            />
          )}
        </main>

        {/* MOVIE MODAL */}
        <MovieModal
          movie={selectedMovie}
          isOpen={isModalOpen}
          userRating={selectedMovieRating}
          comments={comments}
          onClose={closeModal}
          onRatingChange={handleRatingChange}
          onAddComment={handleAddComment}
          onDeleteComment={handleDeleteComment}
        />
      </div>
    </div>
  );
}

export default App;
