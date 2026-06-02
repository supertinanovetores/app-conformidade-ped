import type { Card } from './types';

export const SEED_PT: Card[] = [
  {
    id: 'seed-1', titulo: 'Verificação de pH da amostra A', categoria: 'materiaprima',
    fase: 'Desenvolvimento', status: 'conforme', notas: 'pH dentro do esperado (6.5).',
    criadoEm: 1716700000000,
    etapas: [
      { id: 'seed-1-e1', titulo: 'Coleta da amostra', fase: 'Desenvolvimento', feedback: 'Amostra coletada sem contaminação.' },
      { id: 'seed-1-e2', titulo: 'Medição em bancada', fase: 'Validação', feedback: 'Leitura estável após calibração.' },
      { id: 'seed-1-e3', titulo: 'Liberação do lote', fase: 'Liberação', feedback: '' },
    ],
  },
  {
    id: 'seed-2', titulo: 'Compatibilidade com tensoativo X', categoria: 'compatibilidade',
    fase: 'Validação', status: 'parcial', notas: 'Leve turvação após 48h.',
    criadoEm: 1716800000000,
    etapas: [
      { id: 'seed-2-e1', titulo: 'Mistura 1:1', fase: 'Desenvolvimento', feedback: 'Homogênea no início.' },
      { id: 'seed-2-e2', titulo: 'Observação 48h', fase: 'Validação', feedback: 'Turvação parcial registrada.' },
    ],
  },
  {
    id: 'seed-3', titulo: 'Potencial de zeta — nanoemulsão B', categoria: 'zeta',
    fase: 'Desenvolvimento', status: 'reprovado', notas: 'Valor fora da faixa de estabilidade.',
    criadoEm: 1716900000000,
    etapas: [
      { id: 'seed-3-e1', titulo: 'Preparo da diluição', fase: 'Desenvolvimento', feedback: '' },
      { id: 'seed-3-e2', titulo: 'Leitura no zetasizer', fase: 'Desenvolvimento', feedback: '-12 mV, instável.' },
    ],
  },
  {
    id: 'seed-4', titulo: 'Solubilidade do ativo C', categoria: 'solubilidade',
    fase: 'Liberação', status: '', notas: '', criadoEm: 1717000000000, etapas: [],
  },
];
