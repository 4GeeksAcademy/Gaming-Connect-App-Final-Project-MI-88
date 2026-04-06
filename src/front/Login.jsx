import { Link } from "react-router-dom";

export const Login = () => {
	const loginSubmit = (e) => {
		e.preventDefault();
		// hook up api later
	};

	return (
		<div className="container py-5">
			<div className="row justify-content-center">
				<div className="col-12 col-sm-10 col-md-7 col-lg-5">
					<div
						className="border rounded p-4 bg-white"
						style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
						<h1 className="h4 mb-4">Login</h1>
						<form onSubmit={loginSubmit}>
							<div className="mb-3">
								<label htmlFor="login-username" className="form-label">
									Username
								</label>
								<input
									type="text"
									className="form-control"
									id="login-username"
									name="username"
									autoComplete="username"
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
								Sign up
							</Link>
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
