import React from "react"
import useGlobalReducer from "../hooks/useGlobalReducer"

export const FAQ = () => {
    const { store, dispatch } = useGlobalReducer

    return (
        <>
            <div className="container text-center">
                <h1 className="display-3 m-5">Frequently Asked Questions</h1>
                <h3 className="text-start mt-5 mb-4">How can I view my list of favorite games?</h3>
                <p className="text-start">The list of favorite games you create can easily be viewed by clicking your profile here, or on the nav bar above.</p>
                <h3 className="text-start mt-5 mb-4">What makes us different from something like Discord?</h3>
                <p className="text-start">Unlike Discord, what makes us attractive to others is the ability to match gamers with others who are of the same or similar skill level with our matching system, making it far easier to find people to play games with who are relatively close to you in skill. With the click of a button, you'll be able to connect with someone else-- we'll do the legwork for you. </p>
                <h3 className="text-start mt-5 mb-4">How would I go about finding recommendations for other gamers to play with?</h3>
                <p className="text-start">Upon logging in, you will see a "Recommended Gamers" header where you will automatically see other gamers who play the same games as you and are of a similar skill level.</p>
                <h3 className="text-start mt-5 mb-4">What filters do you use to make it easier to find other gamers to play with?</h3>
                <p className="text-start">If you know exactly the person you're looking for, you can simply search for their username! If that's not the case, fear not. You can also find others by searching a game you have in common, by searching their minimum skill level on a scale of 1-10, maximum skill level on a scale of 1-10, and the minimum and maximum age of your fellow gamers you'd like to play with (as indicated by your date of birth upon signup).</p>
            </div>
        </>
    )
}