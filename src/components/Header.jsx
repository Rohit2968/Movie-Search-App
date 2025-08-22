import React from 'react';
import { Film, Heart, Star } from 'lucide-react';

export function Header({ activeTab, onTabChange, favoritesCount, ratedCount }) {
  return (
    <header className="bg-gray-900/80 backdrop-blur-lg border-b border-gray-700/50 sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl">
              <Film className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1
                onClick={() => onTabChange('search')}
                className="cursor-pointer text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent hover:opacity-80 transition"
              >
                BingeBox
              </h1>
              <p className="text-xs text-gray-400">Discover • Rate • Share</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex items-center space-x-2">
            <button
              onClick={() => onTabChange('search')}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                activeTab === 'search'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/25'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              Discover
            </button>
            <button
              onClick={() => onTabChange('favorites')}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2 ${
                activeTab === 'favorites'
                  ? 'bg-red-600 text-white shadow-lg shadow-red-600/25'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              <Heart className="w-4 h-4" />
              <span>Favorites</span>
              {favoritesCount > 0 && (
                <span className="bg-white/20 text-xs px-2 py-1 rounded-full">
                  {favoritesCount}
                </span>
              )}
            </button>
            <button
              onClick={() => onTabChange('rated')}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2 ${
                activeTab === 'rated'
                  ? 'bg-yellow-600 text-white shadow-lg shadow-yellow-600/25'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              <Star className="w-4 h-4" />
              <span>Rated</span>
              {ratedCount > 0 && (
                <span className="bg-white/20 text-xs px-2 py-1 rounded-full">
                  {ratedCount}
                </span>
              )}
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}