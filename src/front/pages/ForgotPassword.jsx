import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export const ForgotPassword = () => {
    const [note, setNote] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const navigate = useNavigate();

    const forgotPasswordSubmit = async (e) => {
        e.preventDefault();
        setNote("");
        setSuccessMessage("");

        const fd = new FormData(e.target);
        const email = fd.get("email");
        const newPassword = fd.get("new_password");
        const confirmPassword = fd.get("confirm_password");
        const securityWord = fd.get("security_word");

        if (newPassword !== confirmPassword) {
            setNote("Passwords do not match. Please ensure the passwords match exactly (case sensitive).");
            return;
        }

        const base = import.meta.env.VITE_BACKEND_URL;
        if (!base) {
            setNote("missing VITE_BACKEND_URL in .env");
            return;
        }

        try {
            const res = await fetch(base + "/api/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, new_password: newPassword, security_word: securityWord }),
            });
            const data = await res.json();

            if (!res.ok) {
                setNote(data.msg || "something went wrong");
                return;
            }

            setSuccessMessage("Your password has been reset successfully.");
            setTimeout(() => navigate("/login"), 2000);
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
                        <h1 className="h4 mb-1">Forgotten your password?</h1>
                        <p className="small text-muted mb-4">Fill out the form below to reset your password</p>
                        {note && <p className="small text-danger mb-3">{note}</p>}
                        {successMessage && <p className="small text-success mb-3">{successMessage}</p>}
                        <form onSubmit={forgotPasswordSubmit}>
                            <div className="mb-3">
                                <label htmlFor="forgot-email" className="form-label">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    className="form-control"
                                    id="forgot-email"
                                    name="email"
                                    autoComplete="email"
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="forgot-new-password" className="form-label">
                                    Enter new password
                                </label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="forgot-new-password"
                                    name="new_password"
                                    autoComplete="new-password"
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="forgot-confirm-password" className="form-label">
                                    Confirm new password
                                </label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="forgot-confirm-password"
                                    name="confirm_password"
                                    autoComplete="new-password"
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="forgot-security-word" className="form-label">
                                    Security word
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="forgot-security-word"
                                    name="security_word"
                                />
                            </div>
                            <button type="submit" className="btn btn-primary w-100">
                                Reset password
                            </button>
                        </form>

                        <div className="mt-3">
                            <Link to="/login" className="btn btn-outline-secondary w-100">
                                Back to login
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