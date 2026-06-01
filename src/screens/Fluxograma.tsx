import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCards } from '../store/CardsContext';
import { useToast } from '../components/Toast';
import { CATEGORIAS, FASES, FASE_CLASSE } from '../data/constants';
import type { Etapa, Fase } from '../data/types';
import { uid } from '../lib/uid';
import { fmtData } from '../lib/fmtData';

export function Fluxograma() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cards, setEtapas } = useCards();
  const toast = useToast();
  const card = cards.find((c) => c.id === id);

  const [editando, setEditando] = useState(false);
  const [rascunho, setRascunho] = useState<Etapa[]>(card ? card.etapas.map((e) => ({ ...e })) : []);

  if (!card) {
    return (
      <div className="fluxo-tela">
        <div className="fluxo-vazio" style={{ margin: 'auto' }}>
          Card não encontrado.
          <div style={{ marginTop: 16 }}>
            <button className="btn-fluxo-voltar" onClick={() => navigate('/conformidade')}>← Voltar</button>
          </div>
        </div>
      </div>
    );
  }

  const etapas = editando ? rascunho : card.etapas;

  function salvar() {
    setEtapas(card!.id, rascunho);
    setEditando(false);
    toast('Fluxo salvo!');
  }

  function toggleEditar() {
    if (editando) { salvar(); }
    else { setRascunho(card!.etapas.map((e) => ({ ...e }))); setEditando(true); }
  }

  function imprimir() {
    if (editando) setEditando(false);
    document.body.classList.add('imprimindo-fluxo');
    window.print();
    setTimeout(() => document.body.classList.remove('imprimindo-fluxo'), 1000);
  }

  function patchEtapa(i: number, patch: Partial<Etapa>) {
    setRascunho((r) => r.map((e, j) => (j === i ? { ...e, ...patch } : e)));
  }

  return (
    <div className="fluxo-tela">
      <div className="fluxo-topbar">
        <button className="btn-fluxo-voltar" onClick={() => navigate('/conformidade')}>← Voltar</button>
        <div className="fluxo-topbar-titulo">
          {card.titulo}
          <div className="fluxo-topbar-autoria">
            Criado por {card.criadoPor?.nome ?? 'Sistema'} • editado por {card.atualizadoPor?.nome ?? '—'} em {fmtData(card.atualizadoEm ?? card.criadoEm)}
          </div>
        </div>
        <div className="fluxo-topbar-badges">
          <span className="badge-glass">{CATEGORIAS[card.categoria]}</span>
          <span className="badge-glass">{card.fase}</span>
        </div>
        <div className="fluxo-topbar-acoes">
          <button className="btn-topbar editar" onClick={toggleEditar}>{editando ? 'Salvar' : 'Editar'}</button>
          <button className="btn-topbar" onClick={imprimir}>Exportar PDF</button>
        </div>
      </div>

      <div className="fluxo-canvas">
        {etapas.length === 0 ? (
          <div className="fluxo-vazio">
            Nenhuma etapa cadastrada.
            {!editando && <><br />Clique em <strong>Editar</strong> para adicionar etapas.</>}
          </div>
        ) : (
          etapas.map((e, i) => (
            <div key={e.id}>
              {i > 0 && (
                <div className="fluxo-seta">
                  <svg width="24" height="40" viewBox="0 0 24 40" style={{ overflow: 'visible' }}>
                    <line className="seta-linha" x1="12" y1="0" x2="12" y2="30" style={{ animationDelay: `${i * 120 - 30}ms` }} />
                    <polygon className="seta-ponta" points="12,40 5,28 19,28" style={{ animationDelay: `${i * 120 + 270}ms` }} />
                  </svg>
                </div>
              )}
              <div className={`fluxo-step ${e.fase ? FASE_CLASSE[e.fase] : ''}`} style={{ animationDelay: `${i * 120}ms` }}>
                {editando ? (
                  <>
                    <div className="fsb-header">
                      <span className="fsb-num">Etapa {i + 1}</span>
                      <button className="btn-fsb-rem" onClick={() => setRascunho((r) => r.filter((_, j) => j !== i))}>Remover</button>
                    </div>
                    <input className="fsb-input" value={e.titulo} placeholder="Descrição da etapa..." onChange={(ev) => patchEtapa(i, { titulo: ev.target.value })} />
                    <select className="fsb-select" value={e.fase} onChange={(ev) => patchEtapa(i, { fase: ev.target.value as Fase | '' })}>
                      <option value="">Selecione a fase...</option>
                      {FASES.map((f) => <option key={f} value={f}>{f}</option>)}
                    </select>
                    <textarea className="fsb-textarea" value={e.feedback} placeholder="Registre sua percepção..." onChange={(ev) => patchEtapa(i, { feedback: ev.target.value })} />
                  </>
                ) : (
                  <>
                    <div className="fsb-num">Etapa {i + 1}</div>
                    <div className="fsb-titulo">{e.titulo}</div>
                    <span className="fsb-fase-badge">{e.fase || 'Fase não definida'}</span>
                    {e.feedback ? (
                      <>
                        <div className="fsb-feedback-label">Feedback / Percepção</div>
                        <div className="fsb-feedback-text">{e.feedback}</div>
                      </>
                    ) : (
                      <div className="fsb-feedback-empty">Nenhum feedback registrado.</div>
                    )}
                  </>
                )}
              </div>
            </div>
          ))
        )}

        {editando && (
          <button className="btn-add-step" onClick={() => setRascunho((r) => [...r, { id: uid(), titulo: '', fase: '', feedback: '' }])}>
            + Adicionar etapa
          </button>
        )}
      </div>
    </div>
  );
}
