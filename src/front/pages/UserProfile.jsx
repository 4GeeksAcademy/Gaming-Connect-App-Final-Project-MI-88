import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { GameCard } from "../components/GameCard.jsx"

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

const formatTime = (val) => {
	const num = parseInt(val)
	if (isNaN(num)) return ""
	if (num === 0) return "12:00am"
	if (num === 24) return "11:59pm"
	if (num < 12) return `${num}:00am`
	if (num === 12) return "12:00pm"
	return `${num - 12}:00pm`
}

export const UserProfile = () => {
	const { userId } = useParams()
	const navigate = useNavigate()
	const [profile, setProfile] = useState(null)
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState("")
	const [connectionStatus, setConnectionStatus] = useState("none")
	const [requestId, setRequestId] = useState(null)
	const [actionLoading, setActionLoading] = useState(false)
	const [actionMessage, setActionMessage] = useState("")

	const backendUrl = import.meta.env.VITE_BACKEND_URL
	const getToken = () => localStorage.getItem("token")

	useEffect(() => {
		const fetchAll = async () => {
			const token = getToken()
			if (!token) {
				navigate("/login")
				return
			}

			try {
				const [profileRes, statusRes] = await Promise.all([
					fetch(`${backendUrl}/api/users/${userId}`, {
						headers: { "Authorization": `Bearer ${token}` }
					}),
					fetch(`${backendUrl}/api/friend-requests/status/${userId}`, {
						headers: { "Authorization": `Bearer ${token}` }
					})
				])

				const profileData = await profileRes.json()
				const statusData = await statusRes.json()

				if (profileRes.ok) {
					setProfile(profileData)
				} else {
					setError(profileData.error || "Failed to load profile")
				}

				if (statusRes.ok) {
					setConnectionStatus(statusData.status)
					if (statusData.request_id) setRequestId(statusData.request_id)
				}
			} catch (err) {
				setError("Network error. Please check your connection.")
			} finally {
				setIsLoading(false)
			}
		}

		fetchAll()
	}, [userId, navigate])

	const handleSendRequest = async () => {
		setActionLoading(true)
		try {
			const response = await fetch(`${backendUrl}/api/friend-requests`, {
				method: "POST",
				headers: {
					"Authorization": `Bearer ${getToken()}`,
					"Content-Type": "application/json"
				},
				body: JSON.stringify({ receiver_id: parseInt(userId) })
			})
			const data = await response.json()
			if (response.ok) {
				setConnectionStatus("request_sent")
				setActionMessage("Friend request sent!")
			} else {
				setActionMessage(data.error || "Failed to send request")
			}
		} catch {
			setActionMessage("Network error")
		}
		setActionLoading(false)
		setTimeout(() => setActionMessage(""), 3000)
	}

	const handleRespond = async (action) => {
		setActionLoading(true)
		try {
			const response = await fetch(`${backendUrl}/api/friend-requests/${requestId}`, {
				method: "PATCH",
				headers: {
					"Authorization": `Bearer ${getToken()}`,
					"Content-Type": "application/json"
				},
				body: JSON.stringify({ status: action })
			})
			const data = await response.json()
			if (response.ok) {
				setConnectionStatus(action === "accepted" ? "friends" : "declined")
				setActionMessage(action === "accepted" ? "You are now friends!" : "Request declined.")
			} else {
				setActionMessage(data.error || "Failed to respond")
			}
		} catch {
			setActionMessage("Network error")
		}
		setActionLoading(false)
		setTimeout(() => setActionMessage(""), 3000)
	}

	const renderConnectionButton = () => {
		switch (connectionStatus) {
			case "friends":
				return <button className="glass-pill-button px-4 py-2" style={{ background: 'rgba(0, 255, 136, 0.2)', border: '1px solid #00ff88', color: '#00ff88' }} disabled>Friends</button>
			case "request_sent":
				return <button className="glass-pill-button px-4 py-2" style={{ background: 'rgba(255, 255, 255, 0.05)', color: 'rgba(255, 255, 255, 0.5)' }} disabled>Request Sent</button>
			case "request_received":
				return (
					<div className="d-flex gap-3">
						<button
							className="glass-pill-button px-4 py-2 bg-neon-green text-dark fw-bold"
							onClick={() => handleRespond("accepted")}
							disabled={actionLoading}
						>
							Accept Request
						</button>
						<button
							className="glass-pill-button px-4 py-2"
							style={{ background: 'rgba(255, 0, 0, 0.1)', border: '1px solid #ff4444', color: '#ff4444' }}
							onClick={() => handleRespond("declined")}
							disabled={actionLoading}
						>
							Decline
						</button>
					</div>
				)
			case "declined":
				return <button className="glass-pill-button px-4 py-2" disabled>Request Declined</button>
			default:
				return (
					<button
						className="glass-pill-button px-4 py-2 bg-neon-green text-dark fw-bold"
						onClick={handleSendRequest}
						disabled={actionLoading}
					>
						{actionLoading ? "Sending..." : "Send Friend Request"}
					</button>
				)
		}
	}

	if (isLoading) {
		return (
			<div className="profile-loading">
				<div className="spinner-border" role="status">
					<span className="visually-hidden">Loading...</span>
				</div>
				<p>Loading profile...</p>
			</div>
		)
	}

	if (error || !profile) {
		return (
			<div className="alert alert-danger">
				{error || "Profile not found."}
				<button className="btn btn-secondary ms-3" onClick={() => navigate(-1)}>Go Back</button>
			</div>
		)
	}

	return (
		<div className="profile-container">
			{actionMessage && (
				<div className="alert alert-success alert-dismissible fade show" role="alert">
					{actionMessage}
					<button type="button" className="btn-close" onClick={() => setActionMessage("")}></button>
				</div>
			)}

			<div className="profile-layout">
				{/* Left Column */}
				<div className="profile-left">
					<div className="profile-header">
						<div className="profile-picture-section">
							<div className="profile-picture">
								{profile.profile_picture_url ? (
									<img src={profile.profile_picture_url} alt={profile.user_name} />
								) : (
									<div className="placeholder-avatar">
										<i className="fas fa-user"></i>
									</div>
								)}
							</div>
						</div>

						<div className="profile-info">
							<h1 className="gamertag">{profile.user_name}</h1>

							<div className="user-details">
								{profile.first_name && (
									<p><strong>Name:</strong> {profile.first_name} {profile.last_name}</p>
								)}

								{profile.bio && (
									<div className="bio-quote-box">
										<i className="fas fa-quote-left"></i>
										<p>{profile.bio}</p>
									</div>
								)}

								<div className="interests-ui">
									{profile.favorite_game && (
										<span className="interest-pill game-pill">
											<i className="fas fa-gamepad"></i> {profile.favorite_game}
										</span>
									)}
									{profile.preferred_genre && (
										<span className="interest-pill genre-pill">
											<i className="fas fa-ghost"></i> {profile.preferred_genre}
										</span>
									)}
								</div>

								<div className="gaming-stats-container">
									{profile.playstyle && (
										<div className="stat-info-group">
											<strong>Playstyle</strong>
											<span className={`playstyle-tag ${profile.playstyle.toLowerCase().replace(" ", "-")}`}>
												{profile.playstyle}
											</span>
										</div>
									)}

									{profile.availability && profile.availability.some(r => r.start_time && r.end_time) && (
										<div className="stat-info-group">
											<strong>Availability</strong>
											<div className="availability-summary">
												{profile.availability
													.filter(availabilityRow => availabilityRow.start_time && availabilityRow.end_time)
													.sort((dayA, dayB) => days.indexOf(dayA.day.charAt(0).toUpperCase() + dayA.day.slice(1)) - days.indexOf(dayB.day.charAt(0).toUpperCase() + dayB.day.slice(1)))
													.map(availabilityRow => (
														<p key={availabilityRow.id}>
															<small>{availabilityRow.day.substring(0, 3).toUpperCase()}: {formatTime(availabilityRow.start_time)} - {formatTime(availabilityRow.end_time)}</small>
														</p>
													))
												}
											</div>
										</div>
									)}
								</div>
							</div>

							<div className="profile-actions mt-4">
								{renderConnectionButton()}
							</div>
						</div>
					</div>
				</div>

				{/* Right Column */}
				<div className="profile-right">
					<div className="favorites-section">
						<h2>{profile.user_name}'s Favorite Games</h2>
						{profile.favorites && profile.favorites.length > 0 ? (
							<div className="favorites-grid">
								{profile.favorites.map((game) => (
									<GameCard
										key={game.id}
										game={game}
										isEditable={false}
									/>
								))}
							</div>
						) : (
							<p className="empty-message">No favorite games listed.</p>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}
