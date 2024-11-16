// components/MovieCard.js
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaHeart, FaList } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import noPoster from "../../public/no-poster.jpg";
import styles from "../styles/MovieCard.module.css";
import LoginPrompt from "./LoginPrompt";
import { useAuth } from "../context/AuthContext"; // Use AuthContext

const MovieCard = ({ movie, genres }) => {
	const [isFavorite, setIsFavorite] = useState(false);
	const [isInWatchlist, setIsInWatchlist] = useState(false);
	const { isLoggedIn, user } = useAuth(); // Use the custom AuthContext to check if user is logged in
	const [showLoginPrompt, setShowLoginPrompt] = useState(false);
	const [posterUrl, setPosterUrl] = useState(
		movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : noPoster
	);

	useEffect(() => {
		const checkUserStatus = async () => {
			if (isLoggedIn && user) {
				try {
					const response = await axios.get(`/api/user/checkUserStatus`, {
						params: {
							userId: user.id,
							movieId: movie.id,
						},
					});
					setIsFavorite(response.data.isFavorite);
					setIsInWatchlist(response.data.isInWatchlist);
				} catch (error) {
					console.error(
						"Error checking user status:",
						error.response?.data || error.message
					);
				}
			} else {
				setIsFavorite(false);
				setIsInWatchlist(false);
			}
		};

		checkUserStatus();
	}, [user, movie.id, isLoggedIn]);

	const handleAddToFavorites = async (e) => {
		e.preventDefault();
		if (!isLoggedIn) {
			setShowLoginPrompt(true); // Show login prompt if not logged in
			return;
		}
		const action = isFavorite ? "removeFavorite" : "addFavorite";

		const userId = user?.id;

		const dataToSend = {
			userId,
			movieId: movie.id,
			title: movie.title,
			posterPath: movie.poster_path || "",
			releaseDate: movie.release_date || "",
			action,
		};

		try {
			const response = await axios.post("/api/user/toggleFavorites", dataToSend);
			if (response.data.success) {
				setIsFavorite(!isFavorite);
				toast.success(`Movie ${isFavorite ? "removed from" : "added to"} favorites!`, {
					position: "bottom-right",
				});
			}
		} catch (error) {
			toast.error("Failed to update favorites");
			console.error("Failed to update favorites:", error.response?.data || error.message);
		}
	};

	const handleAddToWatchlist = async (e) => {
		e.preventDefault();
		if (!isLoggedIn) {
			setShowLoginPrompt(true); // Show login prompt if not logged in
			return;
		}

		const action = isInWatchlist ? "removeWatchlist" : "addWatchlist";

		const dataToSend = {
			userId: user?.id,
			movieId: movie.id,
			title: movie.title,
			posterPath: movie.poster_path || "",
			releaseDate: movie.release_date || "",
			action,
		};

		try {
			const response = await axios.post("/api/user/toggleWatchlist", dataToSend);
			if (response.data.success) {
				setIsInWatchlist(!isInWatchlist);
				toast.success(`Movie ${isInWatchlist ? "removed from" : "added to"} Watchlist!`, {
					position: "bottom-right",
				});
			}
		} catch (error) {
			toast.error("Failed to update watchlist");
			console.error("Failed to update watchlist:", error.response?.data || error.message);
		}
	};

	const getGenreNames = (genreIds) => {
		return genreIds
			.map((id) => genres[id])
			.filter(Boolean)
			.slice(0, 2)
			.join("/");
	};

	const handleImageError = () => {
		setPosterUrl(noPoster.src);
	};

	return (
		<>
			{showLoginPrompt && <LoginPrompt onClose={() => setShowLoginPrompt(false)} />}
			<div className={`bg-white p-4 rounded shadow-lg ${styles.card}`}>
				<Link href={`/movie/${movie.id}`} passHref>
					<div className={`relative ${styles.imageContainer}`}>
						<Image
							src={posterUrl}
							alt={`Poster for ${movie.title}`}
							layout="responsive"
							width={500}
							height={750}
							className="rounded-t"
							priority
							onError={handleImageError}
						/>
					</div>
					<div className={`pt-4 pl-2 ${styles.content}`}>
						<div className={styles.titleContainer}>
							<h2 className={`font-bold ${styles.title}`}>{movie.title}</h2>
						</div>
						<div className={styles.movieInfoContainer}>
							<p className={`pt-2 ${styles.movieInfo}`}>
								{new Date(movie.release_date).getFullYear()} {" · "}
								{getGenreNames(movie.genre_ids)}
							</p>
						</div>
					</div>
				</Link>
				<div className="flex pt-4 pl-1 justify-between items-center">
					<button
						onClick={handleAddToFavorites}
						aria-label={`Add ${movie.title} to favorites`}
						className={`mx-1 rounded-full hover:text-red-400 ${
							isFavorite ? "text-red-500" : "text-gray-500"
						}`}>
						<FaHeart size={28} />
					</button>
					<button
						onClick={handleAddToWatchlist}
						aria-label={`Add ${movie.title} to watchlist`}
						className={`mx-1 rounded-full hover:text-green-500 ${
							isInWatchlist ? "text-green-600" : "text-gray-500"
						}`}>
						<FaList size={28} />
					</button>
				</div>
			</div>
		</>
	);
};

export default MovieCard;
