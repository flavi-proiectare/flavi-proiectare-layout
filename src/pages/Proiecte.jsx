import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { v4 as uuidv4 } from "uuid";

const Proiecte = () => {
  const [form, setForm] = useState({
    nume_client: "",
    beneficiar: "",
    domiciliu: "",
    amplasament: "",
    titlu_proiect: "",
    data_predare: "",
    responsabil: "",
    suprafata: "",
  });

  const [listaResponsabili, setListaResponsabili] = useState([]);
  const [serviciiSelectate, setServiciiSelectate] = useState([]);
  const [total, setTotal] = useState(0);

  // Obținem lista colegilor din Supabase
  useEffect(() => {
    const fetchResponsabili = async () => {
      const { data, error } = await supabase.from("utilizatori").select("nume");
      if (!error && data) setListaResponsabili(data.map((r) => r.nume));
    };
    fetchResponsabili();
  }, []);

  // Serviciile împărțite pe categorii
  const categoriiServicii = {
    "🏗️ Proiectare": [
      { id: "cu", nume: "Certificat de urbanism", pret: 500 },
      { id: "datd1", nume: "Documentație D.A.T.D. (1 construcție)", pret: 1000 },
      { id: "datd2", nume: "Documentație D.A.T.D. (2 construcții)", pret: 1500 },
      { id: "datc_parter", nume: "Documentație D.A.T.C. - Parter", pret: 2500 },
      { id: "datc_etaj", nume: "Documentație D.A.T.C. - Parter + Etaj", pret: 3500 },
      { id: "pt_parter", nume: "Proiect Tehnic - Parter", pret: 5000 },
      { id: "pt_etaj", nume: "Proiect Tehnic - Parter + Etaj", pret: 8000 },
    ],
    "🧱 Expertize și relevee": [
      { id: "expertiza", nume: "Expertiză tehnică", pret: 2500 },
      { id: "releveu1", nume: "Releveu prima construcție", pret: 1000 },
      { id: "releveu2", nume: "Releveu două construcții", pret: 1500 },
      { id: "memoriu", nume: "Memoriu tehnic", pret: 500 },
      { id: "memoriu_det", nume: "Memoriu tehnic detaliat", pret: 600 },
    ],
    "🧾 Avize": [
      { id: "aviz_ocpi", nume: "Plan încadrare O.C.P.I.", pret: 140 },
      { id: "aviz_electric", nume: "Aviz energie electrică", pret: 215 },
      { id: "aviz_salubritate", nume: "Aviz salubritate ADI ECO", pret: 205 },
      { id: "aviz_mediu1", nume: "Aviz Mediu Etapa 1", pret: 200 },
      { id: "aviz_mediu2", nume: "Aviz Mediu Etapa 2", pret: 700 },
      { id: "aviz_dsp", nume: "Aviz DSP", pret: 500 },
      { id: "aviz_oar", nume: "Dovadă OAR", pret: 300 },
    ],
    "🧪 Studii": [
      { id: "geo_parter", nume: "Studiu geotehnic - Parter", pret: 600 },
      { id: "geo_etaj", nume: "Studiu geotehnic - P+E", pret: 700 },
      { id: "st_energetic", nume: "Studiu energetic", pret: 600 },
      { id: "st_nzeb", nume: "Studiu NZEB", pret: 600 },
    ],
  };

  // Actualizare total dinamic
  useEffect(() => {
    const suma = serviciiSelectate.reduce((acc, s) => acc + parseFloat(s.pret || 0), 0);
    setTotal(suma);
  }, [serviciiSelectate]);

  // Selectare / deselectare servicii
  const toggleServiciu = (serviciu) => {
    const exista = serviciiSelectate.find((s) => s.id === serviciu.id);
    if (exista) {
      setServiciiSelectate(serviciiSelectate.filter((s) => s.id !== serviciu.id));
    } else {
      setServiciiSelectate([...serviciiSelectate, { ...serviciu }]);
    }
  };

  // Modificare manuală a costului
  const modificaPret = (id, pretNou) => {
    const updated = serviciiSelectate.map((s) =>
      s.id === id ? { ...s, pret: parseFloat(pretNou) || 0 } : s
    );
    setServiciiSelectate(updated);
  };

  // Salvare + generare ofertă
  const handleSave = async () => {
    const proiect = {
      id: uuidv4(),
      ...form,
      servicii: serviciiSelectate,
      total,
      data_creare: new Date().toISOString(),
    };

    const { error } = await supabase.from("clienti").insert([proiect]);
    if (error) {
      alert("Eroare la salvare ofertă!");
      console.error(error);
    } else {
      alert("✅ Ofertă salvată cu succes!");
    }
  };

  // handle inputuri generale
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* STÂNGA – DATE CLIENT */}
        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200 flex flex-col gap-4">
          <h2 className="text-2xl font-semibold text-indigo-600">📋 Date Proiect</h2>

          <input
            name="nume_client"
            placeholder="Nume client"
            value={form.nume_client}
            onChange={handleChange}
            className="p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
          <input
            name="beneficiar"
            placeholder="Nume beneficiar"
            value={form.beneficiar}
            onChange={handleChange}
            className="p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
          <input
            name="domiciliu"
            placeholder="Domiciliu beneficiar"
            value={form.domiciliu}
            onChange={handleChange}
            className="p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
          <input
            name="amplasament"
            placeholder="Amplasament beneficiar"
            value={form.amplasament}
            onChange={handleChange}
            className="p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
          <input
            name="titlu_proiect"
            placeholder="Titlu proiect"
            value={form.titlu_proiect}
            onChange={handleChange}
            className="p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
          />

          <div className="grid grid-cols-2 gap-3">
            <input
              name="suprafata"
              placeholder="Suprafață (mp)"
              value={form.suprafata}
              onChange={handleChange}
              className="p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="date"
              name="data_predare"
              value={form.data_predare}
              onChange={handleChange}
              className="p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <select
            name="responsabil"
            value={form.responsabil}
            onChange={handleChange}
            className="p-3 border rounded-lg bg-white focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Alege responsabil</option>
            {listaResponsabili.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        {/* DREAPTA – SERVICII */}
        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200 overflow-y-auto max-h-[80vh] flex flex-col">
          <h2 className="text-2xl font-semibold text-indigo-600 mb-4">🧾 Servicii & Costuri</h2>

          <div className="space-y-6 flex-1">
            {Object.entries(categoriiServicii).map(([categorie, lista]) => (
              <div key={categorie}>
                <h3 className="text-lg font-semibold text-gray-700 mb-2 border-b border-gray-200 pb-1">
                  {categorie}
                </h3>
                <div className="space-y-2">
                  {lista.map((serviciu) => {
                    const esteSelectat = serviciiSelectate.find((s) => s.id === serviciu.id);
                    return (
                      <div
                        key={serviciu.id}
                        className={`flex items-center justify-between border rounded-lg px-3 py-2 transition ${
                          esteSelectat ? "bg-indigo-50 border-indigo-400" : "hover:bg-gray-50"
                        }`}
                      >
                        <label className="flex items-center gap-2 flex-1 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={!!esteSelectat}
                            onChange={() => toggleServiciu(serviciu)}
                          />
                          <span className="text-gray-800">{serviciu.nume}</span>
                        </label>

                        {esteSelectat && (
                          <input
                            type="number"
                            className="w-24 p-1 border rounded-md text-right focus:ring-1 focus:ring-indigo-500"
                            value={esteSelectat.pret}
                            onChange={(e) => modificaPret(serviciu.id, e.target.value)}
                          />
                        )}
                        {!esteSelectat && (
                          <span className="text-gray-500 text-sm">{serviciu.pret} lei</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 border-t pt-4 flex flex-col items-end">
            <div className="text-lg font-semibold text-gray-700">
              Total: <span className="text-indigo-600 text-2xl">{total} lei</span>
            </div>

            <button
              onClick={handleSave}
              className="mt-4 px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow hover:bg-indigo-700 transition"
            >
              📄 Generează ofertă
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Proiecte;
