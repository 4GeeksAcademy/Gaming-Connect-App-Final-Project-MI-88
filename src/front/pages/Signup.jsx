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
				<div className="col-12 col-sm-10 col-md-8 col-lg-6">
					<div
						className="border rounded p-5 glass-card text-white text-center"
						style={{ boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.45)" }}>
						
						<div className="mb-4">
							<i className="fa-solid fa-circle-nodes brand-globe fa-3x mb-3 text-neon-green"></i>
							<h1 className="main-title h2">
								<span className="text-white">Guild</span><span className="text-neon-green">Up</span>
							</h1>
						</div>

						<h2 className="brand-text h4 mb-4 text-white">Create your account</h2>
						
						{note ? <p className="alert alert-danger py-2 small">{note}</p> : null}

						<form onSubmit={signupSubmit} className="text-start">
							<div className="row mb-3">
								<div className="col">
									<label htmlFor="signup-first_name" className="form-label text-white small">
										First Name
									</label>
									<input
										type="text"
										className="form-control bubble-input"
										id="signup-first_name"
										name="first_name"
										autoComplete="given-name"
										required
									/>
								</div>
								<div className="col">
									<label htmlFor="signup-last_name" className="form-label text-white small">
										Last Name
									</label>
									<input
										type="text"
										className="form-control bubble-input"
										id="signup-last_name"
										name="last_name"
										autoComplete="family-name"
										required
									/>
								</div>
							</div>
							<div className="mb-3">
								<label htmlFor="signup-user_name" className="form-label text-white small">
									Username
								</label>
								<input
									type="text"
									className="form-control bubble-input"
									id="signup-user_name"
									name="user_name"
									autoComplete="username"
									required
								/>
							</div>
							<div className="mb-3">
								<label htmlFor="signup-dob" className="form-label text-white small">
									Date of birth
								</label>
								<input
									type="date"
									className="form-control bubble-input"
									id="signup-dob"
									name="date_of_birth"
									required
								/>
							</div>
							<div className="mb-3">
								<label htmlFor="signup-email" className="form-label text-white small">
									Email
								</label>
								<input
									type="email"
									className="form-control bubble-input"
									id="signup-email"
									name="email"
									autoComplete="email"
									required
								/>
							</div>
							<div className="mb-3">
								<label htmlFor="signup-password" className="form-label text-white small">
									Password
								</label>
								<input
									type="password"
									className="form-control bubble-input"
									id="signup-password"
									name="password"
									autoComplete="new-password"
									required
								/>
							</div>
							<div className="mb-4">
								<label htmlFor="signup-security-question" className="form-label text-white small">
									Security question: What is your mother&apos;s maiden name?
								</label>
								<input
									type="text"
									className="form-control bubble-input"
									id="signup-security-question"
									name="security_question_answer"
									autoComplete="off"
									required
								/>
							</div>
							<button type="submit" className="btn btn-primary w-100 py-2 fw-bold">
								Sign up
							</button>
						</form>

						<div className="mt-4">
							<Link to="/login" className="text-neon-green text-decoration-none small fw-bold">
								Already have an account? Sign in
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
