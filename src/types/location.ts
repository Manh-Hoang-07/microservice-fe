export interface AdminCountry {
  id: string;
  code: string;
  codeAlpha3?: string;
  name: string;
  officialName?: string;
  phoneCode?: string;
  currencyCode?: string;
  flagEmoji?: string;
  status?: string;
  createdUserId?: string | null;
  updatedUserId?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminProvince {
  id: string;
  code: string;
  name: string;
  type?: string;
  phoneCode?: string;
  countryId: string;
  status?: string;
  note?: string | null;
  codeBnv?: string | null;
  codeTms?: string | null;
  createdUserId?: string | null;
  updatedUserId?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminWard {
  id: string;
  provinceId: string;
  name: string;
  type?: string;
  code: string;
  status?: string;
  createdUserId?: string | null;
  updatedUserId?: string | null;
  createdAt?: string;
  updatedAt?: string;
}
