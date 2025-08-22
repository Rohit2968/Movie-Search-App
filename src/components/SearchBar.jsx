import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

export function SearchBar({ onSearch, isLoading }) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onSearch(query);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, onSearch]);

  return (
    <div className="relative max-w-2xl mx-auto">
      <div className="relative group">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for movies..."
          className="w-full px-6 py-4 pl-14 bg-gray-900/50 backdrop-blur-lg border border-purple-500/20 rounded-2xl 
                   text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 
                   focus:border-transparent transition-all duration-300 text-lg
                   group-hover:border-purple-500/40"
        />
        <Search 
          className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 transition-colors duration-300
                     ${isLoading ? 'text-purple-400 animate-pulse' : 'text-gray-400 group-hover:text-purple-400'}`}
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-2xl blur-xl opacity-0 
                    group-hover:opacity-100 transition-opacity duration-300 -z-10" />
    </div>
  );
}