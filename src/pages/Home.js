import heroImage from "../assets/ellatrain.jpg";
import { useNavigate } from "react-router-dom";
import "./Home.css"

function Home() {
  const navigate = useNavigate();
  return (
    <div
      className="home-hero"
      style={{ backgroundImage: `url(${heroImage})` }}
    >
      <div className="home-overlay">
        <div>
          <h1 className="home-title">Welcome to LankaExplore</h1>
          <p className="home-subtitle">
            Your all-in-one travel companion for exploring Sri Lanka
          </p>

          <button className = "home-login-btn" onClick={() => navigate("./signup")}>Login</button>
        </div>
      </div>
    </div>
  );
}

export default Home;