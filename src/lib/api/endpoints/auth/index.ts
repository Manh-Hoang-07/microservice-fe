export const authEndpoints = {
    login: "/api/auth/login",
    register: "/api/auth/register",
    sendOtpRegister: "/api/auth/register/send-otp",
    sendOtpForgotPassword: "/api/auth/forgot-password/send-otp",
    resetPassword: "/api/auth/reset-password",
    logout: "/api/auth/logout",
    logoutAll: "/api/auth/logout-all",
    refresh: "/api/auth/refresh",
    google: "/api/auth/google",
    profile: {
        me: "/api/auth/me",
        update: "/api/auth/user/profile",
        changePassword: "/api/auth/user/profile/change-password",
    },
} as const;
