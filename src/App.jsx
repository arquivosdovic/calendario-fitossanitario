import React, { useState, useMemo } from "react";

const PLANTS = [
  "Hortelã",
  "Alecrim",
  "Tomilho",
  "Manjericão", // colocado entre Tomilho e Pimenta
  "Pimenta",
  "Lírio Asiático",
  "Lírio da Paz",
  "Mini Phalaenopsis",
  "Antúrio",
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
      "Manjericão": "não recomendado",
      "Pimenta": "seguro, enxágue opcional",
      "Lírio Asiático": "cuidado – enxaguar após 30–60 min",
      "Lírio da Paz": "cuidado – enxaguar após 30–60 min",
      "Mini Phalaenopsis": "não recomendado",
      "Antúrio": "cuidado – enxaguar após 30–60 min",
    },
    receita: `- 70 ml de álcool 70%
- 1 litro de água
- 1 colher de chá de sabão neutro
Borrife diretamente sobre os insetos. Teste antes em uma folha. Repetir a cada 3–4 dias.`
  },
  {
    id: "bicarbonato",
    nome: "Bicarbonato",
    plantas: ["Hortelã", "Tomilho", "Alecrim", "Pimenta", "Lírio Asiático", "Manjericão"],
    frequenciaDias: 14,
    incompativeis: ["leite", "enxofre"],
    controla: ["Oídio", "Míldio", "Fungos foliares"],
    tipo: "Preventiva",
    seguranca: {
      "Hortelã": "seguro, enxágue opcional",
      "Tomilho": "seguro, enxágue opcional",
      "Alecrim": "seguro, enxágue opcional",
      "Manjericão": "seguro, enxágue opcional",
      "Pimenta": "seguro, enxágue opcional",
      "Lírio Asiático": "cuidado, enxágue opcional",
      "Lírio da Paz": "não recomendado",
      "Mini Phalaenopsis": "não recomendado",
      "Antúrio": "não recomendado",
    },
    receita: `- 50 ml de água
- 1 pitada de bicarbonato de sódio
- 1 gotinha de óleo vegetal
- 1 gotinha de detergente neutro
Borrife sobre folhas afetadas, 2x por semana. Agitar antes de usar.`
  },
  {
    id: "leite",
    nome: "Leite",
    plantas: ["Hortelã", "Tomilho", "Alecrim", "Pimenta", "Lírio Asiático", "Manjericão"],
    frequenciaDias: 14,
    incompativeis: ["bicarbonato", "enxofre"],
    controla: ["Oídio", "Fungos foliares"],
    tipo: "Preventiva / Curativa leve",
    seguranca: {
      "Hortelã": "seguro, enxágue opcional",
      "Tomilho": "seguro, enxágue opcional",
      "Alecrim": "seguro, enxágue opcional",
      "Manjericão": "seguro, enxágue opcional",
      "Pimenta": "seguro, enxágue opcional",
      "Lírio Asiático": "cuidado, enxágue opcional",
      "Lírio da Paz": "cuidado, enxágue opcional",
      "Mini Phalaenopsis": "não recomendado",
      "Antúrio": "cuidado, enxágue opcional",
    },
    receita: `- 1 parte de leite
- 2 partes de água
Borrife 2x por semana sobre folhas afetadas, principalmente em oídio.`
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
      "Manjericão": "não recomendado",
      "Pimenta": "seguro, aplicar no fim do dia",
      "Lírio Asiático": "não recomendado",
      "Lírio da Paz": "não recomendado",
      "Mini Phalaenopsis": "não recomendado",
      "Antúrio": "não recomendado",
    },
    receita: `- 1/8 colher de chá de enxofre
- 250 ml de água
Aplicar 1x/semana em ataques ativos. Prevenção a cada 10–14 dias.`
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
      "Tomilho": "seguro, enxágue opcional",
      "Alecrim": "seguro, enxágue opcional",
      "Manjericão": "não recomendado",
      "Pimenta": "seguro, enxágue opcional",
      "Lírio Asiático": "não recomendado",
      "Lírio da Paz": "não recomendado",
      "Mini Phalaenopsis": "não recomendado",
      "Antúrio": "não recomendado",
    },
    receita: `- 1 dente de alho pequeno
- 50 ml de água
Deixar descansar 2–3h, coar e borrifar. Repetir 1x/semana.`
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
      "Manjericão": "seguro, aplicar à tarde, sem enxágue",
      "Pimenta": "seguro, aplicar à tarde, sem enxágue",
      "Lírio Asiático": "seguro, aplicar à tarde, sem enxágue",
      "Lírio da Paz": "seguro, aplicar à tarde, sem enxágue",
      "Mini Phalaenopsis": "seguro, aplicar à tarde, sem enxágue",
      "Antúrio": "seguro, aplicar à tarde, sem enxágue",
    },
    receita: `- 1 colher de sopa de óleo de neem
- 1 litro de água morna
- 1/2 colher de chá de detergente neutro
Borrife todas as partes da planta, repetir 1x/semana por 3–4 semanas.`
  },
];

