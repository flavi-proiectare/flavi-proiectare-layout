import React from "react";
import "./Layout.css";
import { Link } from "react-router-dom";

const Layout = ({ children }) => {
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
      </aside>

      <main className="content">
        {children}
      </main>
    </div>
  );
};

export default Layout;
