import React, { useState, useMemo } from 'react';

// Calendário Fitossanitário - componente React (single-file)
// Usa Tailwind para estilo

const PLANTS = [
  'Hortelã',
  'Alecrim',
  'Tomilho',
  'Manjericão',
  'Pimenta',
  'Lírios / Mini Phalaenopsis',
  'Antúrio',
];

const PESTS = [
  'Pulgões',
  'Cochonilhas',
  'Ácaros',
  'Oídio',
  'Míldio',
  'Fungos foliares',
  'Moscas-brancas',
];

const PRODUCTS = [
  {
    id: 'sabao',
    nome: 'Sabão',
    plantas: ['Hortelã', 'Alecrim', 'Tomilho', 'Manjericão', 'Pimenta'],
    seguroPara: {
      Hortelã: false,
      Alecrim: true,
      Tomilho: true,
      Manjericão: false,
      Pimenta: true,
    },
    frequenciaDias: 10,
    incompativeis: ['neem'],
    controla: ['Pulgões', 'Cochonilhas', 'Ácaros'],
    tipo: 'Curativa',
    receita: {
      ingredientes: ['1 colher de chá de sabão neutro', '1 litro de água'],
      preparo: ['Misture bem os ingredientes e coloque em borrifador.'],
      aplicacao: [
        'Borrife diretamente sobre os insetos.',
        'Faça teste em 1-2 folhas antes.',
        'Remova cochonilhas grandes com algodão embebido em álcool.',
      ],
      tempoAcao: '3-4 dias entre aplicações até controle',
      tempoEnxague: 'Sim. Após 3 horas',
      nota: 'Pode queimar plantas sensíveis como manjericão e hortelã.',
    },
  },
  {
    id: 'bicarbonato',
    nome: 'Bicarbonato',
    plantas: ['Hortelã', 'Tomilho', 'Alecrim', 'Manjericão', 'Pimenta'],
    seguroPara: {
      Hortelã: true,
      Tomilho: true,
      Alecrim: true,
      Manjericão: true,
      Pimenta: true,
    },
    frequenciaDias: 14,
    incompativeis: ['leite', 'enxofre'],
    controla: ['Oídio', 'Míldio', 'Fungos foliares'],
    tipo: 'Preventiva',
    receita: {
      ingredientes: [
        '50 ml de água',
        '1 pitada de bicarbonato de sódio',
        '1 gotinha de óleo de cozinha',
        '1 gotinha de detergente neutro',
      ],
      preparo: ['Misture bem e coloque no borrifador.'],
      aplicacao: [
        'Borrife na parte de cima e embaixo das folhas afetadas.',
        'No fim da tarde, para evitar queimaduras.',
      ],
      tempoAcao: '4 dias entre aplicações no início, depois 1 semana',
      tempoEnxague: 'Não',
      nota: 'Agitar antes de usar e armazenar por no máximo 7 dias.',
    },
  },
  {
    id: 'leite',
    nome: 'Leite',
    plantas: ['Hortelã', 'Tomilho', 'Alecrim', 'Manjericão', 'Pimenta'],
    seguroPara: {
      Hortelã: true,
      Tomilho: true,
      Alecrim: true,
      Manjericão: true,
      Pimenta: true,
    },
    frequenciaDias: 14,
    incompativeis: ['bicarbonato', 'enxofre'],
    controla: ['Oídio', 'Fungos foliares'],
    tipo: 'Preventiva / Curativa leve',
    receita: {
      ingredientes: ['25 ml de leite', '50 ml de água'],
      preparo: ['Misture e coloque no borrifador.'],
      aplicacao: ['Borrife sobre folhas afetadas, 2x por semana.'],
      tempoAcao: 'Reaplicar 2x por semana até melhora',
      tempoEnxague: 'Não',
      nota: 'Forma uma película protetora que reflete luz solar.',
    },
  },
  {
    id: 'enxofre',
    nome: 'Enxofre',
    plantas: ['Hortelã', 'Alecrim', 'Tomilho', 'Manjericão', 'Pimenta'],
    seguroPara: {
      Hortelã: true,
      Alecrim: true,
      Tomilho: true,
      Manjericão: true,
      Pimenta: true,
    },
    frequenciaDias: 14,
    incompativeis: ['neem', 'sabao', 'leite'],
    controla: ['Oídio', 'Fungos foliares', 'Ácaros'],
    tipo: 'Preventiva e Curativa',
    receita: {
      ingredientes: ['1/8 colher de chá de enxofre', '250 ml de água'],
      preparo: ['Misture bem e coloque em borrifador.'],
      aplicacao: [
        'Aplicar 1x por semana em ataques ativos.',
        'Para prevenção, a cada 10–14 dias.',
        'Aplicar em horários frescos (manhã ou fim da tarde).',
      ],
      tempoAcao: '7 dias para prevenção, 1 semana para tratamento ativo',
      tempoEnxague: 'Não',
      nota: 'Evitar em folhas sensíveis expostas ao sol.',
    },
  },
  {
    id: 'alho',
    nome: 'Alho',
    plantas: ['Hortelã', 'Alecrim', 'Tomilho', 'Manjericão', 'Pimenta'],
    seguroPara: {
      Hortelã: true,
      Alecrim: true,
      Tomilho: true,
      Manjericão: true,
      Pimenta: true,
    },
    frequenciaDias: 14,
    incompativeis: ['neem', 'enxofre'],
    controla: ['Pulgões', 'Cochonilhas', 'Moscas-brancas'],
    tipo: 'Curativa leve',
    receita: {
      ingredientes: [
        '1 dente de alho pequeno',
        '50 ml de água',
        'Opcional: 1 pitada de sabão neutro',
      ],
      preparo: [
        'Amasse bem o alho e misture com a água.',
        'Deixar descansar 2–3 horas e coar antes de colocar no borrifador.',
      ],
      aplicacao: [
        'Borrife sobre folhas, principalmente embaixo.',
        '1 vez por semana ou quando notar pragas.',
      ],
      tempoAcao: '1 semana por aplicação, repita se necessário',
      tempoEnxague: 'Não',
      nota: 'Evitar sol muito forte para não queimar folhas.',
    },
  },
  {
    id: 'neem',
    nome: 'Neem (Óleo de Nim)',
    plantas: [
      'Hortelã',
      'Alecrim',
      'Tomilho',
      'Manjericão',
      'Pimenta',
      'Antúrio',
      'Lírios / Mini Phalaenopsis',
    ],
    seguroPara: {
      Hortelã: true,
      Alecrim: true,
      Tomilho: true,
      Manjericão: true,
      Pimenta: true,
      Antúrio: true,
      'Lírios / Mini Phalaenopsis': true,
    },
    frequenciaDias: 7,
    incompativeis: ['enxofre', 'sabao', 'alho'],
    controla: ['Pulgões', 'Cochonilhas', 'Ácaros', 'Moscas-brancas'],
    tipo: 'Preventiva e Curativa',
    receita: {
      ingredientes: [
        '1 colher de sopa (15 ml) de óleo de neem',
        '1 litro de água morna',
        '1/2 colher de chá de detergente neutro',
      ],
      preparo: [
        'Misture o óleo e o detergente na água morna.',
        'Coloque a solução em borrifador.',
      ],
      aplicacao: [
        'Borrife todas as partes da planta, inclusive folhas e caules.',
        'Uma vez por semana.',
        'Remova manualmente aglomerados maiores se possível.',
      ],
      tempoAcao: '3-4 semanas de aplicação contínua para eliminação completa',
      tempoEnxague: 'Não',
      nota: 'O neem age lentamente, então repita por algumas semanas.',
    },
  },
];

