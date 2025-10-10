import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import Dashboard from "./pages/Dashboard";
import Proiecte from "./pages/Proiecte";
import Taskuri from "./pages/Taskuri";
import Setari from "./pages/Setari";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/proiecte" element={<Proiecte />} />
          <Route path="/taskuri" element={<Taskuri />} />
          <Route path="/setari" element={<Setari />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
