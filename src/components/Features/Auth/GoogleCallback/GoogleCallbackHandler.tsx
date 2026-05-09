"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";
import { setTokenToCookie } from "@/lib/api/utils";
import { storage } from "@/lib/storage";

export default function GoogleCallbackHandler() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { fetchUserInfo } = useAuthStore();

    useEffect(() => {
        const token = searchParams.get("token");
        const refreshToken = searchParams.get("refreshToken");
        const error = searchParams.get("error");

        if (error) {
            const errorMessages: Record<string, string> = {
                ACCOUNT_LINKED_TO_OTHER: "Email này đã liên kết với tài khoản khác",
                ACCOUNT_LOCKED: "Tài khoản bị khóa",
                GOOGLE_AUTH_FAILED: "Đăng nhập Google thất bại",
            };
            const message = errorMessages[error] || "Có lỗi xảy ra";
            router.push(`/login?error=${encodeURIComponent(message)}`);
            return;
        }

        if (token) {
            setTokenToCookie(token);
            if (refreshToken) {
                storage.auth.setRefreshToken(refreshToken);
            }
            fetchUserInfo(true)
                .then(() => { router.push("/admin"); })
                .catch((err) => {
                    console.error("Failed to fetch user info", err);
                    router.push("/login?error=auth_failed");
                });
        } else {
            router.push("/login?error=invalid_callback");
        }
    }, [searchParams, router, fetchUserInfo]);

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
}
