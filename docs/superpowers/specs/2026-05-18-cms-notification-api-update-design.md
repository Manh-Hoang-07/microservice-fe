# Design: CMS & Notification Service API Integration Update

**Date:** 2026-05-18
**Scope:** 2 PRs — URL fixes + new Notification UI

---

## Background

Hai tài liệu API mới (`cms-service-api.md`, `notification-service-api.md`) xác định rõ base URL của từng microservice:
- CMS Service: `http://<host>/api/cms`
- Notification Service: `http://<host>/api/notifications`

Codebase hiện tại dùng path thiếu prefix (ví dụ `/api/admin/about-sections` thay vì `/api/cms/admin/about-sections`). Đồng thời thiếu hoàn toàn UI cho Notification (user + admin).

---

## PR 1: URL Fixes + Contact Admin Improvements

### 1.1 Sửa API Endpoint URLs

Cập nhật các file trong `src/lib/api/endpoints/`:

| File | Cũ | Mới |
|---|---|---|
| `introduction/about.ts` | `/api/about-sections` | `/api/cms/public/about-sections` |
| `introduction/about.ts` | `/api/admin/about-sections` | `/api/cms/admin/about-sections` |
| `introduction/contacts.ts` | `/api/public/contacts` | `/api/cms/public/contacts` |
| `introduction/contacts.ts` | `/api/admin/contacts` | `/api/cms/admin/contacts` |
| `introduction/certificates.ts` | `/api/*/certificates` | `/api/cms/*/certificates` |
| `introduction/faqs.ts` | `/api/*/faqs` | `/api/cms/*/faqs` |
| `introduction/gallery.ts` | `/api/*/galleries` | `/api/cms/*/galleries` |
| `introduction/partners.ts` | `/api/*/partners` | `/api/cms/*/partners` |
| `introduction/projects.ts` | `/api/*/projects` | `/api/cms/*/projects` |
| `introduction/staff.ts` | `/api/*/staff` | `/api/cms/*/staff` |
| `introduction/testimonials.ts` | `/api/*/testimonials` | `/api/cms/*/testimonials` |
| `marketing/banners.ts` | `/api/*/banners` | `/api/cms/*/banners` |
| `marketing/bannerLocations.ts` | `/api/*/banner-locations` | `/api/cms/*/banner-locations` |
| `core/contentTemplates.ts` | `/api/admin/content-templates` | `/api/notifications/admin/content-templates` |

### 1.2 Contact Form

**File:** `src/components/Features/CMS/Contacts/Public/ContactForm.tsx`

- Đổi `phone` từ required → optional trong Zod schema
- Bỏ `.min(1, "Số điện thoại là bắt buộc")`, giữ validation format nếu có giá trị

### 1.3 Admin Contacts — Thêm Actions

**File:** `src/components/Features/CMS/Contacts/Admin/AdminContacts.tsx`

Thêm 3 actions mới (hiện chỉ có Delete):
- **Reply** — mở `ContactReplyModal` với textarea reply, POST đến `PATCH /api/cms/admin/contacts/:id/reply`
- **Mark as Read** — button inline, gọi `PATCH /api/cms/admin/contacts/:id/read`, refresh list
- **Close** — button inline, gọi `PATCH /api/cms/admin/contacts/:id/close`, refresh list

**File mới:** `src/components/Features/CMS/Contacts/Admin/ContactReplyModal.tsx`
- Modal với textarea (required, max 20,000 ký tự)
- Submit gọi API reply

**File mới:** `src/lib/api/admin/contacts.ts`
- `contactAdminService.reply(id, reply)`
- `contactAdminService.markAsRead(id)`
- `contactAdminService.close(id)`

---

## PR 2: Notification UI

### 2.1 API Endpoints

**File mới:** `src/lib/api/endpoints/core/notifications.ts`

```ts
export const notificationEndpoints = {
  user: {
    list: "/api/notifications/user/notifications",
    unreadCount: "/api/notifications/user/notifications/unread/count",
    show: (id) => `/api/notifications/user/notifications/${id}`,
    markRead: (id) => `/api/notifications/user/notifications/${id}/read`,
    markAllRead: "/api/notifications/user/notifications/read-all",
  },
  admin: {
    list: "/api/notifications/admin/notifications",
    send: "/api/notifications/admin/notifications/send",
    delete: (id) => `/api/notifications/admin/notifications/${id}`,
  },
}
```

Export từ `src/lib/api/endpoints/core/index.ts` và thêm vào `adminEndpoints`/`userEndpoints` trong `src/lib/api/endpoints/index.ts`.

### 2.2 Hooks

**File mới:** `src/hooks/data/user/useNotifications.ts`
- `useNotifications(params)` — fetch list với filter/pagination
- `useUnreadCount()` — fetch count, dùng cho badge

**File mới:** `src/hooks/data/admin/useAdminNotifications.ts`
- `useAdminNotificationList(params)` — fetch all notifications
- `useSendNotification()` — POST bulk send

### 2.3 User — Bell Icon

**File sửa:** `src/components/Layouts/Admin/header/HeaderBar.tsx` (và user layout header nếu có)

Thêm `NotificationBell` component:
- Gọi `useUnreadCount()`, hiện badge đỏ nếu count > 0
- Click → mở dropdown `NotificationDropdown`

**File mới:** `src/components/Features/Notification/User/NotificationBell.tsx`
**File mới:** `src/components/Features/Notification/User/NotificationDropdown.tsx`
- Hiện 10 thông báo gần nhất
- Mỗi item: icon theo `type` (info/success/warning/error), title, time relative
- Click item → mark read + navigate nếu `data` có link
- Nút "Đánh dấu tất cả đã đọc" → `markAllRead`
- Link "Xem tất cả" → `/user/notifications`

### 2.4 User — Trang Notifications

**File mới:** `src/app/(user)/user/notifications/page.tsx`
**File mới:** `src/components/Features/Notification/User/NotificationList.tsx`
- Filter: `type` (all/info/success/warning/error), `isRead` (all/unread/read)
- Danh sách với pagination
- Click item → mark as read
- Nút "Đánh dấu tất cả đã đọc"

### 2.5 Admin — Trang Notifications

**File mới:** `src/app/(admin)/admin/notifications/page.tsx`
**File mới:** `src/components/Features/Notification/Admin/AdminNotifications.tsx`

Hai tab:
1. **Danh sách** — table với filter userId/type/status/isRead, nút Delete
2. **Gửi thông báo** — form:
   - `userIds`: text area nhập nhiều ID (mỗi dòng 1 ID) hoặc multiselect
   - `title`: input text
   - `message`: textarea
   - `type`: select (info/success/warning/error), mặc định info
   - Submit → `POST /api/notifications/admin/notifications/send`

**Files mới:**
- `src/components/Features/Notification/Admin/NotificationList.tsx`
- `src/components/Features/Notification/Admin/SendNotificationForm.tsx`

---

## Constraints

- Không thêm dependency mới — dùng existing patterns (useCrudList, useFormModal, useToastContext)
- Phone trong ContactForm phải vẫn validate format nếu được nhập
- Bell icon chỉ render khi user đã authenticated
- Admin notification page cần permission `notification.manage`

---

*Spec tạo 2026-05-18*
