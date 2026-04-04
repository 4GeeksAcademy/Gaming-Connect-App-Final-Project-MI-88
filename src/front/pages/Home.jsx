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

	useEffect(() => {
		loadMessage()
	}, [])

	return (
		<div className="container text-center mt-5">

			<h1 className="display-2 m-4">Welcome to GuildUp!</h1>

			<img src="https://cdn.discordapp.com/attachments/1170571402114498602/1489773408014041138/amazing_thumbs_up.png?ex=69d1a31b&is=69d0519b&hm=061b33dc276db7b2a02562835f2260f02d893a8b52f2be8e4eb133b376ca6bcc&"></img>

			<h3 className="m-4">Our Mission and What We Do:</h3>
			<p>1. At GuildUp, we believe every gamer deserves a crew. We're breaking down the barriers that keep players apart by intelligently connecting gamers based on the games they love, the skills they've built, and the time they have to play. Because gaming is always better together!</p>
			<p>2. GuildUp's mission is to eliminate the barriers between gamers and meaningful connection. By matching players across shared games, skill levels, and availability, we create a seamless path from playing solo to active community — making it effortless to find the right person to play with, every time.</p>
			<p>3. GuildUp exists to end the lull of playing solo. We match gamers with the right players — same games, same skill, same schedule — so finding your next teammate is as easy as loading into a match. No awkward outreach, no dead lobbies. Just play.</p>

			<h3 className="m-4">Features:</h3>
			<ul>
				<li>Customize your own profile card: Let others know a little bit about yourself, the kinds of games you like to play, your skill level, what platform you play on (PC, PS5, Xbox, etc.), and what time you're available to play. </li>
				<li>Create your own list of your favorite games that you've played and or are currently playing.</li>
				<li>Connect with new and old friends manually or by adding them through a list of people you recently played with.</li>
				<li>The ability to message other gamers (Direct messaging and the abilty to create group chats/guilds to make communication easier).</li>
				<li>Schedule and set a time to meet up with your friends and game with an event reminder</li>
			</ul>
		</div>
	);
}; 