import React, { useState } from "react";
import { supabase } from "./supabaseClient";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("❌ Date incorecte sau cont inexistent");
      console.error(error);
    } else {
      setSuccess("✅ Autentificare reușită!");
      window.location.href = "/"; // redirecționează la Dashboard
    }
  }

  return (
    <div style={{
      maxWidth: 400,
      margin: "120px auto",
      padding: 30,
      border: "1px solid #ddd",
      borderRadius: 10,
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      background: "#fff"
    }}>
      <h2 style={{ textAlign: "center", marginBottom: 30 }}>
        🔐 Autentificare Flavi Proiectare
      </h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: "100%",
            marginBottom: 15,
            padding: 10,
            border: "1px solid #ccc",
            borderRadius: 5,
          }}
          required
        />
        <input
          type="password"
          placeholder="Parolă"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            marginBottom: 15,
            padding: 10,
            border: "1px solid #ccc",
            borderRadius: 5,
          }}
          required
        />
        <button
          type="submit"
          style={{
            width: "100%",
            padding: 10,
            background: "#1f2937",
            color: "white",
            border: "none",
            borderRadius: 5,
            cursor: "pointer",
          }}
        >
          Autentificare
        </button>
      </form>

      {error && <p style={{ color: "red", marginTop: 15 }}>{error}</p>}
      {success && <p style={{ color: "green", marginTop: 15 }}>{success}</p>}
    </div>
  );
}
