import "./Login.css";
import loginImage from "../assets/login.jpg";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  // 🔐 Always start login with a clean session
  useEffect(() => {
    localStorage.removeItem("token");
  }, []);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:8085/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err);
      }

      const data = await res.json();

      // ✅ Store fresh JWT
      localStorage.setItem("token", data.token);

      // ✅ Correct redirect flow
      if (!data.emailVerified) {
        navigate("/verify-email");
      } else if (!data.roleSelected) {
        navigate("/role-selection");
      } else if (data.role === "TOURIST" && !data.profileCompleted) {
        navigate("/tourist-setup");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <div className="login-image">
          <img src={loginImage} alt="Sri Lanka" />
        </div>

        <div className="login-form">
          <h2>Login</h2>

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
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            className="login-btn"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {error && <p className="login-error">{error}</p>}

          <div className="divider">
            <span>OR</span>
          </div>

          <button className="google-btn">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
              alt="Google"
            />
            Continue with Google
          </button>

          <div className="login-links">
            <span onClick={() => navigate("/signup")}>
              Create an Account
            </span>
            <span>Forgot Password?</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
