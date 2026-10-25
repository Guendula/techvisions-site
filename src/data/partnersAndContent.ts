import { PartnerIntegration, TestimonialComment, NewsArticle } from '../types';

export const INITIAL_PARTNERS: PartnerIntegration[] = [
  {
    id: 'partner-mpesa',
    name: 'Vodacom M-Pesa Moçambique',
    category: 'telco',
    categoryLabel: 'Carteira Móvel & Pagamentos',
    logo: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=300&q=80',
    description: 'Integração direta com o serviço M-Pesa (prefixos 84 e 85) via API STK Push e QR Code no checkout dos pontos de venda.',
    status: 'Oficial',
    features: ['STK Push em tempo real', 'Sem necessidade de POS físico', 'Reconciliação diária de caixa', 'Validação de PIN no telemóvel'],
    latency: '< 1.8 segundos',
    protocol: 'Open API REST / STK Push v2.0',
    uptime: '99.98%',
    techHighlight: 'Disparo de prompt PIN diretamente no ecrã do cliente Vodacom',
    prefixCoverage: 'Prefixos 84 & 85 em todo Moçambique',
  },
  {
    id: 'partner-emola',
    name: 'Movitel E-Mola',
    category: 'telco',
    categoryLabel: 'Carteira Móvel & Pagamentos',
    logo: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=300&q=80',
    description: 'Cobranças instantâneas via carteira móvel E-Mola (prefixos 86 e 87), garantindo inclusão financeira para comerciantes em todo Moçambique.',
    status: 'Oficial',
    features: ['Notificação USSD imediata', 'Baixo custo de transação', 'Sincronização com o fecho de caixa', 'Cobertura nacional'],
    latency: '< 2.2 segundos',
    protocol: 'USSD Gateway / Webhook Callback',
    uptime: '99.95%',
    techHighlight: 'Ideal para clientes e fornecedores das zonas periurbanas e distritos',
    prefixCoverage: 'Prefixos 86 & 87 em todo Moçambique',
  },
  {
    id: 'partner-bim',
    name: 'Millennium BIM',
    category: 'banking',
    categoryLabel: 'Rede Bancária & Cartões',
    logo: 'https://images.unsplash.com/photo-1601597111158-2fceff292cdc?auto=format&fit=crop&w=300&q=80',
    description: 'Processamento de pagamentos com cartões Visa e débito nacional SIMO Rede através de gateways bancários moçambicanos seguros.',
    status: 'Homologado',
    features: ['Aceitação Visa / Mastercard', 'Liquidação em conta BIM', 'Criptografia 3D Secure', 'Extrato fiscal detalhado'],
    latency: '< 1.5 segundos',
    protocol: 'SIMO Rede Gateway / EMV TLS 1.3',
    uptime: '99.99%',
    techHighlight: 'Liquidação D+1 automatizada com extrato para contabilidade',
    prefixCoverage: 'Cartões Nacionais e Internacionais',
  },
  {
    id: 'partner-bci',
    name: 'BCI (Banco Comercial e de Investimentos)',
    category: 'banking',
    categoryLabel: 'Rede Bancária & Cartões',
    logo: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=300&q=80',
    description: 'Integração para transferências bancárias B2B, emissão de faturas com referência bancária e conciliação financeira automatizada.',
    status: 'Homologado',
    features: ['Referências bancárias automáticas', 'Conexão direta com extratos', 'Apoio a médias e grandes empresas', 'Suporte a débito direto'],
    latency: 'Tempo Real / Batch',
    protocol: 'ISO 20022 / BCI Connect API',
    uptime: '99.97%',
    techHighlight: 'Geração de referências bancárias para encomendas grossistas',
    prefixCoverage: 'Todo o território moçambicano',
  },
  {
    id: 'partner-sunmi',
    name: 'Sunmi Technology Moçambique',
    category: 'hardware',
    categoryLabel: 'Terminais POS Móveis',
    logo: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=300&q=80',
    description: 'Homologação oficial para os terminais Android portáteis Sunmi V2s, V2 Pro e T2 Lite com impressora térmica integrada.',
    status: 'Certificado',
    features: ['Impressão térmica sem fio', 'Bateria para 14 horas de trabalho', 'Leitor de cartões e câmara para código de barras', 'Resistente a quedas'],
    latency: 'Local Instantâneo',
    protocol: 'Sunmi SDK / Android OS 11 & 13',
    uptime: '100% Operação Offline',
    techHighlight: 'Emissão de talão de 58mm mesmo sem eletricidade na loja',
    prefixCoverage: 'Garantia e Assistência Técnica em Maputo',
  },
  {
    id: 'partner-epson',
    name: 'Epson POS Moçambique',
    category: 'hardware',
    categoryLabel: 'Impressoras Fiscais e Térmicas',
    logo: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=300&q=80',
    description: 'Compatibilidade nativa com impressoras térmicas de 58mm e 80mm da série TM-T20X e TM-m30 para emissão de talões fiscais.',
    status: 'Certificado',
    features: ['Corte automático de papel', 'Conexão USB, Rede Ethernet e Wi-Fi', 'Disparo de gaveta de dinheiro RJ11', 'Alta velocidade (250mm/s)'],
    latency: 'Corte em 0.4s',
    protocol: 'ESC/POS Driver Direto / USB & LAN',
    uptime: 'Alta Durabilidade Industrial',
    techHighlight: 'Conexão com gavetas metálicas automáticas de notas e moedas',
    prefixCoverage: 'Peças e Bobinas em Maputo e Beira',
  },
];

