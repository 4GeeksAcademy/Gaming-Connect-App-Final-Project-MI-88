import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import rigoImageUrl from "../assets/img/rigo-baby.jpg";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const Home = () => {

	const { store, dispatch } = useGlobalReducer()
	const navigate = useNavigate()
	const [searchResults, setSearchResults] = useState([])
	const [searchForm, setSearchForm] = useState({
		username: '',
		game: '',
		skill_min: '',
		skill_max: '',
		age_min: '',
		age_max: ''
	})
	const [searching, setSearching] = useState(false)

	// Recommendations state
	const [recommendations, setRecommendations] = useState([])
	const [loadingRecommendations, setLoadingRecommendations] = useState(false)
	const [userProfile, setUserProfile] = useState(null)
	const [recommendationSettings, setRecommendationSettings] = useState({
		skillRange: 'any', // +/- skill points or 'any'
		ageRange: 'any',   // +/- years or 'any'
		specificGame: '' // empty means any game
	})

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

	const handleSearch = async (e) => {
		e.preventDefault()
		setSearching(true)
		setSearchResults([])

		const backendUrl = import.meta.env.VITE_BACKEND_URL
		const token = localStorage.getItem('token')

		if (!backendUrl || !token) {
			alert('Backend URL or token not found')
			setSearching(false)
			return
		}

		const params = new URLSearchParams()
		if (searchForm.username) params.append('username', searchForm.username)
		if (searchForm.game) params.append('game', searchForm.game)
		if (searchForm.skill_min) params.append('skill_min', searchForm.skill_min)
		if (searchForm.skill_max) params.append('skill_max', searchForm.skill_max)
		if (searchForm.age_min) params.append('age_min', searchForm.age_min)
		if (searchForm.age_max) params.append('age_max', searchForm.age_max)

		try {
			const response = await fetch(`${backendUrl}/api/search-users?${params}`, {
				headers: {
					'Authorization': `Bearer ${token}`
				}
			})
			const data = await response.json()

			if (response.ok) {
				setSearchResults(data)
			} else {
				alert(data.error || 'Search failed')
			}
		} catch (error) {
			alert('Search failed: ' + error.message)
		}

		setSearching(false)
	}

	const handleInputChange = (e) => {
		const { name, value } = e.target
		setSearchForm(prev => ({ ...prev, [name]: value }))
	}

	const loadUserProfile = async () => {
		const backendUrl = import.meta.env.VITE_BACKEND_URL
		const token = localStorage.getItem('token')

		if (!backendUrl || !token) return

		try {
			const response = await fetch(`${backendUrl}/api/profile`, {
				headers: {
					'Authorization': `Bearer ${token}`
				}
			})
			const data = await response.json()
			if (response.ok) {
				setUserProfile(data)
			}
		} catch (error) {
			console.error('Failed to load profile:', error)
		}
	}

	const loadRecommendations = async () => {
		setLoadingRecommendations(true)
		const backendUrl = import.meta.env.VITE_BACKEND_URL
		const token = localStorage.getItem('token')

		if (!backendUrl || !token || !userProfile) {
			setLoadingRecommendations(false)
			return
		}

		const params = new URLSearchParams({
			skill_range: recommendationSettings.skillRange === 'any' ? '-1' : recommendationSettings.skillRange,
			age_range: recommendationSettings.ageRange === 'any' ? '-1' : recommendationSettings.ageRange,
			specific_game: recommendationSettings.specificGame
		})

		try {
			const response = await fetch(`${backendUrl}/api/recommendations?${params}`, {
				headers: {
					'Authorization': `Bearer ${token}`
				}
			})
			const data = await response.json()
			if (response.ok) {
				setRecommendations(data.slice(0, 6))
			}
		} catch (error) {
			console.error('Failed to load recommendations:', error)
		}
		setLoadingRecommendations(false)
	}

	const handleRecommendationSettingChange = (setting, value) => {
		setRecommendationSettings(prev => ({ ...prev, [setting]: value }))
	}

	useEffect(() => {
		loadMessage()
		loadUserProfile()
	}, [])

	useEffect(() => {
		if (userProfile) {
			loadRecommendations()
		}
	}, [userProfile, recommendationSettings])

	return (
		<>
			<div className="container text-center mt-5">

				<h1 className="main-title m-4">
					<span className="text-white">CRAFT YOUR ULTIMATE</span> <span className="text-neon-green">GUILD.</span>
				</h1>

				{/* Recommended Gamers Section */}
				<div className="mt-5 p-4 rounded glass-card text-white shadow-lg">
					<div className="d-flex justify-content-between align-items-center mb-3">
						<h2 className="mb-0 section-title">Recommended Gamers</h2>
						<div className="dropdown">
							<button className="glass-pill-button dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
								<i className="fa-solid fa-sliders"></i>
								Settings
							</button>
							<ul className="dropdown-menu dropdown-menu-end glass-card p-3 shadow-lg" style={{ right: '0', minWidth: '250px' }}>
								<li className="dropdown-header">Skill Level Range (±)</li>
								<li>
									<select 
										className="form-select form-select-sm mx-2 mb-2" 
										value={recommendationSettings.skillRange}
										onChange={(e) => handleRecommendationSettingChange('skillRange', e.target.value === 'any' ? 'any' : parseInt(e.target.value))}
									>
										<option value="any">Any skill level</option>
										<option value="1">1 point</option>
										<option value="2">2 points</option>
										<option value="3">3 points</option>
										<option value="4">4 points</option>
										<option value="5">5 points</option>
									</select>
								</li>
								<li className="dropdown-header">Age Range (± years)</li>
								<li>
									<select 
										className="form-select form-select-sm mx-2 mb-2" 
										value={recommendationSettings.ageRange}
										onChange={(e) => handleRecommendationSettingChange('ageRange', e.target.value === 'any' ? 'any' : parseInt(e.target.value))}
									>
										<option value="any">Any age</option>
										<option value="2">2 years</option>
										<option value="3">3 years</option>
										<option value="5">5 years</option>
										<option value="7">7 years</option>
										<option value="10">10 years</option>
									</select>
								</li>
								<li className="dropdown-header">Focus Game</li>
								<li>
									<select 
										className="form-select form-select-sm mx-2 mb-2" 
										value={recommendationSettings.specificGame}
										onChange={(e) => handleRecommendationSettingChange('specificGame', e.target.value)}
									>
										<option value="">Any game</option>
										{userProfile?.favorites?.map((game, index) => (
											<option key={index} value={game.name}>{game.name}</option>
										))}
									</select>
								</li>
							</ul>
						</div>
					</div>
					
					{loadingRecommendations ? (
						<div className="text-center py-4">
							<div className="spinner-border text-light" role="status">
								<span className="visually-hidden">Loading...</span>
							</div>
							<p className="mt-2">Finding great matches...</p>
						</div>
					) : recommendations.length > 0 ? (
						<div className="row">
							{recommendations.map(user => (
								<div key={user.id} className="col-md-2 mb-3">
									<div className="card glass-card text-white h-100 border-0 shadow-lg">
										<div className="card-body text-center p-3">
											<div className="mb-3 position-relative">
												{user.profile_picture_url ? (
													<img 
														src={user.profile_picture_url} 
														alt={user.user_name} 
														className="rounded-circle"
														style={{ width: '70px', height: '70px', objectFit: 'cover', border: '3px solid #00ff88', boxShadow: '0 0 15px rgba(0, 255, 136, 0.4)' }}
													/>
												) : (
													<div className="mx-auto rounded-circle d-flex align-items-center justify-content-center" style={{ width: '70px', height: '70px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(0,255,136,0.3)' }}>
														<i className="fa-solid fa-user fa-2x text-neon-green opacity-50"></i>
													</div>
												)}
											</div>
											<h6 className="card-title text-neon-green fw-bold mb-1">{user.user_name}</h6>
											<p className="card-text small text-white-50 mb-3">
												{user.favorites.length} Games
											</p>
											<button
												className="btn btn-outline-primary btn-sm rounded-pill px-3"
												onClick={() => navigate(`/profile/${user.id}`)}
											>View</button>
										</div>
									</div>
								</div>
							))}
						</div>
					) : (
						<p className="text-center py-4 extra-text">No recommendations available. Try adjusting your settings!</p>
					)}
				</div>

				{/* Search Section */}
				<div className="mt-5 p-4 rounded glass-card text-white">
					<h2 className="mb-4 section-title">Find Gamers to Play With</h2>
					<form onSubmit={handleSearch} className="row g-3 justify-content-center">
						<div className="col-md-4">
							<label htmlFor="username" className="form-label">Username (partial match)</label>
							<input
								type="text"
								className="form-control"
								id="username"
								name="username"
								value={searchForm.username}
								onChange={handleInputChange}
								placeholder="Enter username"
							/>
						</div>
						<div className="col-md-4">
							<label htmlFor="game" className="form-label">Game Name</label>
							<input
								type="text"
								className="form-control"
								id="game"
								name="game"
								value={searchForm.game}
								onChange={handleInputChange}
								placeholder="e.g., Fortnite, League of Legends"
							/>
						</div>
						<div className="col-md-2">
							<label htmlFor="skill_min" className="form-label">Min Skill (1-10)</label>
							<input
								type="number"
								className="form-control"
								id="skill_min"
								name="skill_min"
								value={searchForm.skill_min}
								onChange={handleInputChange}
								min="1"
								max="10"
							/>
						</div>
						<div className="col-md-2">
							<label htmlFor="skill_max" className="form-label">Max Skill (1-10)</label>
							<input
								type="number"
								className="form-control"
								id="skill_max"
								name="skill_max"
								value={searchForm.skill_max}
								onChange={handleInputChange}
								min="1"
								max="10"
							/>
						</div>
						<div className="col-md-2">
							<label htmlFor="age_min" className="form-label">Min Age</label>
							<input
								type="number"
								className="form-control"
								id="age_min"
								name="age_min"
								value={searchForm.age_min}
								onChange={handleInputChange}
								min="13"
								max="100"
							/>
						</div>
						<div className="col-md-2">
							<label htmlFor="age_max" className="form-label">Max Age</label>
							<input
								type="number"
								className="form-control"
								id="age_max"
								name="age_max"
								value={searchForm.age_max}
								onChange={handleInputChange}
								min="13"
								max="100"
							/>
						</div>
						<div className="col-12">
							<button type="submit" className="btn btn-primary" disabled={searching}>
								{searching ? 'Searching...' : 'Search Gamers'}
							</button>
						</div>
					</form>

					{/* Search Results */}
					{searchResults.length > 0 && (
						<div className="mt-4">
							<h3>Search Results ({searchResults.length})</h3>
							<div className="row">
								{searchResults.map(user => (
									<div key={user.id} className="col-md-4 mb-3">
										<div className="card glass-card h-100 text-center">
											<div className="card-body">
												<div className="mb-3">
													{user.profile_picture_url ? (
														<img 
															src={user.profile_picture_url} 
															alt={user.user_name} 
															className="rounded-circle"
															style={{ width: '80px', height: '80px', objectFit: 'cover', border: '3px solid #00ff88', boxShadow: '0 0 15px rgba(0, 255, 136, 0.3)' }}
														/>
													) : (
														<div className="mx-auto bg-dark rounded-circle d-flex align-items-center justify-content-center" style={{ width: '80px', height: '80px', border: '1px solid rgba(255,255,255,0.1)' }}>
															<i className="fa-solid fa-user fa-2x text-neon-green"></i>
														</div>
													)}
												</div>
												<h5 className="card-title text-neon-green">{user.user_name}</h5>
												<p className="card-text small text-white opacity-75">
													{user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : 'Gamer'}
												</p>
												<p className="card-text small mb-3">
													<i className="fas fa-gamepad me-2"></i>
													{user.favorites.length} {user.favorites.length === 1 ? 'Game' : 'Games'}
												</p>
												<button
												className="btn btn-outline-primary btn-sm"
												onClick={() => navigate(`/profile/${user.id}`)}
											>View Profile</button>
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
					)}
				</div>

				<div className="row mt-5 mb-5">
					<div className="col-md-6">
						<div className="mission-feature-box h-100 text-white">
							<h3 className="mb-4 text-start section-title">Our Mission</h3>
							<ul className="bubble-list text-start">
								<li>At GuildUp, we believe every gamer deserves a crew. We're breaking down the barriers that keep players apart by intelligently connecting gamers based on the games they love, the skills they've built, and the time they have to play. Because gaming is always better together!</li>
								<li>GuildUp's mission is to eliminate the barriers between gamers and meaningful connection. By matching players across shared games, skill levels, and availability, we create a seamless path from playing solo to active community — making it effortless to find the right person to play with, every time.</li>
								<li>GuildUp exists to end the lull of playing solo. We match gamers with the right players — same games, same skill, same schedule — so finding your next teammate is as easy as loading into a match. No awkward outreach, no dead lobbies. Just play.</li>
							</ul>
						</div>
					</div>
					<div className="col-md-6">
						<div className="mission-feature-box h-100 text-white">
							<h3 className="mb-4 text-start section-title">Our Features</h3>
							<ul className="bubble-list text-start">
								<li>Customize your own profile card: Let others know a little bit about yourself, the kinds of games you like to play, your favorite genre(s), your skill level, what platform you play on (PC, PS5, Xbox, etc.), and what time(s) you're available to play.</li>
								<li>Create your own list of your favorite games that you've played and or are currently playing, as well as adding your own rating and mini review to said games.</li>
								<li>Our filters make it easier than ever to find other gamers to play with based on your preferences.</li>
								<li>Connect with new and old friends by searching for their username or by adding them through a list of people you recently played with. Don't worry, you can also remove friends just as easily.</li>
								<li>The ability to send messages to other users (Coming soon!)</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}; 