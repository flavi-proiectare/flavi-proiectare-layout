import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";

const ClientView = () => {
  const { id } = useParams();
  const [client, setClient] = useState(null);
  const [taskuri, setTaskuri] = useState([]);
  const [istoric, setIstoric] = useState([]);
  const [comentariu, setComentariu] = useState("");

  // 🔹 Preia datele clientului + taskurile + istoricul
  useEffect(() => {
    const fetchData = async () => {
      const { data: c } = await supabase.from("clienti").select("*").eq("id", id).single();
      setClient(c);

      const { data: t } = await supabase.from("taskuri").select("*").eq("client_id", id);
      setTaskuri(t || []);

      const { data: i } = await supabase
        .from("istoric")
        .select("*")
        .eq("client_id", id)
        .order("data_actiune", { ascending: false });
      setIstoric(i || []);
    };
    fetchData();
  }, [id]);

  // 🔹 Actualizează status task
  const updateTask = async (taskId, field, value) => {
    await supabase.from("taskuri").update({ [field]: value }).eq("id", taskId);
    setTaskuri((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, [field]: value } : t))
    );
    await supabase.from("istoric").insert([
      { client_id: id, actiune: `Modificare ${field}: ${value}`, tip: "task" },
    ]);
  };

  // 🔹 Adaugă comentariu (note interne)
  const addComentariu = async () => {
    if (!comentariu.trim()) return;
    await supabase.from("istoric").insert([
      { client_id: id, actiune: comentariu, tip: "comentariu" },
    ]);
    setComentariu("");
    const { data } = await supabase
      .from("istoric")
      .select("*")
      .eq("client_id", id)
      .order("data_actiune", { ascending: false });
    setIstoric(data || []);
  };

  if (!client)
    return (
      <div className="text-center mt-20 text-gray-500">
        Se încarcă detaliile proiectului...
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-blue-200 p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-6">
        <h1 className="text-3xl font-bold text-indigo-700 mb-4">
          {client.titlu_proiect} – {client.nume_client}
        </h1>

        {/* Date generale */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <p><strong>Beneficiar:</strong> {client.beneficiar}</p>
            <p><strong>Domiciliu:</strong> {client.domiciliu}</p>
            <p><strong>Amplasament:</strong> {client.amplasament}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <p><strong>Responsabil:</strong> {client.responsabil}</p>
            <p><strong>Data predare:</strong> {client.data_predare || "–"}</p>
            <p><strong>Total:</strong> {client.total} lei</p>
          </div>
        </div>

        {/* Taskuri */}
        <h2 className="text-2xl font-semibold text-indigo-700 mb-2">🧱 Taskuri</h2>
        <div className="overflow-x-auto mb-8">
          <table className="w-full border-collapse">
            <thead className="bg-indigo-50">
              <tr>
                <th className="p-2 border">Nume Task</th>
                <th className="p-2 border">Responsabil</th>
                <th className="p-2 border">Termen</th>
                <th className="p-2 border">Status</th>
              </tr>
            </thead>
            <tbody>
              {taskuri.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50">
                  <td className="p-2 border">{t.nume_task}</td>
                  <td className="p-2 border">{t.responsabil}</td>
                  <td className="p-2 border">
                    <input
                      type="date"
                      value={t.termen || ""}
                      onChange={(e) => updateTask(t.id, "termen", e.target.value)}
                      className="border rounded p-1"
                    />
                  </td>
                  <td className="p-2 border">
                    <select
                      value={t.status}
                      onChange={(e) => updateTask(t.id, "status", e.target.value)}
                      className="border rounded p-1 bg-white"
                    >
                      <option value="neînceput">Neînceput</option>
                      <option value="în lucru">În lucru</option>
                      <option value="finalizat">Finalizat</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Chat intern */}
        <h2 className="text-2xl font-semibold text-indigo-700 mb-2">💬 Note interne</h2>
        <div className="bg-gray-50 p-4 rounded-lg shadow-inner mb-6 max-h-64 overflow-y-auto">
          {istoric
            .filter((i) => i.tip === "comentariu")
            .map((i) => (
              <div key={i.id} className="mb-2 border-b pb-1 text-sm">
                <span className="text-gray-500">{new Date(i.data_actiune).toLocaleString()}:</span>
                <p className="text-gray-800">{i.actiune}</p>
              </div>
            ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Scrie un comentariu..."
            value={comentariu}
            onChange={(e) => setComentariu(e.target.value)}
            className="flex-1 border rounded-lg p-2"
          />
          <button
            onClick={addComentariu}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Trimite
          </button>
        </div>

        {/* Istoric acțiuni */}
        <h2 className="text-2xl font-semibold text-indigo-700 mt-10 mb-2">🕓 Istoric acțiuni</h2>
        <div className="bg-gray-50 p-4 rounded-lg shadow-inner max-h-64 overflow-y-auto">
          {istoric.map((i) => (
            <div key={i.id} className="border-b border-gray-200 py-1 text-sm">
              <span className="text-gray-500">{new Date(i.data_actiune).toLocaleString()}:</span>{" "}
              {i.actiune}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClientView;
