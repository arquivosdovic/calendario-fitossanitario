import React, { useState, useMemo } from 'react';
import { DateTime } from 'luxon';

const TARGET_TIMEZONE = 'America/Sao_Paulo';

const parseLocalDate = (str) => {
  // Cria um objeto Luxon no fuso TARGET_TIMEZONE
  const luxonDt = DateTime.fromISO(str, { zone: TARGET_TIMEZONE }).startOf(
    'day'
  ); // Converte de volta para Date nativo para armazenar no estado

  return luxonDt.toJSDate();
};

// ... (Definições de PLANTS, PESTS, PRODUCTS - mantidas) ...

const PLANTS = ['Hortelã', 'Alecrim', 'Tomilho', 'Manjericão', 'Pimenta'];

const SPECIAL_PLANTS = ['Lírios / Mini Phalaenopsis', 'Antúrio'];

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
    frequenciaDias: 4,
    frequenciaDiasexib: '4 a 7 dias durante o combate; 7 a 10 como manutenção.',
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
      tempoEnxague:
        'Sim. Se a planta for sensível, em 40-60 min. Se for resistente, em 2-3h ou não enxaguar.',
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
    frequenciaDiasexib: 'A cada 14 dias.',
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
    frequenciaDiasexib: 'A cada 14 dias.',
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
    frequenciaDiasexib: 'De 10 a 14 dias.',
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
    frequenciaDiasexib:
      'Entre 1 a 2 semanas, ou conforme a aparição de pragas.',
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
    plantas: ['Hortelã', 'Alecrim', 'Tomilho', 'Manjericão', 'Pimenta'],
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
    frequenciaDiasexib: 'Entre 1 e 2 semanas, conforme necessidade.',
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

function generateSchedule({ startDate, endDate, selections }) {
  // OBS: Assume que startDate e endDate são agora objetos Luxon DateTime.
  const calendar = {};
  const perPlantNeeded = {};
  const scheduleByPlant = {}; // --- 1. Calcula produtos necessários por planta ---

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
  } // --- 2. CÁLCULO DE DIAS E INICIALIZAÇÃO DO CALENDÁRIO (LUXON SAFE) --- // Calcula a diferença de dias usando Luxon (seguro para fuso) // O +1 garante que o dia final (endDate) seja incluído.

  const totalDays = Math.ceil(endDate.diff(startDate, 'days').days) + 1; // Loop para INICIALIZAR o objeto 'calendar' e definir as chaves.

  for (let i = 0; i < totalDays; i++) {
    // Luxon adiciona dias de forma segura, mantendo o fuso correto.
    const currentLuxon = startDate.plus({ days: i }); // dayKey extraído com formato ISO 'YYYY-MM-DD', garantindo o dia correto.

    const dayKey = currentLuxon.toISODate();

    calendar[dayKey] = {};
    for (const p of PLANTS) calendar[dayKey][p] = [];
  } // ------------------------------------------------------------- // --- 3. LÓGICA DE AGENDAMENTO (CÁLCULO DOS DIAS DE APLICAÇÃO) ---

  for (const plant of Object.keys(selections)) {
    const needed = perPlantNeeded[plant];
    scheduleByPlant[plant] = [];
    const placed = []; // Usado para rastrear conflitos na planta atual

    for (const pid of needed) {
      const prod = PRODUCTS.find((p) => p.id === pid);
      if (!prod) continue;

      let dayOffset = 0;
      const incompatIds = prod.incompativeis || [];
      const minSeparation = 3; // Busca o primeiro dia disponível que não tem conflito

      while (dayOffset < totalDays) {
        const conflictSameDay = placed.some(
          (pl) =>
            pl.dayOffset === dayOffset &&
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
          return Math.abs(pl.dayOffset - dayOffset) < minSeparation;
        });

        if (!conflictSameDay && !conflictClose) break;
        dayOffset++;
      }

      if (dayOffset >= totalDays) continue; // Agendamento das repetições

      for (let d = dayOffset; d < totalDays; d += prod.frequenciaDias) {
        const conflictSameDay = placed.some(
          (pl) =>
            pl.dayOffset === d &&
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
          return Math.abs(pl.dayOffset - d) < minSeparation;
        });
        if (conflictSameDay || conflictClose) continue;
        placed.push({ dayOffset: d, id: pid });
      }
    }

    placed.sort((a, b) => a.dayOffset - b.dayOffset);
    scheduleByPlant[plant] = placed;
  } // ----------------------------------------------------------------- // --- 4. PREENCHIMENTO FINAL DO CALENDÁRIO ---

  for (const plant of Object.keys(scheduleByPlant)) {
    for (const item of scheduleByPlant[plant]) {
      // Usa o Luxon para calcular a data correta
      const currentLuxon = startDate.plus({ days: item.dayOffset }); // Usa toISODate() para gerar o dayKey correto

      const dayKey = currentLuxon.toISODate(); // Verificar se a chave existe (deve existir, pois foi inicializada no passo 2)

      if (!calendar[dayKey]) {
        continue;
      }

      const prod = PRODUCTS.find((p) => p.id === item.id);
      if (!prod) continue; // Adiciona o produto à data/planta correta

      calendar[dayKey][plant].push(
        prod.nome + (prod.tipo ? ` (${prod.tipo})` : '')
      );
    }
  }

  return { calendar, perPlantNeeded };
}

