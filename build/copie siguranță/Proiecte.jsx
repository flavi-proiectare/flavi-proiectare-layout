import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { v4 as uuidv4 } from "uuid";

const Proiecte = () => {
  const [proiecte, setProiecte] = useState([]);
  const [listaResponsabili, setListaResponsabili] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    nume_client: "",
    beneficiar: "",
    domiciliu: "",
    amplasament: "",
    titlu_proiect: "",
    data_predare: "",
    responsabil: "",
    servicii: [],
    total: 0,
  });

  // 🔹 Lista completă servicii + avize + studii
  const listaServicii = [
    { id: "cu", nume: "Certificat de urbanism", pret: 500 },
    { id: "datd1", nume: "D.A.T.D. (1 construcție)", pret: 1000 },
    { id: "datd2", nume: "D.A.T.D. (2 construcții)", pret: 1500 },
    { id: "datd3", nume: "D.A.T.D. (>2 construcții)", pret: 2500 },
    { id: "datc1", nume: "D.A.T.C. - Parter", pret: 2500 },
    { id: "datc2", nume: "D.A.T.C. - Parter + Etaj", pret: 3500 },
    { id: "pt1", nume: "Proiect tehnic - Parter", pret: 5000 },
    { id: "pt2", nume: "Proiect tehnic - Parter + Etaj", pret: 8000 },
    { id: "expertiza", nume: "Expertiză tehnică", pret: 2500 },
    { id: "releveu", nume: "Releveu construcție", pret: 1000 },
    { id: "memoriu", nume: "Memoriu tehnic", pret: 500 },
    { id: "memoriu_det", nume: "Memoriu tehnic detaliat", pret: 600 },
    { id: "aviz_ocpi", nume: "Plan încadrare OCPI", pret: 140 },
    { id: "aviz_ee", nume: "Aviz energie electrică", pret: 215 },
    { id: "aviz_salub", nume: "Aviz salubritate", pret: 205 },
    { id: "aviz_mediu1", nume: "Aviz Mediu - Etapa 1", pret: 200 },
    { id: "aviz_mediu2", nume: "Aviz Mediu - Etapa 2", pret: 700 },
    { id: "aviz_dsp", nume: "Aviz D.S.P.", pret: 500 },
    { id: "aviz_dsv", nume: "Aviz D.S.V.", pret: 100 },
    { id: "aviz_osp", nume: "Aviz O.S.P.A.", pret: 100 },
    { id: "aviz_cultura", nume: "Documentație cultură", pret: 100 },
    { id: "st_geoteh1", nume: "Studiu geotehnic - Parter", pret: 600 },
    { id: "st_geoteh2", nume: "Studiu geotehnic - Parter + Etaj", pret: 700 },
    { id: "st_energetic", nume: "Studiu energetic", pret: 600 },
    { id: "st_nzeb", nume: "Studiu consum energetic (NZEB)", pret: 600 },
  ];

  // 🔹 Obține responsabili
  useEffect(() => {
    const fetchResponsabili = async () => {
      const { data, error } = await supabase.from("utilizatori").select("nume");
      if (!error && data) setListaResponsabili(data.map((r) => r.nume));
    };
    fetchResponsabili();
    fetchProiecte();
  }, []);

  // 🔹 Obține lista proiectelor
  const fetchProiecte = async () => {
    const { data, error } = await supabase.from("clienti").select("*").order("data_creare", { ascending: false });
    if (!error && data) setProiecte(data);
  };

  // 🔹 Selectare servicii
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

  const updatePret = (id, pret) => {
    const updated = form.servicii.map((s) => (s.id === id ? { ...s, pret: parseFloat(pret) || 0 } : s));
    const total = updated.reduce((sum, s) => sum + s.pret, 0);
    setForm({ ...form, servicii: updated, total });
  };

  // 🔹 Salvare proiect complet
  const handleSave = async () => {
    const clientId = uuidv4();

    const proiect = {
      id: clientId,
      nume_client: form.nume_client,
      beneficiar: form.beneficiar,
      domiciliu: form.domiciliu,
      amplasament: form.amplasament,
      titlu_proiect: form.titlu_proiect,
      data_predare: form.data_predare || null,
      responsabil: form.responsabil,
      servicii: form.servicii,
      total: form.total,
      stare: "neînceput",
      culoare_proiect: "#4F46E5",
    };

    const { error: err1 } = await supabase.from("clienti").insert([proiect]);
    if (err1) {
      alert("❌ Eroare la salvare client!");
      console.error(err1);
      return;
    }

    // 🔹 taskuri asociate
    const taskuri = form.servicii.map((s) => ({
      id: uuidv4(),
      client_id: clientId,
      nume_task: s.nume,
      responsabil: form.responsabil,
      termen: form.data_predare || null,
      status: "neînceput",
    }));
    await supabase.from("taskuri").insert(taskuri);

    // 🔹 istoric
    await supabase.from("istoric").insert([
      { client_id: clientId, actiune: `Proiect creat: ${form.titlu_proiect}`, tip: "actiune" },
    ]);

    alert("✅ Proiect salvat cu succes!");
    setShowForm(false);
    fetchProiecte();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-blue-200 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-indigo-800">📁 Proiecte / Clienți</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-md"
          >
            ➕ Adaugă proiect nou
          </button>
        </div>

        {showForm && (
          <div className="bg-white shadow-lg rounded-xl p-6 mb-8 overflow-y-auto max-h-[80vh]">
            <h2 className="text-2xl font-semibold text-indigo-600 mb-4">Detalii proiect</h2>

            {/* FORM */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <input name="nume_client" placeholder="Nume client" value={form.nume_client} onChange={handleChange} className="p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400" />
              <input name="beneficiar" placeholder="Nume beneficiar" value={form.beneficiar} onChange={handleChange} className="p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400" />
              <input name="domiciliu" placeholder="Domiciliu beneficiar" value={form.domiciliu} onChange={handleChange} className="p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400" />
              <input name="amplasament" placeholder="Amplasament" value={form.amplasament} onChange={handleChange} className="p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400" />
              <input name="titlu_proiect" placeholder="Titlu proiect" value={form.titlu_proiect} onChange={handleChange} className="p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400" />
              <input type="date" name="data_predare" value={form.data_predare} onChange={handleChange} className="p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400" />
              <select name="responsabil" value={form.responsabil} onChange={handleChange} className="p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 bg-white">
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
                      <input type="number" value={sel.pret} onChange={(e) => updatePret(s.id, e.target.value)} className="w-24 border rounded-md text-right p-1" />
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

            <button onClick={handleSave} className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
              💾 Salvează proiect
            </button>
          </div>
        )}

        {/* LISTA PROIECTE */}
        <div className="bg-white shadow-md rounded-xl p-6">
          <h2 className="text-xl font-semibold text-indigo-700 mb-4">📋 Lista proiecte</h2>
          {proiecte.length === 0 ? (
            <p className="text-gray-500">Nu există proiecte salvate.</p>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-left bg-indigo-50">
                  <th className="p-2 border">Client</th>
                  <th className="p-2 border">Titlu</th>
                  <th className="p-2 border">Amplasament</th>
                  <th className="p-2 border">Responsabil</th>
                  <th className="p-2 border text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {proiecte.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="p-2 border">{p.nume_client}</td>
                    <td
                      className="p-2 border text-indigo-600 underline cursor-pointer"
                      onClick={() => (window.location.href = `/client/${p.id}`)}
                    >
                      {p.titlu_proiect}
                    </td>
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
      </div>
    </div>
  );
};

export default Proiecte;