function monthInfo(year, monthIndex) {
  const first = new Date(year, monthIndex, 1);
  const last = new Date(year, monthIndex + 1, 0);
  return { firstDayWeek: first.getDay(), daysInMonth: last.getDate() };
}

function isOnlyCurative(prod) {
  const t = prod.tipo.toLowerCase();
  return (
    t.includes('curativa') &&
    !t.includes('preventiva') &&
    !t.includes('preventiva e')
  );
}

function isDisease(pest) {
  const diseases = ['Oídio', 'Míldio', 'Fungos foliares'];
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
              PRODUCTS.find((p) => p.id === pl.id).incompativeis.includes(
                prod.id
              ))
        );
        const conflictClose = placed.some((pl) => {
          const otherProd = PRODUCTS.find((p) => p.id === pl.id);
          const areIncompat =
            incompatIds.includes(pl.id) ||
            (otherProd && otherProd.incompativeis.includes(prod.id));
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
              PRODUCTS.find((p) => p.id === pl.id).incompativeis.includes(
                prod.id
              ))
        );
        const conflictClose = placed.some((pl) => {
          const otherProd = PRODUCTS.find((p) => p.id === pl.id);
          const areIncompat =
            prod.incompativeis.includes(pl.id) ||
            (otherProd && otherProd.incompativeis.includes(prod.id));
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
      calendar[item.day][plant].push(
        prod.nome + (prod.tipo ? ` (${prod.tipo})` : '')
      );
    }
  }

  return { calendar, perPlantNeeded };
}

