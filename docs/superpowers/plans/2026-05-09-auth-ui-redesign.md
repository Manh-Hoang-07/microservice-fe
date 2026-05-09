# Auth UI Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign all auth pages to a clean white/light-gray centered card style (Notion/Linear aesthetic) with subtle indigo blobs, replacing the old split-screen purple layout.

**Architecture:** Remove the split-screen layout from `layout.tsx` entirely — replace with a full-page `#f8fafc` background + soft indigo blobs, children centered. Each form component gets brand header inside the card, clean inputs with `#f8fafc` bg and `#e2e8f0` border, focus ring `#6366f1`. All logic (react-hook-form, zod, auth store) stays untouched.

**Tech Stack:** Next.js, React inline styles (existing pattern), lucide-react icons, react-hook-form, zod.

---

## Design Tokens (use these exact values everywhere)

```
BG:          #f8fafc
CARD_BG:     #ffffff
CARD_BORDER: #e2e8f0
CARD_RADIUS: 20px
CARD_SHADOW: 0 4px 6px rgba(0,0,0,0.03), 0 20px 50px rgba(99,102,241,0.08)
CARD_PAD:    40px 44px (desktop) / 28px 24px (mobile ≤480px)

INPUT_BG:       #f8fafc
INPUT_BORDER:   1.5px solid #e2e8f0
INPUT_RADIUS:   10px
INPUT_HEIGHT:   48px
INPUT_FOCUS_BORDER: #6366f1
INPUT_FOCUS_SHADOW: 0 0 0 3px rgba(99,102,241,0.10)
INPUT_ERROR_BORDER: #ef4444
INPUT_ERROR_SHADOW: 0 0 0 3px rgba(239,68,68,0.08)

BRAND_ICON_BG:  linear-gradient(135deg, #6366f1, #7c3aed)
BTN_BG:         linear-gradient(135deg, #6366f1 0%, #7c3aed 100%)
BTN_SHADOW:     0 4px 14px rgba(99,102,241,0.35)
BTN_RADIUS:     10px

LABEL_COLOR:    #374151
TEXT_MUTED:     #94a3b8
TEXT_BODY:      #0f172a
LINK_COLOR:     #6366f1
ERROR_COLOR:    #ef4444

BLOB_1: rgba(99,102,241,0.07)  500px circle top-left blur:80px
BLOB_2: rgba(139,92,246,0.06)  420px circle bottom-right blur:80px
BLOB_3: rgba(99,102,241,0.05)  300px circle mid-right blur:60px
```

---

## Files Modified

- `src/app/(auth)/layout.tsx` — replace split-screen with centered blob layout
- `src/components/Features/Auth/Login/LoginForm.tsx` — redesign UI only
- `src/components/Features/Auth/Register/RegisterForm.tsx` — redesign UI only
- `src/components/Features/Auth/ForgotPassword/ForgotPasswordForm.tsx` — redesign UI only
- `src/components/Features/Auth/GoogleCallback/GoogleCallbackHandler.tsx` — update loading UI

---

## Task 1: Update Auth Layout

**Files:**
- Modify: `src/app/(auth)/layout.tsx`

- [ ] **Step 1: Replace layout with centered blob design**

Replace the entire file content with:

