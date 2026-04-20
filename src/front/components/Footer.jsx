import { Link } from "react-router-dom";

export const Footer = () => (
	<footer className="footer mt-auto py-5 text-center glass-card mx-auto mb-5 shadow-lg" style={{ maxWidth: '1320px' }}>
		<div className="container">
			<div className="row">
				<div className="col-12 mb-4">
					<h4 className="mb-3 text-white">Connect with Us</h4>
					<div className="d-flex justify-content-center gap-4 fs-2">
						<a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" target="_blank" rel="noopener noreferrer" className="text-white hover-teal">
							<i className="fa-brands fa-instagram"></i>
						</a>
						<a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" target="_blank" rel="noopener noreferrer" className="text-white hover-teal">
							<i className="fa-brands fa-x-twitter"></i>
						</a>
						<a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" target="_blank" rel="noopener noreferrer" className="text-white hover-teal">
							<i className="fa-brands fa-discord"></i>
						</a>
						<a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" target="_blank" rel="noopener noreferrer" className="text-white hover-teal">
							<i className="fa-brands fa-youtube"></i>
						</a>
					</div>
				</div>
			</div>
			
			<div className="row justify-content-center mb-4">
				<div className="col-auto d-flex gap-5">
					<Link to="/aboutus" className="text-white-50 text-decoration-none">About Us</Link>
					<Link to="/contactus" className="text-white-50 text-decoration-none">Contact Us</Link>
					<Link to="/FAQ" className="text-white-50 text-decoration-none">FAQ</Link>
				</div>
			</div>

			<div className="row mt-3">
				<div className="col-12">
					<p className="mb-1">
						<a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" target="_blank" rel="noopener noreferrer" className="text-white-50 text-decoration-none small italic">
							<i className="fa-solid fa-location-dot me-2"></i>
							1337 Gamersville, USA
						</a>
					</p>
					<p className="text-white-50 small mb-0">© 2026 GuildUp LLC. All rights reserved.</p>
				</div>
			</div>
		</div>
	</footer>
);
