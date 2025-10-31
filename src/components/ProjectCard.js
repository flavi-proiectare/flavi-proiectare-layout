import { useAuth } from "../context/AuthContext";

export default function ProjectCard({ project }) {
  const { user } = useAuth();

  const color =
    project.zile_ramase > 20
      ? "text-green-600"
      : project.zile_ramase > 10
      ? "text-yellow-500"
      : project.zile_ramase >= 0
      ? "text-red-500"
      : "text-red-800";

  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-4 hover:shadow-md transition">
      <h3 className="text-gray-800 font-semibold">{project.client_name}</h3>
      <p className="text-sm text-gray-500">{project.amplasament}</p>
      <p className={`font-semibold ${color}`}>{project.zile_ramase} zile</p>
      <p className="text-xs text-gray-400 mt-2">
        Responsabil: {project.responsabil}
      </p>
    </div>
  );
}
