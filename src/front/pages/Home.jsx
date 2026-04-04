import React, { useEffect, useState } from "react"
import rigoImageUrl from "../assets/img/rigo-baby.jpg";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import useActions from "../hooks/useActions.jsx";


export const Home = () => {

	const { store, dispatch } = useGlobalReducer()
	const { postToIGDB } = useActions()
	const [games, setGames] = useState([])
	const [loadingGames, setLoadingGames] = useState(false)

	const formatDate = (timestamp) => {
		if (!timestamp) return "No release date available"
		const date = new Date(timestamp * 1000) // Unix timestamp is in seconds
		const month = (date.getMonth() + 1).toString().padStart(2, '0')
		const day = date.getDate().toString().padStart(2, '0')
		const year = date.getFullYear()
		return `${month}/${day}/${year}`
	}

	const fetchGames = async () => {
		setLoadingGames(true)
		try {
			const result = await postToIGDB("games", `
				fields name, first_release_date, total_rating, cover.url;
				search "halo";
				limit 10;
			`)
			if (result.error) {
				console.error("Error fetching games:", result.error)
			} else {
				setGames(result)
			}
		} catch (error) {
			console.error("Failed to fetch games:", error)
		} finally {
			setLoadingGames(false)
		}
	}

	useEffect(() => {
	}, [])

	return (
		<div className="text-center mt-5">
			<h1 className="display-4">Hello Rigo!!</h1>
			<p className="lead">
				<img src={rigoImageUrl} className="img-fluid rounded-circle mb-3" alt="Rigo Baby" />
			</p>
			<div className="alert alert-info">
				{store.message ? (
					<span>{store.message}</span>
				) : (
					<span className="text-danger">
						Loading message from the backend (make sure your python 🐍 backend is running)...
					</span>
				)}
			</div>
			<div className="mt-4">
				<button
					className="btn btn-primary"
					onClick={fetchGames}
					disabled={loadingGames}
				>
					{loadingGames ? "Loading Games..." : "Fetch Games from IGDB"}
				</button>
			</div>
			{games.length > 0 && (
				<div className="mt-4">
					<h3>Games from IGDB:</h3>
					<div className="row">
						{games.map((game, index) => (
							<div key={index} className="col-md-4 mb-3">
								<div className="card">
									{game.cover && game.cover.url && (
										<img
											src={`https:${game.cover.url.replace('t_thumb', 't_cover_big')}`}
											className="card-img-top"
											alt={game.name}
										/>
									)}
									<div className="card-body">
										<h5 className="card-title">{game.name}</h5>
										<p className="card-text">
											Release Date: {formatDate(game.first_release_date)}
										</p>
										<p className="card-text">
											{game.total_rating ? `Rating: ${game.total_rating.toFixed(2)}` : "No rating available"}
										</p>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
}; 