export const INITIAL_COMMENTS: TestimonialComment[] = [
  {
    id: 'comm-1',
    userName: 'Mestre Armindo Tembe',
    userCompany: 'Padaria Flor da Matola',
    city: 'Matola (Malhampsene)',
    systemId: 'tv-sys-padaria',
    systemTitle: 'TechPadaria Pro',
    rating: 5,
    comment: 'Instalámos o TechPadaria há 8 meses e a nossa perda de farinha caiu drasticamente. Mesmo quando a corrente da EDM falha no bairro, o sistema continua a faturar no tablet com bateria e depois sincroniza tudo. Excelente assistência técnica!',
    date: '2026-03-12',
    isApproved: true,
    isFeatured: true,
    businessSector: 'Panificação & Pastelaria',
    impactMetric: '-18% Quebra de Farinha',
    helpfulCount: 38,
    verifiedBadge: true,
  },
  {
    id: 'comm-2',
    userName: 'Zaheer Patel',
    userCompany: 'Minimercado Patel & Filhos',
    city: 'Maputo (Baixa da Cidade)',
    systemId: 'tv-sys-mercearia',
    systemTitle: 'TechPOS Mercearia',
    rating: 5,
    comment: 'A funcionalidade de fiado no caderno digital salvou a minha mercearia. Consigo saber exatamente quanto cada cliente do bairro deve, e os clientes agora pagam direto pelo M-Pesa sem confusão. Muito rápido no leitor de código de barras.',
    date: '2026-04-05',
    isApproved: true,
    isFeatured: true,
    businessSector: 'Mercearia & Supermercado',
    impactMetric: '100% Controlo do Fiado Digital',
    helpfulCount: 52,
    verifiedBadge: true,
  },
  {
    id: 'comm-3',
    userName: 'Eng. Carlos Sitoe',
    userCompany: 'Ferragens & Materiais Zimpeto',
    city: 'Maputo (Zimpeto)',
    systemId: 'tv-sys-ferragens',
    systemTitle: 'TechFerragens Pro',
    rating: 5,
    comment: 'Vendemos ferro, cimento e tintas a granel. A opção de converter varões em metros e calcular frete de transporte para entregas na Matola Gare é impecável. Aprovado a 100%.',
    date: '2026-04-18',
    isApproved: true,
    isFeatured: true,
    businessSector: 'Ferragens & Materiais',
    impactMetric: '+35% Rapidez na Carga e Balcão',
    helpfulCount: 29,
    verifiedBadge: true,
  },
  {
    id: 'comm-4',
    userName: 'Dona Esperança Langa',
    userCompany: 'Restaurante & Esplanada Costa do Sol',
    city: 'Maputo (Costa do Sol)',
    systemId: 'tv-sys-restaurante',
    systemTitle: 'TechResto & Bar',
    rating: 5,
    comment: 'Os garçons tiram os pedidos das mesas de marisco diretamente pelo telemóvel e o talão sai logo na cozinha e no bar. Fim dos erros nas contas dos clientes!',
    date: '2026-05-02',
    isApproved: true,
    isFeatured: false,
    businessSector: 'Restaurantes & Bares',
    impactMetric: 'Zero Trocas de Comandas',
    helpfulCount: 21,
    verifiedBadge: true,
  },
  {
    id: 'comm-5',
    userName: 'Celso Macuácua',
    userCompany: 'Boutique Elegância Chic',
    city: 'Beira (Ponta Gêa)',
    systemId: 'tv-sys-roupas',
    systemTitle: 'TechModa Boutique',
    rating: 5,
    comment: 'Controlo perfeito de grade por tamanho e cor (S, M, L, XL). A exportação das vendas para o Google Sheets ajudou imenso a minha contabilidade no fim do mês.',
    date: '2026-05-20',
    isApproved: true,
    isFeatured: false,
    businessSector: 'Moda & Retalho',
    impactMetric: 'Inventário Físico em 2 Horas',
    helpfulCount: 16,
    verifiedBadge: true,
  },
  {
    id: 'comm-6',
    userName: 'Dra. Samira Momed',
    userCompany: 'Farmácia Central de Nampula',
    city: 'Nampula (Centro)',
    systemId: 'tv-sys-mercearia',
    systemTitle: 'TechPOS Plus',
    rating: 5,
    comment: 'O alerta de validade de lotes de medicamentos e a impressão com NUIT do cliente tornaram a nossa farmácia 100% compliant com a Autoridade Tributária e Saúde.',
    date: '2026-05-25',
    isApproved: true,
    isFeatured: true,
    businessSector: 'Farmácia & Saúde',
    impactMetric: 'Zero Medicamentos Vencidos em Prateleira',
    helpfulCount: 34,
    verifiedBadge: true,
  },
];

