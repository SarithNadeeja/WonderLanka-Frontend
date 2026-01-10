import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {

  const [username, setU] = useState("");
  const [password, setP] = useState("");
  const nav = useNavigate();

  const login = async () => {
    try {
      const res = await fetch(
        "http://localhost:8085/api/admin/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password })
        }
      );

      if (!res.ok) throw new Error();

      const data = await res.json();
      localStorage.setItem("adminToken", data.token);
      nav("/admin");

    } catch {
      alert("Invalid credentials");
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>Admin Login</h2>

      <input
        placeholder="Username"
        onChange={e => setU(e.target.value)}
      /><br/><br/>

      <input
        type="password"
        placeholder="Password"
        onChange={e => setP(e.target.value)}
      /><br/><br/>

      <button onClick={login}>Login</button>
    </div>
  );
}
