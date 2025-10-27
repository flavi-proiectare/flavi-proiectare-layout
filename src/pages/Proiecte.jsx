import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { v4 as uuidv4 } from "uuid";

const Proiecte = () => {
  const [proiecte, setProiecte] = useState([]);
  const [listaResponsabili, setListaResponsabili] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [istoric, setIstoric] = useState([]);

  const [form, setForm] = useState({
    nume_client: "",
    beneficiar: "",
    domiciliu: "",
    amplasament: "",
    titlu_proiect: "",
    data_predare: "",
    responsabil: "",
    suprafata: "",
    servicii: [],
    total: 0,
  });

  const listaServicii = [
    { id: "cu", nume: "Certificat de urbanism", pret: 500 },
    { id: "dtac", nume: "Documentație D.T.A.C.", pret: 2500 },
    { id: "dtad", nume: "Documentație D.T.A.D.", pret: 1500 },
    { id: "avize", nume: "Obținere avize", pret: 1200 },
    { id: "expertiza", nume: "Expertiză tehnică", pret: 2500 },
    { id: "releveu", nume: "Releveu", pret: 1000 },
  ];

  // 🔹 Obține proiectele existente
  const fetchProiecte = async () => {
    const { data, error } = await supabase.from("clienti").select("*").order("data_creare", { ascending: false });
    if (!error && data) setProiecte(data);
  };

  // 🔹 Obține lista de responsabili
  useEffect(() => {
    const fetchResponsabili = async () => {
      const { data, error } = await supabase.from("utilizatori").select("nume");
      if (!error && data) setListaResponsabili(data.map((r) => r.nume));
    };
    fetchResponsabili();
    fetchProiecte();
  }, []);

  // 🔹 Selectare serviciu
  const toggleServiciu = (serviciu) => {
    let updated;
    if (form.servicii.find((s) => s.id === serviciu.id)) {
      updated = form.servicii.filter((s) => s.id !== serviciu.id);
    } else {
      updated = [...form.servicii, { ...serviciu }];
    }
    const total = updated.reduce((sum, s) => sum + s.pret, 0);
    setForm({ ...form, servicii: updated, total });
  };

  // 🔹 Modificare preț manual
  const updatePret = (id, pret) => {
    const updated = form.servicii.map((s) => (s.id === id ? { ...s, pret: parseFloat(pret) || 0 } : s));
    const total = updated.reduce((sum, s) => sum + s.pret, 0);
    setForm({ ...form, servicii: updated, total });
  };

  // 🔹 Salvare proiect + generare taskuri
  const handleSave = async () => {
    const clientId = uuidv4();
    const proiect = {
      id: clientId,
      ...form,
      stare: "neînceput",
      culoare_proiect: "#4F46E5",
      data_creare: new Date().toISOString(),
    };

    const { error } = await supabase.from("clienti").insert([proiect]);
    if (error) {
      alert("Eroare la salvarea proiectului!");
      console.error(error);
      return;
    }

    // generăm taskuri automat
    const taskuri = form.servicii.map((s) => ({
      id: uuidv4(),
      client_id: clientId,
      nume_task: s.nume,
      responsabil: form.responsabil,
      termen: form.data_predare,
      status: "neînceput",
    }));
    await supabase.from("taskuri").insert(taskuri);

    // istoric
    const log = {
      data: new Date().toLocaleString(),
      actiune: `Proiect "${form.titlu_proiect}" creat pentru ${form.nume_client}`,
    };
    setIstoric((prev) => [...prev, log]);

    alert("✅ Proiect salvat cu succes!");
    setShowForm(false);
    fetchProiecte();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-indigo-700">📁 Proiecte / Clienți</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-md"
          >
            ➕ Adaugă proiect nou
          </button>
        </div>

        {/* Formular proiect nou */}
        {showForm && (
          <div className="bg-white shadow-lg rounded-xl p-6 mb-8">
            <h2 className="text-2xl font-semibold text-indigo-600 mb-4">Detalii proiect</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <input name="nume_client" placeholder="Nume client" value={form.nume_client} onChange={handleChange}
                className="p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400" />
              <input name="beneficiar" placeholder="Nume beneficiar" value={form.beneficiar} onChange={handleChange}
                className="p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400" />
              <input name="domiciliu" placeholder="Domiciliu beneficiar" value={form.domiciliu} onChange={handleChange}
                className="p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400" />
              <input name="amplasament" placeholder="Amplasament" value={form.amplasament} onChange={handleChange}
                className="p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400" />
              <input name="titlu_proiect" placeholder="Titlu proiect" value={form.titlu_proiect} onChange={handleChange}
                className="p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400" />
              <input type="date" name="data_predare" value={form.data_predare} onChange={handleChange}
                className="p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400" />
              <select name="responsabil" value={form.responsabil} onChange={handleChange}
                className="p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 bg-white">
                <option value="">Alege responsabil</option>
                {listaResponsabili.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            <h3 className="text-xl font-semibold text-gray-700 mb-2">Servicii și costuri</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              {listaServicii.map((s) => {
                const sel = form.servicii.find((x) => x.id === s.id);
                return (
                  <div key={s.id} className={`flex items-center justify-between border p-2 rounded-lg ${sel ? "bg-indigo-50 border-indigo-400" : "hover:bg-gray-50"}`}>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" checked={!!sel} onChange={() => toggleServiciu(s)} />
                      {s.nume}
                    </label>
                    {sel ? (
                      <input
                        type="number"
                        value={sel.pret}
                        onChange={(e) => updatePret(s.id, e.target.value)}
                        className="w-24 border rounded-md text-right p-1"
                      />
                    ) : (
                      <span className="text-gray-600 text-sm">{s.pret} lei</span>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="text-right text-xl font-semibold text-indigo-700 mb-3">
              Total: {form.total} lei
            </div>

            <button
              onClick={handleSave}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              💾 Salvează proiect
            </button>
          </div>
        )}

        {/* Lista proiecte */}
        <div className="bg-white shadow-md rounded-xl p-6">
          <h2 className="text-xl font-semibold text-indigo-700 mb-4">📋 Lista proiecte</h2>
          {proiecte.length === 0 ? (
            <p className="text-gray-500">Nu există proiecte salvate.</p>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-left bg-indigo-50">
                  <th className="p-2 border">Client</th>
                  <th className="p-2 border">Titlu proiect</th>
                  <th className="p-2 border">Amplasament</th>
                  <th className="p-2 border">Responsabil</th>
                  <th className="p-2 border text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {proiecte.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="p-2 border">{p.nume_client}</td>
                    <td className="p-2 border">{p.titlu_proiect}</td>
                    <td className="p-2 border">{p.amplasament}</td>
                    <td className="p-2 border">{p.responsabil}</td>
                    <td className="p-2 border text-center">
                      <span className="bg-yellow-200 text-yellow-800 px-3 py-1 rounded-full text-sm">
                        {p.stare}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Istoric */}
        <div className="bg-white shadow-md rounded-xl p-6 mt-6">
          <h2 className="text-lg font-semibold text-indigo-600 mb-2">🕓 Istoric acțiuni</h2>
          {istoric.length === 0 ? (
            <p className="text-gray-500">Nicio acțiune recentă.</p>
          ) : (
            <ul className="space-y-1 text-sm text-gray-700">
              {istoric.map((i, idx) => (
                <li key={idx}>
                  <strong>{i.data}</strong> — {i.actiune}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Proiecte;
