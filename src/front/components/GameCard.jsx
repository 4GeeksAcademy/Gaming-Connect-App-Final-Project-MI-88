import React, { useState } from "react"

export const GameCard = ({ game, onRemove, onSkillUpdate, onReviewUpdate, isEditable = false }) => {
    const [skillLevel, setSkillLevel] = useState(game.skill_level || 1)
    const [personalRating, setPersonalRating] = useState(game.personal_rating || 0)
    const [personalReview, setPersonalReview] = useState(game.personal_review || "")
    const [isEditing, setIsEditing] = useState(false)
    const [isUpdating, setIsUpdating] = useState(false)

    const formatDate = (timestamp) => {
        if (!timestamp) return "N/A"
        const date = new Date(timestamp * 1000)
        return date.toLocaleDateString()
    }

    const handleSaveReview = async () => {
        setIsUpdating(true)
        try {
            await onReviewUpdate(game.id, personalRating, personalReview)
            setIsEditing(false)
        } catch (error) {
            console.error("Failed to update review:", error)
        } finally {
            setIsUpdating(false)
        }
    }

    const handleSkillUpdate = async () => {
        setIsUpdating(true)
        try {
            await onSkillUpdate(game.id, skillLevel)
            setIsEditing(false)
        } catch (error) {
            console.error("Failed to update skill level:", error)
        } finally {
            setIsUpdating(false)
        }
    }

    return (
        <div className="game-card-horizontal glass-card">
            <div className="game-card-left">
                {game.cover && game.cover.url && (
                    <img
                        src={`https:${game.cover.url.replace('t_thumb', 't_cover_big')}`}
                        alt={game.name}
                        className="game-card-art"
                    />
                )}
            </div>

            <div className="game-card-right">
                <div className="game-card-content-top">
                    <div className="d-flex justify-content-between align-items-start">
                        <h4 className="game-card-title">{game.name}</h4>
                        {onRemove && isEditable && (
                            <button
                                className="btn btn-link text-danger p-0"
                                onClick={() => onRemove(game.id)}
                                title="Remove from favorites"
                            >
                                <i className="fas fa-trash-can"></i>
                            </button>
                        )}
                    </div>
                    
                    <div className="game-meta-row">
                        <div className="game-meta-item">
                            <i className="fas fa-calendar-alt"></i>
                            <span>{formatDate(game.first_release_date)}</span>
                        </div>
                        {game.total_rating && (
                            <div className="game-meta-item">
                                <i className="fas fa-star text-warning"></i>
                                <span>{game.total_rating.toFixed(1)}%</span>
                            </div>
                        )}
                        <div className="game-meta-item">
                            <span className="skill-badge">Skill: {game.skill_level || 1}</span>
                        </div>
                    </div>
                </div>

                <div className="game-card-main-body">
                    {isEditing ? (
                        <div className="edit-mode-container">
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <label className="small text-neon-green text-uppercase mb-1">Skill Level (1-10)</label>
                                    <div className="d-flex gap-2">
                                        <input
                                            type="number"
                                            className="form-control bubble-input py-1"
                                            min="1"
                                            max="10"
                                            value={skillLevel}
                                            onChange={(e) => setSkillLevel(parseInt(e.target.value))}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <label className="small text-neon-green text-uppercase mb-1">My Rating</label>
                                    <input
                                        type="number"
                                        className="form-control bubble-input py-1"
                                        min="0"
                                        max="10"
                                        value={personalRating}
                                        onChange={(e) => setPersonalRating(parseInt(e.target.value))}
                                    />
                                </div>
                                <div className="col-12 mt-2">
                                    <label className="small text-neon-green text-uppercase mb-1">Review Preview</label>
                                    <textarea
                                        className="form-control bubble-input"
                                        rows="2"
                                        value={personalReview}
                                        onChange={(e) => setPersonalReview(e.target.value)}
                                        placeholder="Add your thoughts..."
                                    />
                                </div>
                                <div className="col-12 d-flex gap-2 mt-2">
                                    <button 
                                        className="btn btn-sm btn-primary flex-grow-1"
                                        onClick={async () => {
                                            await handleSaveReview();
                                            await handleSkillUpdate();
                                        }}
                                        disabled={isUpdating}
                                    >
                                        {isUpdating ? "Saving..." : "Save All"}
                                    </button>
                                    <button className="btn btn-sm btn-outline-light" onClick={() => setIsEditing(false)}>Cancel</button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="display-mode-container">
                            <div className="user-review-box">
                                <div className="d-flex justify-content-between align-items-center mb-1">
                                    <span className="small text-uppercase fw-bold text-white-50">My Review</span>
                                    <span className="badge bg-secondary">{game.personal_rating || 0}/10 Rating</span>
                                </div>
                                <p className="mb-0 small text-white">{game.personal_review || "No review yet."}</p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="game-card-footer mt-auto pt-3">
                    {isEditable && !isEditing && (
                        <button 
                            className="btn btn-sm action-pill-button px-4" 
                            onClick={() => setIsEditing(true)}
                        >
                            <i className="fas fa-edit me-2"></i>Edit Review
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
