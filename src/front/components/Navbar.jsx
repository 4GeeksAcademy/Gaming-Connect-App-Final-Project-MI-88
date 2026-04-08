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
		<nav className="navbar navbar-expand-lg border-bottom bg-body-tertiary">
			<div className="container">
				<Link to="/">
					<span className="navbar-brand mb-0 h1">React Boilerplate</span>
				</Link>
				<div className="ms-auto d-flex align-items-center gap-2 flex-wrap justify-content-end">
					{userName ? (
						<span className="navbar-text small text-end">{userName}</span>
					) : null}
					{userName ? (
						<button
							type="button"
							className="btn btn-outline-secondary btn-sm"
							onClick={logout}>
							Log out
						</button>
					) : (
						<>
							<Link to="/login" className="btn btn-outline-secondary btn-sm">
								Sign in
							</Link>
							<Link to="/signup" className="btn btn-outline-primary btn-sm">
								Sign up
							</Link>
						</>
					)}
					<button
						type="button"
						className="btn btn-outline-secondary btn-sm"
						onClick={() => navigate("/profile")}>
						<i className="fa-solid fa-user me-1"></i>
						Profile
					</button>

					<div className="dropdown">
						<button
							type="button"
							className="btn btn-outline-secondary btn-sm dropdown-toggle"
							data-bs-toggle="dropdown">
							<i className="fa-solid fa-gear me-1"></i>
							Settings
						</button>
						<ul className="dropdown-menu dropdown-menu-end">
							<li>
								<button
									type="button"
									className="dropdown-item d-flex justify-content-between align-items-center"
									onClick={() => setDark((d) => !d)}>
									<span>Dark mode</span>
									<span className="badge text-bg-secondary">{dark ? "On" : "Off"}</span>
								</button>
							</li>
							<li>
								<hr className="dropdown-divider" />
							</li>
							<li>
								<Link className="dropdown-item" to="/profile">
									Profile settings
								</Link>
							</li>
						</ul>
					</div>
					<Link to="/demo">
						<button type="button" className="btn btn-primary btn-sm">
							Check the Context in action
						</button>
					</Link>
				</div>
			</div>
		</nav>
	);
};
