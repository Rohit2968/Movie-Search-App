const API_BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

// Replace 'YOUR_API_KEY_HERE' with your actual TMDB API key
const API_KEY = '2aee74c0d0ebca8a935c5652835c90db';

const fetchFromApi = async (endpoint) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}&api_key=${API_KEY}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API fetch error:", error);
    return null;
  }
};

export const searchMovies = async (query) => {
  if (!query.trim()) return [];
  const data = await fetchFromApi(`/search/movie?query=${encodeURIComponent(query)}&page=1`);
  return data?.results || [];
};

export const getPopularMovies = async () => {
  const data = await fetchFromApi("/movie/popular?page=1");
  return data?.results || [];
};

export const getMovieImages = async (movieId) => {
  const data = await fetchFromApi(`/movie/${movieId}/images?`);
  return data || { backdrops: [], posters: [] };
};

export const getImageUrl = (path, size = "w500") => {
  if (!path) return "/placeholder-movie.jpg";
  return `${IMAGE_BASE_URL}/${size}${path}`;
};
