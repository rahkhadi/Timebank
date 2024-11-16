// components/MediaCard.js
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaHeart, FaList } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import noPoster from "../../public/no-poster.jpg";
import styles from "../styles/MediaCard.module.css";
import LoginPrompt from "./LoginPrompt";
import { useAuth } from "../context/AuthContext";

const MediaCard = ({ media }) => {
	const [isFavorite, setIsFavorite] = useState(false);
	const [isInWatchlist, setIsInWatchlist] = useState(false);
	const { isLoggedIn, user } = useAuth();
	const [showLoginPrompt, setShowLoginPrompt] = useState(false);
	const [posterUrl, setPosterUrl] = useState(
		media.posterPath ? `https://image.tmdb.org/t/p/w500${media.posterPath}` : noPoster
	);

	useEffect(() => {
		const checkUserStatus = async () => {
			if (isLoggedIn && user) {
				try {
					const response = await axios.get(`/api/user/checkUserStatus`, {
						params: {
							userId: user.id,
							movieId: media.movieId,
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
	}, [user, media.movieId, isLoggedIn]);

	const handleAddToFavorites = async (e) => {
		e.preventDefault();
		if (!isLoggedIn) {
			setShowLoginPrompt(true);
			return;
		}
		const action = isFavorite ? "removeFavorite" : "addFavorite";

		try {
			const response = await axios.post("/api/user/toggleFavorites", {
				userId: user.id,
				movieId: media.movieId,
				title: media.title,
				posterPath: media.posterPath || "",
				releaseDate: media.releaseDate || "",
				action,
			});
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
			setShowLoginPrompt(true);
			return;
		}

		const action = isInWatchlist ? "removeWatchlist" : "addWatchlist";

		try {
			const response = await axios.post("/api/user/toggleWatchlist", {
				userId: user.id,
				movieId: media.movieId,
				title: media.title,
				posterPath: media.posterPath || "",
				releaseDate: media.releaseDate || "",
				action,
			});
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

	const handleImageError = () => {
		setPosterUrl(noPoster.src);
	};

	return (
		<>
			{showLoginPrompt && <LoginPrompt onClose={() => setShowLoginPrompt(false)} />}
			<div className={`bg-white p-4 rounded shadow-lg ${styles.card}`}>
				<Link href={`/movie/${media.movieId}`} passHref>
					<div className={`relative ${styles.imageContainer}`}>
						<Image
							src={posterUrl}
							alt={`Poster for ${media.title}`}
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
							<h3 className={`font-bold ${styles.title}`}>{media.title}</h3>
						</div>
						<div className={styles.movieInfoContainer}>
							<p className={`pt-2 ${styles.movieInfo}`}>
								{new Date(media.releaseDate).getFullYear()}
							</p>
						</div>
					</div>
				</Link>
				<div className="flex pt-4 pl-1 justify-between items-center">
					<button
						onClick={handleAddToFavorites}
						aria-label={`Add ${media.title} to favorites`}
						className={`mx-1 rounded-full hover:text-red-400 ${
							isFavorite ? "text-red-500" : "text-gray-500"
						}`}>
						<FaHeart size={28} />
					</button>
					<button
						onClick={handleAddToWatchlist}
						aria-label={`Add ${media.title} to watchlist`}
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

export default MediaCard;
