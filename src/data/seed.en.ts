import type { Card } from './types';

export const SEED_EN: Card[] = [
  {
    id: 'seed-1', titulo: 'pH check of sample A', categoria: 'materiaprima',
    fase: 'Desenvolvimento', status: 'conforme', notas: 'pH within expected range (6.5).',
    criadoEm: 1716700000000,
    etapas: [
      { id: 'seed-1-e1', titulo: 'Sample collection', fase: 'Desenvolvimento', feedback: 'Sample collected without contamination.' },
      { id: 'seed-1-e2', titulo: 'Bench measurement', fase: 'Validação', feedback: 'Stable reading after calibration.' },
      { id: 'seed-1-e3', titulo: 'Batch release', fase: 'Liberação', feedback: '' },
    ],
  },
  {
    id: 'seed-2', titulo: 'Compatibility with surfactant X', categoria: 'compatibilidade',
    fase: 'Validação', status: 'parcial', notas: 'Slight turbidity after 48h.',
    criadoEm: 1716800000000,
    etapas: [
      { id: 'seed-2-e1', titulo: '1:1 mix', fase: 'Desenvolvimento', feedback: 'Homogeneous at first.' },
      { id: 'seed-2-e2', titulo: '48h observation', fase: 'Validação', feedback: 'Partial turbidity recorded.' },
    ],
  },
  {
    id: 'seed-3', titulo: 'Zeta potential — nanoemulsion B', categoria: 'zeta',
    fase: 'Desenvolvimento', status: 'reprovado', notas: 'Value outside the stability range.',
    criadoEm: 1716900000000,
    etapas: [
      { id: 'seed-3-e1', titulo: 'Dilution prep', fase: 'Desenvolvimento', feedback: '' },
      { id: 'seed-3-e2', titulo: 'Zetasizer reading', fase: 'Desenvolvimento', feedback: '-12 mV, unstable.' },
    ],
  },
  {
    id: 'seed-4', titulo: 'Solubility of active C', categoria: 'solubilidade',
    fase: 'Liberação', status: '', notas: '', criadoEm: 1717000000000, etapas: [],
  },
];
