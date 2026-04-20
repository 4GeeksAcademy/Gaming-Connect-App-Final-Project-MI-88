import React from "react"
import useGlobalReducer from "../hooks/useGlobalReducer"

export const FAQ = () => {
    const { store, dispatch } = useGlobalReducer

    return (
        <div className="info-page-container">
            <h1 className="info-page-title text-center">FAQ</h1>
            
            <div className="info-section-glass">
                <div className="faq-item">
                    <h3 className="faq-question">How can I view my list of favorite games?</h3>
                    <p className="faq-answer">The list of favorite games you create can easily be viewed by clicking your profile avatar on the navigation bar, which will take you directly to your personal dashboard.</p>
                </div>

                <div className="faq-item">
                    <h3 className="faq-question">What makes us different from something like Discord?</h3>
                    <p className="faq-answer">Unlike general chat platforms, GuildUp is built specifically for skill-based matchmaking. We match gamers with others of similar proficiency and shared history, ensuring your next session is competitive and fun without the "rank gap" frustration.</p>
                </div>

                <div className="faq-item">
                    <h3 className="faq-question">How do I find new recommended gamers?</h3>
                    <p className="faq-answer">Upon logging in, your home dashboard will automatically populate with "Recommended Gamers" who share your favorite titles and fall within your skill range. You can fine-tune these suggestions using the settings filter.</p>
                </div>

                <div className="faq-item">
                    <h3 className="faq-question">What filters are available for searching?</h3>
                    <p className="faq-answer">You can filter fellow gamers by username, specific game titles, minimum/maximum skill levels (1-10), and age ranges. This ensures you find exactly the crew you're looking for.</p>
                </div>
            </div>
        </div>
    )
}