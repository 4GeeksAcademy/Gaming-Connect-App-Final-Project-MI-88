import React, { useState } from "react"

export const GameCard = ({ game, onRemove, onSkillUpdate, isEditable = false }) => {
    const [skillLevel, setSkillLevel] = useState(game.skill_level || 1)
    const [isUpdatingSkill, setIsUpdatingSkill] = useState(false)

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

    return (
        <div className="game-card">
            <div className="game-card-image">
                {game.cover && game.cover.url && (
                    <img
                        src={`https:${game.cover.url.replace('t_thumb', 't_cover_big')}`}
                        alt={game.name}
                    />
                )}
            </div>
            <div className="game-card-body">
                <h5 className="game-card-title">{game.name}</h5>
                <p className="game-card-text">
                    <small>Release: {formatDate(game.first_release_date)}</small>
                </p>
                {game.total_rating && (
                    <p className="game-card-text">
                        <small>Rating: {game.total_rating.toFixed(2)}</small>
                    </p>
                )}
                
                {isEditable && (
                    <div className="skill-level-section">
                        <label htmlFor={`skill-${game.id}`}>Skill Level:</label>
                        <div className="skill-level-input">
                            <input
                                id={`skill-${game.id}`}
                                type="number"
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
                                {isUpdatingSkill ? "Updating..." : "Update"}
                            </button>
                        </div>
                    </div>
                )}
                
                {onRemove && (
                    <button
                        className="btn btn-sm btn-outline-danger mt-2"
                        onClick={() => onRemove(game.id)}
                    >
                        Remove from Favorites
                    </button>
                )}
            </div>
        </div>
    )
}