function monthInfo(year, monthIndex) {
  const first = new Date(year, monthIndex, 1);
  const last = new Date(year, monthIndex + 1, 0);
  return { firstDayWeek: first.getDay(), daysInMonth: last.getDate() };
}

function isOnlyCurative(prod) {
  const t = prod.tipo.toLowerCase();
  return t.includes("curativa") && !t.includes("preventiva") && !t.includes("preventiva e");
}

function isDisease(pest) {
  const diseases = ["Oídio", "Míldio", "Fungos foliares"];
  return diseases.includes(pest);
}

function generateSchedule({ year, monthIndex, selections }) {
  const { daysInMonth } = monthInfo(year, monthIndex);
  const perPlantNeeded = {};

  for (const plant of Object.keys(selections)) {
    const pests = selections[plant].pests || [];
    const needed = new Set();

    for (const pest of pests) {
      for (const prod of PRODUCTS) {
        if (!prod.plantas.includes(plant)) continue;
        if (!prod.controla.includes(pest)) continue;
        if (isOnlyCurative(prod) && !isDisease(pest)) continue;
        needed.add(prod.id);
      }
    }
    perPlantNeeded[plant] = Array.from(needed);
  }

  const scheduleByPlant = {};

  for (const plant of Object.keys(selections)) {
    const needed = perPlantNeeded[plant];
    scheduleByPlant[plant] = [];
    const placed = [];

    for (const pid of needed) {
      const prod = PRODUCTS.find((p) => p.id === pid);
      if (!prod) continue;

      let day = 1;
      const incompatIds = prod.incompativeis || [];
      const minSeparation = 3;

      while (day <= daysInMonth) {
        const conflictSameDay = placed.some(
          (pl) =>
            pl.day === day &&
            (incompatIds.includes(pl.id) ||
              PRODUCTS.find((p) => p.id === pl.id).incompativeis.includes(prod.id))
        );
        const conflictClose = placed.some((pl) => {
          const otherProd = PRODUCTS.find((p) => p.id === pl.id);
          const areIncompat =
            incompatIds.includes(pl.id) || (otherProd && otherProd.incompativeis.includes(prod.id));
          if (!areIncompat) return false;
          return Math.abs(pl.day - day) < minSeparation;
        });

        if (!conflictSameDay && !conflictClose) break;
        day++;
      }

      if (day > daysInMonth) {
        continue;
      }

      for (let d = day; d <= daysInMonth; d += prod.frequenciaDias) {
        const conflictSameDay = placed.some(
          (pl) =>
            pl.day === d &&
            (prod.incompativeis.includes(pl.id) ||
              PRODUCTS.find((p) => p.id === pl.id).incompativeis.includes(prod.id))
        );
        const conflictClose = placed.some((pl) => {
          const otherProd = PRODUCTS.find((p) => p.id === pl.id);
          const areIncompat =
            prod.incompativeis.includes(pl.id) || (otherProd && otherProd.incompativeis.includes(prod.id));
          if (!areIncompat) return false;
          return Math.abs(pl.day - d) < 3;
        });
        if (conflictSameDay || conflictClose) continue;
        placed.push({ day: d, id: pid });
      }
    }

    placed.sort((a, b) => a.day - b.day);
    scheduleByPlant[plant] = placed;
  }

  const calendar = {};
  for (let d = 1; d <= daysInMonth; d++) {
    calendar[d] = {};
    for (const p of PLANTS) calendar[d][p] = [];
  }

  for (const plant of Object.keys(scheduleByPlant)) {
    for (const item of scheduleByPlant[plant]) {
      const prod = PRODUCTS.find((p) => p.id === item.id);
      if (!prod) continue;
      calendar[item.day][plant].push(prod.nome + (prod.tipo ? ` (${prod.tipo})` : ""));
    }
  }

  return { calendar, perPlantNeeded };
}

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export default function FitossanitarioApp() {
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
      const pests = enabled ? prev[plant].pests : []; // limpa pragas se desmarcar
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

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* … calendário e seleção de plantas permanecem iguais … */}

      <div className="mt-6 text-sm">
        <h3 className="font-medium">Soluções detalhadas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2 text-sm">
          {PRODUCTS.map((p) => (
            <div key={p.id} className="border rounded p-2">
              <strong>{p.nome}</strong>
              <div className="text-xs">Tipo: {p.tipo}</div>
              <div className="text-xs">Freq.: a cada {p.frequenciaDias} dias</div>
              <div className="text-xs">Controla: {p.controla.join(", ")}</div>
              <div className="text-xs mt-1">Segurança por planta:</div>
              <ul className="list-disc pl-5 text-xs">
                {Object.entries(p.seguranca).map(([pl, info]) => (
                  <li key={pl}><strong>{pl}:</strong> {info}</li>
                ))}
              </ul>
              <div className="text-xs mt-1">Receita / preparo:</div>
              <pre className="text-xs bg-gray-50 p-1 rounded">{p.receita}</pre>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