const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export default function FitossanitarioApp() {
  // ... (Estados e funções de toggle - mantidos) ...

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
  // O Luxon no useMemo garante que as datas enviadas ao generateSchedule estão corretas.
  const [startDate, setStartDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), today.getDate())
  );
  const [endDate, setEndDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), today.getDate() + 30)
  );

  const { calendar, perPlantNeeded } = useMemo(() => {
    // Converte as datas de estado (Date nativo) para Luxon DateTime no fuso correto.
    const luxonStartDate = DateTime.fromJSDate(startDate, {
      zone: TARGET_TIMEZONE,
    }).startOf('day'); // Garantir que está no início do dia
    const luxonEndDate = DateTime.fromJSDate(endDate, {
      zone: TARGET_TIMEZONE,
    }).startOf('day'); // Garantir que está no início do dia

    return generateSchedule({
      startDate: luxonStartDate,
      endDate: luxonEndDate,
      selections,
    });
  }, [startDate, endDate, selections]);

  const { daysInMonth } = monthInfo(year, monthIndex); // 🖨️ Função para imprimir só a tabela - (mantida)

  function printTable() {
    // ... (Lógica de impressão mantida) ...
  }

  return (
    <div className='p-6 max-w-6xl mx-auto'>
            {/* ... (Controles de seleção e inputs de data - mantidos) ... */}
      {/* ... (Resumo de produtos - mantido) ... */}     {' '}
      {/* 🖨️ Botão de impressão - (mantido) */}     {' '}
      <div className='overflow-auto border rounded'>
               {' '}
        <table id='fitos-table' className='min-w-full table-auto'>
                   {' '}
          <thead className='bg-gray-50 sticky top-0'>
                       {' '}
            <tr>
                            <th className='p-2 border'>Dia</th>             {' '}
              {PLANTS.map((plant) => (
                <th key={plant} className='p-2 border text-left'>
                                    {plant}               {' '}
                </th>
              ))}
                         {' '}
            </tr>
                     {' '}
          </thead>
                   {' '}
          <tbody>
                       {' '}
            {Object.keys(calendar).map((dayKey) => {
              // 🚀 CORREÇÃO APLICADA AQUI: USAR LUXON PARA PARSEAR A CHAVE NO FUSO ALVO
              const currentLuxon = DateTime.fromISO(dayKey, {
                zone: TARGET_TIMEZONE,
              });
              // Luxon weekday: 1 (Seg) a 7 (Dom). Corrigimos para o array WEEKDAYS: 0 (Dom) a 6 (Sáb).
              // currentLuxon.weekday 7 (Dom) -> 0
              const weekdayLuxon =
                currentLuxon.weekday === 7 ? 0 : currentLuxon.weekday;

              return (
                <tr key={dayKey} className='hover:bg-gray-50'>
                                   {' '}
                  <td className='p-2 border align-top' style={{ width: 120 }}>
                                        {currentLuxon.day} —{' '}
                    {WEEKDAYS[weekdayLuxon]}                 {' '}
                  </td>
                                   {' '}
                  {PLANTS.map((plant) => (
                    <td key={plant + dayKey} className='p-2 border align-top'>
                                           {' '}
                      {calendar[dayKey][plant].length ? (
                        <ul className='list-disc pl-5 text-sm'>
                                                   {' '}
                          {calendar[dayKey][plant].map((txt, idx) => (
                            <li key={idx}>{txt}</li>
                          ))}
                                                 {' '}
                        </ul>
                      ) : (
                        <span className='text-gray-400 text-sm'>—</span>
                      )}
                                         {' '}
                    </td>
                  ))}
                                 {' '}
                </tr>
              );
            })}
                     {' '}
          </tbody>
                 {' '}
        </table>
             {' '}
      </div>
            {/* ... (Observações e detalhes de produtos - mantidos) ... */}   {' '}
    </div>
  );
}