export const INITIAL_NEWS: NewsArticle[] = [
  {
    id: 'news-1',
    title: 'Atualização 2.6: Modo 100% Offline com Fecho Cego de Caixa para Mercearias e Padarias',
    summary: 'Novo mecanismo de contingência garante faturação ininterrupta mesmo durante cortes de energia ou quebras no sinal de rede móvel em qualquer província de Moçambique.',
    content: `A TechVisions acaba de disponibilizar a versão 2.6 para os sistemas de gestão de balcão (TechPOS Mercearia, TechPadaria Pro e TechResto).

Principais destaques desta atualização:
1. Arquitetura Offline-First robusta: O sistema armazena todos os talões emitidos no disco local em banco de dados encriptado SQLite/IndexedDB.
2. Fecho Cego de Caixa: O operador insere as notas e moedas físicas sem ver o total do sistema, evitando divergências intencionais.
3. Sincronização em Segundo Plano: Assim que o sinal de internet da Vodacom ou Movitel for restabelecido, os dados são automaticamente replicados para o servidor central da nuvem.
4. Histórico de Pagamentos M-Pesa / E-Mola salvaguardados sem duplicidade.

Todos os utilizadores com licença ativa podem atualizar gratuitamente o software diretamente pelo painel.`,
    category: 'Atualizações',
    imageUrl: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=1000&q=80',
    date: '2026-04-20',
    readTime: '3 min de leitura',
    isFeatured: true,
    author: 'Equipa de Engenharia TechVisions',
    tags: ['Offline', 'POS', 'Segurança', 'Moçambique'],
  },
  {
    id: 'news-2',
    title: 'Parceria com a Sunmi: Terminais Móveis Android com Impressora Térmica Integrada',
    summary: 'Soluções móveis homologadas para cobradores de rua, esplanadas e entrega ao domicílio com aceitação de pagamentos M-Pesa e talão instantâneo.',
    content: `Para responder à crescente procura de negócios móveis e entregas rápidas na Grande Maputo e Matola, a TechVisions formalizou a homologação dos terminais móveis Sunmi V2s e Sunmi V2 Pro.

Com esta solução tudo-em-um:
- O vendedor não precisa de carregar impressora separada ou portátil.
- A bateria de longa duração permite operar até 14 horas contínuas em campo.
- Suporta leitura ótica de códigos de barras 1D e QR Codes 2D para produtos e confirmação de faturas.
- Integração completa com o sistema TechStore e entregas locais.

Consulte a nossa equipa comercial para pacotes combinados de software + terminal com garantia de 1 ano e assistência local em Maputo.`,
    category: 'Hardware',
    imageUrl: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=1000&q=80',
    date: '2026-04-10',
    readTime: '4 min de leitura',
    isFeatured: false,
    author: 'Departamento de Hardware & Parcerias',
    tags: ['Sunmi', 'Android', 'POS Portátil', 'M-Pesa'],
  },
  {
    id: 'news-3',
    title: 'Conformidade Fiscal em Moçambique: Emissão de Faturas com Código QR e IVA a 16%',
    summary: 'Os softwares TechVisions estão totalmente preparados para cumprir os requisitos de faturação fiscal e comunicação contabilística de Moçambique.',
    content: `Com as recentes diretrizes da Autoridade Tributária de Moçambique (AT) relativas à modernização dos sistemas de faturação, é essencial que os pequenos e médios empresários utilizem softwares certificados.

Os sistemas TechFatura, TechSupermercado e TechPOS incluem:
- Cálculo automático da taxa de IVA em vigor (16%).
- Impressão de Fatura, Fatura-Recibo e Guia de Transporte com menção do NUIT do emitente e adquirente.
- Impressão de Código QR nos talões para conferência digital.
- Exportação periódica de ficheiro SAF-T MZ / mapa mensal de vendas para o seu contabilista ou para o Google Sheets com 1 clique.

Evite multas e assegure que o seu comércio opera dentro das normas legais moçambicanas.`,
    category: 'Fiscalidade',
    imageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1000&q=80',
    date: '2026-03-28',
    readTime: '3 min de leitura',
    isFeatured: false,
    author: 'Consultoria Fiscal & Compliance TechVisions',
    tags: ['Fiscalidade', 'IVA 16%', 'NUIT', 'Google Sheets'],
  },
  {
    id: 'news-4',
    title: '5 Dicas para Reduzir Furtos e Erros de Caixa no seu Minimercado ou Mercearia',
    summary: 'Aprenda como empresários de Maputo e Matola usam os relatórios de auditoria e fecho cego de caixa da TechVisions para proteger as suas margens.',
    content: `O roubo de caixa e as quebras não registadas no stock representam até 15% das perdas do comércio retalhista em Moçambique.

Aqui estão 5 práticas recomendadas pelos nossos consultores:
1. Imponha o fecho cego de caixa em cada troca de turno dos caixas.
2. Limite os descontos manuais com palavra-passe de supervisor.
3. Utilize leitores de código de barras em vez de digitar os preços manualmente.
4. Faça inventários rotativos semanais nos 20 produtos de maior valor (cervejas, óleo, arroz, etc.).
5. Conecte pagamentos M-Pesa e E-Mola diretamente ao POS para que o valor entre na conta da empresa antes da impressão do talão.`,
    category: 'Dicas',
    imageUrl: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=1000&q=80',
    date: '2026-03-15',
    readTime: '5 min de leitura',
    isFeatured: false,
    author: 'Mário Guambe, Especialista em Retalho',
    tags: ['Gestão', 'Prevenção de Perdas', 'Dicas'],
  },
];
