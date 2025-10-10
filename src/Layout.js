import React from "react";
import "./Layout.css";

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <aside className="sidebar">
        <h2>Flavi Proiectare</h2>
        <nav>
          <ul>
            <li><a href="/">Dashboard</a></li>
            <li><a href="/proiecte">Proiecte</a></li>
            <li><a href="/taskuri">Taskuri</a></li>
            <li><a href="/setari">Setări</a></li>
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
