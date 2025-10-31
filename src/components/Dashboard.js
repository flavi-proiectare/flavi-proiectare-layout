import { useEffect, useState } from "react";
import { supabase } from "../supabase/supabaseClient";
import ProjectCard from "./ProjectCard";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const loadProjects = async () => {
      let query = supabase.from("projects").select("*");
      if (user.role !== "admin") query = query.eq("responsabil", user.username);
      const { data } = await query;
      setProjects(data);
    };
    if (user) loadProjects();
  }, [user]);

  return (
    <div className="grid gap-4 md:grid-cols-3 p-4">
      {projects.map((p) => (
        <ProjectCard key={p.id} project={p} />
      ))}
    </div>
  );
}
