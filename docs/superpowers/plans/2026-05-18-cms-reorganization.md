# CMS Reorganization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Gộp toàn bộ components từ `Features/Introduction` và `Features/Marketing` vào `Features/CMS`, và di chuyển 11 admin pages từ `admin/introduction/*` + `admin/marketing/*` vào `admin/cms/*`.

**Architecture:** Dùng bash mv để di chuyển thư mục nhanh, sau đó cập nhật tất cả import paths bằng sed. Public pages và component files cần cập nhật import từ `Introduction/` và `Marketing/` sang `CMS/`.

**Tech Stack:** Next.js 14 App Router, TypeScript, bash (Git Bash on Windows)

---

### Task 1: Di chuyển component directories sang Features/CMS

**Files:**
- Move: `src/components/Features/Introduction/` → `src/components/Features/CMS/` (từng subdir)
- Move: `src/components/Features/Marketing/Banners/` → `src/components/Features/CMS/Banners/`
- Move: `src/components/Features/Marketing/BannerLocations/` → `src/components/Features/CMS/BannerLocations/`

- [ ] **Step 1: Tạo thư mục CMS và di chuyển từ Introduction**

```bash
cd d:/microservice-fe
mkdir -p src/components/Features/CMS
# Di chuyển từng subdir của Introduction sang CMS
for dir in About Certificates Contacts Faqs Galleries Gallery Partners Projects Services Staff Testimonials; do
  mv "src/components/Features/Introduction/$dir" "src/components/Features/CMS/$dir"
done
```

- [ ] **Step 2: Di chuyển từ Marketing sang CMS**

```bash
mv src/components/Features/Marketing/Banners src/components/Features/CMS/Banners
mv src/components/Features/Marketing/BannerLocations src/components/Features/CMS/BannerLocations
```

- [ ] **Step 3: Xoá thư mục Introduction và Marketing cũ (nếu rỗng)**

```bash
rm -rf src/components/Features/Introduction
rm -rf src/components/Features/Marketing
```

- [ ] **Step 4: Verify cấu trúc mới**

```bash
ls src/components/Features/CMS/
```

Expected: `About  Banners  BannerLocations  Certificates  Contacts  Faqs  Galleries  Gallery  Partners  Projects  Services  Staff  Testimonials`

---

### Task 2: Cập nhật import paths trong tất cả files

**Files:**
- Modify: tất cả `.tsx` và `.ts` trong `src/` có import từ `Features/Introduction` hoặc `Features/Marketing`

- [ ] **Step 1: Replace tất cả import paths Introduction → CMS**

```bash
cd d:/microservice-fe
find src -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i 's|@/components/Features/Introduction/|@/components/Features/CMS/|g' {} +
```

- [ ] **Step 2: Replace tất cả import paths Marketing → CMS**

```bash
find src -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i 's|@/components/Features/Marketing/|@/components/Features/CMS/|g' {} +
```

- [ ] **Step 3: Verify không còn import cũ**

```bash
grep -r "Features/Introduction\|Features/Marketing" src/ --include="*.tsx" --include="*.ts"
```

Expected: No output

---

### Task 3: Tạo 11 admin/cms pages

**Files:**
- Create: `src/app/(admin)/admin/cms/banners/page.tsx`
- Create: `src/app/(admin)/admin/cms/banner-locations/page.tsx`
- Create: `src/app/(admin)/admin/cms/abouts/page.tsx`
- Create: `src/app/(admin)/admin/cms/certificates/page.tsx`
- Create: `src/app/(admin)/admin/cms/contacts/page.tsx`
- Create: `src/app/(admin)/admin/cms/faqs/page.tsx`
- Create: `src/app/(admin)/admin/cms/gallery/page.tsx`
- Create: `src/app/(admin)/admin/cms/partners/page.tsx`
- Create: `src/app/(admin)/admin/cms/projects/page.tsx`
- Create: `src/app/(admin)/admin/cms/staff/page.tsx`
- Create: `src/app/(admin)/admin/cms/testimonials/page.tsx`

- [ ] **Step 1: Tạo thư mục cms và copy các page files**

```bash
cd d:/microservice-fe
mkdir -p src/app/'(admin)'/admin/cms/{banners,banner-locations,abouts,certificates,contacts,faqs,gallery,partners,projects,staff,testimonials}
cp src/app/'(admin)'/admin/marketing/banners/page.tsx       src/app/'(admin)'/admin/cms/banners/page.tsx
cp src/app/'(admin)'/admin/marketing/banner-locations/page.tsx src/app/'(admin)'/admin/cms/banner-locations/page.tsx
cp src/app/'(admin)'/admin/introduction/abouts/page.tsx     src/app/'(admin)'/admin/cms/abouts/page.tsx
cp src/app/'(admin)'/admin/introduction/certificates/page.tsx src/app/'(admin)'/admin/cms/certificates/page.tsx
cp src/app/'(admin)'/admin/introduction/contacts/page.tsx   src/app/'(admin)'/admin/cms/contacts/page.tsx
cp src/app/'(admin)'/admin/introduction/faqs/page.tsx       src/app/'(admin)'/admin/cms/faqs/page.tsx
cp src/app/'(admin)'/admin/introduction/gallery/page.tsx    src/app/'(admin)'/admin/cms/gallery/page.tsx
cp src/app/'(admin)'/admin/introduction/partners/page.tsx   src/app/'(admin)'/admin/cms/partners/page.tsx
cp src/app/'(admin)'/admin/introduction/projects/page.tsx   src/app/'(admin)'/admin/cms/projects/page.tsx
cp src/app/'(admin)'/admin/introduction/staff/page.tsx      src/app/'(admin)'/admin/cms/staff/page.tsx
cp src/app/'(admin)'/admin/introduction/testimonials/page.tsx src/app/'(admin)'/admin/cms/testimonials/page.tsx
```

- [ ] **Step 2: Update import paths trong các cms page files (Introduction → CMS)**

```bash
find src/app/'(admin)'/admin/cms -type f -name "*.tsx" -exec sed -i 's|Features/Introduction/|Features/CMS/|g' {} +
find src/app/'(admin)'/admin/cms -type f -name "*.tsx" -exec sed -i 's|Features/Marketing/|Features/CMS/|g' {} +
```

- [ ] **Step 3: Xoá các page cũ**

```bash
rm -rf src/app/'(admin)'/admin/introduction
rm -rf src/app/'(admin)'/admin/marketing
```

- [ ] **Step 4: Verify**

```bash
ls src/app/'(admin)'/admin/cms/
```

Expected: `abouts  banner-locations  banners  certificates  contacts  faqs  gallery  partners  projects  staff  testimonials`

---

### Task 4: Commit

- [ ] **Step 1: Stage và commit**

```bash
cd d:/microservice-fe
git add -A
git status
git commit -m "refactor: gộp Introduction + Marketing vào Features/CMS, di chuyển admin pages sang admin/cms"
```
