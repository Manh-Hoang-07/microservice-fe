# lib Cleanup & Restructure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Dọn dẹp src/lib, xóa mock data, xóa group (không còn dùng), đơn giản hóa storage, gộp ToastContext vào lib/toast, cập nhật imports.

**Architecture:** Xóa toàn bộ group-related code (lib/group, hooks/data/system/useGroup, GroupSwitcher component), xóa mock data, di chuyển ToastContext → lib/toast. Mỗi bước độc lập, không phụ thuộc nhau ngoại trừ bước import update cuối.

**Tech Stack:** Next.js 14 App Router, TypeScript, Zustand, localStorage

---

### Task 1: Xóa src/lib/data/ (mock-services)

**Files:**
- Delete: `src/lib/data/mock-services.ts`
- Modify: `src/app/(public)/services/page.tsx`

- [ ] Xóa file `src/lib/data/mock-services.ts`
- [ ] Xóa thư mục `src/lib/data/`
- [ ] Sửa `src/app/(public)/services/page.tsx`: bỏ import `getServices`, truyền `initialServices={[]}`

---

### Task 2: Xóa group — files chính

**Files:**
- Delete: `src/lib/group/utils.ts` (+ thư mục group/)
- Delete: `src/hooks/data/system/useGroup.ts`
- Delete: `src/components/UI/Navigation/GroupSwitcher.tsx`

- [ ] Xóa `src/lib/group/utils.ts` và thư mục `src/lib/group/`
- [ ] Xóa `src/hooks/data/system/useGroup.ts`
- [ ] Xóa `src/components/UI/Navigation/GroupSwitcher.tsx`

---

### Task 3: Xóa group — barrel exports & component usage

**Files:**
- Modify: `src/hooks/index.ts` — xóa dòng `export * from "./data/system/useGroup"`
- Modify: `src/components/UI/Navigation/index.ts` — xóa dòng export GroupSwitcher
- Modify: `src/components/Layouts/Admin/header/HeaderBar.tsx` — xóa GroupSwitcher

- [ ] `src/hooks/index.ts`: xóa `export * from "./data/system/useGroup";`
- [ ] `src/components/UI/Navigation/index.ts`: xóa `export { default as GroupSwitcher } from "./GroupSwitcher";`
- [ ] `src/components/Layouts/Admin/header/HeaderBar.tsx`: xóa import GroupSwitcher, xóa `<GroupSwitcher className="mr-3" />`

---

### Task 4: Dọn src/lib/storage/index.ts — bỏ group section

**Files:**
- Modify: `src/lib/storage/index.ts`

- [ ] Xóa import `Group` từ `@/lib/group/utils`
- [ ] Xóa keys `USER_GROUPS` và `SELECTED_GROUP_ID` khỏi KEYS
- [ ] Xóa toàn bộ section `group: { ... }` trong `storage`
- [ ] Cập nhật `clearAll()`: bỏ 2 dòng `storage.group.clearGroups()` và `storage.group.clearSelected()`

---

### Task 5: Dọn src/lib/store/authStore.ts — bỏ initializeUserGroups

**Files:**
- Modify: `src/lib/store/authStore.ts`

- [ ] Xóa `import { initializeUserGroups } from "@/lib/group/utils";`
- [ ] Xóa bất kỳ lời gọi `initializeUserGroups(...)` còn lại trong file

---

### Task 6: Di chuyển ToastContext → src/lib/toast/

**Files:**
- Create: `src/lib/toast/index.ts` (copy từ src/contexts/ToastContext.tsx)
- Delete: `src/contexts/ToastContext.tsx` (và thư mục contexts/)
- Modify: tất cả files import từ `@/contexts/ToastContext`

- [ ] Tạo `src/lib/toast/index.ts` với nội dung y hệt `src/contexts/ToastContext.tsx`
- [ ] Xóa `src/contexts/ToastContext.tsx` và thư mục `src/contexts/`
- [ ] Cập nhật tất cả imports: thay `@/contexts/ToastContext` → `@/lib/toast`
  - `src/app/layout.tsx`
  - `src/components/UI/Feedback/ToastContainer.tsx`
  - Tất cả components dùng `useToastContext`

---
