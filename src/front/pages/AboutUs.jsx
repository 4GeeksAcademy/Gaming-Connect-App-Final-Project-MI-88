import React from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const AboutUs = () => {
    const {store, dispatch} = useGlobalReducer()

    return (
        <>
        <div className="container text-center">
            <h1 className="display-3 mb-5">About the Developers</h1>
            <p className="mb-5">We're a small group of web developers from the US and Canada with a particular interest and passion for gaming. Through our shared interest, we have a strong desire to make it a simple task for gamers to have the best possible experience by matching with those who play on the same systems/consoles and have a similar skill level.</p>
            <h1 className="mb-5">Meet the Team</h1>
        </div>
        <div className="container border border-secondary">
            <h2 className="m-5">Josh Bean</h2>
            <p className="m-5">I grew up playing lots of video games. I remember my first gaming system being the Nintendo NES Original. I owned pretty much every gaming console from there on out (even Sega Saturn), I loved playing shooting games - 007, Halo 2 , and Call of Duty daily and various RPG games as well. I always remembered it being challenging to find people to consistently play with, that were at a similar skill level, and that were actually fun to chat with. I got into coding to create applications like GuildUp, and allow gamers like you to find a new and create a new guild! If you have recommendations on how we can make GuildUp better, let us know, we’re always on the lookout to make improvements.</p>
            <h2 className="me-5 mb-3 text-end">Jin Beasley</h2>
            <p className="m-5 text-end">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
            <h2 className="ms-5 mb-3">Patrick Thomas</h2>
            <p className="m-5">For about as long as I can remember, video games have always been a huge passion for me and a great way to escape reality for a little while. I grew up playing video games on all sorts of different devices, from GameBoy to PC. The GameBoy Color was my first exposure to gaming, and since then, I've experienced all different kinds of genres of games, my personal favorites being JRPGs and Action-Adventure games. While single player games are always fun, I've always found it harder to find the right people to play my favorite multiplayer games with. And so one of the many things that got me into coding is so I could explore opportunites like this! Thus came the idea for GuildUp, so it can make the task of finding people who want to play the same games as me and play at a similar level a trivial matter.</p>
        </div>
        </>
    )  

};

