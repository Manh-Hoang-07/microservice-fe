// ─── Generic API wrappers ────────────────────────────────────────────────────

export interface PaginatedMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
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
  code_alpha3?: string | null;
  name: string;
  official_name?: string | null;
  phone_code?: string | null;
  currency_code?: string | null;
  flag_emoji?: string | null;
  status: 'active' | 'inactive';
}

export interface Province {
  id: string;
  code: string;
  name: string;
  type: string;
  country_id: string;
  phone_code?: string | null;
  status: 'active' | 'inactive';
  note?: string | null;
  code_bnv?: string | null;
  code_tms?: string | null;
}

export interface Ward {
  id: string;
  province_id: string;
  code: string;
  name: string;
  type: string;
  status: 'active' | 'inactive';
}

// ─── Menu ────────────────────────────────────────────────────────────────────

/** Minimal shape used in navigation trees (public/user menus) */
export interface Menu {
  id: number;
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
  api_path?: string | null;
  icon?: string | null;
  type: 'route' | 'group' | 'link';
  status: 'active' | 'inactive';
  parent_id?: string | null;
  sort_order: number;
  is_public: boolean;
  show_in_menu: boolean;
  required_permission_code?: string | null;
  group?: string | null;
  children?: MenuItem[];
}

// ─── System Config ───────────────────────────────────────────────────────────

export interface ContactChannel {
  type: string;
  value: string;
  label?: string;
  icon?: string;
  url_template?: string;
  enabled: boolean;
  sort_order?: number;
}

/** GET /api/config/general response — snake_case from DB */
export interface SystemConfig {
  [key: string]: unknown;
  id?: string;
  /** Mapped convenience alias for site_name */
  name?: string;
  site_name?: string;
  site_description?: string | null;
  site_logo?: string | null;
  site_favicon?: string | null;
  site_email?: string | null;
  site_phone?: string | null;
  site_address?: string | null;
  site_country_id?: string | null;
  site_province_id?: string | null;
  site_ward_id?: string | null;
  site_copyright?: string | null;
  timezone?: string;
  locale?: string;
  currency?: string;
  contact_channels?: ContactChannel[];
  meta_title?: string | null;
  meta_keywords?: string | null;
  og_title?: string | null;
  og_description?: string | null;
  og_image?: string | null;
  canonical_url?: string | null;
  google_analytics_id?: string | null;
  google_search_console?: string | null;
  facebook_pixel_id?: string | null;
  twitter_site?: string | null;
  created_at?: string;
  updated_at?: string;
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

/** PUT /api/config/config/general */
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

/** PUT /api/config/config/email */
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
  file_path?: string;
  metadata?: Record<string, unknown>;
  variables?: string[] | Record<string, unknown>;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at?: string;
}
