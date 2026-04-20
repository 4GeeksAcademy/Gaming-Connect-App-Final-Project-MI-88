import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const THEME_KEY = "gc_theme";

export const Navbar = () => {
	const loc = useLocation();
	const navigate = useNavigate();
	const [userName, setUserName] = useState("");
	const [dark, setDark] = useState(() => localStorage.getItem(THEME_KEY) === "dark");

	useEffect(() => {
		setUserName(localStorage.getItem("user_name") || "");
	}, [loc.pathname]);

	useEffect(() => {
		const mode = dark ? "dark" : "light";
		document.documentElement.setAttribute("data-bs-theme", mode);
		localStorage.setItem(THEME_KEY, mode);
	}, [dark]);

	const logout = () => {
		localStorage.removeItem("token");
		localStorage.removeItem("user_name");
		setUserName("");
		navigate("/");
	};

	return (
		<div className="navbar-pill-container d-flex align-items-center justify-content-between px-0">
			<nav className="navbar-pill">
				<Link to={localStorage.getItem("token") ? "/home" : "/"} className="brand-capsule">
					<i className="fa-solid fa-circle-nodes brand-globe"></i>
					<span className="brand-text">
						<span className="text-white">Guild</span>
						<span className="text-neon-green">Up</span>
					</span>
				</Link>

				<Link to="/home" className="action-pill-button">Home</Link>
				<Link to="/profile" className="action-pill-button">Profile</Link>
			</nav>

			{userName ? (
				<div className="navbar-pill py-1 px-1 d-flex align-items-center">
					<span className="text-white small d-none d-md-inline ms-3 me-3">{userName}</span>
					<button className="action-pill-button px-4" onClick={logout}>Logout</button>
				</div>
			) : (
				<div className="navbar-pill py-1 px-1 d-flex align-items-center gap-1">
					<Link to="/login" className="action-pill-button">Sign In</Link>
					<Link to="/signup" className="action-pill-button px-4">Sign Up</Link>
				</div>
			)}
		</div>
	);
};
