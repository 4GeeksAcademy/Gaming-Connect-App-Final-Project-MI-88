import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const THEME_KEY = "gc_theme";

export const Navbar = () => {
	const loc = useLocation();
	const navigate = useNavigate();
	const [userName, setUserName] = useState("");
	const [dark, setDark] = useState(() => localStorage.getItem(THEME_KEY) === "dark");

	// username in nav updates when you navigate (e.g. come back from /profile)
	useEffect(() => {
		setUserName(localStorage.getItem("user_name") || "");
	}, [loc.pathname]);

	// dark/light — bootstrap 5 uses data-bs-theme on the root
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
		<div className="navbar-pill-container">
			<div className="navbar-pill">
				<Link to="/home" className="brand-capsule">
					<i className="fa-solid fa-earth-americas brand-globe"></i>
					<div className="brand-text">
						<span className="text-dark-green">GUILD</span>
						<span className="text-neon-green">UP</span>
					</div>
				</Link>

				<div className="nav-links-group">
					<Link to="/home" className="nav-pill-link">Home</Link>
					<Link to="/profile" className="nav-pill-link">Profile</Link>
					<Link to="/demo" className="nav-pill-link">Demo</Link>
					{userName && (
						<a href="#" className="nav-pill-link" onClick={(e) => { e.preventDefault(); logout(); }}>
							Logout
						</a>
					)}
				</div>

				{userName ? (
					<Link to="/profile" className="action-pill-button">
						{userName}
					</Link>
				) : (
					<Link to="/login" className="action-pill-button">
						Sign In
					</Link>
				)}
			</div>
		</div>
	);
};
