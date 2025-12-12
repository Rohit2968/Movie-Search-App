const BACKEND_URL = "https://backend-mna6.onrender.com"; 
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

// Fetch wrapper for backend
const fetchFromBackend = async (endpoint) => {
  try {
    const res = await fetch(`${BACKEND_URL}${endpoint}`);

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Backend API fetch error:", error);
    return null;
  }
};

// Search Movies
export const searchMovies = async (query) => {
  if (!query.trim()) return [];
  const data = await fetchFromBackend(`/api/movies/search?q=${encodeURIComponent(query)}`);
  return data?.results || [];
};

// Popular Movies
export const getPopularMovies = async () => {
  const data = await fetchFromBackend(`/api/movies/popular`);
  return data?.results || [];
};

// Movie Images
export const getMovieImages = async (movieId) => {
  const data = await fetchFromBackend(`/api/movies/${movieId}/images`);
  return data || { backdrops: [], posters: [] };
};

// Image URL Builder
export const getImageUrl = (path, size = "w500") => {
  if (!path) return "/placeholder-movie.jpg";
  return `${IMAGE_BASE_URL}/${size}${path}`;
};
