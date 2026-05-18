import React from "react";
import { Metadata } from "next";
import SystemConfigForm from "@/components/Features/Config/SystemConfig/Admin/SystemConfigForm";
import ContactChannelsManager from "@/components/Features/Config/SystemConfig/Admin/ContactChannelsManager";
import SystemLocationSelector from "@/components/Features/Config/SystemConfig/Admin/SystemLocationSelector";
import PageMeta from "@/components/UI/Navigation/PageMeta";

interface ConfigField {
  key: string;
  label: string;
  type: "text" | "number" | "textarea" | "image" | "email" | "password" | "checkbox" | "custom";
  placeholder?: string;
  description?: string;
  component?: React.ComponentType<{
    value: unknown;
    onChange: (value: unknown) => void;
    formData?: Record<string, unknown>;
    onUpdate?: (key: string, value: unknown) => void;
  }>;
}

export const metadata: Metadata = {
  title: "Cấu hình chung | Admin",
  description: "Quản lý thông tin chung của hệ thống",
};

export default function AdminSystemConfigGeneralPage() {
  const fields: ConfigField[] = [
    { key: "siteName", label: "Tên Website", type: "text", placeholder: "Nhập tên website" },
    { key: "siteDescription", label: "Mô tả Website", type: "textarea", placeholder: "Nhập mô tả ngắn về website" },
    { key: "siteLogo", label: "Logo", type: "image", description: "Logo hiển thị trên Header và các trang" },
    { key: "siteFavicon", label: "Favicon", type: "image", description: "Biểu tượng hiển thị trên tab trình duyệt" },
    { key: "siteEmail", label: "Email liên hệ", type: "email", placeholder: "contact@example.com" },
    { key: "sitePhone", label: "Số điện thoại", type: "text", placeholder: "19001234" },
    {
      key: "site_location",
      label: "Vị trí trụ sở",
      type: "custom",
      component: SystemLocationSelector
    },
    { key: "siteAddress", label: "Địa chỉ chi tiết", type: "textarea", placeholder: "Số nhà, tên đường..." },
    { key: "siteCopyright", label: "Thông tin bản quyền", type: "text", placeholder: "© 2024. All rights reserved." },
    { key: "timezone", label: "Múi giờ (Timezone)", type: "text", placeholder: "Asia/Ho_Chi_Minh" },
    { key: "locale", label: "Ngôn ngữ (Locale)", type: "text", placeholder: "vi" },
    { key: "currency", label: "Tiền tệ (Currency)", type: "text", placeholder: "VND" },
    {
      key: "contactChannels",
      label: "Kênh liên hệ (Contact Channels)",
      type: "custom",
      component: ContactChannelsManager
    },
    { key: "metaTitle", label: "SEO Meta Title", type: "text" },
    { key: "metaKeywords", label: "SEO Meta Keywords", type: "textarea" },
    { key: "ogTitle", label: "OG Title (Social)", type: "text" },
    { key: "ogDescription", label: "OG Description (Social)", type: "textarea" },
    { key: "ogImage", label: "OG Image (Social)", type: "image" },
    { key: "canonicalUrl", label: "Canonical URL", type: "text", placeholder: "https://example.com" },
    { key: "googleAnalyticsId", label: "Google Analytics ID", type: "text", placeholder: "UA-XXXXXXXXX-X" },
    { key: "googleSearchConsole", label: "Google Search Console Key", type: "text" },
    { key: "facebookPixelId", label: "Facebook Pixel ID", type: "text" },
    { key: "twitterSite", label: "Twitter ID (Site)", type: "text" },
  ];

  return (
    <div className="w-full p-4">
      <PageMeta
        title="Cấu hình chung"
        breadcrumbs={[
          { label: "Trang quản trị", href: "/admin", },
          { label: "Cấu hình hệ thống" },
          { label: "Cấu hình chung" },
        ]}
      />
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Cấu hình chung</h1>
        <p className="text-gray-500 mt-2">Quản lý thông tin cơ bản và SEO của website</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 sm:p-8">
          <SystemConfigForm group="general" fields={fields} />
        </div>
      </div>
    </div>
  );
}
