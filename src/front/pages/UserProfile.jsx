import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"

export const UserProfile = () => {
	const { userId } = useParams()
	const navigate = useNavigate()
	const [profile, setProfile] = useState(null)
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState("")
	const [connectionStatus, setConnectionStatus] = useState("none") // none | request_sent | request_received | friends
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
				return <button className="btn btn-success" disabled>Friends</button>
			case "request_sent":
				return <button className="btn btn-secondary" disabled>Request Sent</button>
			case "request_received":
				return (
					<div className="d-flex gap-2">
						<button
							className="btn btn-primary"
							onClick={() => handleRespond("accepted")}
							disabled={actionLoading}
						>
							Accept Request
						</button>
						<button
							className="btn btn-outline-danger"
							onClick={() => handleRespond("declined")}
							disabled={actionLoading}
						>
							Decline
						</button>
					</div>
				)
			case "declined":
				return <button className="btn btn-secondary" disabled>Request Declined</button>
			default:
				return (
					<button
						className="btn btn-primary"
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
			<div className="d-flex justify-content-center align-items-center mt-5">
				<div className="spinner-border" role="status">
					<span className="visually-hidden">Loading...</span>
				</div>
				<p className="ms-3">Loading profile...</p>
			</div>
		)
	}

	if (error || !profile) {
		return (
			<div className="container mt-5">
				<div className="alert alert-danger">{error || "Profile not found."}</div>
				<button className="btn btn-secondary" onClick={() => navigate(-1)}>Go Back</button>
			</div>
		)
	}

	return (
		<div className="container mt-5">
			<button className="btn btn-outline-secondary mb-4" onClick={() => navigate(-1)}>
				&larr; Back
			</button>

			<div className="card shadow-sm p-4">
				<div className="d-flex align-items-center justify-content-between mb-4">
					<div className="d-flex align-items-center">
						<div className="me-4">
							{profile.profile_picture_url ? (
								<img
									src={profile.profile_picture_url}
									alt={profile.user_name}
									className="rounded-circle"
									style={{ width: 100, height: 100, objectFit: "cover" }}
								/>
							) : (
								<div
									className="rounded-circle bg-secondary d-flex align-items-center justify-content-center"
									style={{ width: 100, height: 100 }}
								>
									<i className="fas fa-user fa-3x text-white"></i>
								</div>
							)}
						</div>
						<div>
							<h1 className="mb-1">{profile.user_name}</h1>
							{profile.playstyle && (
								<div className="playstyle-box mb-2 p-2 border rounded bg-light d-inline-block">
									<strong>Playstyle:</strong> {profile.playstyle}
								</div>
							)}
							<div className="profile-badges mb-3">
								<span className="badge bg-warning text-dark me-1">Weekend Warrior</span>
								<span className="badge bg-success me-1">Friendly Gamer</span>
								<span className="badge bg-danger">Killamanjaro</span>
							</div>

							{/* New Interests Section under Badges */}
							{(profile.bio || profile.favorite_game || profile.preferred_genre) && (
								<div className="user-interests-section mb-3">
									{profile.bio && (
										<div className="bio-display mb-3 p-3 border-start border-4 border-primary bg-light rounded">
											<h6 className="fw-bold mb-1">About Me</h6>
											<p className="mb-0 text-muted">{profile.bio}</p>
										</div>
									)}
									<div className="d-flex flex-wrap gap-2">
										{profile.favorite_game && (
											<div className="interest-tag px-3 py-1 bg-primary text-white rounded-pill small">
												<i className="fas fa-gamepad me-2"></i>{profile.favorite_game}
											</div>
										)}
										{profile.preferred_genre && (
											<div className="interest-tag px-3 py-1 bg-info text-white rounded-pill small">
												<i className="fas fa-tags me-2"></i>{profile.preferred_genre}
											</div>
										)}
									</div>
								</div>
							)}

							{profile.first_name && (
								<p className="text-muted mb-0">{profile.first_name} {profile.last_name}</p>
							)}
						</div>
					</div>

					<div className="text-end">
						{renderConnectionButton()}
						{actionMessage && (
							<p className="mt-2 small text-muted">{actionMessage}</p>
						)}
					</div>
				</div>

				<div>
					<h4>Favorite Games ({profile.favorites?.length || 0})</h4>
					{profile.favorites && profile.favorites.length > 0 ? (
						<div className="row">
							{profile.favorites.map((game, index) => (
								<div key={index} className="col-md-4 mb-3">
									<div className="card h-100">
										<div className="card-body">
											<h6 className="card-title">{game.name}</h6>
											{game.skill_level && (
												<p className="card-text small text-muted">
													Skill Level: {game.skill_level}/10
												</p>
											)}
										</div>
									</div>
								</div>
							))}
						</div>
					) : (
						<p className="text-muted">No favorite games listed.</p>
					)}
				</div>
			</div>
		</div>
	)
}
