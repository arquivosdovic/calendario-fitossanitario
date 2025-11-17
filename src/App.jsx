import React, { useState, useMemo } from "react";

// Calendário Fitossanitário - componente React (single-file)
// Usa Tailwind para estilo

const PLANTS = [
  "Hortelã",
  "Alecrim",
  "Tomilho",
  "Manjericão",
  "Pimenta",
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
    plantas: ["Hortelã", "Alecrim", "Tomilho", "Pimenta"],
    frequenciaDias: 10,
    incompativeis: ["neem"],
    controla: ["Pulgões", "Cochonilhas", "Ácaros"],
    tipo: "Curativa",
    seguranca: {
      // segurança detalhada por planta
      "Hortelã": "Seguro com teste em 1 folha antes",
      "Alecrim": "Seguro",
      "Tomilho": "Seguro",
      "Pimenta": "Seguro",
    },
    enxague: true,
    tempoAcao: "1 hora",
  },
  {
    id: "bicarbonato",
    nome: "Bicarbonato",
    plantas: ["Hortelã", "Tomilho", "Alecrim", "Pimenta"],
    frequenciaDias: 14,
    incompativeis: ["leite", "enxofre"],
    controla: ["Oídio", "Míldio", "Fungos foliares"],
    tipo: "Preventiva",
    seguranca: {
      "Hortelã": "Seguro",
      "Alecrim": "Seguro",
      "Tomilho": "Seguro",
      "Pimenta": "Seguro",
    },
    enxague: false,
    tempoAcao: "Deixar até secar",
  },
  {
    id: "leite",
    nome: "Leite",
    plantas: ["Hortelã", "Tomilho", "Alecrim", "Pimenta"],
    frequenciaDias: 14,
    incompativeis: ["bicarbonato", "enxofre"],
    controla: ["Oídio", "Fungos foliares"],
    tipo: "Preventiva / Curativa leve",
    seguranca: {
      "Hortelã": "Seguro",
      "Alecrim": "Seguro",
      "Tomilho": "Seguro",
      "Pimenta": "Seguro",
    },
    enxague: false,
    tempoAcao: "Deixar até secar",
  },
  {
    id: "enxofre",
    nome: "Enxofre",
    plantas: ["Hortelã", "Alecrim", "Tomilho", "Pimenta"],
    frequenciaDias: 14,
    incompativeis: ["neem", "sabao", "leite"],
    controla: ["Oídio", "Fungos foliares", "Ácaros"],
    tipo: "Preventiva e Curativa",
    seguranca: {
      "Hortelã": "Seguro",
      "Alecrim": "Seguro",
      "Tomilho": "Seguro",
      "Pimenta": "Seguro",
    },
    enxague: false,
    tempoAcao: "Deixar até secar",
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
      "Hortelã": "Seguro",
      "Alecrim": "Seguro",
      "Tomilho": "Seguro",
      "Pimenta": "Seguro",
    },
    enxague: false,
    tempoAcao: "2–3 horas antes de aplicar",
  },
  {
    id: "neem",
    nome: "Neem (Óleo de Nim)",
    plantas: ["Hortelã", "Alecrim", "Tomilho", "Pimenta", "Mini Phalaenopsis", "Antúrio"],
    frequenciaDias: 7,
    incompativeis: ["enxofre", "sabao", "alho"],
    controla: ["Pulgões", "Cochonilhas", "Ácaros", "Moscas-brancas"],
    tipo: "Preventiva e Curativa",
    seguranca: {
      "Hortelã": "Seguro",
      "Alecrim": "Seguro",
      "Tomilho": "Seguro",
      "Pimenta": "Seguro",
      "Mini Phalaenopsis": "Cuidado — teste em 1 folha",
      "Antúrio": "Seguro com teste prévio",
    },
    enxague: true,
    tempoAcao: "1–2 horas",
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
      return { ...prev, [plant]: { ...prev[plant], enabled, pests: enabled ? prev[plant].pests : [] } };
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

  // 🖨️ Função de impressão
  function printTable() {
    const table = document.getElementById("fitos-table");
    if (!table) return;
    const newWin = window.open("", "_blank");
    if (!newWin) return alert("Não foi possível abrir a janela de impressão.");
    const monthLabel = new Date(year, monthIndex).toLocaleString("pt-BR", { month: "long", year: "numeric" });
    const genDate = new Date().toLocaleDateString("pt-BR");

    newWin.document.write(`
      <html>
      <head>
        <title>Calendário Fitossanitário - ${monthLabel}</title>
        <meta charset="utf-8" />
        <style>
          body { margin:20px; font-family:-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; color:#111; }
          h2{text-align:center;margin-bottom:12px;font-size:18px;}
          .meta{text-align:center;font-size:12px;color:#555;margin-bottom:8px;}
          table{border-collapse:collapse;width:100%;font-size:12px;}
          th,td{border:1px solid #ccc;padding:6px;vertical-align:top;text-align:left;}
          th{background:#f9f9f9;font-weight:600;}
          ul{margin:0;padding-left:18px;}
          footer{margin-top:12px;font-size:11px;color:#444;text-align:right;}
        </style>
      </head>
      <body>
        <h2>Calendário Fitossanitário — ${monthLabel}</h2>
        <div class="meta">Gerado em ${genDate}</div>
        ${table.outerHTML}
        <footer>Gerado por seu sistema</footer>
        <script>
          window.onload = function(){ window.print(); }
        </script>
      </body>
      </html>
    `);
    newWin.document.close();
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Gerador de Calendário Fitossanitário</h1>
      <p className="text-sm mb-4">Selecione suas plantas e marque as pragas/doenças observadas. Produtos respeitam incompatibilidades e sensibilidade das plantas.</p>

      <div className="bg-white shadow rounded p-4 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h2 className="font-medium">Plantas</h2>
          <div className="space-y-2 mt-2">
            {PLANTS.map((plant) => (
              <div key={plant} className="border rounded p-2">
                <label className="inline-flex items-center gap-2">
                  <input type="checkbox" checked={selections[plant].enabled} onChange={() => togglePlant(plant)} />
                  <span className="font-medium">{plant}</span>
                </label>
                {selections[plant].enabled && (
                  <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                    {PESTS.map((pest) => (
                      <label key={pest} className="inline-flex items-center gap-2">
                        <input type="checkbox" checked={selections[plant].pests.includes(pest)} onChange={() => togglePest(plant, pest)} />
                        <span>{pest}</span>
                      </label>
                    ))}
                  </div>
                )}
                {plant === "Lírio da Paz" && (
                  <div className="mt-1 text-xs text-red-600">⚠️ Sensível: nenhum produto seguro</div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="font-medium">Mês</h2>
          <div className="flex gap-2 items-center mt-2">
            <select value={monthIndex} onChange={(e) => setMonthIndex(parseInt(e.target.value))} className="border rounded p-2">
              {Array.from({ length: 12 }).map((_, i) => (
                <option value={i} key={i}>{new Date(year, i, 1).toLocaleString("pt-BR", { month: "long" })}</option>
              ))}
            </select>
            <input type="number" value={year} onChange={(e) => setYear(parseInt(e.target.value) || year)} className="border rounded p-2 w-28" />
          </div>

          <div className="mt-4">
            <h3 className="font-medium">Resumo de produtos sugeridos por planta</h3>
            <div className="mt-2 text-sm">
              {PLANTS.map((plant) => (
                <div key={plant} className="mb-2">
                  <strong>{plant}:</strong>{" "}
                  {selections[plant].enabled ? (
                    perPlantNeeded[plant] && perPlantNeeded[plant].length
                      ? perPlantNeeded[plant].map((id) => PRODUCTS.find((p) => p.id === id).nome).join(", ")
                      : plant === "Lírio da Paz"
                        ? "Nenhum produto seguro"
                        : "Nenhum produto necessário com base nas pragas marcadas"
                  ) : "Não selecionada"}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end mb-2">
        <button onClick={printTable} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow">🖨️ Imprimir Tabela</button>
      </div>

      <div className="overflow-auto border rounded">
        <table id="fitos-table" className="min-w-full table-auto">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              <th className="p-2 border">Dia</th>
              {PLANTS.map((plant) => <th key={plant} className="p-2 border text-left">{plant}</th>)}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const weekday = new Date(year, monthIndex, day).getDay();
              return (
                <tr key={day} className="hover:bg-gray-50">
                  <td className="p-2 border align-top" style={{ width: 120 }}>{day} — {WEEKDAYS[weekday]}</td>
                  {PLANTS.map((plant) => (
                    <td key={plant + day} className="p-2 border align-top">
                      {calendar[day] && calendar[day][plant] && calendar[day][plant].length ? (
                        <ul className="list-disc pl-5 text-sm">
                          {calendar[day][plant].map((txt, idx) => <li key={idx}>{txt}</li>)}
                        </ul>
                      ) : "-"}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
