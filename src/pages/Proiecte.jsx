import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { v4 as uuidv4 } from "uuid";

const projectColors = ["#FF4C4C", "#FFA500", "#4CAF50", "#3F51B5", "#9C27B0", "#009688"];

const Proiecte = () => {
  const [form, setForm] = useState({
    nume_client: "",
    beneficiar: "",
    domiciliu: "",
    amplasament: "",
    titlu_proiect: "",
    data_predare: "",
    responsabil: "",
    stare: "neînceput",
    culoare_proiect: "",
    servicii: [],
    cost_total: 0,
    avans: 0,
    rest_plata: 0,
  });

  const [taskuri, setTaskuri] = useState([]);
  const [listaResponsabili, setListaResponsabili] = useState([]);

  // 🔹 Culoare proiect automată
  useEffect(() => {
    const color = projectColors[Math.floor(Math.random() * projectColors.length)];
    setForm((prev) => ({ ...prev, culoare_proiect: color }));
  }, []);

  // 🔹 Obține lista responsabililor
  useEffect(() => {
    const fetchResponsabili = async () => {
      const { data, error } = await supabase.from("utilizatori").select("nume");
      if (!error && data) setListaResponsabili(data.map((r) => r.nume));
    };
    fetchResponsabili();
  }, []);

  const listaServicii = [
    { id: "cu", nume: "Certificat de urbanism", pret: 800 },
    { id: "dtac", nume: "Documentație tehnică (DTAC)", pret: 2500 },
    { id: "dtad", nume: "Documentație tehnică (DTAD)", pret: 1500 },
    { id: "avize", nume: "Obținere avize", pret: 1200 },
    { id: "expertiza", nume: "Expertizare tehnică", pret: 1000 },
    { id: "releeve", nume: "Releeve", pret: 600 },
  ];

  const toggleServiciu = (serviciu) => {
    let updated;
    if (form.servicii.includes(serviciu.id)) {
      updated = form.servicii.filter((s) => s !== serviciu.id);
    } else {
      updated = [...form.servicii, serviciu.id];
    }

    const total = updated.reduce((sum, id) => {
      const s = listaServicii.find((x) => x.id === id);
      return sum + (s?.pret || 0);
    }, 0);

    setForm((prev) => ({
      ...prev,
      servicii: updated,
      cost_total: total,
      rest_plata: total - prev.avans,
    }));

    const generateTasks = updated.map((id) => ({
      id: uuidv4(),
      nume_task: listaServicii.find((x) => x.id === id)?.nume || "",
      status: "în lucru",
      termen: form.data_predare || "",
      culoare: form.culoare_proiect,
    }));
    setTaskuri(generateTasks);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newForm = { ...form, [name]: value };
    if (name === "avans") {
      newForm.rest_plata = newForm.cost_total - parseFloat(value || 0);
    }
    setForm(newForm);
  };

  const handleSave = async () => {
    const { data, error } = await supabase.from("clienti").insert([form]).select("id");
    if (error) {
      alert("Eroare la salvare client!");
      console.error(error);
      return;
    }
    const clientId = data[0]?.id;

    const tasksWithClient = taskuri.map((t) => ({ ...t, client_id: clientId }));
    const { error: taskErr } = await supabase.from("taskuri").insert(tasksWithClient);
    if (taskErr) console.error(taskErr);

    alert("Clientul și taskurile au fost salvate!");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div
        className="p-4 rounded-2xl shadow-md text-white mb-6"
        style={{ backgroundColor: form.culoare_proiect }}
      >
        <h1 className="text-2xl font-semibold">Proiect nou</h1>
        <div className="flex space-x-2 mt-2">
          <span
            onClick={() => setForm({ ...form, stare: "neînceput" })}
            className={`px-3 py-1 rounded-full cursor-pointer ${
              form.stare === "neînceput" ? "bg-red-600" : "bg-white/30"
            }`}
          >
            Neînceput
          </span>
          <span
            onClick={() => setForm({ ...form, stare: "în lucru" })}
            className={`px-3 py-1 rounded-full cursor-pointer ${
              form.stare === "în lucru" ? "bg-yellow-400" : "bg-white/30"
            }`}
          >
            În lucru
          </span>
          <span
            onClick={() => setForm({ ...form, stare: "finalizat" })}
            className={`px-3 py-1 rounded-full cursor-pointer ${
              form.stare === "finalizat" ? "bg-green-500" : "bg-white/30"
            }`}
          >
            Finalizat
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <input className="border p-2 rounded" name="nume_client" placeholder="Nume client"
          value={form.nume_client} onChange={handleChange} />
        <input className="border p-2 rounded" name="beneficiar" placeholder="Nume beneficiar"
          value={form.beneficiar} onChange={handleChange} />
        <input className="border p-2 rounded" name="domiciliu" placeholder="Domiciliu beneficiar"
          value={form.domiciliu} onChange={handleChange} />
        <input className="border p-2 rounded" name="amplasament" placeholder="Amplasament beneficiar"
          value={form.amplasament} onChange={handleChange} />
        <input className="border p-2 rounded" name="titlu_proiect" placeholder="Titlu proiect"
          value={form.titlu_proiect} onChange={handleChange} />
        <input type="date" className="border p-2 rounded" name="data_predare"
          value={form.data_predare} onChange={handleChange} />
        <select className="border p-2 rounded" name="responsabil"
          value={form.responsabil} onChange={handleChange}>
          <option value="">Alege responsabil</option>
          {listaResponsabili.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </div>

      <h2 className="text-xl font-semibold mb-2">Servicii oferite</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-6">
        {listaServicii.map((s) => (
          <label key={s.id} className="border rounded p-2 flex items-center space-x-2 bg-white hover:bg-gray-100">
            <input type="checkbox" checked={form.servicii.includes(s.id)} onChange={() => toggleServiciu(s)} />
            <span>{s.nume} ({s.pret} RON)</span>
          </label>
        ))}
      </div>

      <h2 className="text-xl font-semibold mb-2">Situație financiară</h2>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="border rounded p-3 bg-white">
          <p className="font-medium">Cost total</p>
          <p className="text-xl font-bold">{form.cost_total} RON</p>
        </div>
        <div className="border rounded p-3 bg-white">
          <p className="font-medium">Avans</p>
          <input type="number" className="border p-1 rounded w-full" name="avans"
            value={form.avans} onChange={handleChange} />
        </div>
        <div className="border rounded p-3 bg-white">
          <p className="font-medium">Rest de plată</p>
          <p className="text-xl font-bold text-red-600">{form.rest_plata} RON</p>
        </div>
      </div>

      <button
        onClick={handleSave}
        className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
      >
        Salvează proiectul și taskurile
      </button>
    </div>
  );
};

export default Proiecte;
