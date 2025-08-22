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
  
  // Local storage hooks
  const [userRatings, setUserRatings] = useLocalStorage('movieRatings', []);
  const [favorites, setFavorites] = useLocalStorage('movieFavorites', []);
  const [comments, setComments] = useLocalStorage('movieComments', []);

  // Load popular movies on initial load
  useEffect(() => {
    if (activeTab === 'search') {
      setIsLoading(true);
      getPopularMovies().then((popularMovies) => {
        setMovies(popularMovies);
        setIsLoading(false);
      });
    }
  }, [activeTab]);

  // Filter movies based on active tab
  useEffect(() => {
    if (activeTab === 'favorites') {
      const favoriteMovieIds = favorites.map(f => f.movieId);
      const favoriteMovies = movies.length > 0 
        ? movies.filter(movie => favoriteMovieIds.includes(movie.id))
        : [];
      
      // If no movies loaded yet, load popular movies first
      if (movies.length === 0 && favorites.length > 0) {
        getPopularMovies().then((popularMovies) => {
          const favoriteMoviesFromPopular = popularMovies.filter(movie => 
            favoriteMovieIds.includes(movie.id)
          );
          setMovies(favoriteMoviesFromPopular);
        });
      }
    } else if (activeTab === 'rated') {
      const ratedMovieIds = userRatings.map(r => r.movieId);
      const ratedMovies = movies.length > 0 
        ? movies.filter(movie => ratedMovieIds.includes(movie.id))
        : [];
      
      // If no movies loaded yet, load popular movies first
      if (movies.length === 0 && userRatings.length > 0) {
        getPopularMovies().then((popularMovies) => {
          const ratedMoviesFromPopular = popularMovies.filter(movie => 
            ratedMovieIds.includes(movie.id)
          );
          setMovies(ratedMoviesFromPopular);
        });
      }
    }
  }, [activeTab, favorites, userRatings]);

  const handleSearch = useCallback(async (query) => {
    if (activeTab !== 'search') return;
    
    setIsLoading(true);
    try {
      const results = query.trim() ? await searchMovies(query) : await getPopularMovies();
      setMovies(results);
    } finally {
      setIsLoading(false);
    }
  }, [activeTab]);

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };

  const handleRatingChange = (movieId, rating) => {
    setUserRatings(prev => {
      const existingRatingIndex = prev.findIndex(r => r.movieId === movieId);
      if (existingRatingIndex >= 0) {
        const updated = [...prev];
        updated[existingRatingIndex] = { movieId, rating, timestamp: Date.now() };
        return updated;
      } else {
        return [...prev, { movieId, rating, timestamp: Date.now() }];
      }
    });
  };

  const handleToggleFavorite = (movieId) => {
    setFavorites(prev => {
      const existingIndex = prev.findIndex(f => f.movieId === movieId);
      if (existingIndex >= 0) {
        return prev.filter(f => f.movieId !== movieId);
      } else {
        return [...prev, { movieId, timestamp: Date.now() }];
      }
    });
  };

  const handleAddComment = (movieId, text) => {
    const newComment = {
      id: Date.now().toString(),
      movieId,
      text,
      timestamp: Date.now(),
      author: 'You'
    };
    setComments(prev => [newComment, ...prev]);
  };

  const handleDeleteComment = (commentId) => {
    setComments(prev => prev.filter(c => c.id !== commentId));
  };

  const getFilteredMovies = () => {
    const allMovies = movies;
    
    switch (activeTab) {
      case 'favorites':
        return allMovies.filter(movie => 
          favorites.some(f => f.movieId === movie.id)
        );
      case 'rated':
        return allMovies.filter(movie => 
          userRatings.some(r => r.movieId === movie.id)
        );
      default:
        return allMovies;
    }
  };

  const selectedMovieRating = selectedMovie 
    ? userRatings.find(r => r.movieId === selectedMovie.id)?.rating || 0
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] 
                    from-purple-900/20 via-gray-900 to-gray-900 pointer-events-none" />
      <div className="fixed inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%239C92AC%22 fill-opacity=%220.02%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] pointer-events-none" />
      
      <div className="relative z-10">
        <Header 
          activeTab={activeTab}
          onTabChange={setActiveTab}
          favoritesCount={favorites.length}
          ratedCount={userRatings.length}
        />

        <main className="container mx-auto px-4 py-8">
          {activeTab === 'search' && (
            <div className="mb-8">
              <SearchBar onSearch={handleSearch} isLoading={isLoading} />
            </div>
          )}

          {activeTab === 'favorites' && (
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Your Favorites</h2>
              <p className="text-gray-400">Movies you've marked as favorites</p>
            </div>
          )}

          {activeTab === 'rated' && (
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Your Ratings</h2>
              <p className="text-gray-400">Movies you've rated</p>
            </div>
          )}

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

        <MovieModal
          movie={selectedMovie}
          isOpen={isModalOpen}
          userRating={selectedMovieRating}
          comments={comments}
          onClose={() => setIsModalOpen(false)}
          onRatingChange={handleRatingChange}
          onAddComment={handleAddComment}
          onDeleteComment={handleDeleteComment}
        />
      </div>
    </div>
  );
}

export default App;