# PR 1: CMS & Notification URL Fixes + Contact Admin Improvements

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Sửa tất cả API endpoint paths để đúng với service prefix (`/api/cms/`, `/api/notifications/`), sửa Contact form (phone optional), thêm actions Reply/Read/Close cho Admin Contacts.

**Architecture:** Chỉ thay đổi files endpoint URL strings và component ContactForm/AdminContacts. Không thay đổi logic hay component structure. Mỗi endpoint file được sửa hoàn toàn trong một task.

**Tech Stack:** TypeScript, Next.js 14, React, Zod, @tanstack/react-query, axios

---

## File Map

### Files sẽ bị sửa (Modify)
- `src/lib/api/endpoints/introduction/about.ts`
- `src/lib/api/endpoints/introduction/certificates.ts`
- `src/lib/api/endpoints/introduction/contacts.ts`
- `src/lib/api/endpoints/introduction/faqs.ts`
- `src/lib/api/endpoints/introduction/gallery.ts`
- `src/lib/api/endpoints/introduction/partners.ts`
- `src/lib/api/endpoints/introduction/projects.ts`
- `src/lib/api/endpoints/introduction/staff.ts`
- `src/lib/api/endpoints/introduction/testimonials.ts`
- `src/lib/api/endpoints/marketing/banners.ts`
- `src/lib/api/endpoints/marketing/bannerLocations.ts`
- `src/lib/api/endpoints/core/contentTemplates.ts`
- `src/components/Features/CMS/Contacts/Public/ContactForm.tsx`
- `src/components/Features/CMS/Contacts/Admin/AdminContacts.tsx`
- `src/components/Features/CMS/Contacts/Admin/ContactsFilter.tsx` (thêm field email filter)

### Files sẽ được tạo (Create)
- `src/lib/api/admin/contacts.ts` — service functions: reply, markAsRead, close
- `src/components/Features/CMS/Contacts/Admin/ContactReplyModal.tsx`

---

## Task 1: Sửa endpoint URLs — Introduction group (about, certificates, contacts, faqs)

**Files:**
- Modify: `src/lib/api/endpoints/introduction/about.ts`
- Modify: `src/lib/api/endpoints/introduction/certificates.ts`
- Modify: `src/lib/api/endpoints/introduction/contacts.ts`
- Modify: `src/lib/api/endpoints/introduction/faqs.ts`

- [ ] **Step 1: Sửa `about.ts`**

```ts
// src/lib/api/endpoints/introduction/about.ts
type Id = string | number;

export const aboutEndpoints = {
    public: {
        list: "/api/cms/public/about-sections",
        showBySlug: (slug: string) => `/api/cms/public/about-sections/${slug}`,
        getByType: (type: string) => `/api/cms/public/about-sections/type/${type}`,
    },
    admin: {
        list: "/api/cms/admin/about-sections",
        create: "/api/cms/admin/about-sections",
        show: (id: Id) => `/api/cms/admin/about-sections/${id}`,
        update: (id: Id) => `/api/cms/admin/about-sections/${id}`,
        delete: (id: Id) => `/api/cms/admin/about-sections/${id}`,
    },
} as const;
```

- [ ] **Step 2: Sửa `certificates.ts`**

```ts
// src/lib/api/endpoints/introduction/certificates.ts
type Id = string | number;

export const certificateEndpoints = {
    public: {
        list: "/api/cms/public/certificates",
        show: (id: Id) => `/api/cms/public/certificates/${id}`,
        getByType: (type: string) => `/api/cms/public/certificates/type/${type}`,
    },
    admin: {
        list: "/api/cms/admin/certificates",
        create: "/api/cms/admin/certificates",
        show: (id: Id) => `/api/cms/admin/certificates/${id}`,
        update: (id: Id) => `/api/cms/admin/certificates/${id}`,
        delete: (id: Id) => `/api/cms/admin/certificates/${id}`,
    },
} as const;
```

- [ ] **Step 3: Sửa `contacts.ts`** (thêm markAsRead, close vào admin)

