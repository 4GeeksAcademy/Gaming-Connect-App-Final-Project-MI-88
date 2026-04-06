import { Link } from "react-router-dom";

export const Footer = () => (
	<footer className="footer mt-auto py-3 text-center">

		<h4 className="pt-5">Socials</h4>
		<h2 className="pb-4">
			<a href="https://www.instagram.com"> <i class="fa-brands fa-square-instagram text-success"></i></a>
			<a href="https://www.youtube.com"> <i class="fa-brands fa-youtube text-danger"></i></a>
			<a href="https://www.twitter.com"> <i class="fa-brands fa-twitter text-info"></i></a>
		</h2>

		<p>
			<Link to={`/aboutus/`}>
          		About Us
        	</Link>
		</p>
		<p>
			<Link to={`/contactus/`}>
          		Contact Us
        	</Link>
		</p>
		<p>
			<Link to={`/FAQ/`}>
          		Frequently Asked Questions
        	</Link>
		</p>
		<p>
			<a href="http://www.4geeksacademy.com">1337 Gamersville, USA</a>
		</p>
		<p>© 2026 GuildUp LLC </p>
	</footer>
);
