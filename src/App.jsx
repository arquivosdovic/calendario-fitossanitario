import React, { useState, useMemo } from "react";

// Calendário Fitossanitário - componente React (single-file)
// Usa Tailwind para estilo

const PLANTS = [
  "Hortelã",
  "Alecrim",
  "Tomilho",
  "Pimenta",
  "Lírio Asiático",
  "Lírio da Paz",
  "Mini Phalaenopsis",
  "Antúrio",
  "Manjericão",
];

const PESTS = [
  "Pulgões",
  "Cochonilhas",
  "Ácaros",
  "Oídio",
  "Míldio",
  "Fungos foliares",
  "Moscas-brancas",
];

const PRODUCTS = [
  {
    id: "sabao",
    nome: "Sabão",
    plantas: ["Hortelã", "Alecrim", "Tomilho", "Pimenta", "Lírio Asiático", "Lírio da Paz", "Antúrio"],
    frequenciaDias: 10,
    incompativeis: ["neem"],
    controla: ["Pulgões", "Cochonilhas", "Ácaros"],
    tipo: "Curativa",
    seguranca: {
      "Hortelã": "cuidado – enxaguar após 30–60 min",
      "Alecrim": "seguro, enxágue opcional",
      "Tomilho": "seguro, enxágue opcional",
      "Pimenta": "seguro, enxágue opcional",
      "Lírio Asiático": "cuidado – enxaguar após 30–60 min",
      "Lírio da Paz": "cuidado – enxaguar após 30–60 min",
      "Mini Phalaenopsis": "não recomendado",
      "Antúrio": "cuidado – enxaguar após 30–60 min",
      "Manjericão": "não recomendado",
    },
  },
  {
    id: "bicarbonato",
    nome: "Bicarbonato",
    plantas: ["Hortelã", "Tomilho", "Alecrim", "Pimenta", "Lírio Asiático"],
    frequenciaDias: 14,
    incompativeis: ["leite", "enxofre"],
    controla: ["Oídio", "Míldio", "Fungos foliares"],
    tipo: "Preventiva",
    seguranca: {
      "Hortelã": "seguro, enxágue opcional",
      "Tomilho": "seguro, enxágue opcional",
      "Alecrim": "seguro, enxágue opcional",
      "Pimenta": "seguro, enxágue opcional",
      "Lírio Asiático": "cuidado, enxágue opcional",
      "Lírio da Paz": "não recomendado",
      "Mini Phalaenopsis": "não recomendado",
      "Antúrio": "não recomendado",
      "Manjericão": "seguro, enxágue opcional",
    },
  },
  {
    id: "leite",
    nome: "Leite",
    plantas: ["Hortelã", "Tomilho", "Alecrim", "Pimenta", "Lírio Asiático"],
    frequenciaDias: 14,
    incompativeis: ["bicarbonato", "enxofre"],
    controla: ["Oídio", "Fungos foliares"],
    tipo: "Preventiva / Curativa leve",
    seguranca: {
      "Hortelã": "seguro, enxágue opcional",
      "Tomilho": "seguro, enxágue opcional",
      "Alecrim": "seguro, enxágue opcional",
      "Pimenta": "seguro, enxágue opcional",
      "Lírio Asiático": "cuidado, enxágue opcional",
      "Lírio da Paz": "cuidado, enxágue opcional",
      "Mini Phalaenopsis": "não recomendado",
      "Antúrio": "cuidado, enxágue opcional",
      "Manjericão": "seguro, enxágue opcional",
    },
  },
  {
    id: "enxofre",
    nome: "Enxofre",
    plantas: ["Alecrim", "Hortelã", "Tomilho", "Pimenta"],
    frequenciaDias: 14,
    incompativeis: ["neem", "sabao", "leite"],
    controla: ["Oídio", "Fungos foliares", "Ácaros"],
    tipo: "Preventiva e Curativa",
    seguranca: {
      "Hortelã": "seguro em folhas adultas, aplicar no fim do dia",
      "Alecrim": "seguro em folhas adultas, aplicar no fim do dia",
      "Tomilho": "seguro em folhas adultas, aplicar no fim do dia",
      "Pimenta": "seguro, aplicar no fim do dia",
      "Lírio Asiático": "não recomendado",
      "Lírio da Paz": "não recomendado",
      "Mini Phalaenopsis": "não recomendado",
      "Antúrio": "não recomendado",
      "Manjericão": "não recomendado",
    },
  },
  {
    id: "alho",
    nome: "Alho",
    plantas: ["Hortelã", "Alecrim", "Tomilho", "Pimenta"],
    frequenciaDias: 14,
    incompativeis: ["neem", "enxofre"],
    controla: ["Pulgões", "Cochonilhas", "Moscas-brancas"],
    tipo: "Curativa leve",
    seguranca: {
      "Hortelã": "seguro, enxágue opcional",
      "Alecrim": "seguro, enxágue opcional",
      "Tomilho": "seguro, enxágue opcional",
      "Pimenta": "seguro, enxágue opcional",
      "Lírio Asiático": "não recomendado",
      "Lírio da Paz": "não recomendado",
      "Mini Phalaenopsis": "não recomendado",
      "Antúrio": "não recomendado",
      "Manjericão": "não recomendado",
    },
  },
  {
    id: "neem",
    nome: "Neem (Óleo de Nim)",
    plantas: ["Hortelã", "Alecrim", "Tomilho", "Pimenta", "Antúrio", "Lírio Asiático", "Manjericão"],
    frequenciaDias: 7,
    incompativeis: ["enxofre", "sabao", "alho"],
    controla: ["Pulgões", "Cochonilhas", "Ácaros", "Moscas-brancas"],
    tipo: "Preventiva e Curativa",
    seguranca: {
      "Hortelã": "seguro, aplicar à tarde, sem enxágue",
      "Alecrim": "seguro, aplicar à tarde, sem enxágue",
      "Tomilho": "seguro, aplicar à tarde, sem enxágue",
      "Pimenta": "seguro, aplicar à tarde, sem enxágue",
      "Lírio Asiático": "seguro, aplicar à tarde, sem enxágue",
      "Lírio da Paz": "seguro, aplicar à tarde, sem enxágue",
      "Mini Phalaenopsis": "seguro, aplicar à tarde, sem enxágue",
      "Antúrio": "seguro, aplicar à tarde, sem enxágue",
      "Manjericão": "seguro, aplicar à tarde, sem enxágue",
    },
  },
];