```ts
// src/lib/api/endpoints/introduction/contacts.ts
type Id = string | number;

export const contactEndpoints = {
    public: {
        create: "/api/cms/public/contacts",
    },
    admin: {
        list: "/api/cms/admin/contacts",
        create: "/api/cms/admin/contacts",
        show: (id: Id) => `/api/cms/admin/contacts/${id}`,
        update: (id: Id) => `/api/cms/admin/contacts/${id}`,
        delete: (id: Id) => `/api/cms/admin/contacts/${id}`,
        reply: (id: Id) => `/api/cms/admin/contacts/${id}/reply`,
        markAsRead: (id: Id) => `/api/cms/admin/contacts/${id}/read`,
        close: (id: Id) => `/api/cms/admin/contacts/${id}/close`,
    },
} as const;
```

- [ ] **Step 4: Sửa `faqs.ts`** (thêm view endpoint per API docs)

```ts
// src/lib/api/endpoints/introduction/faqs.ts
type Id = string | number;

export const faqEndpoints = {
    public: {
        list: "/api/cms/public/faqs",
        popular: "/api/cms/public/faqs/popular",
        show: (id: Id) => `/api/cms/public/faqs/${id}`,
        markHelpful: (id: Id) => `/api/cms/public/faqs/${id}/helpful`,
        view: (id: Id) => `/api/cms/public/faqs/${id}/view`,
    },
    admin: {
        list: "/api/cms/admin/faqs",
        create: "/api/cms/admin/faqs",
        show: (id: Id) => `/api/cms/admin/faqs/${id}`,
        update: (id: Id) => `/api/cms/admin/faqs/${id}`,
        delete: (id: Id) => `/api/cms/admin/faqs/${id}`,
    },
} as const;
```

- [ ] **Step 5: Commit**

```bash
git add src/lib/api/endpoints/introduction/about.ts \
        src/lib/api/endpoints/introduction/certificates.ts \
        src/lib/api/endpoints/introduction/contacts.ts \
        src/lib/api/endpoints/introduction/faqs.ts
git commit -m "fix: update CMS endpoint URLs for about, certificates, contacts, faqs"
```

---

## Task 2: Sửa endpoint URLs — Introduction group (gallery, partners, projects, staff, testimonials)

**Files:**
- Modify: `src/lib/api/endpoints/introduction/gallery.ts`
- Modify: `src/lib/api/endpoints/introduction/partners.ts`
- Modify: `src/lib/api/endpoints/introduction/projects.ts`
- Modify: `src/lib/api/endpoints/introduction/staff.ts`
- Modify: `src/lib/api/endpoints/introduction/testimonials.ts`

- [ ] **Step 1: Sửa `gallery.ts`** (cũng đổi `gallery` → `galleries` per API docs)

```ts
// src/lib/api/endpoints/introduction/gallery.ts
type Id = string | number;

export const galleryEndpoints = {
    public: {
        list: "/api/cms/public/galleries",
        featured: "/api/cms/public/galleries/featured",
        showBySlug: (slug: string) => `/api/cms/public/galleries/${slug}`,
    },
    admin: {
        list: "/api/cms/admin/galleries",
        create: "/api/cms/admin/galleries",
        show: (id: Id) => `/api/cms/admin/galleries/${id}`,
        update: (id: Id) => `/api/cms/admin/galleries/${id}`,
        delete: (id: Id) => `/api/cms/admin/galleries/${id}`,
    },
} as const;
```

- [ ] **Step 2: Sửa `partners.ts`**

```ts
// src/lib/api/endpoints/introduction/partners.ts
type Id = string | number;

export const partnerEndpoints = {
    public: {
        list: "/api/cms/public/partners",
        getByType: (type: string) => `/api/cms/public/partners/type/${type}`,
    },
    admin: {
        list: "/api/cms/admin/partners",
        create: "/api/cms/admin/partners",
        show: (id: Id) => `/api/cms/admin/partners/${id}`,
        update: (id: Id) => `/api/cms/admin/partners/${id}`,
        delete: (id: Id) => `/api/cms/admin/partners/${id}`,
    },
} as const;
```

- [ ] **Step 3: Sửa `projects.ts`**

