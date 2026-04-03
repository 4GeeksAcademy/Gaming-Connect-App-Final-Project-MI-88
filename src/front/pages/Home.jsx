import React, { useEffect } from "react"
import rigoImageUrl from "../assets/img/rigo-baby.jpg";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const Home = () => {

	const { store, dispatch } = useGlobalReducer()

	const loadMessage = async () => {
		try {
			const backendUrl = import.meta.env.VITE_BACKEND_URL

			if (!backendUrl) throw new Error("VITE_BACKEND_URL is not defined in .env file")

			const response = await fetch(backendUrl + "/api/hello")
			const data = await response.json()

			if (response.ok) dispatch({ type: "set_hello", payload: data.message })

			return data

		} catch (error) {
			if (error.message) throw new Error(
				`Could not fetch the message from the backend.
				Please check if the backend is running and the backend port is public.`
			);
		}

	}
	const apiAuth = async () => {
		try {
			//need to reformat this and remove my secret key and replace with a concat on the location (process.env.client_secret)
			//const response = await fetch("https://id.twitch.tv/oauth2/token?client_id=dfarh6uy42ex46tz3xsjeco60pqlqt&client_secret=INSERT SECRET KEY LOCATION HERE &grant_type=client_credentials", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
			})

			const data = await response.json()
			console.log(data)
		} catch (err) {
			return { error: err.message || "credentials failed" }
		}}



	useEffect(() => {
		apiAuth()
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
		</div>
	);
}; 