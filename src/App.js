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
  const [session, setSession] = useState(undefined); // undefined = încă se încarcă
  const [userRole, setUserRole] = useState("user");

  // Obținem sesiunea activă și ascultăm modificările
  useEffect(() => {
    async function loadSession() {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);

      const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
      });

      return () => listener.subscription.unsubscribe();
    }

    loadSession();
  }, []);

  // După ce avem sesiunea, citim rolul din tabelul `users`
  useEffect(() => {
    async function fetchRole() {
      if (session?.user) {
        const { data, error } = await supabase
          .from("users")
          .select("role")
          .eq("id", session.user.id)
          .single();

        if (!error && data) {
          setUserRole(data.role);
        } else {
          setUserRole("user");
        }
      }
    }

    fetchRole();
  }, [session]);

  // Afișează un mesaj temporar cât se încarcă sesiunea
  if (session === undefined) {
    return <p style={{ padding: 20 }}>Se inițializează sesiunea...</p>;
  }

  // Dacă nu există sesiune activă → pagina de login
  if (!session) {
    return (
      <Router>
        <Routes>
          <Route path="*" element={<Login />} />
        </Routes>
      </Router>
    );
  }

  // Dacă există sesiune activă → aplicația completă
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/proiecte" element={<Proiecte />} />
          <Route path="/taskuri" element={<Taskuri />} />

          {/* doar adminii și șefii pot accesa setările */}
          {(userRole === "admin" || userRole === "sef") && (
            <Route path="/setari" element={<Setari />} />
          )}

          {/* orice altă rută → redirecționare la Dashboard */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