```ts
// src/lib/api/endpoints/introduction/projects.ts
type Id = string | number;

export const projectEndpoints = {
    public: {
        list: "/api/cms/public/projects",
        featured: "/api/cms/public/projects/featured",
        showBySlug: (slug: string) => `/api/cms/public/projects/${slug}`,
    },
    admin: {
        list: "/api/cms/admin/projects",
        create: "/api/cms/admin/projects",
        show: (id: Id) => `/api/cms/admin/projects/${id}`,
        update: (id: Id) => `/api/cms/admin/projects/${id}`,
        delete: (id: Id) => `/api/cms/admin/projects/${id}`,
    },
} as const;
```

- [ ] **Step 4: Sửa `staff.ts`**

```ts
// src/lib/api/endpoints/introduction/staff.ts
type Id = string | number;

export const staffEndpoints = {
    public: {
        list: "/api/cms/public/staff",
        show: (id: Id) => `/api/cms/public/staff/${id}`,
        getByDepartment: (department: string) => `/api/cms/public/staff/department/${department}`,
    },
    admin: {
        list: "/api/cms/admin/staff",
        create: "/api/cms/admin/staff",
        show: (id: Id) => `/api/cms/admin/staff/${id}`,
        update: (id: Id) => `/api/cms/admin/staff/${id}`,
        delete: (id: Id) => `/api/cms/admin/staff/${id}`,
    },
} as const;
```

- [ ] **Step 5: Sửa `testimonials.ts`**

```ts
// src/lib/api/endpoints/introduction/testimonials.ts
type Id = string | number;

export const testimonialEndpoints = {
    public: {
        list: "/api/cms/public/testimonials",
        featured: "/api/cms/public/testimonials/featured",
        getByProject: (projectId: Id) => `/api/cms/public/testimonials/project/${projectId}`,
    },
    admin: {
        list: "/api/cms/admin/testimonials",
        create: "/api/cms/admin/testimonials",
        show: (id: Id) => `/api/cms/admin/testimonials/${id}`,
        update: (id: Id) => `/api/cms/admin/testimonials/${id}`,
        delete: (id: Id) => `/api/cms/admin/testimonials/${id}`,
        toggleFeatured: (id: Id) => `/api/cms/admin/testimonials/${id}/featured`,
    },
} as const;
```

- [ ] **Step 6: Commit**

```bash
git add src/lib/api/endpoints/introduction/gallery.ts \
        src/lib/api/endpoints/introduction/partners.ts \
        src/lib/api/endpoints/introduction/projects.ts \
        src/lib/api/endpoints/introduction/staff.ts \
        src/lib/api/endpoints/introduction/testimonials.ts
git commit -m "fix: update CMS endpoint URLs for gallery, partners, projects, staff, testimonials"
```

---

## Task 3: Sửa endpoint URLs — Marketing + Core

**Files:**
- Modify: `src/lib/api/endpoints/marketing/banners.ts`
- Modify: `src/lib/api/endpoints/marketing/bannerLocations.ts`
- Modify: `src/lib/api/endpoints/core/contentTemplates.ts`

- [ ] **Step 1: Sửa `banners.ts`**

```ts
// src/lib/api/endpoints/marketing/banners.ts
type Id = string | number;

export const bannerEndpoints = {
    public: {
        list: "/api/cms/public/banners",
        show: (id: Id) => `/api/cms/public/banners/${id}`,
        getByLocation: (locationCode: string) => `/api/cms/public/banners/location/${locationCode}`,
    },
    admin: {
        list: "/api/cms/admin/banners",
        create: "/api/cms/admin/banners",
        show: (id: Id) => `/api/cms/admin/banners/${id}`,
        update: (id: Id) => `/api/cms/admin/banners/${id}`,
        delete: (id: Id) => `/api/cms/admin/banners/${id}`,
        updateStatus: (id: Id) => `/api/cms/admin/banners/${id}/status`,
        updateSortOrder: (id: Id) => `/api/cms/admin/banners/${id}/sort-order`,
        restore: (id: Id) => `/api/cms/admin/banners/${id}/restore`,
        getByLocation: (locationCode: string) => `/api/cms/admin/banners/location/${locationCode}`,
    },
} as const;
```

