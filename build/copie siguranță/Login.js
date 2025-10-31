import React, { useState } from "react";
import { supabase } from "./supabaseClient";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setError("");

    const normalizedUsername = username.trim().toLowerCase();

    console.log("🔍 Caut utilizator:", normalizedUsername);

    // căutăm în tabelul `users`, fără diferență între majuscule/minuscule
    const { data, error: fetchError } = await supabase
      .from("users")
      .select("id, username, email")
      .ilike("username", normalizedUsername);

    console.log("📦 Rezultat căutare:", data, "Eroare:", fetchError);

    if (fetchError) {
      setError("⚠️ Eroare la conexiunea cu baza de date.");
      return;
    }

    if (!data || data.length === 0) {
      setError("❌ Utilizator inexistent");
      return;
    }

    const user = data[0];

    // generăm emailul automat, bazat pe username
    const email = `${user.username.toLowerCase()}@flavi.ro`;

    // autentificare în Supabase Auth
    const { error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (loginError) {
      console.error(loginError);
      setError("❌ Parolă incorectă sau cont inexistent");
      return;
    }

    // salvăm userul logat local (pentru a-l afișa în Dashboard)
    localStorage.setItem("user", user.username);

    // redirecționăm la Dashboard
    window.location.href = "/";
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
          placeholder="Utilizator (ex: radu)"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
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
    </div>
  );
}
