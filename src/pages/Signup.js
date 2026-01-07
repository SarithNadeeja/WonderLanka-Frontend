import { useNavigate } from "react-router-dom";
import "./Signup.css";
import signupImage from "../assets/signup.jpg";
import { useState, useEffect } from "react";

function Signup() {
  const navigate = useNavigate();

  // 🔐 Always start signup with a clean session
  useEffect(() => {
    localStorage.removeItem("token");
  }, []);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");

  const checkPasswordStrength = (password) => {
    if (password.length < 8)
      return "Password must be at least 8 characters";

    if (!/[A-Z]/.test(password))
      return "Add at least one uppercase letter";

    if (!/[0-9]/.test(password))
      return "Add at least one number";

    if (!/[!@#$%^&*]/.test(password))
      return "Add at least one special character";

    return "STRONG";
  };

  const handleSignup = async () => {
    setLoading(true);
    setMessage("");

    if (passwordStrength !== "STRONG") {
      setMessage("Please use a strong password");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:8085/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            password: password,
          }),
        }
      );

      const text = await response.text();

      if (!response.ok) {
        setMessage(text);
        setLoading(false);
        return;
      }

      setMessage(text);

      setTimeout(() => {
        navigate("/check-email");
      }, 200);
    } catch (error) {
      setMessage("Something went wrong please try again later");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-glass">
        <button
          className="signup-back-btn"
          onClick={() => navigate(-1)}
        >
          Back
        </button>

        <div className="signup-form">
          <h2>Sign Up</h2>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setPasswordStrength(
                checkPasswordStrength(e.target.value)
              );
            }}
          />

          {password && (
            <p
              className={`password-hint ${
                passwordStrength === "STRONG"
                  ? "strong"
                  : "weak"
              }`}
            >
              {passwordStrength}
            </p>
          )}

          <button
            className="signup-btn"
            disabled={loading}
            onClick={handleSignup}
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>

          {message && (
            <p className="signup-message">{message}</p>
          )}

          <div className="divider">
            <span>OR</span>
          </div>

          <button
            className="google-btn"
            onClick={() =>
              console.log("Google Signup clicked")
            }
          >
            <img
              src="https://developers.google.com/identity/images/g-logo.png"
              alt="google"
            />
            Sign up with Google
          </button>

          <p className="signup-footer">
            Already have an account?{" "}
            <span
              className="login-link"
              onClick={() => navigate("/login")}
            >
              Login
            </span>
          </p>
        </div>

        <div className="signup-image">
          <img src={signupImage} alt="Sri Lanka" />
        </div>
      </div>
    </div>
  );
}

export default Signup;