- [ ] **Step 2: Sửa `bannerLocations.ts`**

```ts
// src/lib/api/endpoints/marketing/bannerLocations.ts
type Id = string | number;

export const bannerLocationEndpoints = {
    admin: {
        list: "/api/cms/admin/banner-locations",
        create: "/api/cms/admin/banner-locations",
        show: (id: Id) => `/api/cms/admin/banner-locations/${id}`,
        update: (id: Id) => `/api/cms/admin/banner-locations/${id}`,
        delete: (id: Id) => `/api/cms/admin/banner-locations/${id}`,
        updateStatus: (id: Id) => `/api/cms/admin/banner-locations/${id}/status`,
        restore: (id: Id) => `/api/cms/admin/banner-locations/${id}/restore`,
        getByCode: (code: string) => `/api/cms/admin/banner-locations/code/${code}`,
    },
} as const;
```

- [ ] **Step 3: Sửa `contentTemplates.ts`** (đổi sang `/api/notifications/`)

```ts
// src/lib/api/endpoints/core/contentTemplates.ts
type Id = string | number;

export const contentTemplateEndpoints = {
    admin: {
        list: "/api/notifications/admin/content-templates",
        create: "/api/notifications/admin/content-templates",
        show: (id: Id) => `/api/notifications/admin/content-templates/${id}`,
        update: (id: Id) => `/api/notifications/admin/content-templates/${id}`,
        delete: (id: Id) => `/api/notifications/admin/content-templates/${id}`,
        test: (id: Id) => `/api/notifications/admin/content-templates/${id}/test`,
    },
} as const;
```

- [ ] **Step 4: Commit**

```bash
git add src/lib/api/endpoints/marketing/banners.ts \
        src/lib/api/endpoints/marketing/bannerLocations.ts \
        src/lib/api/endpoints/core/contentTemplates.ts
git commit -m "fix: update marketing and notification endpoint URLs with correct service prefix"
```

---

## Task 4: Sửa ContactForm — phone optional

**Files:**
- Modify: `src/components/Features/CMS/Contacts/Public/ContactForm.tsx`

- [ ] **Step 1: Sửa Zod schema — phone optional, giữ validation format nếu có giá trị**

Tìm đoạn:
```ts
phone: z.string().min(1, "Số điện thoại là bắt buộc").max(20, "Số điện thoại tối đa 20 ký tự"),
```

Thay bằng:
```ts
phone: z.string().max(50, "Số điện thoại tối đa 50 ký tự").regex(/^[+]?[0-9 .\-]{6,50}$/, "Số điện thoại không hợp lệ").optional().or(z.literal("")),
```

- [ ] **Step 2: Sửa defaultValues — phone thành empty string**

Tìm:
```ts
defaultValues: {
    name: "",
    email: "",
    phone: "",
    message: "",
},
```

Giữ nguyên (không cần thay đổi).

- [ ] **Step 3: Sửa field phone — bỏ `required`**

Tìm:
```tsx
<FormField
    id="phone"
    type="tel"
    label="Số điện thoại"
    placeholder="090 123 4567"
    {...register("phone")}
    required
    error={errors.phone?.message}
/>
```

Thay bằng:
```tsx
<FormField
    id="phone"
    type="tel"
    label="Số điện thoại"
    placeholder="090 123 4567"
    {...register("phone")}
    error={errors.phone?.message}
/>
```

- [ ] **Step 4: Commit**

```bash
git add src/components/Features/CMS/Contacts/Public/ContactForm.tsx
git commit -m "fix: make phone optional in ContactForm per API spec"
```

---

## Task 5: Tạo contacts admin service

**Files:**
- Create: `src/lib/api/admin/contacts.ts`

- [ ] **Step 1: Tạo file service**

