import React, { useEffect, useState } from "react";
import "./Layout.css";
import { Link } from "react-router-dom";
import { supabase } from "./supabaseClient";

const Layout = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data?.user));
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  // extragem doar partea dinainte de @
  const userName = user?.email ? user.email.split("@")[0] : "";

  return (
    <div className="layout">
      <aside
        className="sidebar"
        style={{
          backgroundColor: "#1f2937", // gri închis elegant
          color: "#f9fafb", // text deschis
          display: "flex",
          flexDirection: "column",
          padding: "20px",
          minHeight: "100vh",
          width: "220px",
          position: "fixed", // 🔹 menținem bara laterală fixă
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <h2 style={{ color: "#60a5fa", marginBottom: "15px" }}>
          Flavi Proiectare
        </h2>

        {user && (
          <div
            style={{
              background: "#374151",
              padding: "10px 14px",
              borderRadius: "6px",
              marginBottom: "20px",
              fontSize: "15px",
              color: "#f9fafb",
              textAlign: "center",
              fontWeight: "500",
            }}
          >
            👋 {userName.charAt(0).toUpperCase() + userName.slice(1)}
          </div>
        )}

        <nav style={{ flex: "1" }}>
          <ul style={{ listStyle: "none", padding: 0 }}>
            <li><Link style={linkStyle} to="/">🏠 Dashboard</Link></li>
            <li><Link style={linkStyle} to="/proiecte">📁 Proiecte</Link></li>
            <li><Link style={linkStyle} to="/taskuri">🧱 Taskuri</Link></li>
            <li><Link style={linkStyle} to="/setari">⚙️ Setări</Link></li>
          </ul>
        </nav>
      </aside>

      {/* conținutul principal (mutat cu margine pentru sidebar) */}
      <main
        className="content"
        style={{
          marginLeft: "240px",
          padding: "30px",
          minHeight: "100vh",
          backgroundColor: "#f9fafb",
        }}
      >
        {children}
      </main>

      {/* 🔹 Buton fix de Ieșire */}
      <button
        onClick={handleLogout}
        style={{
          position: "fixed",
          left: "30px", // poziție față de marginea stângă
          bottom: "25px", // poziție față de marginea de jos
          zIndex: 1000,
          padding: "10px 16px",
          background: "#ef4444",
          border: "none",
          color: "white",
          borderRadius: "6px",
          cursor: "pointer",
          fontWeight: "500",
          transition: "background 0.2s",
          boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
        }}
        onMouseOver={(e) => (e.target.style.background = "#dc2626")}
        onMouseOut={(e) => (e.target.style.background = "#ef4444")}
      >
        ⎋ Ieșire
      </button>
    </div>
  );
};

// Stil comun pentru linkuri
const linkStyle = {
  display: "block",
  padding: "10px 12px",
  color: "#d1d5db",
  textDecoration: "none",
  borderRadius: "6px",
  marginBottom: "5px",
  fontWeight: "500",
  transition: "0.2s",
  background: "transparent",
};

export default Layout;
