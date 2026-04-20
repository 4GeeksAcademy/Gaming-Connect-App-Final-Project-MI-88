import React from "react"
import useGlobalReducer from "../hooks/useGlobalReducer"

export const ContactUs = () => {
    const { store, dispatch } = useGlobalReducer

    return (
        <div className="info-page-container">
            <h1 className="info-page-title text-center">Contact Us</h1>

            <div className="info-section-glass">
                <p className="text-center mb-4 opacity-75">Have a question or feedback? Our team is here to help you build the perfect guild.</p>
                
                <form>
                    <div className="mb-4">
                        <label htmlFor="name" className="info-subtitle">Full Name</label>
                        <input type="text" className="form-control glass-input" id="name" placeholder="Enter first and last name" required />
                    </div>
                    
                    <div className="mb-4">
                        <label htmlFor="email" className="info-subtitle">Email address</label>
                        <input type="email" className="form-control glass-input" id="email" placeholder="Enter email" required />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="query" className="info-subtitle">Query / Message</label>
                        <textarea className="form-control glass-input" id="query" rows="5" placeholder="How can we help?" required></textarea>
                    </div>

                    <div className="text-center mt-5">
                        <button type="submit" className="glass-pill-button px-5 py-2">
                            Send Message
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}