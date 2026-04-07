import React, { useState } from "react"
import useActions from "../hooks/useActions.jsx"

export const GameSearchBar = ({ onGameSelect }) => {
    const { postToIGDB } = useActions()
    const [searchQuery, setSearchQuery] = useState("")
    const [searchResults, setSearchResults] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [showResults, setShowResults] = useState(false)
    const [selectedGames, setSelectedGames] = useState({})

    const performSearch = async () => {
        if (!searchQuery.trim()) {
            setSearchResults([])
            setShowResults(false)
            return
        }

        setIsLoading(true)
        try {
            const result = await postToIGDB("games", `
                fields name, first_release_date, total_rating, cover.url;
                search "${searchQuery}";
                limit 10;
            `)
            
            if (result.error) {
                console.error("Search error:", result.error)
                setSearchResults([])
            } else {
                setSearchResults(result)
                setShowResults(true)
            }
        } catch (error) {
            console.error("Failed to search games:", error)
            setSearchResults([])
        } finally {
            setIsLoading(false)
        }
    }

    const handleSearch = (e) => {
        e.preventDefault()
        performSearch()
    }

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            e.preventDefault()
            performSearch()
        }
    }

    const handleAddGame = (game) => {
        const gameData = {
            ...game,
            skill_level: selectedGames[game.id] || 1
        }
        onGameSelect(gameData)
        
        // Reset after selection
        setSelectedGames({ ...selectedGames, [game.id]: 1 })
    }

    const handleSkillChange = (gameId, value) => {
        setSelectedGames({
            ...selectedGames,
            [gameId]: value
        })
    }

    return (
        <div className="game-search-bar">
            <div className="search-input-group">
                <input
                    type="text"
                    placeholder="Search for games (e.g., 'Zelda', 'Elden Ring')"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="form-control search-input"
                />
                <button
                    onClick={handleSearch}
                    disabled={isLoading}
                    className="btn btn-primary search-btn"
                >
                    {isLoading ? "Searching..." : "Search"}
                </button>
            </div>

            {showResults && searchResults.length > 0 && (
                <div className="search-results">
                    <h4>Search Results ({searchResults.length})</h4>
                    <div className="search-results-grid">
                        {searchResults.map((game) => (
                            <div key={game.id} className="search-result-item">
                                <div className="result-image">
                                    {game.cover && game.cover.url && (
                                        <img
                                            src={`https:${game.cover.url.replace('t_thumb', 't_cover_big')}`}
                                            alt={game.name}
                                        />
                                    )}
                                </div>
                                <div className="result-body">
                                    <h6>{game.name}</h6>
                                    {game.total_rating && (
                                        <p className="rating">★ {game.total_rating.toFixed(2)}</p>
                                    )}
                                    <div className="skill-select">
                                        <label>Initial Skill Level:</label>
                                        <select
                                            value={selectedGames[game.id] || 1}
                                            onChange={(e) => handleSkillChange(game.id, parseInt(e.target.value))}
                                            className="form-select"
                                        >
                                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
                                                <option key={level} value={level}>
                                                    {level}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <button
                                        onClick={() => handleAddGame(game)}
                                        className="btn btn-sm btn-success"
                                    >
                                        Add to Favorites
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {showResults && searchResults.length === 0 && !isLoading && (
                <div className="alert alert-info mt-2">
                    No games found. Try a different search.
                </div>
            )}
        </div>
    )
}
