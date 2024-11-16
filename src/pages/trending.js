// pages/trending.js
import Head from 'next/head';
import { useEffect, useState } from "react";
import axios from "axios";
import MovieCard from "../components/MovieCard";
import Pagination from "../components/Pagination";
import styles from "../styles/MovieCard.module.css";

const TrendingPage = () => {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState({});
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  console.log("JWT_SECRET:", process.env.JWT_SECRET);


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
    fetchTrendingMovies(1);
  }, []);

  const fetchTrendingMovies = async (page) => {
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/trending/movie/week?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&page=${page}`
      );
      setMovies(response.data.results);
      setTotalPages(response.data.total_pages);
    } catch (error) {
      setError("Failed to fetch trending movies");
      console.error("Error fetching trending movies:", error);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchTrendingMovies(page);
  };

  return (
	<>
  <Head>
        <title>PopcornBuddy - Trending Movies</title>
        <meta name="description" content="Explore the latest trending movies with PopcornBuddy." />
      </Head>
    <div className="container mx-auto mt-16">
      <h1 className="text-3xl font-bold text-center mb-8">Trending Movies</h1>
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

export default TrendingPage;