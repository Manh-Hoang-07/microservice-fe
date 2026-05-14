// ─── Generic API wrappers ────────────────────────────────────────────────────

export interface PaginatedMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: PaginatedMeta | null;
  timestamp: string;
}

// ─── Location ────────────────────────────────────────────────────────────────

export interface Country {
  id: string;
  code: string;
  codeAlpha3?: string | null;
  name: string;
  officialName?: string | null;
  phoneCode?: string | null;
  currencyCode?: string | null;
  flagEmoji?: string | null;
  status: 'active' | 'inactive';
}

export interface Province {
  id: string;
  code: string;
  name: string;
  type: string;
  countryId: string;
  phoneCode?: string | null;
  status: 'active' | 'inactive';
  note?: string | null;
  codeBnv?: string | null;
  codeTms?: string | null;
}

export interface Ward {
  id: string;
  provinceId: string;
  code: string;
  name: string;
  type: string;
  status: 'active' | 'inactive';
}

// ─── Menu ────────────────────────────────────────────────────────────────────

/** Minimal shape used in navigation trees (public/user menus) */
export interface Menu {
  id: string;
  code: string;
  name: string;
  path: string;
  icon: string;
  type: 'route' | 'group' | 'link';
  children: Menu[];
}

/** Full shape returned by admin endpoints */
export interface MenuItem {
  id: string;
  code: string;
  name: string;
  path?: string | null;
  apiPath?: string | null;
  icon?: string | null;
  type: 'route' | 'group' | 'link';
  status: 'active' | 'inactive';
  parentId?: string | null;
  sortOrder: number;
  isPublic: boolean;
  showInMenu: boolean;
  requiredPermissionCode?: string | null;
  group?: string | null;
  children?: MenuItem[];
  createdAt?: string;
  updatedAt?: string;
}

// ─── System Config ───────────────────────────────────────────────────────────

export interface ContactChannel {
  type: string;
  value: string;
  label?: string;
  icon?: string;
  urlTemplate?: string;
  enabled: boolean;
  sortOrder?: number;
}

/** GET /api/config/general — camelCase from config-service */
export interface SystemConfig {
  [key: string]: unknown;
  id?: string;
  siteName?: string;
  siteDescription?: string | null;
  siteLogo?: string | null;
  siteFavicon?: string | null;
  siteEmail?: string | null;
  sitePhone?: string | null;
  siteAddress?: string | null;
  siteCountryId?: string | null;
  siteProvinceId?: string | null;
  siteWardId?: string | null;
  siteCopyright?: string | null;
  timezone?: string;
  locale?: string;
  currency?: string;
  contactChannels?: ContactChannel[];
  metaTitle?: string | null;
  metaKeywords?: string | null;
  ogTitle?: string | null;
  ogDescription?: string | null;
  ogImage?: string | null;
  canonicalUrl?: string | null;
  googleAnalyticsId?: string | null;
  googleSearchConsole?: string | null;
  facebookPixelId?: string | null;
  twitterSite?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

// ─── Payloads (camelCase — request bodies) ───────────────────────────────────

export interface ContactChannelPayload {
  type: string;
  value: string;
  enabled: boolean;
  label?: string;
  icon?: string;
  urlTemplate?: string;
  sortOrder?: number;
}

/** PUT /api/config/admin/general */
export interface GeneralConfigPayload {
  siteName?: string;
  siteDescription?: string;
  siteLogo?: string;
  siteFavicon?: string;
  siteEmail?: string;
  sitePhone?: string;
  siteAddress?: string;
  siteCountryId?: string;
  siteProvinceId?: string;
  siteWardId?: string;
  siteCopyright?: string;
  timezone?: string;
  locale?: string;
  currency?: string;
  contactChannels?: ContactChannelPayload[];
  metaTitle?: string;
  metaKeywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  canonicalUrl?: string;
  googleAnalyticsId?: string;
  googleSearchConsole?: string;
  facebookPixelId?: string;
  twitterSite?: string;
}

/** PUT /api/config/admin/email */
export interface EmailConfig {
  smtpHost?: string;
  smtpPort?: number;
  smtpSecure?: boolean;
  smtpUsername?: string;
  /** Send "******" to keep existing password */
  smtpPassword?: string;
  fromEmail?: string;
  fromName?: string;
  replyToEmail?: string;
}

// ─── Other ───────────────────────────────────────────────────────────────────

export interface ContactPayload {
  name: string;
  email: string;
  message: string;
  phone: string;
}

export interface ContactResponse {
  id: string;
  name: string;
  email: string;
  message: string;
  phone: string;
  status: string;
  createdAt: string;
}

export interface ContentTemplate {
  id: string;
  code: string;
  name: string;
  category: 'render' | 'file';
  type: 'email' | 'telegram' | 'zalo' | 'sms' | 'pdf_generated' | 'file_word' | 'file_excel' | 'file_pdf' | string;
  content?: string;
  filePath?: string;
  metadata?: Record<string, unknown>;
  variables?: string[] | Record<string, unknown>;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt?: string;
}
