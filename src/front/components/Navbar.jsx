import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export const Navbar = () => {
	const loc = useLocation();
	const navigate = useNavigate();
	const [userName, setUserName] = useState("");

	useEffect(() => {
		setUserName(localStorage.getItem("user_name") || "");
	}, [loc.pathname]);

	const logout = () => {
		localStorage.removeItem("token");
		localStorage.removeItem("user_name");
		setUserName("");
		navigate("/");
	};

	return (
		<nav className="navbar navbar-light bg-light">
			<div className="container">
				<Link to="/">
					<span className="navbar-brand mb-0 h1">React Boilerplate</span>
				</Link>
				<div className="ms-auto d-flex align-items-center gap-2 flex-wrap justify-content-end">
					{userName ? (
						<>
							<span className="navbar-text small text-end">{userName}</span>
							<button
								type="button"
								className="btn btn-outline-secondary btn-sm"
								onClick={logout}>
								Log out
							</button>
						</>
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
