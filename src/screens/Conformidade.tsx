import { useMemo, useState } from 'react';
import { useCards } from '../store/CardsContext';
import { useToast } from '../components/Toast';
import { contarStatus, filtrarCards, buscarCards, ordenarCards } from '../data/derive';
import { CATEGORIA_OPTS, STATUS_OPTS, FASES, ORDEM_OPTS } from '../data/constants';
import { cardsToCsv } from '../lib/csv';
import type { Card, Categoria, Fase, Filtros, Ordem, Status } from '../data/types';
import { CardItem } from '../components/CardItem';
import { CardDetalheModal } from '../components/CardDetalheModal';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { DuplicarDialog } from '../components/DuplicarDialog';
import { Modal } from '../components/Modal';

const FILTROS_VAZIO: Filtros = { categoria: '', status: '', fase: '' };

export function Conformidade() {
  const { cards, create, update, remove, duplicate, setEtapas } = useCards();
  const toast = useToast();
  const [filtros, setFiltros] = useState<Filtros>(FILTROS_VAZIO);
  const [busca, setBusca] = useState('');
  const [ordem, setOrdem] = useState<Ordem>('recentes');
  const [excluindo, setExcluindo] = useState<string | null>(null);
  const [novoAberto, setNovoAberto] = useState(false);
  const [editando, setEditando] = useState<Card | null>(null);
  const [detalheId, setDetalheId] = useState<string | null>(null);
  const cardDetalhe = detalheId ? cards.find((c) => c.id === detalheId) ?? null : null;
  const [duplicando, setDuplicando] = useState<string | null>(null);
  const cardDuplicando = duplicando ? cards.find((c) => c.id === duplicando) ?? null : null;

  const s = contarStatus(cards);
  const visiveis = useMemo(
    () => ordenarCards(filtrarCards(buscarCards(cards, busca), filtros), ordem),
    [cards, busca, filtros, ordem],
  );

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
          <input
            className="filtro-busca"
            type="search"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por título ou notas..."
          />
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
          <select value={ordem} onChange={(e) => setOrdem(e.target.value as Ordem)}>
            {ORDEM_OPTS.map(([v, label]) => <option key={v} value={v}>{label}</option>)}
          </select>
        </div>
      </div>

      <div className="grid-cards">
        {visiveis.length === 0 ? (
          <div className="sem-cards">Nenhum card encontrado.</div>
        ) : (
          visiveis.map((c) => (
            <CardItem
              key={c.id}
              card={c}
              onStatus={(status) => update(c.id, { status })}
              onNotas={(notas) => update(c.id, { notas })}
              onAbrir={() => setDetalheId(c.id)}
              onEditar={() => setEditando(c)}
              onDuplicar={() => setDuplicando(c.id)}
              onExcluir={() => setExcluindo(c.id)}
            />
          ))
        )}
      </div>

      {cardDetalhe && (
        <CardDetalheModal
          card={cardDetalhe}
          onClose={() => setDetalheId(null)}
          onStatus={(status) => update(cardDetalhe.id, { status })}
          onNotas={(notas) => update(cardDetalhe.id, { notas })}
          onEtapas={(etapas) => setEtapas(cardDetalhe.id, etapas)}
        />
      )}

      {cardDuplicando && (
        <DuplicarDialog
          card={cardDuplicando}
          onConfirm={() => { duplicate(cardDuplicando.id); setDuplicando(null); toast('Card duplicado!'); }}
          onCancel={() => setDuplicando(null)}
        />
      )}

      {excluindo && (
        <ConfirmDialog
          mensagem="Excluir este card?"
          onConfirm={() => { remove(excluindo); setExcluindo(null); toast('Card excluído.'); }}
          onCancel={() => setExcluindo(null)}
        />
      )}

      {novoAberto && (
        <CardModal
          onClose={() => setNovoAberto(false)}
          onSubmit={(dados) => { create(dados); setNovoAberto(false); toast('Card criado!'); }}
        />
      )}

      {editando && (
        <CardModal
          card={editando}
          onClose={() => setEditando(null)}
          onSubmit={(dados) => {
            update(editando.id, { titulo: dados.titulo, categoria: dados.categoria, fase: dados.fase, solicitante: dados.solicitante, responsavel: dados.responsavel });
            setEditando(null);
            toast('Card atualizado!');
          }}
        />
      )}
    </>
  );
}

interface CardModalDados {
  titulo: string;
  categoria: Categoria;
  fase: Fase;
  etapasTitulos: string[];
  solicitante?: string;
  responsavel?: string;
}

// ── Modal de criar/editar card ──────────────────────────────────────
function CardModal({ card, onClose, onSubmit }: { card?: Card; onClose: () => void; onSubmit: (d: CardModalDados) => void }) {
  const toast = useToast();
  const editando = !!card;
  const [titulo, setTitulo] = useState(card?.titulo ?? '');
  const [categoria, setCategoria] = useState<Categoria | ''>(card?.categoria ?? '');
  const [fase, setFase] = useState<Fase | ''>(card?.fase ?? '');
  const [solicitante, setSolicitante] = useState(card?.solicitante ?? '');
  const [responsavel, setResponsavel] = useState(card?.responsavel ?? '');
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
    onSubmit({
      titulo: titulo.trim(),
      categoria,
      fase,
      etapasTitulos: etapas,
      solicitante: solicitante.trim() || undefined,
      responsavel: responsavel.trim() || undefined,
    });
  }

  return (
    <Modal titulo={editando ? 'Editar card' : 'Novo card de conformidade'} onClose={onClose} className="modal-medio">
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
      <div className="campo">
        <label>Solicitante</label>
        <input value={solicitante} onChange={(e) => setSolicitante(e.target.value)} placeholder="Quem solicitou o teste" />
      </div>
      <div className="campo">
        <label>Responsável</label>
        <input value={responsavel} onChange={(e) => setResponsavel(e.target.value)} placeholder="Quem é responsável pelo teste" />
      </div>
      {editando ? (
        <p className="modal-dica">As etapas, o status e as notas são editados no card / no modal de detalhes.</p>
      ) : (
        <>
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
        </>
      )}
      <div className="modal-acoes">
        <button className="app-btn app-btn-outline" onClick={onClose}>Cancelar</button>
        <button className="app-btn app-btn-primary" onClick={salvar}>{editando ? 'Salvar alterações' : 'Criar card'}</button>
      </div>
    </Modal>
  );
}