```tsx
import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc", padding: "24px", position: "relative", overflow: "hidden" }}>
      {/* Background blobs */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div style={{ position: "absolute", width: "500px", height: "500px", background: "rgba(99,102,241,0.07)", borderRadius: "50%", top: "-150px", left: "-120px", filter: "blur(80px)" }} />
        <div style={{ position: "absolute", width: "420px", height: "420px", background: "rgba(139,92,246,0.06)", borderRadius: "50%", bottom: "-120px", right: "-100px", filter: "blur(80px)" }} />
        <div style={{ position: "absolute", width: "300px", height: "300px", background: "rgba(99,102,241,0.05)", borderRadius: "50%", top: "35%", right: "10%", filter: "blur(60px)" }} />
      </div>

      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: "460px" }}>
        {children}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify dev server compiles (check terminal for errors)**

---

## Task 2: Redesign LoginForm UI

**Files:**
- Modify: `src/components/Features/Auth/Login/LoginForm.tsx`

Keep ALL logic (useEffect, onSubmit, form registration, auth store calls) unchanged. Only replace JSX/styles.

- [ ] **Step 1: Replace the return statement**

Replace everything from `return (` to end of component (keep all logic above it) with:

```tsx
  const inputStyle = (focused: boolean, hasError: boolean): React.CSSProperties => ({
    width: "100%", height: "48px", paddingLeft: "44px", paddingRight: "14px",
    borderRadius: "10px", fontSize: "15px", color: "#0f172a", outline: "none",
    background: "#f8fafc",
    border: hasError ? "1.5px solid #ef4444" : focused ? "1.5px solid #6366f1" : "1.5px solid #e2e8f0",
    boxShadow: focused ? "0 0 0 3px rgba(99,102,241,0.10)" : hasError ? "0 0 0 3px rgba(239,68,68,0.08)" : "none",
    transition: "all 0.2s ease",
  });

  return (
    <>
      {/* Card */}
      <div style={{ background: "#ffffff", borderRadius: "20px", padding: "40px 44px", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px rgba(0,0,0,0.03), 0 20px 50px rgba(99,102,241,0.08)" }}>
        {/* Brand */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ width: "52px", height: "52px", background: "linear-gradient(135deg, #6366f1, #7c3aed)", borderRadius: "16px", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: "14px", boxShadow: "0 8px 20px rgba(99,102,241,0.3)" }}>
            <svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div style={{ fontSize: "22px", fontWeight: 700, color: "#0f172a", letterSpacing: "-0.4px", marginBottom: "4px" }}>Comic Haven</div>
          <div style={{ fontSize: "14px", color: "#94a3b8" }}>Đăng nhập để tiếp tục</div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Email */}
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 500, color: "#374151", marginBottom: "7px" }}>Email</label>
            <div style={{ position: "relative" }}>
              <div style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: emailFocused ? "#6366f1" : "#9ca3af", pointerEvents: "none", display: "flex" }}>
                <Mail style={{ width: 16, height: 16 }} />
              </div>
              <input type="email" placeholder="you@example.com" {...register("email")} autoComplete="email"
                style={inputStyle(emailFocused, !!errors.email)}
                onFocus={() => setEmailFocused(true)} onBlur={() => setEmailFocused(false)} />
            </div>
            {errors.email && <p style={{ marginTop: "6px", fontSize: "13px", color: "#ef4444" }}>{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div style={{ marginBottom: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "7px" }}>
              <label style={{ fontSize: "13px", fontWeight: 500, color: "#374151" }}>Mật khẩu</label>
              <Link href="/forgot-password" style={{ fontSize: "13px", fontWeight: 500, color: "#6366f1", textDecoration: "none" }}>Quên mật khẩu?</Link>
            </div>
            <div style={{ position: "relative" }}>
              <div style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: passFocused ? "#6366f1" : "#9ca3af", pointerEvents: "none", display: "flex" }}>
                <Lock style={{ width: 16, height: 16 }} />
              </div>
              <input type={showPassword ? "text" : "password"} placeholder="Nhập mật khẩu" {...register("password")} autoComplete="current-password"
                style={{ ...inputStyle(passFocused, !!errors.password), paddingRight: "48px" }}
                onFocus={() => setPassFocused(true)} onBlur={() => setPassFocused(false)} />
              <button type="button" tabIndex={-1} onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: "4px", top: "50%", transform: "translateY(-50%)", width: "40px", height: "40px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", cursor: "pointer", color: "#9ca3af" }}>
                {showPassword ? <EyeOff style={{ width: 16, height: 16 }} /> : <Eye style={{ width: 16, height: 16 }} />}
              </button>
            </div>
            {errors.password && <p style={{ marginTop: "6px", fontSize: "13px", color: "#ef4444" }}>{errors.password.message}</p>}
          </div>

          {/* Remember */}
          <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", marginBottom: "20px" }}>
            <input type="checkbox" {...register("rememberMe")} style={{ width: "15px", height: "15px", accentColor: "#6366f1", cursor: "pointer" }} />
            <span style={{ fontSize: "13px", color: "#64748b" }}>Ghi nhớ đăng nhập</span>
          </label>

          {/* Submit */}
          <button type="submit" disabled={isLoading} style={{ width: "100%", height: "48px", borderRadius: "10px", background: "linear-gradient(135deg, #6366f1 0%, #7c3aed 100%)", color: "white", fontSize: "14.5px", fontWeight: 600, border: "none", cursor: isLoading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", opacity: isLoading ? 0.65 : 1, boxShadow: "0 4px 14px rgba(99,102,241,0.35)", transition: "all 0.2s ease", marginBottom: "20px" }}>
            {isLoading ? (
              <><svg style={{ animation: "spin 1s linear infinite", width: 18, height: 18 }} viewBox="0 0 24 24" fill="none"><circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3.003 7.938l3-2.647z" /></svg>Đang đăng nhập...</>
            ) : "Đăng nhập"}
          </button>
        </form>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
          <div style={{ flex: 1, height: "1px", background: "#e2e8f0" }} />
          <span style={{ fontSize: "12px", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em" }}>Hoặc</span>
          <div style={{ flex: 1, height: "1px", background: "#e2e8f0" }} />
        </div>

        {/* Google */}
        <button type="button" onClick={() => { window.location.href = `${env.apiUrl}/api/auth/google`; }} style={{ width: "100%", height: "48px", borderRadius: "10px", border: "1.5px solid #e2e8f0", background: "white", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", fontSize: "14px", fontWeight: 500, color: "#374151", cursor: "pointer", transition: "all 0.2s" }}>
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Tiếp tục với Google
        </button>
      </div>

      {/* Footer */}
      <p style={{ marginTop: "24px", textAlign: "center", fontSize: "13.5px", color: "#94a3b8" }}>
        Chưa có tài khoản?{" "}
        <Link href="/register" style={{ fontWeight: 600, color: "#6366f1", textDecoration: "none" }}>Đăng ký miễn phí</Link>
      </p>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
```

Also remove `inputBase` helper (replaced by inline `inputStyle`) and remove the old `emailFocused`/`passFocused` state declarations — keep them as-is since they're reused.

- [ ] **Step 2: Verify page loads at `/login`**

---

## Task 3: Redesign RegisterForm UI

**Files:**
- Modify: `src/components/Features/Auth/Register/RegisterForm.tsx`

Keep ALL logic. Replace only JSX/styles.

- [ ] **Step 1: Replace inputBase helper and return statement**

Remove the top-level `inputBase` function. Add `inputStyle` inside the component (before return):

```tsx
  const inputStyle = (focused: boolean, hasError: boolean, extraPad?: React.CSSProperties): React.CSSProperties => ({
    width: "100%", height: "48px", padding: "0 14px",
    borderRadius: "10px", fontSize: "15px", color: "#0f172a", outline: "none",
    background: "#f8fafc",
    border: hasError ? "1.5px solid #ef4444" : focused ? "1.5px solid #6366f1" : "1.5px solid #e2e8f0",
    boxShadow: focused ? "0 0 0 3px rgba(99,102,241,0.10)" : hasError ? "0 0 0 3px rgba(239,68,68,0.08)" : "none",
    transition: "all 0.2s ease",
    ...extraPad,
  });
```

Replace return statement:

```tsx
  return (
    <>
      {/* Card */}
      <div style={{ background: "#ffffff", borderRadius: "20px", padding: "40px 44px", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px rgba(0,0,0,0.03), 0 20px 50px rgba(99,102,241,0.08)" }}>
        {/* Brand */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div style={{ width: "52px", height: "52px", background: "linear-gradient(135deg, #6366f1, #7c3aed)", borderRadius: "16px", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: "14px", boxShadow: "0 8px 20px rgba(99,102,241,0.3)" }}>
            <svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div style={{ fontSize: "22px", fontWeight: 700, color: "#0f172a", letterSpacing: "-0.4px", marginBottom: "4px" }}>Tạo tài khoản</div>
          <div style={{ fontSize: "14px", color: "#94a3b8" }}>Bắt đầu sử dụng Comic Haven</div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Name */}
          <div style={{ marginBottom: "14px" }}>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 500, color: "#374151", marginBottom: "7px" }}>Họ và tên <span style={{ color: "#ef4444" }}>*</span></label>
            <input type="text" placeholder="Nguyễn Văn A" {...register("name")}
              style={inputStyle(focusField === "name", !!errors.name)}
              onFocus={() => setFocusField("name")} onBlur={() => setFocusField("")} />
            {errors.name && <p style={{ marginTop: "5px", fontSize: "13px", color: "#ef4444" }}>{errors.name.message}</p>}
          </div>

          {/* Email + OTP button */}
          <div style={{ marginBottom: "14px" }}>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 500, color: "#374151", marginBottom: "7px" }}>Email <span style={{ color: "#ef4444" }}>*</span></label>
            <div style={{ display: "flex", gap: "8px" }}>
              <input type="email" placeholder="you@example.com" {...register("email")}
                style={{ ...inputStyle(focusField === "email", !!errors.email), flex: 1 }}
                onFocus={() => setFocusField("email")} onBlur={() => setFocusField("")} />
              <button type="button" onClick={handleSendOtp} disabled={isSendingOtp || countdown > 0} style={{ height: "48px", padding: "0 16px", borderRadius: "10px", background: countdown > 0 || isSendingOtp ? "#f1f5f9" : "linear-gradient(135deg, #6366f1, #7c3aed)", color: countdown > 0 || isSendingOtp ? "#94a3b8" : "white", fontSize: "13px", fontWeight: 600, border: "none", whiteSpace: "nowrap", cursor: countdown > 0 || isSendingOtp ? "not-allowed" : "pointer", transition: "all 0.2s" }}>
                {isSendingOtp ? "..." : countdown > 0 ? `${countdown}s` : "Gửi OTP"}
              </button>
            </div>
            {errors.email && <p style={{ marginTop: "5px", fontSize: "13px", color: "#ef4444" }}>{errors.email.message}</p>}
          </div>

          {/* OTP */}
          <div style={{ marginBottom: "14px" }}>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 500, color: "#374151", marginBottom: "7px" }}>Mã xác thực OTP <span style={{ color: "#ef4444" }}>*</span></label>
            <input type="text" placeholder="Nhập mã 6 số" maxLength={6} {...register("otp")}
              style={{ ...inputStyle(focusField === "otp", !!errors.otp), letterSpacing: "0.2em", fontFamily: "monospace" }}
              onFocus={() => setFocusField("otp")} onBlur={() => setFocusField("")} />
            {errors.otp && <p style={{ marginTop: "5px", fontSize: "13px", color: "#ef4444" }}>{errors.otp.message}</p>}
            {otpSent && !errors.otp && <p style={{ marginTop: "5px", fontSize: "13px", color: "#059669" }}>Mã OTP đã gửi. Hiệu lực 5 phút.</p>}
          </div>

          {/* Phone */}
          <div style={{ marginBottom: "14px" }}>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 500, color: "#374151", marginBottom: "7px" }}>Số điện thoại <span style={{ fontWeight: 400, color: "#94a3b8" }}>(không bắt buộc)</span></label>
            <input type="tel" placeholder="+84 901 234 567" {...register("phone")}
              style={inputStyle(focusField === "phone", !!errors.phone)}
              onFocus={() => setFocusField("phone")} onBlur={() => setFocusField("")} />
            {errors.phone && <p style={{ marginTop: "5px", fontSize: "13px", color: "#ef4444" }}>{errors.phone.message}</p>}
          </div>

          {/* Password */}
          <div style={{ marginBottom: "14px" }}>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 500, color: "#374151", marginBottom: "7px" }}>Mật khẩu <span style={{ color: "#ef4444" }}>*</span></label>
            <div style={{ position: "relative" }}>
              <input type={showPassword ? "text" : "password"} placeholder="Tối thiểu 8 ký tự" {...register("password")}
                style={{ ...inputStyle(focusField === "password", !!errors.password), paddingRight: "48px" }}
                onFocus={() => setFocusField("password")} onBlur={() => setFocusField("")} />
              {eyeBtn(showPassword, () => setShowPassword(!showPassword))}
            </div>
            {errors.password && <p style={{ marginTop: "5px", fontSize: "13px", color: "#ef4444" }}>{errors.password.message}</p>}
          </div>

          {/* Confirm Password */}
          <div style={{ marginBottom: "14px" }}>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 500, color: "#374151", marginBottom: "7px" }}>Xác nhận mật khẩu <span style={{ color: "#ef4444" }}>*</span></label>
            <div style={{ position: "relative" }}>
              <input type={showConfirmPassword ? "text" : "password"} placeholder="Nhập lại mật khẩu" {...register("confirmPassword")}
                style={{ ...inputStyle(focusField === "confirm", !!errors.confirmPassword), paddingRight: "48px" }}
                onFocus={() => setFocusField("confirm")} onBlur={() => setFocusField("")} />
              {eyeBtn(showConfirmPassword, () => setShowConfirmPassword(!showConfirmPassword))}
            </div>
            {errors.confirmPassword && <p style={{ marginTop: "5px", fontSize: "13px", color: "#ef4444" }}>{errors.confirmPassword.message}</p>}
          </div>

          {/* Terms */}
          <label style={{ display: "flex", alignItems: "flex-start", gap: "8px", cursor: "pointer", margin: "16px 0 20px" }}>
            <input type="checkbox" {...register("agreeTerms")} style={{ marginTop: "3px", width: "15px", height: "15px", accentColor: "#6366f1", cursor: "pointer", flexShrink: 0 }} />
            <span style={{ fontSize: "13px", color: "#64748b", lineHeight: 1.5 }}>
              Tôi đồng ý với <a href="#" style={{ fontWeight: 500, color: "#6366f1", textDecoration: "none" }}>Điều khoản dịch vụ</a> và <a href="#" style={{ fontWeight: 500, color: "#6366f1", textDecoration: "none" }}>Chính sách bảo mật</a>
            </span>
          </label>
          {errors.agreeTerms && <p style={{ marginTop: "-12px", marginBottom: "12px", fontSize: "13px", color: "#ef4444" }}>{errors.agreeTerms.message}</p>}

          {/* Submit */}
          <button type="submit" disabled={isLoading} style={{ width: "100%", height: "48px", borderRadius: "10px", background: "linear-gradient(135deg, #6366f1 0%, #7c3aed 100%)", color: "white", fontSize: "14.5px", fontWeight: 600, border: "none", cursor: isLoading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", opacity: isLoading ? 0.65 : 1, boxShadow: "0 4px 14px rgba(99,102,241,0.35)", transition: "all 0.2s" }}>
            {isLoading ? (
              <><svg style={{ animation: "spin 1s linear infinite", width: 18, height: 18 }} viewBox="0 0 24 24" fill="none"><circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3.003 7.938l3-2.647z" /></svg>Đang xử lý...</>
            ) : "Tạo tài khoản"}
          </button>
        </form>
      </div>

      <p style={{ marginTop: "24px", textAlign: "center", fontSize: "13.5px", color: "#94a3b8" }}>
        Đã có tài khoản?{" "}
        <Link href="/login" style={{ fontWeight: 600, color: "#6366f1", textDecoration: "none" }}>Đăng nhập</Link>
      </p>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
```

- [ ] **Step 2: Remove old top-level `inputBase`, `label`, `errMsg`, `eyeBtn` helpers** (they were outside the component; keep `eyeBtn` inside the component since it's still used)

- [ ] **Step 3: Verify `/register` loads correctly**

---

## Task 4: Redesign ForgotPasswordForm UI

**Files:**
- Modify: `src/components/Features/Auth/ForgotPassword/ForgotPasswordForm.tsx`

Keep ALL logic. Replace only JSX/styles.

- [ ] **Step 1: Replace inputBase helper and return statement**

Remove top-level `inputBase`. Add inside component (before return):

```tsx
  const inputStyle = (focused: boolean, hasError: boolean): React.CSSProperties => ({
    width: "100%", height: "48px", padding: "0 14px",
    borderRadius: "10px", fontSize: "15px", color: "#0f172a", outline: "none",
    background: "#f8fafc",
    border: hasError ? "1.5px solid #ef4444" : focused ? "1.5px solid #6366f1" : "1.5px solid #e2e8f0",
    boxShadow: focused ? "0 0 0 3px rgba(99,102,241,0.10)" : hasError ? "0 0 0 3px rgba(239,68,68,0.08)" : "none",
    transition: "all 0.2s ease",
  });
```

Replace return statement:

```tsx
  return (
    <>
      {/* Back link */}
      {step !== 3 && (
        <div style={{ marginBottom: "16px" }}>
          <Link href="/login" style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "13.5px", color: "#64748b", textDecoration: "none" }}>
            <ArrowLeft style={{ width: 15, height: 15 }} /> Quay lại đăng nhập
          </Link>
        </div>
      )}

      <div style={{ background: "#ffffff", borderRadius: "20px", padding: "40px 44px", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px rgba(0,0,0,0.03), 0 20px 50px rgba(99,102,241,0.08)" }}>
        {/* Brand */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div style={{ width: "52px", height: "52px", background: "linear-gradient(135deg, #6366f1, #7c3aed)", borderRadius: "16px", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: "14px", boxShadow: "0 8px 20px rgba(99,102,241,0.3)" }}>
            <svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div style={{ fontSize: "20px", fontWeight: 700, color: "#0f172a", letterSpacing: "-0.4px", marginBottom: "4px" }}>
            {step === 3 ? "Thành công!" : step === 2 ? "Đặt lại mật khẩu" : "Quên mật khẩu?"}
          </div>
          {step !== 3 && (
            <div style={{ fontSize: "14px", color: "#94a3b8" }}>
              {step === 1 ? "Nhập email để nhận mã khôi phục" : <>Mã OTP đã gửi đến <strong style={{ color: "#374151" }}>{userEmail}</strong></>}
            </div>
          )}
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <form onSubmit={emailForm.handleSubmit(onEmailSubmit)}>
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 500, color: "#374151", marginBottom: "7px" }}>Email</label>
              <input type="email" placeholder="you@example.com" {...emailForm.register("email")}
                style={inputStyle(focusField === "email", !!emailForm.formState.errors.email)}
                onFocus={() => setFocusField("email")} onBlur={() => setFocusField("")} />
              {emailForm.formState.errors.email && <p style={{ marginTop: "6px", fontSize: "13px", color: "#ef4444" }}>{emailForm.formState.errors.email.message}</p>}
            </div>
            {btnPrimary(isLoading, "Gửi mã xác thực", "Đang gửi...")}
          </form>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <form onSubmit={resetForm.handleSubmit(onResetSubmit)}>
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 500, color: "#374151", marginBottom: "7px" }}>Mã OTP</label>
              <input type="text" placeholder="Nhập mã 6 số" maxLength={6} {...resetForm.register("otp")}
                style={{ ...inputStyle(focusField === "otp", !!resetForm.formState.errors.otp), letterSpacing: "0.2em", fontFamily: "monospace" }}
                onFocus={() => setFocusField("otp")} onBlur={() => setFocusField("")} />
              {resetForm.formState.errors.otp && <p style={{ marginTop: "6px", fontSize: "13px", color: "#ef4444" }}>{resetForm.formState.errors.otp.message}</p>}
              <button type="button" onClick={handleResendOtp} disabled={countdown > 0 || isLoading} style={{ marginTop: "8px", fontSize: "13px", fontWeight: 500, color: countdown > 0 ? "#94a3b8" : "#6366f1", background: "none", border: "none", cursor: countdown > 0 ? "not-allowed" : "pointer", padding: 0 }}>
                {countdown > 0 ? `Gửi lại sau ${countdown}s` : "Gửi lại mã OTP"}
              </button>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 500, color: "#374151", marginBottom: "7px" }}>Mật khẩu mới</label>
              <div style={{ position: "relative" }}>
                <input type={showPassword ? "text" : "password"} placeholder="Tối thiểu 8 ký tự" {...resetForm.register("password")}
                  style={{ ...inputStyle(focusField === "password", !!resetForm.formState.errors.password), paddingRight: "48px" }}
                  onFocus={() => setFocusField("password")} onBlur={() => setFocusField("")} />
                {eyeBtn(showPassword, () => setShowPassword(!showPassword))}
              </div>
              {resetForm.formState.errors.password && <p style={{ marginTop: "6px", fontSize: "13px", color: "#ef4444" }}>{resetForm.formState.errors.password.message}</p>}
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 500, color: "#374151", marginBottom: "7px" }}>Xác nhận mật khẩu</label>
              <div style={{ position: "relative" }}>
                <input type={showConfirmPassword ? "text" : "password"} placeholder="Nhập lại mật khẩu" {...resetForm.register("confirmPassword")}
                  style={{ ...inputStyle(focusField === "confirm", !!resetForm.formState.errors.confirmPassword), paddingRight: "48px" }}
                  onFocus={() => setFocusField("confirm")} onBlur={() => setFocusField("")} />
                {eyeBtn(showConfirmPassword, () => setShowConfirmPassword(!showConfirmPassword))}
              </div>
              {resetForm.formState.errors.confirmPassword && <p style={{ marginTop: "6px", fontSize: "13px", color: "#ef4444" }}>{resetForm.formState.errors.confirmPassword.message}</p>}
            </div>

            {btnPrimary(isLoading, "Cập nhật mật khẩu", "Đang xử lý...")}
          </form>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div style={{ textAlign: "center", padding: "8px 0" }}>
            <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "72px", height: "72px", borderRadius: "50%", background: "#ecfdf5", marginBottom: "20px" }}>
              <CheckCircle2 style={{ width: 36, height: 36, color: "#059669" }} />
            </div>
            <p style={{ fontSize: "15px", color: "#64748b", lineHeight: 1.6, marginBottom: "24px" }}>
              Mật khẩu đã được đặt lại.<br />Hãy đăng nhập với mật khẩu mới.
            </p>
            <button onClick={() => router.push("/login")} style={{ width: "100%", height: "48px", borderRadius: "10px", background: "linear-gradient(135deg, #6366f1, #7c3aed)", color: "white", fontSize: "14.5px", fontWeight: 600, border: "none", cursor: "pointer", boxShadow: "0 4px 14px rgba(99,102,241,0.35)", transition: "all 0.2s" }}>
              Về trang đăng nhập
            </button>
          </div>
        )}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
