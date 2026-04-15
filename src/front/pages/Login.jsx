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
						className="border rounded p-4 glass-card"
						style={{ boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37)" }}>
						<h1 className="h4 mb-4">Sign in</h1>
						{note ? <p className="small text-muted mb-3">{note}</p> : null}
						<form onSubmit={loginSubmit}>
							<div className="mb-3">
								<label htmlFor="login-email" className="form-label">
									Email
								</label>
								<input
									type="email"
									className="form-control"
									id="login-email"
									name="email"
									autoComplete="email"
								/>
							</div>
							<div className="mb-3">
								<label htmlFor="login-password" className="form-label">
									Password
								</label>
								<input
									type="password"
									className="form-control"
									id="login-password"
									name="password"
									autoComplete="current-password"
								/>
							</div>
							<button type="submit" className="btn btn-primary w-100">
								Log in
							</button>
						</form>

						<div className="mt-3">
							<Link to="/signup" className="btn btn-outline-secondary w-100">
								Create an account
							</Link>
						</div>

						<div className="text-center mt-3">
							<Link to="/forgotpassword">Forgot password?</Link>
						</div>

						<div className="text-center mt-3">
							<Link to="/">Back home</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
