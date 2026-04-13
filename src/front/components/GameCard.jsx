import React, { useState } from "react"

export const GameCard = ({ game, onRemove, onSkillUpdate, onReviewUpdate, isEditable = false }) => {
    const [skillLevel, setSkillLevel] = useState(game.skill_level || 1)
    const [isUpdatingSkill, setIsUpdatingSkill] = useState(false)
    const [personalRating, setPersonalRating] = useState(game.personal_rating || 5)
    const [review, setReview] = useState(game.review || "")
    const [isUpdatingReview, setIsUpdatingReview] = useState(false)

    const formatDate = (timestamp) => {
        if (!timestamp) return "No release date available"
        const date = new Date(timestamp * 1000)
        const month = (date.getMonth() + 1).toString().padStart(2, '0')
        const day = date.getDate().toString().padStart(2, '0')
        const year = date.getFullYear()
        return `${month}/${day}/${year}`
    }

    const handleSkillUpdate = async () => {
        setIsUpdatingSkill(true)
        try {
            await onSkillUpdate(game.id, skillLevel)
        } catch (error) {
            console.error("Failed to update skill level:", error)
            setSkillLevel(game.skill_level || 1)
        } finally {
            setIsUpdatingSkill(false)
        }
    }

    const handleReviewUpdate = async () => {
        setIsUpdatingReview(true)
        try {
            await onReviewUpdate(game.id, personalRating, review)
        } catch (error) {
            console.error("Failed to update review:", error)
        } finally {
            setIsUpdatingReview(false)
        }
    }

    return (
        <div className="game-card">
            <div className="game-card-left-col">
                <div className="game-card-image">
                    {game.cover && game.cover.url && (
                        <img
                            src={`https:${game.cover.url.replace('t_thumb', 't_cover_big')}`}
                            alt={game.name}
                        />
                    )}
                </div>
                <div className="game-card-info">
                    <h5 className="game-card-title">{game.name}</h5>
                    <p className="game-card-text">
                        <small>Release: {formatDate(game.first_release_date)}</small>
                    </p>
                    {game.total_rating && (
                        <p className="game-card-text">
                            <small>Rating: {game.total_rating.toFixed(2)}</small>
                        </p>
                    )}
                    
                    {onRemove && (
                        <button
                            className="btn btn-sm btn-outline-danger mt-2 w-100"
                            onClick={() => onRemove(game.id)}
                        >
                            Remove from Favorites
                        </button>
                    )}
                </div>
            </div>

            <div className="game-card-body">
                {isEditable && (
                    <div className="game-card-editable-section">
                        <div className="skill-level-section mb-3">
                            <label htmlFor={`skill-${game.id}`} className="form-label small mb-1">My Skill Level:</label>
                            <div className="d-flex gap-2">
                                <input
                                    id={`skill-${game.id}`}
                                    type="number"
                                    className="form-control form-control-sm"
                                    min="1"
                                    max="10"
                                    value={skillLevel}
                                    onChange={(e) => setSkillLevel(parseInt(e.target.value))}
                                    disabled={isUpdatingSkill}
                                />
                                <button
                                    className="btn btn-sm btn-outline-primary"
                                    onClick={handleSkillUpdate}
                                    disabled={isUpdatingSkill || skillLevel === game.skill_level}
                                >
                                    {isUpdatingSkill ? "..." : "Set"}
                                </button>
                            </div>
                        </div>

                        <div className="personal-rating-section mb-3">
                            <label htmlFor={`rating-${game.id}`} className="form-label small mb-1">My Rating (1-10):</label>
                            <input
                                id={`rating-${game.id}`}
                                type="number"
                                className="form-control form-control-sm"
                                min="1"
                                max="10"
                                value={personalRating}
                                onChange={(e) => setPersonalRating(parseInt(e.target.value))}
                            />
                        </div>

                        <div className="review-section mb-2">
                            <label htmlFor={`review-${game.id}`} className="form-label small mb-1">My Review:</label>
                            <textarea
                                id={`review-${game.id}`}
                                className="form-control form-control-sm"
                                rows="3"
                                value={review}
                                onChange={(e) => setReview(e.target.value)}
                                placeholder="Write your thoughts..."
                            />
                        </div>

                        <button
                            className="btn btn-sm btn-primary w-100 mt-auto"
                            onClick={handleReviewUpdate}
                            disabled={isUpdatingReview}
                        >
                            {isUpdatingReview ? "Saving..." : "Save Review & Rating"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
