"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuthStore } from "@/lib/store/authStore";
import { useToastContext } from "@/contexts/ToastContext";
import { Eye, EyeOff } from "lucide-react";

const registerSchema = z.object({
  name: z.string().min(1, "Họ và tên là bắt buộc").max(255, "Họ và tên tối đa 255 ký tự"),
  email: z.string().min(1, "Email là bắt buộc").email("Email không hợp lệ").max(255, "Email quá dài"),
  phone: z.string().regex(/^[0-9+]{6,20}$/, "Số điện thoại không hợp lệ").optional().nullable().or(z.literal("")),
  password: z.string().min(1, "Mật khẩu là bắt buộc").min(8, "Mật khẩu phải có ít nhất 8 ký tự").max(72, "Mật khẩu tối đa 72 ký tự"),
  confirmPassword: z.string().min(1, "Xác nhận mật khẩu là bắt buộc"),
  otp: z.string().min(6, "Mã OTP phải có 6 ký tự").max(6, "Mã OTP phải có 6 ký tự"),
  agreeTerms: z.boolean().refine(val => val === true, "Bạn phải đồng ý với điều khoản"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Mật khẩu xác nhận không khớp", path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterForm() {
  const router = useRouter();
  const { register: registerUser, sendOtpRegister } = useAuthStore();
  const { showSuccess, showError } = useToastContext();
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focusField, setFocusField] = useState("");

  useEffect(() => {
    let t: NodeJS.Timeout;
    if (countdown > 0) t = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const { register, handleSubmit, watch, formState: { errors }, setError } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", phone: "", password: "", confirmPassword: "", otp: "", agreeTerms: false },
  });

  const email = watch("email");

  const handleSendOtp = async () => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("email", { message: "Vui lòng nhập email hợp lệ" }); return;
    }
    setIsSendingOtp(true);
    try {
      const result = await sendOtpRegister(email);
      if (result.success) { setOtpSent(true); setCountdown(60); showSuccess(result.message || "Mã OTP đã được gửi."); }
      else showError(result.message || "Không thể gửi OTP.");
    } catch { showError("Có lỗi xảy ra."); }
    finally { setIsSendingOtp(false); }
  };

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    try {
      const result = await registerUser({ name: data.name, email: data.email, phone: data.phone || undefined, password: data.password, confirmPassword: data.confirmPassword, otp: data.otp });
      if (result.success) { showSuccess("Đăng ký thành công!"); setTimeout(() => router.push("/login"), 2000); }
      else {
        if (result.errors) Object.keys(result.errors).forEach(k => { const m = result.errors![k]; if (m?.[0]) setError(k as any, { message: m[0] }); });
        showError(result.message || "Đăng ký thất bại.");
      }
    } catch { showError("Có lỗi xảy ra."); }
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

  return (
    <>
      {/* Card */}
      <div className="auth-card" style={{ background: "#ffffff", borderRadius: "20px", padding: "40px 44px", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px rgba(0,0,0,0.03), 0 20px 50px rgba(99,102,241,0.08)" }}>
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
}