```ts
// src/lib/api/admin/contacts.ts
import { api } from "@/lib/api/client";
import { contactEndpoints } from "@/lib/api/endpoints";

export const contactAdminService = {
    reply: async (id: string | number, reply: string): Promise<void> => {
        await api.patch(contactEndpoints.admin.reply(id), { reply });
    },

    markAsRead: async (id: string | number): Promise<void> => {
        await api.patch(contactEndpoints.admin.markAsRead(id));
    },

    close: async (id: string | number): Promise<void> => {
        await api.patch(contactEndpoints.admin.close(id));
    },
};
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/api/admin/contacts.ts
git commit -m "feat: add contacts admin service for reply, read, close actions"
```

---

## Task 6: Tạo ContactReplyModal

**Files:**
- Create: `src/components/Features/CMS/Contacts/Admin/ContactReplyModal.tsx`

- [ ] **Step 1: Tạo component**

```tsx
// src/components/Features/CMS/Contacts/Admin/ContactReplyModal.tsx
"use client";

import { useState } from "react";
import { contactAdminService } from "@/lib/api/admin/contacts";
import { useToastContext } from "@/lib/toast";

interface ContactReplyModalProps {
    contactId: string | number;
    contactName: string;
    onClose: () => void;
    onSuccess: () => void;
}

export default function ContactReplyModal({
    contactId,
    contactName,
    onClose,
    onSuccess,
}: ContactReplyModalProps) {
    const [reply, setReply] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { showSuccess, showError } = useToastContext();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!reply.trim()) return;
        setIsSubmitting(true);
        try {
            await contactAdminService.reply(contactId, reply.trim());
            showSuccess("Đã gửi phản hồi thành công");
            onSuccess();
            onClose();
        } catch {
            showError("Không thể gửi phản hồi. Vui lòng thử lại.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4">
                <div className="flex items-center justify-between px-6 py-4 border-b">
                    <h3 className="text-lg font-semibold text-gray-900">
                        Phản hồi liên hệ từ <span className="text-primary">{contactName}</span>
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nội dung phản hồi <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={reply}
                            onChange={(e) => setReply(e.target.value)}
                            rows={6}
                            maxLength={20000}
                            required
                            placeholder="Nhập nội dung phản hồi..."
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
                        />
                        <p className="text-xs text-gray-400 mt-1 text-right">{reply.length}/20.000</p>
                    </div>
                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || !reply.trim()}
                            className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {isSubmitting ? "Đang gửi..." : "Gửi phản hồi"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Features/CMS/Contacts/Admin/ContactReplyModal.tsx
git commit -m "feat: add ContactReplyModal for admin contact reply action"
```

---

## Task 7: Cập nhật AdminContacts — thêm Reply, Read, Close actions

**Files:**
- Modify: `src/components/Features/CMS/Contacts/Admin/AdminContacts.tsx`

- [ ] **Step 1: Thay toàn bộ nội dung file**

