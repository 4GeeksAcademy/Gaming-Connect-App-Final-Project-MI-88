import React, { useEffect } from "react"
import rigoImageUrl from "../assets/img/rigo-baby.jpg";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const LandingPage = () => {

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

	useEffect(() => {
		loadMessage()
	}, [])

	return (
		<>
			<div className="container text-center mt-5">

				<h1 className="display-2 m-4">Welcome to GuildUp! LANDING PAGE</h1>

				<img src="https://i.ibb.co/653LxPR/amazing-thumbs-up.png"></img>

				<h3 className="mt-4 mb-4 text-start">Our Mission and What We Do:</h3>
				<ol className="text-start">
					<li>At GuildUp, we believe every gamer deserves a crew. We're breaking down the barriers that keep players apart by intelligently connecting gamers based on the games they love, the skills they've built, and the time they have to play. Because gaming is always better together!</li>
					<li>GuildUp's mission is to eliminate the barriers between gamers and meaningful connection. By matching players across shared games, skill levels, and availability, we create a seamless path from playing solo to active community — making it effortless to find the right person to play with, every time.</li>
					<li>GuildUp exists to end the lull of playing solo. We match gamers with the right players — same games, same skill, same schedule — so finding your next teammate is as easy as loading into a match. No awkward outreach, no dead lobbies. Just play.</li>
				</ol>
				<h3 className="mt-4 mb-4 text-start">Our Features:</h3>
				<ul className="text-start">
					<li>Customize your own profile card: Let others know a little bit about yourself, the kinds of games you like to play, your favorite genre(s), your skill level, what platform you play on (PC, PS5, Xbox, etc.), and what time(s) you're available to play.</li>
					<li>Create your own list of your favorite games that you've played and or are currently playing, as well as adding your own rating and mini review to said games.</li>
					<li>Our filters make it easier than ever to find other gamers to play with based on your preferences.</li>
					<li>Connect with new and old friends by searching for their username or by adding them through a list of people you recently played with. Don't worry, you can also remove friends just as easily.</li>
					<li>The ability to send messages to other users (Coming soon!)</li>
				</ul>
			</div>
		</>
	);
}; 