import { Link } from "react-router-dom";

export const Signup = () => {
	const signupSubmit = (e) => {
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
						<div className="mb-3">
							<Link
								to="/login"
								className="text-dark"
								aria-label="Back to login"
								title="Back to login">
								<i className="fas fa-arrow-left fa-lg"></i>
							</Link>
						</div>

						<h1 className="h4 mb-4">Sign up</h1>
						<form onSubmit={signupSubmit}>
							<div className="mb-3">
								<label htmlFor="signup-name" className="form-label">
									Name
								</label>
								<input
									type="text"
									className="form-control"
									id="signup-name"
									name="name"
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
								<label htmlFor="signup-phone" className="form-label">
									Phone number
								</label>
								<input
									type="tel"
									className="form-control"
									id="signup-phone"
									name="phone"
									autoComplete="tel"
								/>
							</div>
							<button type="submit" className="btn btn-primary w-100">
								Sign up
							</button>
						</form>

						<div className="text-center mt-3">
							<Link to="/">Back home</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
