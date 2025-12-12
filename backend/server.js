import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());

const TMDB_BASE = "https://api.themoviedb.org/3";
const AUTH_HEADER = {
  headers: {
    Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
    accept: "application/json",
  },
};

// Route 1 — Popular Movies
app.get("/api/movies/popular", async (req, res) => {
  try {
    const response = await axios.get(`${TMDB_BASE}/movie/popular?page=1`, AUTH_HEADER);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "TMDB request failed" });
  }
});

// Route 2 — Search Movies
app.get("/api/movies/search", async (req, res) => {
  try {
    const query = req.query.q;
    const response = await axios.get(`${TMDB_BASE}/search/movie?query=${query}`, AUTH_HEADER);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "TMDB request failed" });
  }
});

// Route 3 — Movie Images
app.get("/api/movies/:id/images", async (req, res) => {
  try {
    const id = req.params.id;
    const response = await axios.get(`${TMDB_BASE}/movie/${id}/images`, AUTH_HEADER);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "TMDB request failed" });
  }
});

app.get("/", (req, res) => {
  res.send("Movie API Backend is running!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
