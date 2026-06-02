// Dicionário PT-BR — fonte da verdade das chaves de tradução.
// O dicionário `en` é tipado como `typeof pt`, então qualquer chave
// faltante/sobrando lá é erro de compilação.
export const pt = {
  // App / marca
  'app.nome': 'Testes P&D',

  // Navegação
  'nav.testes': 'Testes',
  'nav.painel': 'Painel',
  'nav.log': 'Log',
  'nav.sair': 'Sair',

  // Acessibilidade
  'a11y.abrirMenu': 'Abrir menu',
  'a11y.fecharMenu': 'Fechar menu',
  'a11y.idiomaPt': 'Português',
  'a11y.idiomaEn': 'English',

  // Comuns
  'comum.exportarPdf': 'Exportar PDF',
  'comum.exportarCsv': 'Exportar CSV',
  'comum.cancelar': 'Cancelar',
  'comum.excluir': 'Excluir',
  'comum.duplicar': 'Duplicar',
  'comum.adicionar': 'Adicionar',
  'comum.selecione': 'Selecione...',
  'comum.status': 'Status',
  'comum.semStatusOpt': '— Sem status',
  'comum.etapa': 'etapa',
  'comum.etapas': 'etapas',

  // Campos reutilizados
  'campo.solicitante': 'Solicitante',
  'campo.responsavel': 'Responsável',
  'campo.categoria': 'Categoria',
  'campo.fase': 'Fase',
  'campo.titulo': 'Título',

  // Categorias (rótulos de domínio)
  'categoria.materiaprima': 'Matérias-primas',
  'categoria.compatibilidade': 'Compatibilidade',
  'categoria.zeta': 'Potencial de Zeta',
  'categoria.solubilidade': 'Solubilidade',
  'categoria.homogeneidade': 'Homogeneidade',
  'categoria.aspectos': 'Aspectos Organolépticos',

  // Status (rótulos de domínio)
  'status.conforme': 'Conforme',
  'status.parcial': 'Parcial',
  'status.reprovado': 'Reprovado',

  // Fases (rótulos de domínio)
  'fase.Desenvolvimento': 'Desenvolvimento',
  'fase.Validação': 'Validação',
  'fase.Liberação': 'Liberação',

  // Ordenação
  'ordem.recentes': 'Mais recentes',
  'ordem.antigos': 'Mais antigos',
  'ordem.titulo': 'Título (A–Z)',
  'ordem.status': 'Status',

  // Tela Painel
  'painel.titulo': 'Painel',
  'painel.subtitulo': 'Visão geral dos testes P&D',
  'painel.total': 'Total',
  'painel.semStatus': 'Sem status',
  'painel.distStatus': 'Distribuição por status',
  'painel.porCategoria': 'Testes por categoria',
  'painel.porFase': 'Por fase',
  'painel.porSolicitante': 'Por solicitante',
  'painel.porResponsavel': 'Por responsável',

  // Tela Testes
  'testes.titulo': 'Testes',
  'testes.subtitulo': 'Testes de P&D e seus fluxos',
  'testes.novoCard': '+ Novo card',
  'testes.buscar': 'Buscar por título ou notas...',
  'testes.todasCategorias': 'Todas as categorias',
  'testes.todosStatus': 'Todos os status',
  'testes.todasFases': 'Todas as fases',
  'testes.nenhumEncontrado': 'Nenhum card encontrado.',
  'testes.excluirConfirm': 'Excluir este card?',
  'testes.toastNadaExportar': 'Nenhum card para exportar.',
  'testes.toastCriado': 'Card criado!',
  'testes.toastAtualizado': 'Card atualizado!',
  'testes.toastExcluido': 'Card excluído.',
  'testes.toastDuplicado': 'Card duplicado!',

  // Modal de criar/editar card
  'cardModal.editarTitulo': 'Editar card',
  'cardModal.novoTitulo': 'Novo card de teste',
  'cardModal.tituloTeste': 'Título do teste *',
  'cardModal.tituloPlaceholder': 'Ex: Verificação de pH da amostra A',
  'cardModal.categoria': 'Categoria *',
  'cardModal.fase': 'Fase *',
  'cardModal.solicitantePlaceholder': 'Quem solicitou o teste',
  'cardModal.responsavelPlaceholder': 'Quem é responsável pelo teste',
  'cardModal.dica': 'As etapas, o status e as notas são editados no card / no modal de detalhes.',
  'cardModal.etapasFluxo': 'Etapas do fluxo',
  'cardModal.descrevaEtapa': 'Descreva a etapa...',
  'cardModal.salvarAlteracoes': 'Salvar alterações',
  'cardModal.criarCard': 'Criar card',
  'cardModal.preencha': 'Preencha título, categoria e fase.',

  // CardItem
  'cardItem.abrirDetalhes': 'Abrir detalhes e fluxo',
  'cardItem.editar': 'Editar',
  'cardItem.notasPlaceholder': 'Notas e observações...',
  'cardItem.fluxo': 'Fluxo:',

  // Modal de detalhe do card
  'detalhe.notasLabel': 'Notas e observações',
  'detalhe.fluxoTeste': 'Fluxo do teste',
  'detalhe.nenhumaEtapa': 'Nenhuma etapa cadastrada. Adicione a primeira abaixo.',
  'detalhe.etapa': 'Etapa',
  'detalhe.remover': 'Remover',
  'detalhe.descricaoEtapa': 'Descrição da etapa...',
  'detalhe.selecioneFase': 'Selecione a fase...',
  'detalhe.feedbackPlaceholder': 'Registre sua percepção / feedback...',
  'detalhe.adicionarEtapa': '+ Adicionar etapa',

  // Diálogo de confirmação
  'confirm.titulo': 'Confirmar',

  // Diálogo de duplicação
  'dup.titulo': 'Duplicar card',
  'dup.intro1': 'Uma cópia ',
  'dup.modelo': 'como modelo',
  'dup.intro2': ' será criada com:',
  'dup.copia': '(cópia)',
  'dup.titulosEFases': '(títulos e fases)',
  'dup.reset1': 'Será ',
  'dup.zerado': 'zerado',
  'dup.reset2': ' na cópia: status, notas e os feedbacks das etapas.',

  // Autoria
  'autoria.criadoPor': 'criado por',
  'autoria.editadoPor': 'editado por',
  'autoria.em': 'em',
  'autoria.sistema': 'Sistema',

  // Tela Log
  'log.titulo': 'Log de atividades',
  'log.subtitulo': 'Histórico de quem criou, editou, duplicou e excluiu',
  'log.vazio': 'Nenhuma atividade registrada ainda.',
  'log.acaoCriou': 'Criou',
  'log.acaoEditou': 'Editou',
  'log.acaoDuplicou': 'Duplicou',
  'log.acaoExcluiu': 'Excluiu',

  // Detalhe do log (texto gerado na ação)
  'logDet.statusPara': 'Alterou o status para',
  'logDet.statusRemovido': 'Removeu o status',
  'logDet.notasEditadas': 'Editou as notas',
  'logDet.dadosEditados': 'Editou os dados do card',
  'logDet.cardEditado': 'Editou o card',
  'logDet.fluxoEditado': 'Editou o fluxo',

  // CSV (cabeçalho)
  'csv.titulo': 'Titulo',
  'csv.categoria': 'Categoria',
  'csv.fase': 'Fase',
  'csv.status': 'Status',
  'csv.solicitante': 'Solicitante',
  'csv.responsavel': 'Responsavel',
  'csv.notas': 'Notas',
  'csv.etapas': 'Etapas',
  'csv.fasesEtapas': 'Fases das etapas',
  'csv.feedbacks': 'Feedbacks',
  'csv.criadoEm': 'Criado em',
  'csv.criadoPor': 'Criado por',
  'csv.editadoPor': 'Editado por',

  // Login
  'login.subtitulo': 'Acesso restrito a contas Nanovetores.',
  'login.entrar': 'Entrar com Microsoft',
  'login.naoConfigPre': 'Login não configurado. Defina ',
  'login.naoConfigMid': ' e ',
  'login.naoConfigFile': ' no arquivo ',
} satisfies Record<string, string>;