// Mantive todo o restante do código existente, apenas ajustando togglePlant e togglePest:

function FitossanitarioApp() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [monthIndex, setMonthIndex] = useState(today.getMonth());

  const [selections, setSelections] = useState(() => {
    const obj = {};
    PLANTS.forEach((p) => {
      obj[p] = { enabled: false, pests: [] };
    });
    return obj;
  });

  function togglePlant(plant) {
    setSelections((prev) => {
      const enabled = !prev[plant].enabled;
      // Se desabilitar, limpar pragas
      const pests = enabled ? prev[plant].pests : [];
      return { ...prev, [plant]: { enabled, pests } };
    });
  }

  function togglePest(plant, pest) {
    setSelections((prev) => {
      const list = prev[plant].pests || [];
      const has = list.includes(pest);
      const next = has ? list.filter((x) => x !== pest) : [...list, pest];
      return { ...prev, [plant]: { ...prev[plant], pests: next, enabled: true } };
    });
  }

  const { calendar, perPlantNeeded } = useMemo(() => generateSchedule({ year, monthIndex, selections }), [year, monthIndex, selections]);
  const { daysInMonth } = monthInfo(year, monthIndex);

  // ... resto do código de renderização permanece igual, mantendo visual e funcionalidade
}

export default FitossanitarioApp;