```tsx
// src/components/Features/CMS/Contacts/Admin/AdminContacts.tsx
"use client";

import { useState } from "react";
import { useCrudList } from "@/hooks";
import { adminEndpoints } from "@/lib/api/endpoints";
import ContactsFilter from "./ContactsFilter";
import ContactReplyModal from "./ContactReplyModal";
import SkeletonLoader from "@/components/UI/Feedback/SkeletonLoader";
import Pagination from "@/components/UI/DataDisplay/Pagination";
import ConfirmModal from "@/components/UI/Feedback/ConfirmModal";
import { formatDate } from "@/utils";
import { getStatusBadge } from "@/config/constants/status";
import { CONTACT_STATUS_BADGES } from "@/components/Features/CMS/Contacts/constants";
import { contactAdminService } from "@/lib/api/admin/contacts";
import { useToastContext } from "@/lib/toast";

const endpoints = adminEndpoints.contacts;

interface AdminContactsProps {
    title?: string;
}

export default function AdminContacts({ title = "Quản lý Liên hệ" }: AdminContactsProps) {
    const { showSuccess, showError } = useToastContext();
    const {
        data, actions, ui,
        deleteModal,
        handleDeleteConfirm, openDelete,
    } = useCrudList({
        endpoint: endpoints.list,
        deleteSuccessMessage: "Liên hệ đã được xóa thành công",
    });

    const { items, loading, pagination, filters, hasData } = data;
    const { getSerialNumber } = ui;

    const [replyModal, setReplyModal] = useState<{ id: string | number; name: string } | null>(null);

    const handleMarkAsRead = async (id: string | number) => {
        try {
            await contactAdminService.markAsRead(id);
            showSuccess("Đã đánh dấu đã đọc");
            actions.refresh();
        } catch {
            showError("Không thể thực hiện thao tác");
        }
    };

    const handleClose = async (id: string | number) => {
        try {
            await contactAdminService.close(id);
            showSuccess("Đã đóng liên hệ");
            actions.refresh();
        } catch {
            showError("Không thể thực hiện thao tác");
        }
    };

    return (
        <div className="admin-contacts">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">{title}</h1>
            </div>

            <ContactsFilter
                initialFilters={filters}
                onUpdateFilters={actions.updateFilters}
            />

            <div className="bg-white shadow-md rounded-lg overflow-hidden mt-6">
                {loading ? (
                    <SkeletonLoader type="table" rows={10} columns={8} />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STT</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Họ tên</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email/SĐT</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nội dung</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày tạo</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {items.length > 0 ? items.map((contact, index) => {
                                    const badge = getStatusBadge(contact.status, CONTACT_STATUS_BADGES);
                                    return (
                                        <tr key={contact.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getSerialNumber(index)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{contact.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <div className="font-medium text-indigo-600">{contact.email}</div>
                                                <div className="text-xs text-gray-400">{contact.phone}</div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate" title={contact.message}>
                                                {contact.message}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <span className={`px-2 py-1 inline-flex text-[10px] leading-5 font-bold uppercase rounded-full ${badge.className}`}>
                                                    {badge.label}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatDate(contact.created_at)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    {contact.status !== "Replied" && contact.status !== "Closed" && (
                                                        <button
                                                            onClick={() => setReplyModal({ id: contact.id, name: contact.name })}
                                                            className="px-2 py-1 text-xs font-medium text-blue-600 border border-blue-200 rounded hover:bg-blue-50 transition-colors"
                                                        >
                                                            Phản hồi
                                                        </button>
                                                    )}
                                                    {contact.status === "Pending" && (
                                                        <button
                                                            onClick={() => handleMarkAsRead(contact.id)}
                                                            className="px-2 py-1 text-xs font-medium text-green-600 border border-green-200 rounded hover:bg-green-50 transition-colors"
                                                        >
                                                            Đã đọc
                                                        </button>
                                                    )}
                                                    {contact.status !== "Closed" && (
                                                        <button
                                                            onClick={() => handleClose(contact.id)}
                                                            className="px-2 py-1 text-xs font-medium text-gray-600 border border-gray-200 rounded hover:bg-gray-50 transition-colors"
                                                        >
                                                            Đóng
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => openDelete(contact, endpoints)}
                                                        className="px-2 py-1 text-xs font-medium text-red-600 border border-red-200 rounded hover:bg-red-50 transition-colors"
                                                    >
                                                        Xóa
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                }) : (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-10 text-center text-gray-500 italic">
                                            Không có dữ liệu liên hệ nào
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {hasData && (
                <Pagination
                    currentPage={pagination.page}
                    totalPages={pagination.totalPages}
                    totalItems={pagination.totalItems}
                    onPageChange={actions.changePage}
                />
            )}

            {deleteModal.isOpen && deleteModal.data && (
                <ConfirmModal
                    show={deleteModal.isOpen}
                    title="Xác nhận xóa"
                    message={`Bạn có chắc chắn muốn xóa liên hệ từ "${deleteModal.data.displayName}"?`}
                    onClose={deleteModal.close}
                    onConfirm={handleDeleteConfirm}
                />
            )}

            {replyModal && (
                <ContactReplyModal
                    contactId={replyModal.id}
                    contactName={replyModal.name}
                    onClose={() => setReplyModal(null)}
                    onSuccess={() => actions.refresh()}
                />
            )}
        </div>
    );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Features/CMS/Contacts/Admin/AdminContacts.tsx
git commit -m "feat: add Reply, Read, Close actions to AdminContacts"
```

---

*Kết thúc PR 1. Sau khi hoàn thành, chạy `npm run build` để kiểm tra TypeScript errors.*
