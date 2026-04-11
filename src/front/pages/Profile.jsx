import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import useGlobalReducer from "../hooks/useGlobalReducer.jsx"
import useActions from "../hooks/useActions.jsx"
import { GameCard } from "../components/GameCard.jsx"
import { GameSearchBar } from "../components/GameSearchBar.jsx"
import { AvailabilityDay } from "../components/AvailabilityDay.jsx"

export const Profile = () => {
	const { store, dispatch } = useGlobalReducer()
	const { postToIGDB } = useActions()
	const navigate = useNavigate()

	const [userProfile, setUserProfile] = useState(null)
	const [isLoading, setIsLoading] = useState(true)
	const [isEditingProfile, setIsEditingProfile] = useState(false)
	const [editFormData, setEditFormData] = useState({})
	const [uploadError, setUploadError] = useState("")
	const [successMessage, setSuccessMessage] = useState("")
	const [friends, setFriends] = useState([])
	const [isLoadingFriends, setIsLoadingFriends] = useState(false)
	const [pendingRequests, setPendingRequests] = useState([])
	const [availableDays, setAvailableDays] = useState([])

	// Check authentication on component mount
	useEffect(() => {
		const token = localStorage.getItem("token")
		if (!token) {
			navigate("/login")
			return
		}

		fetchUserProfile()
		fetchFriends()
		fetchPendingRequests()
	}, [navigate])
	const fetchUserProfile = async () => {
		setIsLoading(true)
		try {
			const token = localStorage.getItem("token")
			if (!token) {
				navigate("/login")
				return
			}

			const backendUrl = import.meta.env.VITE_BACKEND_URL
			const response = await fetch(`${backendUrl}/api/profile`, {
				method: "GET",
				headers: {
					"Accept": "application/json",
					"Content-Type": "application/json",
					"Authorization": `Bearer ${token}`
				}
			})

			const data = await response.json()

			if (response.ok) {
				setUserProfile(data)
				setEditFormData({
					first_name: data.first_name || "",
					last_name: data.last_name || "",
					availability: data.availability || ""
				})
				setAvailableDays(data.availability)
			} else if (response.status === 401) {
				// Token is invalid or expired
				localStorage.removeItem("token")
				navigate("/login")
				return
			} else {
				console.error("Failed to fetch profile:", data)
				setUploadError("Failed to load profile. Please try again.")
			}
		} catch (error) {
			console.error("Error fetching profile:", error)
			setUploadError("Network error. Please check your connection.")
		} finally {
			setIsLoading(false)
		}
	}

	const fetchFriends = async () => {
		setIsLoadingFriends(true)
		try {
			const token = localStorage.getItem("token")
			if (!token) return

			const backendUrl = import.meta.env.VITE_BACKEND_URL
			const response = await fetch(`${backendUrl}/api/profile/friends`, {
				method: "GET",
				headers: {
					"Accept": "application/json",
					"Content-Type": "application/json",
					"Authorization": `Bearer ${token}`
				}
			})

			const data = await response.json()

			if (response.ok) {
				setFriends(data)
			} else if (response.status === 401) {
				// Token is invalid or expired
				localStorage.removeItem("token")
				navigate("/login")
				return
			} else {
				console.error("Error fetching friends:", data)
			}
		} catch (error) {
			console.error("Error fetching friends:", error)
		} finally {
			setIsLoadingFriends(false)
		}
	}

	const fetchPendingRequests = async () => {
		try {
			const token = localStorage.getItem("token")
			if (!token) return
			const backendUrl = import.meta.env.VITE_BACKEND_URL
			const response = await fetch(`${backendUrl}/api/friend-requests`, {
				headers: { "Authorization": `Bearer ${token}` }
			})
			const data = await response.json()
			if (response.ok) setPendingRequests(data)
		} catch (error) {
			console.error("Error fetching friend requests:", error)
		}
	}

	const handleRespondToRequest = async (requestId, action) => {
		try {
			const token = localStorage.getItem("token")
			const backendUrl = import.meta.env.VITE_BACKEND_URL
			const response = await fetch(`${backendUrl}/api/friend-requests/${requestId}`, {
				method: "PATCH",
				headers: {
					"Authorization": `Bearer ${token}`,
					"Content-Type": "application/json"
				},
				body: JSON.stringify({ status: action })
			})
			const data = await response.json()
			if (response.ok) {
				setPendingRequests(prev => prev.filter(r => r.id !== requestId))
				if (action === "accepted") {
					setSuccessMessage(`You are now friends!`)
					fetchFriends()
				} else {
					setSuccessMessage("Request declined.")
				}
				setTimeout(() => setSuccessMessage(""), 3000)
			} else {
				setUploadError(data.error || "Failed to respond to request")
			}
		} catch (error) {
			console.error("Error responding to request:", error)
			setUploadError("Network error")
		}
	}

	const handleProfileUpdate = async (e) => {
		e.preventDefault()
		try {
			const token = localStorage.getItem("token")
			const backendUrl = import.meta.env.VITE_BACKEND_URL

			const response = await fetch(`${backendUrl}/api/profile`, {
				method: "PUT",
				headers: {
					"Accept": "application/json",
					"Content-Type": "application/json",
					"Authorization": `Bearer ${token}`
				},
				body: JSON.stringify(editFormData)
			})

			const data = await response.json()

			if (response.ok) {
				setUserProfile(data)
				setIsEditingProfile(false)
				setSuccessMessage("Profile updated successfully!")
				setTimeout(() => setSuccessMessage(""), 3000)
			} else if (response.status === 401) {
				localStorage.removeItem("token")
				navigate("/login")
				return
			} else {
				setUploadError(data.error || "Failed to update profile")
			}
		} catch (error) {
			console.error("Error updating profile:", error)
			setUploadError("Error updating profile")
		}
	}

	const handleProfilePictureUpload = async (e) => {
		const file = e.target.files[0]
		if (!file) return

		// For now, we'll use a simple URL-based approach
		// In production, you'd upload to a cloud service (S3, Cloudinary, etc.)
		// and get back a URL
		const reader = new FileReader()
		reader.onload = async (event) => {
			try {
				const token = localStorage.getItem("token")
				const backendUrl = import.meta.env.VITE_BACKEND_URL

				const response = await fetch(`${backendUrl}/api/profile`, {
					method: "PUT",
					headers: {
						"Accept": "application/json",
						"Content-Type": "application/json",
						"Authorization": `Bearer ${token}`
					},
					body: JSON.stringify({
						profile_picture_url: event.target.result
					})
				})

				const data = await response.json()

				if (response.ok) {
					setUserProfile(data)
					setSuccessMessage("Profile picture updated!")
					setTimeout(() => setSuccessMessage(""), 3000)
				} else {
					setUploadError("Failed to upload picture")
				}
			} catch (error) {
				console.error("Error uploading picture:", error)
				setUploadError("Error uploading picture")
			}
		}
		reader.readAsDataURL(file)
	}

	const handleAddGameToFavorites = async (gameData) => {
		try {
			const token = localStorage.getItem("token")
			const backendUrl = import.meta.env.VITE_BACKEND_URL

			const response = await fetch(`${backendUrl}/api/profile/favorites`, {
				method: "POST",
				headers: {
					"Accept": "application/json",
					"Content-Type": "application/json",
					"Authorization": `Bearer ${token}`
				},
				body: JSON.stringify(gameData)
			})

			const data = await response.json()

			if (response.ok) {
				setUserProfile({
					...userProfile,
					favorites: data.favorites
				})
				setSuccessMessage(`${gameData.name} added to favorites!`)
				setTimeout(() => setSuccessMessage(""), 3000)
			} else if (response.status === 401) {
				localStorage.removeItem("token")
				navigate("/login")
				return
			} else {
				setUploadError(data.error || "Failed to add game to favorites")
			}
		} catch (error) {
			console.error("Error adding to favorites:", error)
			setUploadError("Error adding to favorites")
		}
	}

	const handleRemoveGameFromFavorites = async (gameId) => {
		try {
			const token = localStorage.getItem("token")
			const backendUrl = import.meta.env.VITE_BACKEND_URL

			const response = await fetch(`${backendUrl}/api/profile/favorites/${gameId}`, {
				method: "DELETE",
				headers: {
					"Accept": "application/json",
					"Content-Type": "application/json",
					"Authorization": `Bearer ${token}`
				}
			})

			const data = await response.json()

			if (response.ok) {
				setUserProfile({
					...userProfile,
					favorites: data.favorites
				})
				setSuccessMessage("Game removed from favorites")
				setTimeout(() => setSuccessMessage(""), 3000)
			} else if (response.status === 401) {
				localStorage.removeItem("token")
				navigate("/login")
				return
			} else {
				setUploadError(data.error || "Failed to remove game")
			}
		} catch (error) {
			console.error("Error removing game:", error)
			setUploadError("Error removing game")
		}
	}

	const handleUpdateSkillLevel = async (gameId, skillLevel) => {
		try {
			const token = localStorage.getItem("token")
			const backendUrl = import.meta.env.VITE_BACKEND_URL

			const response = await fetch(`${backendUrl}/api/profile/favorites/${gameId}/skill`, {
				method: "PATCH",
				headers: {
					"Accept": "application/json",
					"Content-Type": "application/json",
					"Authorization": `Bearer ${token}`
				},
				body: JSON.stringify({ skill_level: skillLevel })
			})

			const data = await response.json()

			if (response.ok) {
				setUserProfile({
					...userProfile,
					favorites: data.favorites
				})
				setSuccessMessage("Skill level updated!")
				setTimeout(() => setSuccessMessage(""), 3000)
			} else if (response.status === 401) {
				localStorage.removeItem("token")
				navigate("/login")
				return
			} else {
				setUploadError(data.error || "Failed to update skill level")
			}
		} catch (error) {
			console.error("Error updating skill level:", error)
			setUploadError("Error updating skill level")
		}
	}

	if (isLoading) {
		return (
			<div className="profile-loading">
				<div className="spinner-border" role="status">
					<span className="visually-hidden">Loading...</span>
				</div>
				<p>Loading your profile...</p>
			</div>
		)
	}

	if (!userProfile) {
		return (
			<div className="alert alert-danger">
				Failed to load profile. Please log in again.
			</div>
		)
	}

	return (
		<div className="profile-container">
			{/* Success and Error Messages */}
			{successMessage && (
				<div className="alert alert-success alert-dismissible fade show" role="alert">
					{successMessage}
					<button type="button" className="btn-close" onClick={() => setSuccessMessage("")}></button>
				</div>
			)}
			{uploadError && (
				<div className="alert alert-danger alert-dismissible fade show" role="alert">
					{uploadError}
					<button type="button" className="btn-close" onClick={() => setUploadError("")}></button>
				</div>
			)}

			<div className="profile-layout">
				{/* Left Column: Profile Info and Search Bar */}
				<div className="profile-left">
					{/* Profile Header */}
					<div className="profile-header">
						<div className="profile-picture-section">
							<div className="profile-picture">
								{userProfile.profile_picture_url ? (
									<img src={userProfile.profile_picture_url} alt={userProfile.user_name} />
								) : (
									<div className="placeholder-avatar">
										<i className="fas fa-user"></i>
									</div>
								)}
							</div>
							<div className="picture-actions">
								<label htmlFor="profilePictureInput" className="btn btn-sm btn-primary">
									Upload Picture
								</label>
								<input
									id="profilePictureInput"
									type="file"
									accept="image/*"
									onChange={handleProfilePictureUpload}
									style={{ display: "none" }}
								/>
							</div>
						</div>

						<div className="profile-info">
							<h1 className="gamertag">{userProfile.user_name || "Username"}</h1>
							<p className="user-email">{userProfile.email}</p>
							<div className="user-details">
								{userProfile.first_name && (
									<p><strong>Name:</strong> {userProfile.first_name} {userProfile.last_name}</p>
								)}
							</div>

							{!isEditingProfile ? (
								<button
									className="btn btn-secondary btn-sm"
									onClick={() => setIsEditingProfile(true)}
								>
									Edit Profile
								</button>
							) : (
								<form onSubmit={handleProfileUpdate} className="edit-profile-form">
									<div className="form-group">
										<label htmlFor="firstName">First Name</label>
										<input
											id="firstName"
											type="text"
											className="form-control"
											value={editFormData.first_name || ""}
											onChange={(e) => setEditFormData({
												...editFormData,
												first_name: e.target.value
											})}
										/>
									</div>
									<div className="form-group">
										<label htmlFor="lastName">Last Name</label>
										<input
											id="lastName"
											type="text"
											className="form-control"
											value={editFormData.last_name || ""}
											onChange={(e) => setEditFormData({
												...editFormData,
												last_name: e.target.value
											})}
										/>
									</div>
									<label>Availability:</label>
									<div>
										<AvailabilityDay day={"Sunday"} />
										<AvailabilityDay day={"Monday"} />
										<AvailabilityDay day={"Tuesday"} />
										<AvailabilityDay day={"Wednesday"} />
										<AvailabilityDay day={"Thursday"} />
										<AvailabilityDay day={"Friday"} />
										<AvailabilityDay day={"Saturday"} />
									</div>
									<div className="button-group">
										<button type="submit" className="btn btn-primary btn-sm">
											Save Changes
										</button>
										<button
											type="button"
											className="btn btn-secondary btn-sm"
											onClick={() => setIsEditingProfile(false)}
										>
											Cancel
										</button>
									</div>
								</form>
							)}
						</div>
					</div>

					{/* Game Search Bar */}
					<div className="search-section">
						<GameSearchBar onGameSelect={handleAddGameToFavorites} />
					</div>
				</div>

				{/* Right Column: Favorites and Friends Lists */}
				<div className="profile-right">
					{/* Favorites Section */}
					<div className="favorites-section">
						<h2>My Favorite Games</h2>
						{userProfile.favorites && userProfile.favorites.length > 0 ? (
							<div className="favorites-grid">
								{userProfile.favorites.map((game) => (
									<GameCard
										key={game.id}
										game={game}
										onRemove={handleRemoveGameFromFavorites}
										onSkillUpdate={handleUpdateSkillLevel}
										isEditable={true}
									/>
								))}
							</div>
						) : (
							<p className="empty-message">No favorite games yet. Search and add some games!</p>
						)}
					</div>

					{/* Pending Friend Requests Section */}
					{pendingRequests.length > 0 && (
						<div className="friends-section mb-4">
							<h2>Friend Requests ({pendingRequests.length})</h2>
							<div className="friends-list">
								{pendingRequests.map((req) => (
									<div key={req.id} className="friend-item">
										<div className="friend-info">
											<h5>{req.sender_username}</h5>
											<p className="text-muted small">wants to connect with you</p>
										</div>
										<div className="d-flex gap-2">
											<button
												className="btn btn-sm btn-primary"
												onClick={() => handleRespondToRequest(req.id, "accepted")}
											>
												Accept
											</button>
											<button
												className="btn btn-sm btn-outline-danger"
												onClick={() => handleRespondToRequest(req.id, "declined")}
											>
												Decline
											</button>
										</div>
									</div>
								))}
							</div>
						</div>
					)}

					{/* Friends Section */}
					<div className="friends-section">
						<h2>My Friends ({friends.length})</h2>
						{friends.length > 0 ? (
							<div className="friends-list">
								{friends.map((friend) => (
									<div key={friend.id} className="friend-item">
										<div className="friend-info">
											<h5>{friend.user_name}</h5>
											<p>{friend.email}</p>
										</div>
										<button
											className="btn btn-sm btn-outline-danger"
											onClick={() => {
												// Handle remove friend
												console.log("Remove friend:", friend.id)
											}}
										>
											Remove
										</button>
									</div>
								))}
							</div>
						) : (
							<p className="empty-message">No friends yet. Connect with other players!</p>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}
