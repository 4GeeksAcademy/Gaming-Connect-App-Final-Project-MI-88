import React, { useState } from "react"

export const GameCard = ({ game, onRemove, onSkillUpdate, onReviewUpdate, isEditable = false }) => {
    const [skillLevel, setSkillLevel] = useState(game.skill_level || 1)
    const [personalRating, setPersonalRating] = useState(game.personal_rating || 0)
    const [personalReview, setPersonalReview] = useState(game.personal_review || "")
    const [isUpdating, setIsUpdating] = useState(false)

    const formatDate = (timestamp) => {
        if (!timestamp) return "No release date available"
        const date = new Date(timestamp * 1000)
        return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
    }

    const handleSaveReview = async () => {
        setIsUpdating(true)
        try {
            await onReviewUpdate(game.id, personalRating, personalReview)
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
        } catch (error) {
            console.error("Failed to update skill level:", error)
        } finally {
            setIsUpdating(false)
        }
    }

    return (
        <div className="game-card-horizontal">
            <div className="game-card-left">
                <div className="game-card-image">
                    {game.cover && game.cover.url && (
                        <img
                            src={`https:${game.cover.url.replace('t_thumb', 't_cover_big')}`}
                            alt={game.name}
                        />
                    )}
                </div>
                <div className="game-card-basic-info">
                    <h5 className="game-card-title">{game.name}</h5>
                    <p className="game-card-text">
                        <small>Release: {formatDate(game.first_release_date)}</small>
                    </p>
                    {game.total_rating && (
                        <p className="game-card-text">
                            <small>Rating: {game.total_rating.toFixed(2)}</small>
                        </p>
                    )}
                    
                    {onRemove && isEditable && (
                        <button
                            className="btn btn-sm btn-outline-danger mt-3 w-100"
                            onClick={() => onRemove(game.id)}
                        >
                            Remove from Favorites
                        </button>
                    )}
                </div>
            </div>

            <div className="game-card-right">
                {isEditable ? (
                    <div className="review-edit-section">
                        <div className="skill-level-section mb-4">
                            <label>My Skill Level:</label>
                            <div className="skill-level-input">
                                <input
                                    type="number"
                                    min="1"
                                    max="10"
                                    value={skillLevel}
                                    onChange={(e) => setSkillLevel(parseInt(e.target.value))}
                                    disabled={isUpdating}
                                />
                                <button
                                    className="btn btn-sm btn-outline-primary"
                                    onClick={handleSkillUpdate}
                                    disabled={isUpdating || skillLevel === game.skill_level}
                                >
                                    Set
                                </button>
                            </div>
                        </div>

                        <div className="rating-input-group mb-3">
                            <label>My Rating (1-10):</label>
                            <input
                                type="number"
                                min="0"
                                max="10"
                                className="form-control"
                                value={personalRating}
                                onChange={(e) => setPersonalRating(parseInt(e.target.value))}
                            />
                        </div>
                        <div className="review-input-group">
                            <label>My Review:</label>
                            <textarea
                                className="form-control"
                                rows="3"
                                placeholder="Write your thoughts..."
                                value={personalReview}
                                onChange={(e) => setPersonalReview(e.target.value)}
                            ></textarea>
                        </div>
                        <div className="review-actions mt-3">
                            <button
                                className="btn btn-sm btn-primary w-100 py-2"
                                style={{backgroundColor: "#667eea"}}
                                onClick={handleSaveReview}
                                disabled={isUpdating}
                            >
                                {isUpdating ? "Saving..." : "Save Review & Rating"}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="review-display-section">
                        <h6>My Personal Review</h6>
                        <div className="display-rating">
                            <strong>Rating:</strong> {game.personal_rating || "N/A"}/10
                        </div>
                        <div className="display-review mt-2">
                            <p>{game.personal_review || "No review written yet."}</p>
                        </div>
                        <div className="display-skill">
                            <small>Skill Level: {game.skill_level || 1}</small>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
