import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export const ProfileSettings = () => {
	const [name, setName] = useState("");
	const [msg, setMsg] = useState("");
	const token = localStorage.getItem("token");

	useEffect(() => {
		setName(localStorage.getItem("user_name") || "");
	}, []);

	const save = (e) => {
		e.preventDefault();
		setMsg("");
		if (!token) {
			setMsg("Sign in first.");
			return;
		}
		const trimmed = name.trim();
		if (!trimmed) {
			setMsg("Name can't be empty.");
			return;
		}
		localStorage.setItem("user_name", trimmed);
		// full reload so the navbar picks up the new name (dumb but works)
		window.location.reload();
	};

	if (!token) {
		return (
			<div className="container py-5">
				<div className="row justify-content-center">
					<div className="col-12 col-md-8 col-lg-6">
						<div className="border rounded p-4 bg-body">
							<h1 className="h4 mb-3">Profile</h1>
							<p className="text-muted small mb-3">Sign in to change your profile.</p>
							<Link to="/login" className="btn btn-outline-secondary btn-sm me-2">
								Sign in
							</Link>
							<Link to="/" className="btn btn-link btn-sm">
								Home
							</Link>
						</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="container py-5">
			<div className="row justify-content-center">
				<div className="col-12 col-md-8 col-lg-6">
					<div
						className="border rounded p-4 bg-body"
						style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
						<h1 className="h4 mb-4">Profile settings</h1>
						{msg ? <p className="small text-muted mb-3">{msg}</p> : null}
						<form onSubmit={save}>
							<div className="mb-3">
								<label htmlFor="profile-name" className="form-label">
									Display name
								</label>
								<input
									id="profile-name"
									className="form-control"
									value={name}
									onChange={(e) => setName(e.target.value)}
								/>
							</div>
							<button type="submit" className="btn btn-primary">
								Save
							</button>
						</form>
						<div className="mt-3">
							<Link to="/">Back home</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
