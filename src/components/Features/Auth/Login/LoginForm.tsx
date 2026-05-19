"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { env } from "@/config/env";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuthStore } from "@/lib/store/authStore";
import { useToastContext } from "@/lib/toast";
import { authEndpoints } from "@/lib/api/endpoints";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";

const loginSchema = z.object({
  email: z.string().min(1, "Email là bắt buộc").email("Email không hợp lệ").max(255, "Email quá dài"),
  password: z.string().min(1, "Mật khẩu là bắt buộc").min(6, "Mật khẩu phải có ít nhất 6 ký tự").max(72, "Mật khẩu quá dài"),
  remember: z.boolean().default(false),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isAuthenticated, isInitialized } = useAuthStore();
  const { showError } = useToastContext();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passFocused, setPassFocused] = useState(false);


  useEffect(() => {
    const error = searchParams.get("error");
    if (error) showError(decodeURIComponent(error));
  }, [searchParams, showError]);

  useEffect(() => {
    if (isInitialized && isAuthenticated) router.replace("/user");
  }, [isInitialized, isAuthenticated, router]);

  const { register, handleSubmit, formState: { errors }, setError } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", remember: false },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      const result = await login({ email: data.email, password: data.password, remember: data.remember });
      if (result.success) {
        router.push(searchParams.get("next") || "/admin");
      } else {
        if (result.errors) Object.keys(result.errors).forEach(key => {
          const m = result.errors![key]; if (m?.[0]) setError(key as any, { message: m[0] });
        });
        showError(result.message || "Đăng nhập thất bại.");
      }
    } catch { showError("Đã có lỗi xảy ra."); }
    finally { setIsLoading(false); }
  };

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
      <div className="auth-card" style={{ background: "#ffffff", borderRadius: "20px", padding: "40px 44px", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px rgba(0,0,0,0.03), 0 20px 50px rgba(99,102,241,0.08)" }}>
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
              <input type="email" placeholder="you@example.com"
                {...register("email")} autoComplete="email"
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
              <input type={showPassword ? "text" : "password"} placeholder="Nhập mật khẩu"
                {...register("password")} autoComplete="current-password"
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
            <input type="checkbox" {...register("remember")} style={{ width: "15px", height: "15px", accentColor: "#6366f1", cursor: "pointer" }} />
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
        <button type="button" onClick={() => { window.location.href = `${env.apiUrl}${authEndpoints.google}`; }} style={{ width: "100%", height: "48px", borderRadius: "10px", border: "1.5px solid #e2e8f0", background: "white", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", fontSize: "14px", fontWeight: 500, color: "#374151", cursor: "pointer", transition: "all 0.2s" }}>
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
}
