import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { supabase } from "./supabaseClient";
import Layout from "./Layout";
import Dashboard from "./pages/Dashboard";
import Proiecte from "./pages/Proiecte";
import Taskuri from "./pages/Taskuri";
import Setari from "./pages/Setari";
import Login from "./Login";

function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    const currentSession = supabase.auth.getSession();
    currentSession.then(({ data }) => setSession(data.session));

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  if (!session) {
    // Dacă nu e autentificat, afișează pagina de login
    return (
      <Router>
        <Routes>
          <Route path="*" element={<Login />} />
        </Routes>
      </Router>
    );
  }

  // Dacă e autentificat, afișează aplicația completă
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/proiecte" element={<Proiecte />} />
          <Route path="/taskuri" element={<Taskuri />} />
          <Route path="/setari" element={<Setari />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
