"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuthStore } from "@/lib/store/authStore";
import { useToastContext } from "@/contexts/ToastContext";
import { ArrowLeft, Eye, EyeOff, CheckCircle2 } from "lucide-react";

const emailSchema = z.object({ email: z.string().min(1, "Email là bắt buộc").email("Email không hợp lệ") });
const resetPasswordSchema = z.object({
  email: z.string().email(),
  otp: z.string().min(6, "Mã OTP phải có 6 ký tự").max(6, "Mã OTP phải có 6 ký tự"),
  password: z.string().min(1, "Mật khẩu mới là bắt buộc").min(8, "Mật khẩu ít nhất 8 ký tự").max(72, "Tối đa 72 ký tự"),
  confirmPassword: z.string().min(1, "Xác nhận mật khẩu là bắt buộc"),
}).refine((d) => d.password === d.confirmPassword, { message: "Mật khẩu không khớp", path: ["confirmPassword"] });

type EmailFormValues = z.infer<typeof emailSchema>;
type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export default function ForgotPasswordForm() {
  const router = useRouter();
  const { sendOtpForgotPassword, resetPassword } = useAuthStore();
  const { showSuccess, showError } = useToastContext();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [userEmail, setUserEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focusField, setFocusField] = useState("");

  useEffect(() => {
    let t: NodeJS.Timeout;
    if (countdown > 0) t = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const emailForm = useForm<EmailFormValues>({ resolver: zodResolver(emailSchema), defaultValues: { email: "" } });
  const resetForm = useForm<ResetPasswordFormValues>({ resolver: zodResolver(resetPasswordSchema), defaultValues: { email: "", otp: "", password: "", confirmPassword: "" } });

  const onEmailSubmit = async (data: EmailFormValues) => {
    setIsLoading(true);
    try {
      const r = await sendOtpForgotPassword(data.email);
      if (r.success) { setUserEmail(data.email); resetForm.setValue("email", data.email); setStep(2); setCountdown(60); showSuccess(r.message || "Mã OTP đã gửi."); }
      else showError(r.message || "Email không tồn tại.");
    } catch { showError("Đã có lỗi xảy ra."); }
    finally { setIsLoading(false); }
  };

  const onResetSubmit = async (data: ResetPasswordFormValues) => {
    setIsLoading(true);
    try {
      const r = await resetPassword(data);
      if (r.success) { showSuccess("Đổi mật khẩu thành công!"); setStep(3); }
      else showError(r.message || "OTP không đúng hoặc hết hạn.");
    } catch { showError("Đã có lỗi xảy ra."); }
    finally { setIsLoading(false); }
  };

  const handleResendOtp = async () => {
    if (countdown > 0) return;
    setIsLoading(true);
    try {
      const r = await sendOtpForgotPassword(userEmail);
      if (r.success) { setCountdown(60); showSuccess("Đã gửi lại mã."); }
      else showError(r.message || "Không thể gửi lại.");
    } catch { showError("Lỗi."); }
    finally { setIsLoading(false); }
  };

  const inputStyle = (focused: boolean, hasError: boolean): React.CSSProperties => ({
    width: "100%", height: "48px", padding: "0 14px",
    borderRadius: "10px", fontSize: "15px", color: "#0f172a", outline: "none",
    background: "#f8fafc",
    border: hasError ? "1.5px solid #ef4444" : focused ? "1.5px solid #6366f1" : "1.5px solid #e2e8f0",
    boxShadow: focused ? "0 0 0 3px rgba(99,102,241,0.10)" : hasError ? "0 0 0 3px rgba(239,68,68,0.08)" : "none",
    transition: "all 0.2s ease",
  });

  const eyeBtn = (show: boolean, toggle: () => void) => (
    <button type="button" tabIndex={-1} onClick={toggle} style={{ position: "absolute", right: "4px", top: "50%", transform: "translateY(-50%)", width: "40px", height: "40px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", cursor: "pointer", color: "#9ca3af" }}>
      {show ? <EyeOff style={{ width: 16, height: 16 }} /> : <Eye style={{ width: 16, height: 16 }} />}
    </button>
  );

  const btnPrimary = (loading: boolean, text: string, loadingText: string) => (
    <button type="submit" disabled={loading} style={{ width: "100%", height: "48px", borderRadius: "10px", background: "linear-gradient(135deg, #6366f1, #7c3aed)", color: "white", fontSize: "14.5px", fontWeight: 600, border: "none", cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", opacity: loading ? 0.65 : 1, boxShadow: "0 4px 14px rgba(99,102,241,0.35)", transition: "all 0.2s" }}>
      {loading ? (
        <><svg style={{ animation: "spin 1s linear infinite", width: 18, height: 18 }} viewBox="0 0 24 24" fill="none"><circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3.003 7.938l3-2.647z" /></svg>{loadingText}</>
      ) : text}
    </button>
  );

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

      <div className="auth-card" style={{ background: "#ffffff", borderRadius: "20px", padding: "40px 44px", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px rgba(0,0,0,0.03), 0 20px 50px rgba(99,102,241,0.08)" }}>
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
}
