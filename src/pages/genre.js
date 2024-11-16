// pages/genre.js
import Head from 'next/head';
import { useState, useEffect } from "react";
import axios from "axios";
import MovieCard from "../components/MovieCard";
import Pagination from "../components/Pagination";
import styles from "../styles/MovieCard.module.css";

const GenrePage = () => {
  const [movies, setMovies] = useState([]);
  const [genre, setGenre] = useState("");
  const [error, setError] = useState(null);
  const [genres, setGenres] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const moviesPerPage = 12;

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/genre/movie/list?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US`
        );
        const genresMap = response.data.genres.reduce((acc, genre) => {
          acc[genre.id] = genre.name;
          return acc;
        }, {});
        setGenres(genresMap);
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };

    fetchGenres();
  }, []);

  const fetchMovies = async (selectedGenre, page) => {
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&with_genres=${selectedGenre}&page=${page}`
      );
      setMovies(response.data.results);
      setTotalPages(response.data.total_pages);
    } catch (error) {
      setError("Failed to fetch movies");
      console.error("Error fetching movies:", error);
      setMovies([]);
    }
  };

  const handleGenreChange = async (event) => {
    const selectedGenre = event.target.value;
    setGenre(selectedGenre);
    setError(null);
    setCurrentPage(1);

    if (selectedGenre === "") {
      setMovies([]);
      setTotalPages(0);
      return;
    }

    fetchMovies(selectedGenre, 1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchMovies(genre, page);
  };

  return (
    <>
  <Head>
        <title>PopcornBuddy - Movies by Genre</title>
        <meta name="description" content="Explore movies by genre with PopcornBuddy." />
      </Head>
    <div className="container mx-auto mt-16">
      <h1 className="text-3xl font-bold text-center mb-8">Movies by Genre</h1>
      <div className="text-center mb-8">
        <select
          onChange={handleGenreChange}
          value={genre}
          className="p-2 rounded text-black rounded-md shadow-sm focus:outline-none focus:ring-[#1f2937] focus:border-[#1f2937]"
        >
          <option value="">Select a Genre</option>
          {Object.keys(genres).map((id) => (
            <option key={id} value={id}>
              {genres[id]}
            </option>
          ))}
        </select>
      </div>
      {error && <p className="text-red-500 text-center">{error}</p>}
      <div
        className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 ${styles.gridContainer}`}
      >
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} genres={genres} />
        ))}
      </div>
      {totalPages > 1 && (
        <Pagination
          pageCount={totalPages}
          onPageChange={handlePageChange}
          currentPage={currentPage}
        />
      )}
    </div>
    </>
  );
};

export default GenrePage;