```

Also update `btnPrimary` helper inside the component to use new tokens:

```tsx
  const btnPrimary = (loading: boolean, text: string, loadingText: string) => (
    <button type="submit" disabled={loading} style={{ width: "100%", height: "48px", borderRadius: "10px", background: "linear-gradient(135deg, #6366f1, #7c3aed)", color: "white", fontSize: "14.5px", fontWeight: 600, border: "none", cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", opacity: loading ? 0.65 : 1, boxShadow: "0 4px 14px rgba(99,102,241,0.35)", transition: "all 0.2s" }}>
      {loading ? (
        <><svg style={{ animation: "spin 1s linear infinite", width: 18, height: 18 }} viewBox="0 0 24 24" fill="none"><circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3.003 7.938l3-2.647z" /></svg>{loadingText}</>
      ) : text}
    </button>
  );
```

- [ ] **Step 2: Verify `/forgot-password` loads correctly**

---

## Task 5: Update GoogleCallbackHandler UI

**Files:**
- Modify: `src/components/Features/Auth/GoogleCallback/GoogleCallbackHandler.tsx`

Keep ALL logic. Only update the loading UI to match new style and fix Vietnamese text encoding.

- [ ] **Step 1: Replace return statement**

```tsx
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ position: "relative", width: "56px", height: "56px", margin: "0 auto 20px" }}>
          <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "3px solid #e2e8f0" }} />
          <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "3px solid #6366f1", borderTopColor: "transparent", animation: "spin 0.8s linear infinite" }} />
        </div>
        <p style={{ fontSize: "16px", fontWeight: 600, color: "#0f172a", margin: 0 }}>Đang xử lý đăng nhập...</p>
        <p style={{ fontSize: "14px", color: "#94a3b8", marginTop: "6px" }}>Vui lòng đợi trong giây lát</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
