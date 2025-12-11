const API_BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

// TMDB v4 Access Token (NOT API key)
const ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhZDlkMWVhYzc1YmY1ZjcxODU2MjZmYjNjMGRkZmQzOCIsIm5iZiI6MTc0MjUwNzk4NS41MDg5OTk4LCJzdWIiOiI2N2RjOGZkMTg0M2E5NTAzMzY2YmE0ZGQiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.7qp4bPICyxkqSemKkjMck04CDiKr0qBS0F2eClGrWEc";

const fetchFromApi = async (endpoint) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
    });

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
  const data = await fetchFromApi(`/movie/popular?page=1`);
  return data?.results || [];
};

export const getMovieImages = async (movieId) => {
  const data = await fetchFromApi(`/movie/${movieId}/images`);
  return data || { backdrops: [], posters: [] };
};

export const getImageUrl = (path, size = "w500") => {
  if (!path) return "/placeholder-movie.jpg";
  return `${IMAGE_BASE_URL}/${size}${path}`;
};


