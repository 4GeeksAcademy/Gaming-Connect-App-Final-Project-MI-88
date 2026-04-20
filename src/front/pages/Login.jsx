import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export const Login = () => {
	const [note, setNote] = useState("");
	const navigate = useNavigate();

	const loginSubmit = async (e) => {
		e.preventDefault();
		setNote("");

		const base = import.meta.env.VITE_BACKEND_URL;
		if (!base) {
			setNote("missing VITE_BACKEND_URL in .env");
			return;
		}

		const fd = new FormData(e.target);
		const email = fd.get("email");
		const password = fd.get("password");

		try {
			const res = await fetch(base + "/api/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, password }),
			});
			const data = await res.json();

			if (!res.ok) {
				setNote(data.msg || "something went wrong");
				return;
			}

			if (data.token) localStorage.setItem("token", data.token);
			if (data.user_name) localStorage.setItem("user_name", data.user_name);

			navigate("/home");
		} catch {
			setNote("fetch failed, is the backend running?");
		}
	};

	return (
		<div className="container py-5">
			<div className="row justify-content-center">
				<div className="col-12 col-sm-10 col-md-7 col-lg-5">
					<div
						className="border rounded p-5 glass-card text-white text-center"
						style={{ boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.45)" }}>
						<div className="mb-4">
							<i className="fa-solid fa-circle-nodes brand-globe fa-3x mb-3 text-neon-green"></i>
							<h1 className="main-title h2">
								<span className="text-white">Guild</span><span className="text-neon-green">Up</span>
							</h1>
						</div>

						<h2 className="brand-text h4 mb-4 text-white">Sign in</h2>
						
						{note ? <p className="alert alert-danger py-2 small">{note}</p> : null}

						<form onSubmit={loginSubmit} className="text-start">
							<div className="mb-3">
								<label htmlFor="login-email" className="form-label text-white">
									Email
								</label>
								<input
									type="email"
									className="form-control bubble-input"
									id="login-email"
									name="email"
									autoComplete="email"
									required
								/>
							</div>
							<div className="mb-4">
								<label htmlFor="login-password" className="form-label text-white">
									Password
								</label>
								<input
									type="password"
									className="form-control bubble-input"
									id="login-password"
									name="password"
									autoComplete="current-password"
									required
								/>
							</div>
							<button type="submit" className="btn btn-primary w-100 py-2 fw-bold">
								Log in
							</button>
						</form>

						<div className="mt-4">
							<Link to="/signup" className="text-neon-green text-decoration-none small fw-bold">
								Don't have an account? Create one
							</Link>
						</div>

						<div className="mt-2">
							<Link to="/forgotpassword" style={{ color: "rgba(255,255,255,0.6)" }} className="small text-decoration-none">
								Forgot password?
							</Link>
						</div>

						<div className="mt-4">
							<Link to="/" className="btn btn-outline-light btn-sm px-4">
								Back Home
							</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
