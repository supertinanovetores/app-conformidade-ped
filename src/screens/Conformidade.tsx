import { useMemo, useState } from 'react';
import { useCards } from '../store/CardsContext';
import { useToast } from '../components/Toast';
import { contarStatus, filtrarCards } from '../data/derive';
import { CATEGORIA_OPTS, STATUS_OPTS, FASES } from '../data/constants';
import { cardsToCsv } from '../lib/csv';
import type { Categoria, Fase, Filtros, Status } from '../data/types';
import { CardItem } from '../components/CardItem';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { Modal } from '../components/Modal';

const FILTROS_VAZIO: Filtros = { categoria: '', status: '', fase: '' };

export function Conformidade() {
  const { cards, create, update, remove } = useCards();
  const toast = useToast();
  const [filtros, setFiltros] = useState<Filtros>(FILTROS_VAZIO);
  const [excluindo, setExcluindo] = useState<string | null>(null);
  const [novoAberto, setNovoAberto] = useState(false);

  const s = contarStatus(cards);
  const visiveis = useMemo(() => filtrarCards(cards, filtros), [cards, filtros]);

  function exportarCsv() {
    if (!cards.length) { toast('Nenhum card para exportar.', true); return; }
    const blob = new Blob(['﻿' + cardsToCsv(cards)], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `conformidade-pd-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <header className="app-header">
        <div>
          <h1>Conformidade</h1>
          <div className="app-header-sub">Testes de P&D e seus fluxos</div>
        </div>
        <div className="app-header-actions">
          <button className="app-btn app-btn-outline" onClick={exportarCsv}>Exportar CSV</button>
          <button className="app-btn app-btn-outline" onClick={() => window.print()}>Exportar PDF</button>
          <button className="app-btn app-btn-primary" onClick={() => setNovoAberto(true)}>+ Novo card</button>
        </div>
      </header>

      <div className="contador">
        <div className="cont-item"><span className="cont-dot conforme" /><span className="cont-num">{s.conforme}</span><span className="cont-label">Conforme</span></div>
        <div className="cont-item"><span className="cont-dot parcial" /><span className="cont-num">{s.parcial}</span><span className="cont-label">Parcial</span></div>
        <div className="cont-item"><span className="cont-dot reprovado" /><span className="cont-num">{s.reprovado}</span><span className="cont-label">Reprovado</span></div>
        <div className="cont-item"><span className="cont-dot total" /><span className="cont-num">{s.total}</span><span className="cont-label">Total</span></div>
      </div>

      <div className="app-header" style={{ marginBottom: 16 }}>
        <div className="filtros">
          <select value={filtros.categoria} onChange={(e) => setFiltros({ ...filtros, categoria: e.target.value as Categoria | '' })}>
            <option value="">Todas as categorias</option>
            {CATEGORIA_OPTS.map(([v, label]) => <option key={v} value={v}>{label}</option>)}
          </select>
          <select value={filtros.status} onChange={(e) => setFiltros({ ...filtros, status: e.target.value as Status })}>
            <option value="">Todos os status</option>
            {STATUS_OPTS.map(([v, label]) => <option key={v} value={v}>{label}</option>)}
          </select>
          <select value={filtros.fase} onChange={(e) => setFiltros({ ...filtros, fase: e.target.value as Fase | '' })}>
            <option value="">Todas as fases</option>
            {FASES.map((f) => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>
      </div>

      <div className="grid-cards">
        {visiveis.length === 0 ? (
          <div className="sem-cards">Nenhum card. Crie um novo card para começar.</div>
        ) : (
          visiveis.map((c) => (
            <CardItem
              key={c.id}
              card={c}
              onStatus={(status) => update(c.id, { status })}
              onNotas={(notas) => update(c.id, { notas })}
              onExcluir={() => setExcluindo(c.id)}
            />
          ))
        )}
      </div>

      {excluindo && (
        <ConfirmDialog
          mensagem="Excluir este card?"
          onConfirm={() => { remove(excluindo); setExcluindo(null); toast('Card excluído.'); }}
          onCancel={() => setExcluindo(null)}
        />
      )}

      {novoAberto && (
        <NovoCardModal
          onClose={() => setNovoAberto(false)}
          onCriar={(dados) => { create(dados); setNovoAberto(false); toast('Card criado!'); }}
        />
      )}
    </>
  );
}

// ── Modal de novo card ──────────────────────────────────────────────
function NovoCardModal({ onClose, onCriar }: { onClose: () => void; onCriar: (d: { titulo: string; categoria: Categoria; fase: Fase; etapasTitulos: string[] }) => void }) {
  const toast = useToast();
  const [titulo, setTitulo] = useState('');
  const [categoria, setCategoria] = useState<Categoria | ''>('');
  const [fase, setFase] = useState<Fase | ''>('');
  const [etapas, setEtapas] = useState<string[]>([]);
  const [novaEtapa, setNovaEtapa] = useState('');

  function addEtapa() {
    const v = novaEtapa.trim();
    if (!v) return;
    setEtapas([...etapas, v]);
    setNovaEtapa('');
  }

  function salvar() {
    if (!titulo.trim() || !categoria || !fase) { toast('Preencha título, categoria e fase.', true); return; }
    onCriar({ titulo: titulo.trim(), categoria, fase, etapasTitulos: etapas });
  }

  return (
    <Modal titulo="Novo card de conformidade" onClose={onClose}>
      <div className="campo">
        <label>Título do teste *</label>
        <input value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Ex: Verificação de pH da amostra A" autoFocus />
      </div>
      <div className="campo">
        <label>Categoria *</label>
        <select value={categoria} onChange={(e) => setCategoria(e.target.value as Categoria | '')}>
          <option value="">Selecione...</option>
          {CATEGORIA_OPTS.map(([v, label]) => <option key={v} value={v}>{label}</option>)}
        </select>
      </div>
      <div className="campo">
        <label>Fase *</label>
        <select value={fase} onChange={(e) => setFase(e.target.value as Fase | '')}>
          <option value="">Selecione...</option>
          {FASES.map((f) => <option key={f} value={f}>{f}</option>)}
        </select>
      </div>
      <div className="secao-label">Etapas do fluxo</div>
      <div className="lista-etapas">
        {etapas.map((t, i) => (
          <div className="etapa-item" key={i}>
            <span className="etapa-num">{i + 1}</span>
            <span className="etapa-texto">{t}</span>
            <button className="btn-rem-etapa" onClick={() => setEtapas(etapas.filter((_, j) => j !== i))}>✕</button>
          </div>
        ))}
      </div>
      <div className="add-etapa-row">
        <input
          value={novaEtapa}
          onChange={(e) => setNovaEtapa(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') addEtapa(); }}
          placeholder="Descreva a etapa..."
        />
        <button className="app-btn app-btn-outline" onClick={addEtapa}>Adicionar</button>
      </div>
      <div className="modal-acoes">
        <button className="app-btn app-btn-outline" onClick={onClose}>Cancelar</button>
        <button className="app-btn app-btn-primary" onClick={salvar}>Criar card</button>
      </div>
    </Modal>
  );
}
