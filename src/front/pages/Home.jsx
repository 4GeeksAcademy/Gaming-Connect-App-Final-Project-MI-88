import React, { useEffect, useState } from "react"
import rigoImageUrl from "../assets/img/rigo-baby.jpg";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import useActions from "../hooks/useActions.jsx";


export const Home = () => {

	const { store, dispatch } = useGlobalReducer()
	const { postToIGDB } = useActions()
	const [games, setGames] = useState([])
	const [loadingGames, setLoadingGames] = useState(false)

	const fetchGames = async () => {
		setLoadingGames(true)
		try {
			const result = await postToIGDB("games", `
				fields name, summary, cover.url;
				search "zelda";
				limit 5;
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
		loadMessage()
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
											{game.summary ? game.summary.substring(0, 100) + "..." : "No summary available"}
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