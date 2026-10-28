import {
  SystemProduct,
  SystemAdvantage,
  SystemOfferedCategory,
  SystemDemoVideo,
  SystemFaqItem,
} from '../types';

export interface VideoPlayerSource {
  type: 'youtube' | 'video' | 'none';
  src: string;
}

export function resolveVideoPlayerSource(rawUrl?: string): VideoPlayerSource {
  const url = (rawUrl || '').trim();
  if (!url) {
    return { type: 'none', src: '' };
  }

  // Match standard YouTube URLs: youtube.com/watch?v=ID, youtu.be/ID, youtube.com/embed/ID, youtube.com/shorts/ID
  const ytMatch = url.match(
    /(?:youtube\.com\/(?:watch\?.*v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{6,})/
  );
  if (ytMatch && ytMatch[1]) {
    return {
      type: 'youtube',
      src: `https://www.youtube.com/embed/${ytMatch[1]}?rel=0`,
    };
  }

  if (url.includes('youtube.com/embed/')) {
    return {
      type: 'youtube',
      src: url,
    };
  }

  return {
    type: 'video',
    src: url,
  };
}

export interface EnrichedSystemDetails {
  overview: string;
  videoUrl?: string;
  whatItDoes: string[];
  advantages: SystemAdvantage[];
  offeredCategories: SystemOfferedCategory[];
  demoVideos: SystemDemoVideo[];
  faqs: SystemFaqItem[];
}

const CATEGORY_PRESETS: Record<
  string,
  {
    whatItDoes: string[];
    advantages: SystemAdvantage[];
    offeredCategories: SystemOfferedCategory[];
    demoVideos: (sys: SystemProduct) => SystemDemoVideo[];
  }
> = {
  Padaria: {
    whatItDoes: [
      'Regista cada fornada produzida e desconta automaticamente o consumo exato de farinha, fermento, açúcar e matéria-prima do armazém.',
      'Realiza vendas ultra-rápidas no balcão por unidade ou peso (ligado a balanças digitais) com emissão instantânea de senha e talão térmico.',
      'Gere encomendas de bolos de aniversário, salgados e catering com alerta de recolha, sinal pago via M-Pesa/E-Mola e saldo na entrega.',
      'Controla turnos de operadores de caixa com fecho cego, apuramento de quebras de produção e relatório de lucro líquido diário.',
    ],
    advantages: [
      {
        title: 'Redução Drástica no Desperdício de Farinha',
        description: 'Compare o número de pães saídos do forno com a matéria-prima entregue aos padeiros em cada turno.',
        metric: '-22% Quebra de Insumos',
      },
      {
        title: 'Atendimento Balcão em Segundos nas Horas de Ponta',
        description: 'Teclas rápidas visuais para pão quente, pastelaria e café sem filas às 06h00 e 17h00.',
        metric: '3x Mais Rápido no Caixa',
      },
      {
        title: '100% Funcional Mesmo Sem Energia ou Internet',
        description: 'Continue a faturar normalmente em tablets ou terminais POS portáteis durante cortes da EDM.',
        metric: '100% Operação Offline',
      },
      {
        title: 'Pagamentos Móveis e Bancários Integrados',
        description: 'Reconciliação automática de M-Pesa, E-Mola e POS bancário no fecho de cada turno.',
        metric: 'Zero Erros de Troco',
      },
    ],
    offeredCategories: [
      {
        name: 'Panificação & Controlo de Fornadas',
        description: 'Fichas técnicas de receitas, consumo de sacos de farinha de 50kg e produtividade por turno.',
        badge: 'Produção',
      },
      {
        name: 'Balcão POS & Padaria Express',
        description: 'Venda rápida por toque, integração com balança eletrónica e impressão de senhas de balcão.',
        badge: 'Caixa Rápido',
      },
      {
        name: 'Confeitaria, Pastelaria & Café',
        description: 'Gestão de vitrine, validade de doces frescos, bebidas quentes e combos de pequeno-almoço.',
        badge: 'Pastelaria',
      },
      {
        name: 'Encomendas de Bolos & Eventos',
        description: 'Agenda de entregas, personalização de bolos, cobrança de sinal de 50% por M-Pesa e recibo.',
        badge: 'Encomendas',
      },
      {
        name: 'Distribuição & Revendedores de Pão',
        description: 'Controlo de motoristas, carrinhas de distribuição, entregas em mercearias e acerto de devoluções.',
        badge: 'Frota & Rotas',
      },
      {
        name: 'Financeiro, Stock & Fecho de Turno',
        description: 'Fluxo de caixa, alertas de stock mínimo de insumos e mapas fiscais de IVA.',
        badge: 'Gestão',
      },
    ],
    demoVideos: (sys) => [
      {
        id: `${sys.id}-vid-1`,
        title: '1. Venda Rápida no Balcão & Emissão de Senhas de Pão Quente',
        duration: '02:45',
        category: 'Ponto de Venda (POS)',
        description: 'Veja como atender clientes em menos de 4 segundos no balcão, pesar produtos de pastelaria e imprimir o talão térmico.',
        thumbnailUrl: sys.imageUrl,
        steps: [
          'Seleção rápida de Pão de Carcaça, Pão Doce e Pastel de Nata no ecrã tátil',
          'Leitura automática de peso na balança digital e cálculo instantâneo em Meticais (MZN)',
          'Pagamento via M-Pesa STK Push com confirmação imediata no terminal',
          'Impressão do talão fiscal + senha de levantamento no balcão de pão quente',
        ],
      },
      {
        id: `${sys.id}-vid-2`,
        title: '2. Controlo de Fornadas, Receitas & Consumo de Sacos de Farinha',
        duration: '03:20',
        category: 'Produção & Stock',
        description: 'Demonstração completa de como lançar uma ordem de produção para os padeiros e auditar o rendimento de cada saco de 50kg.',
        thumbnailUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80',
        steps: [
          'Abertura do turno de panificação e requisição de farinha e fermento ao armazém',
          'Registo da quantidade real de pães produzidos vs. rendimento esperado da receita',
          'Cálculo automático do custo unitário por pão e margem de lucro bruta',
          'Alerta automático de reposição de stock para o fornecedor',
        ],
      },
      {
        id: `${sys.id}-vid-3`,
        title: '3. Encomendas de Bolos, Fecho de Turno & Relatórios no Telemóvel',
        duration: '02:15',
        category: 'Gestão & Mobile',
        description: 'Saiba como gerir encomendas de eventos e acompanhar todas as vendas da padaria em tempo real pelo smartphone.',
        thumbnailUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80',
        steps: [
          'Registo de encomenda de Bolo de Aniversário com sinal pago por E-Mola',
          'Conferência de fecho de caixa cego na troca de turno às 14h00',
          'Visualização do painel do proprietário no telemóvel com vendas do dia em MZN',
        ],
      },
    ],
  },
  Mercearia: {
    whatItDoes: [
      'Acelera o atendimento na caixa com leitura instantânea de código de barras por scanner laser ou câmara.',
      'Substitui o caderno de papel pelo Módulo de Crédito e Fiado Digital com limite máximo por cliente e extrato no WhatsApp.',
      'Monitoriza prazos de validade de laticínios, enlatados, arroz, óleo e bebidas com avisos antecipados de vencimento.',
      'Calcula automaticamente o lucro real de cada artigo, controlando preços de custo por fardo/caixa e venda a retalho.',
    ],
    advantages: [
      {
        title: 'Recuperação Total das Vendas a Fiado',
        description: 'Bloqueio automático de clientes com saldo vencido e envio de lembretes amigáveis por SMS/WhatsApp.',
        metric: '+35% Recuperação de Crédito',
      },
      {
        title: 'Zero Perdas por Produtos Fora de Prazo',
        description: 'Alertas automáticos 30 dias antes do vencimento para criar promoções de escoamento rápido.',
        metric: '-90% Quebras por Validade',
      },
      {
        title: 'Conversão Automática Fardo / Caixa para Unidade',
        description: 'Compre em caixas ou sacos de 25kg/50kg e venda ao quilo ou à unidade com baixa exata no stock.',
        metric: 'Stock 100% Certo',
      },
      {
        title: 'Funcionamento Contínuo Sem Internet',
        description: 'Base de dados local ultrarrápida que nunca trava a fila da mercearia.',
        metric: '0s Latência no Balcão',
      },
    ],
    offeredCategories: [
      {
        name: 'Frente de Caixa (POS) & Código de Barras',
        description: 'Venda rápida com leitor de código de barras, teclas de atalho e cálculo automático de troco.',
        badge: 'Caixa POS',
      },
      {
        name: 'Caderno Digital de Clientes & Fiado',
        description: 'Controlo de conta-corrente de moradores do bairro, tecto de crédito e histórico de amortizações.',
        badge: 'Fiado Digital',
      },
      {
        name: 'Fracionamento (Sacos, Quilos & Retalho)',
        description: 'Desmembramento automático de sacos de arroz/açúcar e caixas de óleo para venda avulsa.',
        badge: 'Retalho & Grosso',
      },
      {
        name: 'Controlo de Validade & Lotes Perecíveis',
        description: 'Monitorização de datas de fabrico e expiração para produtos alimentares e higiene.',
        badge: 'Validades',
      },
      {
        name: 'Pagamentos M-Pesa, E-Mola & TPA',
        description: 'Cobrança integrada no balcão sem necessidade de confirmar SMS manualmente no telemóvel.',
        badge: 'Carteiras Móveis',
      },
      {
        name: 'Compras, Fornecedores & Margem de Lucro',
        description: 'Entrada de faturas de armazenistas e atualização automática do preço de venda sugerido.',
        badge: 'Financeiro',
      },
    ],
    demoVideos: (sys) => [
      {
        id: `${sys.id}-vid-1`,
        title: '1. Caixa Rápido com Leitor de Código de Barras & Pagamento M-Pesa',
        duration: '02:30',
        category: 'Frente de Caixa',
        description: 'Veja a rapidez de passar produtos no leitor de código de barras, aplicar descontos e emitir o recibo da mercearia.',
        thumbnailUrl: sys.imageUrl,
        steps: [
          'Bipagem rápida de Arroz 25kg, Óleo 5L e Açúcar pelo leitor de código de barras',
          'Consulta imediata de preço e stock disponível no ecrã do operador',
          'Pagamento misto (Dinheiro + M-Pesa) e abertura automática da gaveta de dinheiro',
          'Impressão do talão com logotipo e NUIT da mercearia',
        ],
      },
      {
        id: `${sys.id}-vid-2`,
        title: '2. Como Funciona o Caderno de Crédito (Fiado Digital) de Clientes',
        duration: '03:10',
        category: 'Gestão de Fiado',
        description: 'Aprenda a registar vendas a prazo com segurança, definir limites de crédito e enviar o comprovativo ao cliente.',
        thumbnailUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
        steps: [
          'Seleção da conta da cliente e verificação do limite de crédito disponível',
          'Lançamento da compra a prazo com assinatura/PIN de confirmação',
          'Registo de amortização parcial da dívida e emissão de recibo de quitação',
        ],
      },
      {
        id: `${sys.id}-vid-3`,
        title: '3. Entrada de Mercadoria por Caixa/Saco e Alertas de Stock Mínimo',
        duration: '02:50',
        category: 'Stock & Validades',
        description: 'Demonstração da conversão automática de caixas fechadas em unidades de venda e alertas de validade.',
        thumbnailUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
        steps: [
          'Entrada de fatura do fornecedor Grossista no armazém',
          'Conversão automática de fardos para unidades de prateleira',
          'Painel de produtos prestes a atingir o stock mínimo ou validade próxima',
        ],
      },
    ],
  },
  Ferragens: {
    whatItDoes: [
      'Converte automaticamente unidades de medida complexas: venda tubo ao metro, ferro ao varão, areia ao m³, pregos ao quilo e cimento ao saco.',
      'Gera Cotações e Faturas Proforma em PDF em 1 clique para empreiteiros, construtoras e clientes de obras.',
      'Controla entregas faseadas em obra: o cliente paga 100 sacos de cimento hoje e levanta em 3 carregamentos com guia de remessa.',
      'Gere múltiplos armazéns, estaleiros e pátios de materiais pesados com controlo rigoroso de saída de camiões.',
    ],
    advantages: [
      {
        title: 'Cotações Profissionais para Obras em 30 Segundos',
        description: 'Transforme listas de materiais de construção em Faturas Proforma prontas e envie por WhatsApp ou Email.',
        metric: '+45% Fecho de Orçamentos',
      },
      {
        title: 'Controlo de Levantamentos Faseados de Cimento e Ferro',
        description: 'Saiba exatamente quantos sacos ou varões o cliente já levantou e quantos faltam entregar na obra.',
        metric: 'Zero Erros na Entrega',
      },
      {
        title: 'Venda Fracionada Sem Erros de Cálculo',
        description: 'Calcule automaticamente o preço de 2,5 metros de tubo ou 0,5 kg de parafusos sem usar calculadora.',
        metric: '100% Precisão de Medidas',
      },
      {
        title: 'Gestão de Preços para Empreiteiros e Balcão',
        description: 'Tabelas diferenciadas para clientes finais, mestres de obra com comissão e construtoras.',
        metric: '3 Tabelas de Preço',
      },
    ],
    offeredCategories: [
      {
        name: 'Materiais Pesados (Cimento, Ferro, Blocos & Inertes)',
        description: 'Gestão de pátio externo, controlo de lotes de cimento e carregamento de viaturas.',
        badge: 'Construção Civil',
      },
      {
        name: 'Conversão de Medidas (Metros, Quilos, Litros & Rolos)',
        description: 'Venda fracionada de cabos elétricos, mangueiras, chapas de zinco, redes e tubagens.',
        badge: 'Fracionamento',
      },
      {
        name: 'Orçamentos, Proformas & Concursos Públicos',
        description: 'Emissão rápida de propostas comerciais detalhadas com validade, NUIT e dados bancários.',
        badge: 'Proformas PDF',
      },
      {
        name: 'Guias de Remessa, Transporte & Entregas em Obra',
        description: 'Controlo de motoristas, matrículas de camiões, assinatura de receção na obra e baixas parciais.',
        badge: 'Logística Obra',
      },
      {
        name: 'Tintas, Ferramentas Elétricas & Canalização',
        description: 'Catálogo técnico por referência, marca, voltagem, cor e garantia de equipamento.',
        badge: 'Catálogo Técnico',
      },
      {
        name: 'Contas Correntes de Empreiteiros & Construtoras',
        description: 'Faturação mensal, plafonds de crédito corporativo e reconciliação bancária BIM/BCI.',
        badge: 'B2B Corporativo',
      },
    ],
    demoVideos: (sys) => [
      {
        id: `${sys.id}-vid-1`,
        title: '1. Emissão de Cotação / Fatura Proforma para Obra e Conversão em Venda',
        duration: '03:05',
        category: 'Orçamentos & Proformas',
        description: 'Veja como montar um orçamento completo de cimento, varões e tintas e convertê-lo em fatura e guia de transporte.',
        thumbnailUrl: sys.imageUrl,
        steps: [
          'Adição de Sacos de Cimento 42.5N, Varões de 12mm e Tubos PVC ao orçamento',
          'Aplicação de desconto comercial para Mestre de Obras e geração do PDF',
          'Conversão instantânea da Proforma aprovada em Fatura-Recibo e Guia de Remessa',
        ],
      },
      {
        id: `${sys.id}-vid-2`,
        title: '2. Venda com Conversão de Medidas (Metros, Quilos e Rolos)',
        duration: '02:40',
        category: 'Balcão de Ferragens',
        description: 'Demonstração prática de venda de cabos elétricos ao metro e pregos ao quilo com baixa automática no rolo/caixa.',
        thumbnailUrl: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80',
        steps: [
          'Seleção de cabo elétrico e introdução da metragem exata pedida pelo cliente',
          'Cálculo automático do valor proporcional e atualização do saldo restante do rolo',
          'Impressão de requisição de recolha para o fiel de armazém',
        ],
      },
      {
        id: `${sys.id}-vid-3`,
        title: '3. Gestão de Entregas Faseadas em Obra & Controlo de Pátio',
        duration: '02:55',
        category: 'Logística & Entregas',
        description: 'Como controlar materiais já pagos pelo cliente que são levantados aos poucos conforme o avanço da obra.',
        thumbnailUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
        steps: [
          'Consulta do saldo de sacos de cimento pendentes de entrega do cliente',
          'Emissão de Guia de Entrega parcial com registo do motorista e matrícula do camião',
          'Atualização em tempo real do histórico de levantamentos da obra',
        ],
      },
    ],
  },
  'Restaurante & Bar': {
    whatItDoes: [
      'Mostra o mapa visual de mesas do salão, esplanada e área VIP em tempo real (mesas livres, ocupadas e em fecho de conta).',
      'Permite aos garçons lançar pedidos pelo telemóvel ou tablet junto à mesa com envio imediato para a impressora/ecrã da cozinha e do bar.',
      'Divide contas facilmente entre vários clientes (por consumo individual ou partes iguais) e aceita pagamentos parciais via M-Pesa, E-Mola e TPA.',
      'Desconta automaticamente os ingredientes de cada prato e as doses de bebidas da garrafa através da Ficha Técnica.',
    ],
    advantages: [
      {
        title: 'Fim dos Esquecimentos e Erros de Pedidos na Cozinha',
        description: 'Comandas impressas na cozinha com observações claras (mal passado, sem cebola, bebida bem gelada).',
        metric: '+40% Rotação de Mesas',
      },
      {
        title: 'Controlo Rigoroso de Garrafas, Cervejas e Doses no Bar',
        description: 'Auditoria exata do stock de bebidas alcoólicas, evitando desvios e consumos não registados.',
        metric: '-30% Quebras no Bar',
      },
      {
        title: 'Divisão de Conta e Fecho na Mesa sem Confusão',
        description: 'Imprima a pré-conta por pessoa e receba em múltiplos métodos de pagamento em segundos.',
        metric: 'Fecho de Conta em 15s',
      },
      {
        title: 'Operação 100% Wi-Fi Local Sem Depender de Internet',
        description: 'Os telemóveis dos garçons comunicam diretamente com o caixa e impressoras na rede local.',
        metric: 'Zero Paragens no Serviço',
      },
    ],
    offeredCategories: [
      {
        name: 'Mapa Interativo de Mesas, Esplanada & Comandas',
        description: 'Controlo visual de ocupação, transferência de mesas, junção de grupos e tempo de permanência.',
        badge: 'Salão & Mesas',
      },
      {
        name: 'App Mobile para Garçons (Pedidos na Mesa)',
        description: 'Lançamento de pedidos no smartphone Android/iOS com envio direto para cozinha e bar.',
        badge: 'App Garçom',
      },
      {
        name: 'Ecrã de Cozinha (KDS) & Impressão de Produção',
        description: 'Separação automática: pratos quentes vão para a cozinha e bebidas/cocktails saem no bar.',
        badge: 'Cozinha & Bar',
      },
      {
        name: 'Gestão de Bar, Doses, Garrafas & Happy Hour',
        description: 'Controlo de stock de cervejas, vinhos e destilados por unidade ou dose com preços promocionais por horário.',
        badge: 'Bar & Lounges',
      },
      {
        name: 'Take-Away, Delivery & Encomendas WhatsApp',
        description: 'Módulo para pedidos de recolha no balcão e entregas por estafeta com taxa por bairro.',
        badge: 'Delivery',
      },
      {
        name: 'Ficha Técnica de Pratos & Fecho de Caixa por Turno',
        description: 'Cálculo de CMV (Custo de Mercadoria Vendida), gorjetas, comissões de equipa e lucro diário.',
        badge: 'Custos & CMV',
      },
    ],
    demoVideos: (sys) => [
      {
        id: `${sys.id}-vid-1`,
        title: '1. Mapa de Mesas, Pedido pelo Garçom & Impressão na Cozinha/Bar',
        duration: '02:55',
        category: 'Salão & Cozinha',
        description: 'Acompanhe o fluxo completo desde o pedido na Mesa 04 (Esplanada) até a saída automática na cozinha e no bar.',
        thumbnailUrl: sys.imageUrl,
        steps: [
          'Abertura da Mesa 04 no mapa gráfico do salão e adição de Frango à Zambeziana + Cervejas 2M',
          'Disparo automático: o prato imprime na cozinha e as cervejas imprimem no balcão do bar',
          'Monitorização do estado do pedido em preparação até ser entregue na mesa',
        ],
      },
      {
        id: `${sys.id}-vid-2`,
        title: '2. Divisão de Conta entre Amigos & Pagamento M-Pesa / Cartão',
        duration: '02:20',
        category: 'Fecho de Conta',
        description: 'Veja como dividir a conta de uma mesa por consumo de cada pessoa ou em partes iguais sem demora.',
        thumbnailUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
        steps: [
          'Emissão da conferência de mesa (pré-conta) detalhada',
          'Divisão automática da despesa entre 3 clientes no terminal POS',
          'Liquidação combinada (M-Pesa + E-Mola + Numerário) e libertação imediata da mesa',
        ],
      },
      {
        id: `${sys.id}-vid-3`,
        title: '3. Ficha Técnica de Pratos, Controlo de Bebidas & Fecho da Noite',
        duration: '03:15',
        category: 'Stock & Auditoria',
        description: 'Como evitar fugas de stock no bar e apurar o lucro real de cada noite de funcionamento.',
        thumbnailUrl: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=800&q=80',
        steps: [
          'Baixa automática dos ingredientes da receita e garrafas vendidas na noite',
          'Relatório de vendas por garçom e produtos campeões de venda',
          'Fecho de caixa da madrugada com envio do resumo financeiro para o proprietário',
        ],
      },
    ],
  },
};

export function getSystemDetails(system: SystemProduct): EnrichedSystemDetails {
  const preset = CATEGORY_PRESETS[system.category];

  const defaultWhatItDoes = [
    `Automatiza todas as operações diárias de ${system.category.toLowerCase()} com interface intuitiva em Português adaptada para Moçambique.`,
    'Realiza faturação rápida, emissão de recibos e controlo de caixa com integração nativa para M-Pesa, E-Mola e bancos nacionais.',
    'Gere o inventário, clientes, fornecedores e histórico de operações em tempo real com alertas inteligentes.',
    'Gera relatórios gerenciais e mapas fiscais (IVA 16%) prontos para exportação em PDF e Excel.',
  ];

  const defaultAdvantages: SystemAdvantage[] = [
    {
      title: 'Aumento de Velocidade e Produtividade no Atendimento',
      description: `Reduza filas e elimine erros manuais na operação diária de ${system.title}.`,
      metric: '+60% Rapidez Operacional',
    },
    {
      title: 'Controlo Financeiro e Prevenção de Perdas',
      description: 'Rastreabilidade completa de cada entrada e saída de valores e mercadorias por utilizador.',
      metric: '-25% Quebras e Desvios',
    },
    {
      title: 'Adaptado à Realidade de Moçambique (M-Pesa, E-Mola & Offline)',
      description: 'Projetado para funcionar com estabilidade em Maputo, Matola e todas as províncias.',
      metric: '99.8% Disponibilidade',
    },
    {
      title: 'Licença Vitalícia com Suporte Técnico Local',
      description: 'Formação da sua equipa incluída e assistência técnica presencial e remota em Moçambique.',
      metric: 'Suporte Local 24/7',
    },
  ];

  const defaultCategories: SystemOfferedCategory[] = [
    {
      name: `Módulo Principal: ${system.category}`,
      description: system.description,
      badge: 'Core',
    },
    {
      name: 'Faturação, Caixa & Pagamentos Móveis',
      description: 'Emissão de faturas, recibos térmicos/A4 e integração direta com M-Pesa, E-Mola e POS bancário.',
      badge: 'Faturação',
    },
    {
      name: 'Gestão de Clientes, Créditos & Fidelização',
      description: 'Cadastro completo de clientes com NUIT, histórico de compras, conta-corrente e descontos.',
      badge: 'CRM Comercial',
    },
    {
      name: 'Controlo de Stock, Compras & Fornecedores',
      description: 'Entradas de mercadoria, alertas de reposição, código de barras e valorização de inventário.',
      badge: 'Inventário',
    },
    {
      name: 'Relatórios Gerenciais, DRE & Fiscalidade AT',
      description: 'Mapas de vendas por período, apuramento de IVA 16%, fluxo de caixa e exportação contabilística.',
      badge: 'Finanças & IVA',
    },
    {
      name: 'Acesso Multi-Utilizador & Nuvem / Mobile',
      description: 'Controlo de permissões por cargo (Operador, Gerente, Administrador) e consulta no telemóvel.',
      badge: 'Cloud & Segurança',
    },
  ];

  const defaultVideos: SystemDemoVideo[] = [
    {
      id: `${system.id}-vid-1`,
      title: `1. Tour Completo: Como Funciona o ${system.title} na Prática`,
      duration: '02:50',
      category: 'Visão Geral & Operação',
      description: `Demonstração passo a passo das principais funcionalidades do ${system.title} para ${system.category}.`,
      thumbnailUrl: system.imageUrl,
      steps: [
        `Abertura do painel principal do ${system.title} e navegação rápida pelos módulos`,
        ...(system.features.slice(0, 2)),
        'Emissão de comprovativo fiscal e atualização instantânea dos indicadores do dia',
      ],
    },
    {
      id: `${system.id}-vid-2`,
      title: `2. Faturação Rápida, Pagamentos M-Pesa / E-Mola & Fecho de Caixa`,
      duration: '02:35',
      category: 'Pagamentos & Caixa',
      description: 'Veja como processar vendas e pagamentos por carteira móvel ou numerário com reconciliação automática.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80',
      steps: [
        'Registo rápido de operação e seleção de pagamento via M-Pesa ou E-Mola',
        'Confirmação automática da transação e impressão do recibo',
        'Conferência do fecho de caixa diário por operador',
      ],
    },
    {
      id: `${system.id}-vid-3`,
      title: `3. Relatórios de Gestão, Controlo de Stock & Acesso no Telemóvel`,
      duration: '03:05',
      category: 'Gestão & Relatórios',
      description: 'Saiba como acompanhar o lucro, controlar o stock e gerir o seu negócio à distância em qualquer lugar.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
      steps: [
        ...(system.features.slice(2, 5)),
        'Exportação de relatórios em PDF/Excel e visualização no telemóvel do proprietário',
      ],
    },
  ];

  const rawVideos =
    system.demoVideos && system.demoVideos.length > 0
      ? system.demoVideos
      : preset
        ? preset.demoVideos(system)
        : defaultVideos;

  const resolvedVideos = rawVideos.map((vid, index) =>
    index === 0 && system.videoUrl && !vid.videoUrl
      ? { ...vid, videoUrl: system.videoUrl }
      : vid
  );

  const defaultFaqs: SystemFaqItem[] = [
    {
      question: `Como funciona a instalação e formação da equipa no ${system.title}?`,
      answer: `A nossa equipa técnica realiza a instalação completa (presencial em Maputo/Matola ou remota em todas as províncias) e inclui formação prática para operadores de caixa e gerentes.`,
      category: 'Implantação & Formação',
    },
    {
      question: `O ${system.title} continua a operar se houver corte de internet?`,
      answer: system.specs?.offlineMode
        ? 'Sim, possui arquitetura Offline-First que permite faturar e emitir recibos sem interrupção, sincronizando automaticamente quando a rede regressa.'
        : 'Opera em nuvem com otimização para redes móveis 3G/4G em Moçambique e backups automáticos.',
      category: 'Conectividade',
    },
    {
      question: 'Como são processados os pagamentos por M-Pesa, E-Mola e POS Bancário?',
      answer: 'O sistema regista e reconcilia pagamentos via M-Pesa, E-Mola, cartões bancários (SIMOrede/VISA) e numerário em Meticais (MZN), separando cada método no fecho de caixa.',
      category: 'Pagamentos Móveis',
    },
    {
      question: 'A licença de software exige mensalidades obrigatórias?',
      answer: `O valor de ${system.price.toLocaleString('pt-MZ')} MZN corresponde à licença vitalícia de utilização do sistema, com suporte técnico local e atualizações fiscais disponíveis.`,
      category: 'Licença & Suporte',
    },
  ];

  return {
    overview: system.fullDescription || system.description,
    videoUrl: system.videoUrl || resolvedVideos[0]?.videoUrl,
    whatItDoes:
      system.whatItDoes && system.whatItDoes.length > 0
        ? system.whatItDoes
        : preset?.whatItDoes || defaultWhatItDoes,
    advantages:
      system.advantages && system.advantages.length > 0
        ? system.advantages
        : preset?.advantages || defaultAdvantages,
    offeredCategories:
      system.offeredCategories && system.offeredCategories.length > 0
        ? system.offeredCategories
        : preset?.offeredCategories || defaultCategories,
    demoVideos: resolvedVideos,
    faqs: system.faqs && system.faqs.length > 0 ? system.faqs : defaultFaqs,
  };
}
