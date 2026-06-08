import type { Dict } from './types';

// Dicionário EN-US. Tipado como `Dict` (= typeof pt): o `tsc` acusa
// erro se faltar ou sobrar qualquer chave em relação ao `pt`.
export const en: Dict = {
  // App / brand
  'app.nome': 'P&D Tests',

  // Navigation
  'nav.testes': 'Tests',
  'nav.painel': 'Dashboard',
  'nav.log': 'Log',
  'nav.sair': 'Sign out',

  // Accessibility
  'a11y.abrirMenu': 'Open menu',
  'a11y.fecharMenu': 'Close menu',
  'a11y.idiomaPt': 'Português',
  'a11y.idiomaEn': 'English',

  // Common
  'comum.exportarPdf': 'Export PDF',
  'comum.exportarCsv': 'Export CSV',
  'comum.cancelar': 'Cancel',
  'comum.excluir': 'Delete',
  'comum.duplicar': 'Duplicate',
  'comum.adicionar': 'Add',
  'comum.selecione': 'Select...',
  'comum.status': 'Status',
  'comum.semStatusOpt': '— No status',
  'comum.etapa': 'step',
  'comum.etapas': 'steps',

  // Reused fields
  'campo.solicitante': 'Requester',
  'campo.responsavel': 'Owner',
  'campo.categoria': 'Category',
  'campo.fase': 'Phase',
  'campo.titulo': 'Title',

  // Categories (domain labels)
  'categoria.materiaprima': 'Raw materials',
  'categoria.compatibilidade': 'Compatibility',
  'categoria.zeta': 'Zeta Potential',
  'categoria.solubilidade': 'Solubility',
  'categoria.homogeneidade': 'Homogeneity',
  'categoria.aspectos': 'Organoleptic Aspects',

  // Status (domain labels)
  'status.conforme': 'Compliant',
  'status.parcial': 'Partial',
  'status.reprovado': 'Rejected',

  // Phases (domain labels)
  'fase.Desenvolvimento': 'Development',
  'fase.Validação': 'Validation',
  'fase.Liberação': 'Release',

  // Sorting
  'ordem.recentes': 'Most recent',
  'ordem.antigos': 'Oldest',
  'ordem.titulo': 'Title (A–Z)',
  'ordem.status': 'Status',

  // Dashboard screen
  'painel.titulo': 'Dashboard',
  'painel.subtitulo': 'Overview of P&D tests',
  'painel.total': 'Total',
  'painel.semStatus': 'No status',
  'painel.distStatus': 'Distribution by status',
  'painel.porCategoria': 'Tests by category',
  'painel.porFase': 'By phase',
  'painel.porSolicitante': 'By requester',
  'painel.porResponsavel': 'By owner',

  // Tests screen
  'testes.titulo': 'Tests',
  'testes.subtitulo': 'P&D tests and their flows',
  'testes.novoCard': '+ New card',
  'testes.buscar': 'Search by title or notes...',
  'testes.todasCategorias': 'All categories',
  'testes.todosStatus': 'All statuses',
  'testes.todasFases': 'All phases',
  'testes.nenhumEncontrado': 'No cards found.',
  'testes.excluirConfirm': 'Delete this card?',
  'testes.toastNadaExportar': 'No cards to export.',
  'testes.toastCriado': 'Card created!',
  'testes.toastAtualizado': 'Card updated!',
  'testes.toastExcluido': 'Card deleted.',
  'testes.toastDuplicado': 'Card duplicated!',

  // Create/edit card modal
  'cardModal.editarTitulo': 'Edit card',
  'cardModal.novoTitulo': 'New test card',
  'cardModal.tituloTeste': 'Test title *',
  'cardModal.tituloPlaceholder': 'E.g.: pH check of sample A',
  'cardModal.categoria': 'Category *',
  'cardModal.fase': 'Phase *',
  'cardModal.solicitantePlaceholder': 'Who requested the test',
  'cardModal.responsavelPlaceholder': 'Who is responsible for the test',
  'cardModal.dica': 'Steps, status and notes are edited on the card / in the details modal.',
  'cardModal.etapasFluxo': 'Flow steps',
  'cardModal.descrevaEtapa': 'Describe the step...',
  'cardModal.salvarAlteracoes': 'Save changes',
  'cardModal.criarCard': 'Create card',
  'cardModal.preencha': 'Fill in title, category and phase.',
  'cardModal.campoObrigatorio': 'Required field',

  // CardItem
  'cardItem.abrirDetalhes': 'Open details and flow',
  'cardItem.editar': 'Edit',
  'cardItem.notasPlaceholder': 'Notes and remarks...',
  'cardItem.fluxo': 'Flow:',

  // Card details modal
  'detalhe.notasLabel': 'Notes and remarks',
  'detalhe.fluxoTeste': 'Test flow',
  'detalhe.nenhumaEtapa': 'No steps yet. Add the first one below.',
  'detalhe.etapa': 'Step',
  'detalhe.remover': 'Remove',
  'detalhe.descricaoEtapa': 'Step description...',
  'detalhe.selecioneFase': 'Select the phase...',
  'detalhe.feedbackPlaceholder': 'Record your impression / feedback...',
  'detalhe.adicionarEtapa': '+ Add step',

  // Confirm dialog
  'confirm.titulo': 'Confirm',

  // Duplicate dialog
  'dup.titulo': 'Duplicate card',
  'dup.intro1': 'A copy ',
  'dup.modelo': 'as a template',
  'dup.intro2': ' will be created with:',
  'dup.copia': '(copy)',
  'dup.titulosEFases': '(titles and phases)',
  'dup.reset1': 'Will be ',
  'dup.zerado': 'reset',
  'dup.reset2': ' in the copy: status, notes and step feedback.',

  // Authorship
  'autoria.criadoPor': 'created by',
  'autoria.editadoPor': 'edited by',
  'autoria.em': 'on',
  'autoria.sistema': 'System',

  // Log screen
  'log.titulo': 'Activity log',
  'log.subtitulo': 'History of who created, edited, duplicated and deleted',
  'log.vazio': 'No activity recorded yet.',
  'log.acaoCriou': 'Created',
  'log.acaoEditou': 'Edited',
  'log.acaoDuplicou': 'Duplicated',
  'log.acaoExcluiu': 'Deleted',

  // Log detail (text generated at action time)
  'logDet.statusPara': 'Changed status to',
  'logDet.statusRemovido': 'Removed the status',
  'logDet.notasEditadas': 'Edited the notes',
  'logDet.dadosEditados': 'Edited the card data',
  'logDet.cardEditado': 'Edited the card',
  'logDet.fluxoEditado': 'Edited the flow',

  // CSV (header)
  'csv.titulo': 'Title',
  'csv.categoria': 'Category',
  'csv.fase': 'Phase',
  'csv.status': 'Status',
  'csv.solicitante': 'Requester',
  'csv.responsavel': 'Owner',
  'csv.notas': 'Notes',
  'csv.etapas': 'Steps',
  'csv.fasesEtapas': 'Step phases',
  'csv.feedbacks': 'Feedbacks',
  'csv.criadoEm': 'Created at',
  'csv.criadoPor': 'Created by',
  'csv.editadoPor': 'Edited by',

  // Login
  'login.subtitulo': 'Restricted to Nanovetores accounts.',
  'login.entrar': 'Sign in with Microsoft',
  'login.naoConfigPre': 'Login not configured. Set ',
  'login.naoConfigMid': ' and ',
  'login.naoConfigFile': ' in the ',

  // Erro (boundary)
  'erro.titulo': 'Something went wrong',
  'erro.mensagem': 'An unexpected error occurred on this screen. Try reloading the page.',
  'erro.recarregar': 'Reload',
};
