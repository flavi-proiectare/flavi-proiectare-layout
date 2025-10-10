import React, { useState } from "react";
import { supabase } from "./supabaseClient";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    // curățăm spații și transformăm în litere mici
    const cleanUsername = username.trim().toLowerCase();

    console.log("🔍 Caut username:", cleanUsername);

    // căutăm utilizatorul în tabel (ignorând litere mari/mici)
    const { data: users, error: userError } = await supabase
      .from("users")
      .select("email, username")
      .eq("username", cleanUsername);

    console.log("📦 Rezultat căutare:", users, "Eroare:", userError);

    if (userError || !users || users.length === 0) {
      setError("❌ Utilizator inexistent!");
      setLoading(false);
      return;
    }

    const userEmail = users[0].email;
    console.log("📧 Email găsit:", userEmail);

    const { error: loginError } = await supabase.auth.signInWithPassword({
      email: userEmail,
      password,
    });

    if (loginError) {
      console.error("Eroare autentificare:", loginError);
      setError("❌ Parolă greșită!");
    } else {
      window.location.href = "/";
    }

    setLoading(false);
  }

  return (
    <div
      style={{
        maxWidth: 400,
        margin: "120px auto",
        padding: 30,
        border: "1px solid #ddd",
        borderRadius: 10,
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        background: "#fff",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: 30 }}>
        🔐 Autentificare Flavi Proiectare
      </h2>

      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Nume utilizator"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={inputStyle}
          required
        />

        <input
          type="password"
          placeholder="Parolă"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
          required
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: 10,
            background: loading ? "#9ca3af" : "#1f2937",
            color: "white",
            border: "none",
            borderRadius: 5,
            cursor: "pointer",
          }}
        >
          {loading ? "Se conectează..." : "Autentificare"}
        </button>
      </form>

      {error && <p style={{ color: "red", marginTop: 15 }}>{error}</p>}
    </div>
  );
}

const inputStyle = {
  width: "100%",
  marginBottom: 15,
  padding: 10,
  border: "1px solid #ccc",
  borderRadius: 5,
};
