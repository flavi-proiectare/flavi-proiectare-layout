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

  // 🔹 Culoare proiect (aleasă automat)
  useEffect(() => {
    const color = projectColors[Math.floor(Math.random() * projectColors.length)];
    setForm((prev) => ({ ...prev, culoare_proiect: color }));
  }, []);

  // 🔹 Obținem lista colegilor/responsabililor
  useEffect(() => {
    const fetchResponsabili = async () => {
      const { data, error } = await supabase.from("utilizatori").select("nume");
      if (!error && data) setListaResponsabili(data.map((r) => r.nume));
    };
    fetchResponsabili();
  }, []);

  // 🔹 Lista serviciilor disponibile
  const listaServicii = [
    { id: "cu", nume: "Certificat de urbanism", pret: 800 },
    { id: "dtac", nume: "Documentație tehnică (DTAC)", pret: 2500 },
    { id: "dtad", nume: "Documentație tehnică (DTAD)", pret: 1500 },
    { id: "avize", nume: "Obținere avize", pret: 1200 },
    { id: "expertiza", nume: "Expertizare tehnică", pret: 1000 },
    { id: "releeve", nume: "Releeve", pret: 600 },
  ];

  // 🔹 Selectare / deselectare servicii
  const toggleServiciu = (serviciu) => {
    let updated;
    if (form.servicii.includes(serviciu.id)) {
      updated = form.servicii.filter((s) => s !== serviciu.id);
    } else {
      updated = [...form.servicii, serviciu.id];
    }

    const total = updated.reduce((sum, id) => {
      const
