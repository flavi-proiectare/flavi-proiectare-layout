import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";

// Pagini
import Login from "./Login";
import Layout from "./Layout";
import Dashboard from "./pages/Dashboard";
import Proiecte from "./pages/Proiecte";
import Taskuri from "./pages/Taskuri";
import ClientView from "./pages/ClientView"; // ✅ noua pagină detaliu proiect

export default function App() {
  const [session, setSession] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // 🔹 verifică sesiunea curentă
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session) navigate("/login");
    });

    // 🔹 ascultă schimbările de autentificare
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) navigate("/login");
    });

    return () => listener.subscription.unsubscribe();
  }, [navigate]);

  // 🔹 Dacă nu e autentificat → login
  if (!session) {
    return <Login />;
  }

  // 🔹 Layout principal (cu sidebar și rute)
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/proiecte" element={<Proiecte />} />
        <Route path="/taskuri" element={<Taskuri />} />
        <Route path="/client/:id" element={<ClientView />} /> {/* ✅ detaliu proiect */}
      </Routes>
    </Layout>
  );
}
