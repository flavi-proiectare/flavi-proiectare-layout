import React from "react";
import "./Layout.css";
import { Link } from "react-router-dom";
import { supabase } from "./supabaseClient"; // <- importul corect, sus de tot

const Layout = ({ children }) => {
  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  return (
    <div className="layout">
      <aside className="sidebar">
        <h2>Flavi Proiectare</h2>
        <nav>
          <ul>
            <li><Link to="/">Dashboard</Link></li>
            <li><Link to="/proiecte">Proiecte</Link></li>
            <li><Link to="/taskuri">Taskuri</Link></li>
            <li><Link to="/setari">Setări</Link></li>
          </ul>
        </nav>

        <button
          onClick={handleLogout}
          style={{
            marginTop: "auto",
            padding: "10px",
            background: "#ef4444",
            border: "none",
            color: "white",
            borderRadius: "5px",
            cursor: "pointer",
            width: "100%",
          }}
        >
          Ieșire
        </button>
      </aside>

      <main className="content">
        {children}
      </main>
    </div>
  );
};

export default Layout;