const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

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
      return {
        ...prev,
        [plant]: {
          ...prev[plant],
          enabled,
          pests: enabled ? prev[plant].pests : [],
        },
      };
    });
  }

  function togglePest(plant, pest) {
    setSelections((prev) => {
      const list = prev[plant].pests || [];
      const has = list.includes(pest);
      const next = has ? list.filter((x) => x !== pest) : [...list, pest];
      return {
        ...prev,
        [plant]: { ...prev[plant], pests: next, enabled: true },
      };
    });
  }

  const { calendar, perPlantNeeded } = useMemo(
    () => generateSchedule({ year, monthIndex, selections }),
    [year, monthIndex, selections]
  );
  const { daysInMonth } = monthInfo(year, monthIndex);

  // 🖨️ Função para imprimir só a tabela - corrigida para não fechar imediatamente
  function printTable() {
    const table = document.getElementById('fitos-table');
    if (!table) return;
    const newWin = window.open('', '_blank');
    if (!newWin) {
      alert(
        'Não foi possível abrir a janela de impressão. Verifique se o bloqueador de pop-ups está ativo.'
      );
      return;
    }

    const monthLabel = new Date(year, monthIndex).toLocaleString('pt-BR', {
      month: 'long',
      year: 'numeric',
    });
    const genDate = new Date().toLocaleDateString('pt-BR');

    newWin.document.write(`
      <html>
        <head>
          <title>Calendário Fitossanitário - ${monthLabel}</title>
          <meta charset="utf-8" />
          <style>
            body { margin: 20px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; color: #111; }
            h2 { text-align: center; margin-bottom: 12px; font-size: 18px; }
            .meta { text-align: center; font-size: 12px; color: #555; margin-bottom: 8px; }
            table { border-collapse: collapse; width: 100%; font-size: 12px; }
            th, td { border: 1px solid #ccc; padding: 6px; vertical-align: top; text-align: left; }
            th { background: #f9f9f9; font-weight: 600; }
            ul { margin: 0; padding-left: 18px; }
            footer { margin-top: 12px; font-size: 11px; color: #444; text-align: right; }
            @media print {
              body { margin: 8mm; }
            }
          </style>
        </head>
        <body>
          <h2>Calendário Fitossanitário — ${monthLabel}</h2>
          <div class="meta">Gerado em ${genDate}</div>
          ${table.outerHTML}
          <footer>Gerado por seu sistema</footer>

          <script>
            // Garante que a impressão só seja chamada após o carregamento completo
            function tryPrint() {
              try {
                window.focus();
                // Alguns navegadores ignoram onafterprint; chamamos print diretamente no load
                window.print();
              } catch (e) {
                console.warn("Erro ao tentar imprimir:", e);
              }
            }

            // Fecha a janela após o término da impressão (quando suportado)
            function tryClose() {
              try {
                window.close();
              } catch (e) {
                // nada
              }
            }

            window.onload = function() {
              // chama print na carga – ajuda navegadores que mostram o diálogo imediatamente
              tryPrint();
            };

            // onafterprint é o melhor ponto para fechar; fallback com timeout caso não seja suportado
            if ('onafterprint' in window) {
              window.onafterprint = tryClose;
            } else {
              // fallback: fecha 2s após print ser chamado (ajuste se necessário)
              window.onfocus = function() {
                // se o usuário voltar ao popup (após cancelar), fecha
                setTimeout(tryClose, 2000);
              };
            }
          </script>
        </body>
      </html>
    `);

    newWin.document.close();
    try {
      newWin.focus();
    } catch (e) {
      // Ignore if focus não for permitido
    }
  }

  return (
    <div className='p-6 max-w-6xl mx-auto'>
      <h1 className='text-2xl font-semibold mb-4'>
        Gerador de Calendário Fitossanitário
      </h1>
      <p className='text-sm mb-4'>
        Selecione as plantas que você tem e marque as pragas/doenças observadas.
        O calendário respeita incompatibilidades e garante ao menos 3 dias de
        separação quando necessário.
      </p>

      <div className='bg-white shadow rounded p-4 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div>
          <h2 className='font-medium'>Plantas</h2>
          <div className='space-y-2 mt-2'>
            {PLANTS.map((plant) => (
              <div key={plant} className='border rounded p-2'>
                <label className='inline-flex items-center gap-2'>
                  <input
                    type='checkbox'
                    checked={selections[plant].enabled}
                    onChange={() => togglePlant(plant)}
                  />
                  <span className='font-medium'>{plant}</span>
                </label>
                {selections[plant].enabled && (
                  <div className='mt-2 grid grid-cols-2 gap-2 text-sm'>
                    {PESTS.map((pest) => (
                      <label
                        key={pest}
                        className='inline-flex items-center gap-2'
                      >
                        <input
                          type='checkbox'
                          checked={selections[plant].pests.includes(pest)}
                          onChange={() => togglePest(plant, pest)}
                        />
                        <span>{pest}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className='font-medium'>Mês</h2>
          <div className='flex gap-2 items-center mt-2'>
            <select
              value={monthIndex}
              onChange={(e) => setMonthIndex(parseInt(e.target.value))}
              className='border rounded p-2'
            >
              {Array.from({ length: 12 }).map((_, i) => (
                <option value={i} key={i}>
                  {new Date(year, i, 1).toLocaleString('pt-BR', {
                    month: 'long',
                  })}
                </option>
              ))}
            </select>
            <input
              type='number'
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value) || year)}
              className='border rounded p-2 w-28'
            />
          </div>

          <div className='mt-4'>
            <h3 className='font-medium'>
              Resumo de produtos sugeridos por planta
            </h3>
            <div className='mt-2 text-sm'>
              {PLANTS.map((plant) => (
                <div key={plant} className='mb-2'>
                  <strong>{plant}:</strong>{' '}
                  {selections[plant].enabled
                    ? perPlantNeeded[plant] && perPlantNeeded[plant].length
                      ? perPlantNeeded[plant]
                          .map((id) => {
                            const p = PRODUCTS.find((prod) => prod.id === id);
                            const segur = p.seguroPara[plant]
                              ? ''
                              : ' ⚠️ Sensível';
                            const enx = p.exigeEnxague
                              ? ` — enxágue após ${p.tempoAcao}`
                              : '';
                            return `${p.nome}${segur}${enx}`;
                          })
                          .join(', ')
                      : 'Nenhum produto necessário com base nas pragas marcadas'
                    : 'Não selecionada'}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 🖨️ Botão de impressão */}
      <div className='flex justify-end mb-2'>
        <button
          onClick={printTable}
          className='bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow'
        >
          🖨️ Imprimir Tabela
        </button>
      </div>

      <div className='overflow-auto border rounded'>
        <table id='fitos-table' className='min-w-full table-auto'>
          <thead className='bg-gray-50 sticky top-0'>
            <tr>
              <th className='p-2 border'>Dia</th>
              {PLANTS.map((plant) => (
                <th key={plant} className='p-2 border text-left'>
                  {plant}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const weekday = new Date(year, monthIndex, day).getDay();
              return (
                <tr key={day} className='hover:bg-gray-50'>
                  <td className='p-2 border align-top' style={{ width: 120 }}>
                    {day} — {WEEKDAYS[weekday]}
                  </td>
                  {PLANTS.map((plant) => (
                    <td key={plant + day} className='p-2 border align-top'>
                      {calendar[day] &&
                      calendar[day][plant] &&
                      calendar[day][plant].length ? (
                        <ul className='list-disc pl-5 text-sm'>
                          {calendar[day][plant].map((txt, idx) => (
                            <li key={idx}>{txt}</li>
                          ))}
                        </ul>
                      ) : (
                        <span className='text-gray-400 text-sm'>—</span>
                      )}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className='mt-4 text-sm text-gray-700'>
        <p>
          <strong>Observações importantes:</strong>
        </p>
        <ul className='list-disc pl-5'>
          <li>
            Produtos "curativos" (ex.: Sabão, Alho) só são sugeridos se a praga
            marcada for uma doença/condição que eles cobrem. Insetos não geram
            sugestões de curativos-only.
          </li>
          <li>
            Incompatibilidades são respeitadas: produtos declarados como "não
            aplicar no mesmo dia" não aparecem no mesmo dia para a mesma planta.
            Se dois produtos incompatíveis forem necessários, o agendador tenta
            espaçá-los ao menos 3 dias.
          </li>
          <li>
            O agendamento segue uma heurística gulosa dentro do mês (primeiro
            dia disponível + repetições pela frequência). Em casos extremos
            (muito conflito), pode não ser possível encaixar todas as aplicações
            no mês — revise as pragas selecionadas ou escolha outro mês.
          </li>
        </ul>
      </div>

      <div className='mt-6 text-sm'>
        <h3 className='font-medium'>Produtos e detalhes</h3>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-2 mt-2 text-sm'>
          {PRODUCTS.map((p) => (
            <div key={p.id} className='border rounded p-2'>
              <strong>{p.nome}</strong>
              <div className='text-xs'>Tipo: {p.tipo}</div>
              <div className='text-xs'>
                Freq.: a cada {p.frequenciaDias} dias
              </div>
              <div className='text-xs'>Controla: {p.controla.join(', ')}</div>
              <div className='text-xs'>
                Segurança por planta:
                <ul className='list-disc pl-4'>
                  {PLANTS.map((plant) => (
                    <li key={plant}>
                      {plant}:{' '}
                      {p.seguroPara && p.seguroPara[plant]
                        ? '✅ Seguro'
                        : '⚠️ Sensível'}
                    </li>
                  ))}
                </ul>
              </div>
              {p.exigeEnxague && p.tempoAcao && (
                <div className='text-xs'>
                  Enxágue necessário após: {p.tempoAcao}
                </div>
              )}
              {p.nota && <div className='text-xs italic'>Dica: {p.nota}</div>}
            </div>
          ))}
        </div>
      </div>

      <div className='mt-6 text-sm'>
        <h3 className='font-medium'>Receitas e instruções de aplicação</h3>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-2'>
          {PRODUCTS.map((p) => (
            <div key={p.id} className='border rounded p-3'>
              <strong>{p.nome}</strong>
              <div className='text-xs mt-1'>
                <em>Tipo:</em> {p.tipo}
              </div>
              <div className='text-xs mt-1'>
                <em>Freqência:</em> a cada {p.frequenciaDias} dias
              </div>
              <div className='text-xs mt-1'>
                <em>Controla:</em> {p.controla.join(', ')}
              </div>
              <div className='text-xs mt-1'>
                <em>Segurança por planta:</em>{' '}
                {Object.entries(p.seguroPara)
                  .map(
                    ([pl, seguro]) => `${pl}: ${seguro ? 'Seguro' : 'Evitar'}`
                  )
                  .join('; ')}
              </div>

              {p.receita && (
                <div className='mt-2 text-xs'>
                  <div>
                    <strong>Ingredientes:</strong>
                  </div>
                  <ul className='list-disc pl-5'>
                    {p.receita.ingredientes.map((ing, idx) => (
                      <li key={idx}>{ing}</li>
                    ))}
                  </ul>

                  <div className='mt-1'>
                    <strong>Preparo:</strong>
                  </div>
                  <ul className='list-disc pl-5'>
                    {p.receita.preparo.map((step, idx) => (
                      <li key={idx}>{step}</li>
                    ))}
                  </ul>

                  <div className='mt-1'>
                    <strong>Aplicação:</strong>
                  </div>
                  <ul className='list-disc pl-5'>
                    {p.receita.aplicacao.map((step, idx) => (
                      <li key={idx}>{step}</li>
                    ))}
                  </ul>

                  <div className='mt-1'>
                    <strong>Tempo de ação:</strong> {p.receita.tempoAcao}
                  </div>
                  <div className='mt-1'>
                    <strong>Necessita enxágue:</strong> {p.receita.tempoEnxague}
                  </div>
                  {p.receita.nota && (
                    <div className='mt-1 text-gray-600'>
                      <em>{p.receita.nota}</em>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
