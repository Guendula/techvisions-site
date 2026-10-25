export type ProductCategory = string;

export interface CategoryItem {
  id: string;
  name: string;
  description: string;
  badge?: string;
  icon?: string;
  order: number;
  createdAt?: string;
}

export type PaymentMethod = 'MPESA' | 'EMOLA' | 'VISA';

export type PaymentStatus = 'PENDING' | 'PROCESSING' | 'SUCCESS' | 'FAILED';

export interface SystemProduct {
  id: string;
  title: string;
  category: ProductCategory;
  price: number; // in MZN (Meticais)
  description: string;
  fullDescription?: string;
  demoUrl: string;
  imageUrl: string;
  likesCount: number;
  features: string[];
  badges?: string[];
  isMobileSupported?: boolean;
  isCloudSupported?: boolean;
  demoType: 'pos' | 'inventory' | 'restaurant' | 'bakery' | 'ecommerce';
  specs?: {
    platform: string;
    offlineMode: boolean;
    hardwareSupport: string[];
    languages: string[];
  };
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'user' | 'admin';
  createdAt: string;
}

export interface CartItem {
  id: string;
  title: string;
  category: ProductCategory;
  price: number;
  imageUrl: string;
  quantity: number;
}

export interface OrderItem {
  systemId: string;
  title: string;
  category: ProductCategory;
  price: number;
  licenseKey: string;
  downloadUrl: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  items: OrderItem[];
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  transactionRef: string;
  createdAt: string;
  googleDriveSynced?: boolean;
  gmailReceiptSent?: boolean;
}

export interface GroundingChunk {
  maps?: {
    uri: string;
    title: string;
    placeAnswerSources?: {
      reviewSnippets?: Array<{
        snippet: string;
      }>;
    };
  };
  web?: {
    uri: string;
    title: string;
  };
}

export interface MapsGroundingResponse {
  answer: string;
  groundingChunks: GroundingChunk[];
}

export interface TestimonialComment {
  id: string;
  userName: string;
  userCompany: string;
  city: string; // Ex: 'Maputo', 'Matola', 'Beira', 'Nampula'
  systemId?: string;
  systemTitle?: string;
  rating: number; // 1 to 5
  comment: string;
  date: string;
  isApproved: boolean;
  isFeatured?: boolean;
  businessSector?: string; // e.g. 'Panificação', 'Mercearia', 'Restauração'
  impactMetric?: string;   // e.g. '-18% Quebra de Farinha'
  helpfulCount?: number;   // count of helpful votes
  verifiedBadge?: boolean; // verified commercial merchant
}

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: 'Atualizações' | 'Hardware' | 'Fiscalidade' | 'Parcerias' | 'Dicas';
  imageUrl: string;
  date: string;
  readTime: string;
  isFeatured?: boolean;
  author: string;
  tags?: string[];
}

export interface PartnerIntegration {
  id: string;
  name: string;
  category: 'telco' | 'banking' | 'hardware';
  categoryLabel: string;
  logo: string;
  description: string;
  status: 'Ativo' | 'Homologado' | 'Oficial' | 'Certificado';
  features: string[];
  latency?: string;
  protocol?: string;
  uptime?: string;
  techHighlight?: string;
  prefixCoverage?: string;
  websiteUrl?: string;
}

export interface NavigationSubItem {
  id: string;
  label: string;
  href: string;
  description?: string;
  badge?: string;
  categoryFilter?: ProductCategory | 'Todas';
}

export interface NavigationMenuItem {
  id: string;
  label: string;
  href: string;
  badge?: string;
  isExternal?: boolean;
  order: number;
  subItems?: NavigationSubItem[];
  highlight?: boolean;
}

export interface HeroSlide {
  id: string;
  badge: string;
  title: string;
  highlightWord: string;
  subtitle: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
  imageUrl?: string;
  gradientFrom: string;
  gradientVia: string;
  gradientTo: string;
  accentColor: string;
  statsPills: Array<{
    id: string;
    icon: string;
    text: string;
  }>;
  isActive: boolean;
  order: number;
}

export interface CompanySettings {
  name: string;
  tagline: string;
  logoUrl: string;
  nuit: string;
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  city: string;
  country: string;
  currency: string;
}

export interface SmtpSettings {
  host: string;
  port: number;
  username: string;
  password: string;
  senderName: string;
  senderEmail: string;
  encryption: 'TLS' | 'SSL' | 'NONE';
  status: 'connected' | 'error' | 'untested';
  lastTested?: string;
  lastTestMessage?: string;
}

export interface MpesaApiSettings {
  apiKey: string;
  publicKey: string;
  serviceProviderCode: string;
  initiatorIdentifier: string;
  securityCredential: string;
  environment: 'sandbox' | 'production';
  status: 'connected' | 'error' | 'untested';
  lastTested?: string;
}

export interface EmolaApiSettings {
  merchantCode: string;
  apiSecret: string;
  endpointUrl: string;
  environment: 'sandbox' | 'production';
  status: 'connected' | 'error' | 'untested';
  lastTested?: string;
}

export interface GoogleAuthSettings {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  authorizedOrigins: string;
  status: 'connected' | 'error' | 'untested';
  lastTested?: string;
}

export interface SupabaseApiSettings {
  projectUrl: string;
  anonKey: string;
  serviceRoleKey: string;
  status: 'connected' | 'error' | 'untested';
  lastTested?: string;
}

export interface SystemApiConfig {
  smtp: SmtpSettings;
  mpesa: MpesaApiSettings;
  emola: EmolaApiSettings;
  googleAuth: GoogleAuthSettings;
  supabase: SupabaseApiSettings;
}

export interface SeoSettings {
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  author?: string;
  ogImage?: string;
  canonicalUrl?: string;
  robotsIndex?: boolean;
  robotsFollow?: boolean;
  structuredDataEnabled?: boolean;
}

export type ServiceCategory =
  | 'Escritório & Hardware'
  | 'Servidores & Redes'
  | 'Comunicação Corporativa'
  | 'Software & Mobile'
  | 'Gestão & Consultoria'
  | string;

export interface CompanyServiceItem {
  id: string;
  title: string;
  category: ServiceCategory;
  shortDescription: string;
  fullDescription: string;
  icon: string; // Lucide icon identifier e.g. 'Briefcase' | 'Server' | 'Mail' | 'Smartphone' | 'Boxes' | 'HardDrive' | 'Shield' | 'Cpu'
  features: string[];
  deliverables?: string[];
  targetAudience?: string;
  pricingType: 'quote' | 'fixed' | 'hourly' | 'subscription';
  pricingNote?: string;
  badge?: string;
  isActive: boolean;
  order: number;
  contactCtaText?: string;
  imageUrl?: string;
}

export interface ServiceQuoteRequest {
  id: string;
  serviceId: string;
  serviceTitle: string;
  clientName: string;
  companyName: string;
  clientPhone: string;
  clientEmail: string;
  city: string;
  details: string;
  urgency: 'baixa' | 'media' | 'alta' | 'imediata';
  createdAt: string;
  status: 'NOVO' | 'EM_ANALISE' | 'COTACAO_ENVIADA' | 'CONCLUIDO';
}