```

Note: This component does NOT use `AuthLayout` (it's at `/google/callback` which may not be wrapped). The `minHeight: 100vh` + bg handles its own full-page appearance.

- [ ] **Step 2: Verify the component compiles (no runtime check needed for callback page)**

---

## Task 6: Mobile responsiveness

**Files:**
- Modify: `src/app/(auth)/layout.tsx`
- Modify: `src/components/Features/Auth/Login/LoginForm.tsx` (card padding)
- Modify: `src/components/Features/Auth/Register/RegisterForm.tsx` (card padding)
- Modify: `src/components/Features/Auth/ForgotPassword/ForgotPasswordForm.tsx` (card padding)

- [ ] **Step 1: Add responsive card padding to layout**

In `layout.tsx`, add a `<style>` tag after the wrapper div:

```tsx
      <style>{`
        @media (max-width: 480px) {
          .auth-card { padding: 28px 20px !important; }
        }
      `}</style>
```

- [ ] **Step 2: Add `className="auth-card"` to each card div in Login, Register, ForgotPassword forms**

In each form, find the outer white card div and add `className="auth-card"`:
```tsx
<div className="auth-card" style={{ background: "#ffffff", borderRadius: "20px", padding: "40px 44px", ... }}>
```

- [ ] **Step 3: Verify on mobile viewport (DevTools → 375px width)**

---
