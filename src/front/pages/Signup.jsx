import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export const Signup = () => {
	const [note, setNote] = useState("");
	const navigate = useNavigate();

	const signupSubmit = async (e) => {
		e.preventDefault();
		setNote("");

		const base = import.meta.env.VITE_BACKEND_URL;
		if (!base) {
			setNote("missing VITE_BACKEND_URL in .env");
			return;
		}

		const fd = new FormData(e.target);
		const payload = {
			first_name: (fd.get("first_name") || "").toString().trim(),
			last_name: (fd.get("last_name") || "").toString().trim(),
			user_name: (fd.get("user_name") || "").toString().trim(),
			date_of_birth: (fd.get("date_of_birth") || "").toString().trim(),
			email: (fd.get("email") || "").toString().trim(),
			password: fd.get("password"),
			security_question_answer: (fd.get("security_question_answer") || "").toString().trim(),
		};

		try {
			const res = await fetch(base + "/api/signup", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});
			const data = await res.json();

			if (!res.ok) {
				setNote(data.msg || "signup failed");
				return;
			}

			// Auto-login after successful signup
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
						className="border rounded p-4 bg-white"
						style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
						<div className="mb-3">
							<Link
								to="/login"
								className="text-dark"
								aria-label="Back to sign in"
								title="Back to sign in">
								<i className="fas fa-arrow-left fa-lg"></i>
							</Link>
						</div>

						<h1 className="h4 mb-4">Sign up</h1>
						{note ? <p className="small text-muted mb-3">{note}</p> : null}
						<form onSubmit={signupSubmit}>
							<div className="row mb-3">
								<div className="col">
									<label htmlFor="signup-first_name" className="form-label">
										First Name
									</label>
									<input
										type="text"
										className="form-control"
										id="signup-first_name"
										name="first_name"
										autoComplete="given-name"
									/>
								</div>
								<div className="col">
									<label htmlFor="signup-last_name" className="form-label">
										Last Name
									</label>
									<input
										type="text"
										className="form-control"
										id="signup-last_name"
										name="last_name"
										autoComplete="family-name"
									/>
								</div>
							</div>
							<div className="mb-3">
								<label htmlFor="signup-user_name" className="form-label">
									Username
								</label>
								<input
									type="text"
									className="form-control"
									id="signup-user_name"
									name="user_name"
									autoComplete="username"
								/>
							</div>
							<div className="mb-3">
								<label htmlFor="signup-dob" className="form-label">
									Date of birth
								</label>
								<input
									type="date"
									className="form-control"
									id="signup-dob"
									name="date_of_birth"
								/>
							</div>
							<div className="mb-3">
								<label htmlFor="signup-email" className="form-label">
									Email
								</label>
								<input
									type="email"
									className="form-control"
									id="signup-email"
									name="email"
									autoComplete="email"
								/>
							</div>
							<div className="mb-3">
								<label htmlFor="signup-password" className="form-label">
									Password
								</label>
								<input
									type="password"
									className="form-control"
									id="signup-password"
									name="password"
									autoComplete="new-password"
								/>
							</div>
							<div className="mb-3">
								<label htmlFor="signup-security-question" className="form-label">
									Security question: What is your mother&apos;s maiden name?
								</label>
								<input
									type="text"
									className="form-control"
									id="signup-security-question"
									name="security_question_answer"
									autoComplete="off"
								/>
							</div>
							<button type="submit" className="btn btn-primary w-100">
								Sign up
							</button>
						</form>

						<div className="text-center mt-3">
							<Link to="/login">Already have an account? Sign in</Link>
						</div>
						<div className="text-center mt-2">
							<Link to="/">Back home</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
