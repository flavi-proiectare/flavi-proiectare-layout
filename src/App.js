import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";
import Login from "./Login";
import Layout from "./Layout";
import Dashboard from "./pages/Dashboard";
import Proiecte from "./pages/Proiecte";
import Taskuri from "./pages/Taskuri";

export default function App() {
  const [session, setSession] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session) navigate("/login");
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) navigate("/login");
    });

    return () => listener.subscription.unsubscribe();
  }, [navigate]);

  if (!session) {
    return <Login />;
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/proiecte" element={<Proiecte />} />  {/* ✅ Proiecte are acum și clienți */}
        <Route path="/taskuri" element={<Taskuri />} />
      </Routes>
    </Layout>
  );
}
