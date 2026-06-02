import { useMemo, useState } from 'react';
import { useCards } from '../store/CardsContext';
import { useToast } from '../components/Toast';
import { contarStatus, filtrarCards, buscarCards, ordenarCards } from '../data/derive';
import { CATEGORIAS, STATUS_VALUES, FASES, ORDENS } from '../data/constants';
import { useI18n } from '../i18n/LanguageContext';
import { categoriaKey, statusKey, faseKey, ordemKey } from '../i18n/labels';
import { cardsToCsv } from '../lib/csv';
import type { Card, Categoria, Fase, Filtros, Ordem, Status } from '../data/types';
import { CardItem } from '../components/CardItem';
import { CardDetalheModal } from '../components/CardDetalheModal';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { DuplicarDialog } from '../components/DuplicarDialog';
import { Modal } from '../components/Modal';

const FILTROS_VAZIO: Filtros = { categoria: '', status: '', fase: '' };

export function Testes() {
  const { cards, create, update, remove, duplicate, setEtapas } = useCards();
  const { t, lang } = useI18n();
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
    if (!cards.length) { toast(t('testes.toastNadaExportar'), true); return; }
    const blob = new Blob(['﻿' + cardsToCsv(cards, t, lang)], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `testes-pd-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <header className="app-header">
        <div>
          <h1>{t('testes.titulo')}</h1>
          <div className="app-header-sub">{t('testes.subtitulo')}</div>
        </div>
        <div className="app-header-actions">
          <button className="app-btn app-btn-outline" onClick={exportarCsv}>{t('comum.exportarCsv')}</button>
          <button className="app-btn app-btn-outline" onClick={() => window.print()}>{t('comum.exportarPdf')}</button>
          <button className="app-btn app-btn-primary" onClick={() => setNovoAberto(true)}>{t('testes.novoCard')}</button>
        </div>
      </header>

      <div className="contador">
        <div className="cont-item"><span className="cont-dot conforme" /><span className="cont-num">{s.conforme}</span><span className="cont-label">{t('status.conforme')}</span></div>
        <div className="cont-item"><span className="cont-dot parcial" /><span className="cont-num">{s.parcial}</span><span className="cont-label">{t('status.parcial')}</span></div>
        <div className="cont-item"><span className="cont-dot reprovado" /><span className="cont-num">{s.reprovado}</span><span className="cont-label">{t('status.reprovado')}</span></div>
        <div className="cont-item"><span className="cont-dot total" /><span className="cont-num">{s.total}</span><span className="cont-label">{t('painel.total')}</span></div>
      </div>

      <div className="app-header" style={{ marginBottom: 16 }}>
        <div className="filtros">
          <input
            className="filtro-busca"
            type="search"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder={t('testes.buscar')}
          />
          <select value={filtros.categoria} onChange={(e) => setFiltros({ ...filtros, categoria: e.target.value as Categoria | '' })}>
            <option value="">{t('testes.todasCategorias')}</option>
            {CATEGORIAS.map((v) => <option key={v} value={v}>{t(categoriaKey(v))}</option>)}
          </select>
          <select value={filtros.status} onChange={(e) => setFiltros({ ...filtros, status: e.target.value as Status })}>
            <option value="">{t('testes.todosStatus')}</option>
            {STATUS_VALUES.map((v) => <option key={v} value={v}>{t(statusKey(v))}</option>)}
          </select>
          <select value={filtros.fase} onChange={(e) => setFiltros({ ...filtros, fase: e.target.value as Fase | '' })}>
            <option value="">{t('testes.todasFases')}</option>
            {FASES.map((f) => <option key={f} value={f}>{t(faseKey(f))}</option>)}
          </select>
          <select value={ordem} onChange={(e) => setOrdem(e.target.value as Ordem)}>
            {ORDENS.map((o) => <option key={o} value={o}>{t(ordemKey(o))}</option>)}
          </select>
        </div>
      </div>

      <div className="grid-cards">
        {visiveis.length === 0 ? (
          <div className="sem-cards">{t('testes.nenhumEncontrado')}</div>
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
          onConfirm={() => { duplicate(cardDuplicando.id); setDuplicando(null); toast(t('testes.toastDuplicado')); }}
          onCancel={() => setDuplicando(null)}
        />
      )}

      {excluindo && (
        <ConfirmDialog
          mensagem={t('testes.excluirConfirm')}
          onConfirm={() => { remove(excluindo); setExcluindo(null); toast(t('testes.toastExcluido')); }}
          onCancel={() => setExcluindo(null)}
        />
      )}

      {novoAberto && (
        <CardModal
          onClose={() => setNovoAberto(false)}
          onSubmit={(dados) => { create(dados); setNovoAberto(false); toast(t('testes.toastCriado')); }}
        />
      )}

      {editando && (
        <CardModal
          card={editando}
          onClose={() => setEditando(null)}
          onSubmit={(dados) => {
            update(editando.id, { titulo: dados.titulo, categoria: dados.categoria, fase: dados.fase, solicitante: dados.solicitante, responsavel: dados.responsavel });
            setEditando(null);
            toast(t('testes.toastAtualizado'));
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
  const { t } = useI18n();
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
    if (!titulo.trim() || !categoria || !fase) { toast(t('cardModal.preencha'), true); return; }
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
    <Modal titulo={editando ? t('cardModal.editarTitulo') : t('cardModal.novoTitulo')} onClose={onClose} className="modal-medio">
      <div className="campo">
        <label>{t('cardModal.tituloTeste')}</label>
        <input value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder={t('cardModal.tituloPlaceholder')} autoFocus />
      </div>
      <div className="campo">
        <label>{t('cardModal.categoria')}</label>
        <select value={categoria} onChange={(e) => setCategoria(e.target.value as Categoria | '')}>
          <option value="">{t('comum.selecione')}</option>
          {CATEGORIAS.map((v) => <option key={v} value={v}>{t(categoriaKey(v))}</option>)}
        </select>
      </div>
      <div className="campo">
        <label>{t('cardModal.fase')}</label>
        <select value={fase} onChange={(e) => setFase(e.target.value as Fase | '')}>
          <option value="">{t('comum.selecione')}</option>
          {FASES.map((f) => <option key={f} value={f}>{t(faseKey(f))}</option>)}
        </select>
      </div>
      <div className="campo">
        <label>{t('campo.solicitante')}</label>
        <input value={solicitante} onChange={(e) => setSolicitante(e.target.value)} placeholder={t('cardModal.solicitantePlaceholder')} />
      </div>
      <div className="campo">
        <label>{t('campo.responsavel')}</label>
        <input value={responsavel} onChange={(e) => setResponsavel(e.target.value)} placeholder={t('cardModal.responsavelPlaceholder')} />
      </div>
      {editando ? (
        <p className="modal-dica">{t('cardModal.dica')}</p>
      ) : (
        <>
          <div className="secao-label">{t('cardModal.etapasFluxo')}</div>
          <div className="lista-etapas">
            {etapas.map((titulo, i) => (
              <div className="etapa-item" key={i}>
                <span className="etapa-num">{i + 1}</span>
                <span className="etapa-texto">{titulo}</span>
                <button className="btn-rem-etapa" onClick={() => setEtapas(etapas.filter((_, j) => j !== i))}>✕</button>
              </div>
            ))}
          </div>
          <div className="add-etapa-row">
            <input
              value={novaEtapa}
              onChange={(e) => setNovaEtapa(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') addEtapa(); }}
              placeholder={t('cardModal.descrevaEtapa')}
            />
            <button className="app-btn app-btn-outline" onClick={addEtapa}>{t('comum.adicionar')}</button>
          </div>
        </>
      )}
      <div className="modal-acoes">
        <button className="app-btn app-btn-outline" onClick={onClose}>{t('comum.cancelar')}</button>
        <button className="app-btn app-btn-primary" onClick={salvar}>{editando ? t('cardModal.salvarAlteracoes') : t('cardModal.criarCard')}</button>
      </div>
    </Modal>
  );
}
