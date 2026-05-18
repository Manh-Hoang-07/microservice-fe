"use client";

import { useState } from "react";
import {
    useNotifications,
    useMarkRead,
    useMarkAllRead,
    Notification,
} from "@/hooks/data/user/useNotifications";

function getRelativeTime(dateStr: string): string {
    const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (diff < 60) return "vừa xong";
    if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
    return `${Math.floor(diff / 86400)} ngày trước`;
}

const TYPE_BORDER: Record<Notification["type"], string> = {
    info: "border-l-blue-500",
    success: "border-l-green-500",
    warning: "border-l-amber-500",
    error: "border-l-red-500",
};

const TYPE_DOT: Record<Notification["type"], string> = {
    info: "bg-blue-500",
    success: "bg-green-500",
    warning: "bg-amber-500",
    error: "bg-red-500",
};

const TYPE_OPTIONS = [
    { value: "all", label: "Tất cả" },
    { value: "info", label: "Thông tin" },
    { value: "success", label: "Thành công" },
    { value: "warning", label: "Cảnh báo" },
    { value: "error", label: "Lỗi" },
];

const READ_OPTIONS = [
    { value: "all", label: "Tất cả" },
    { value: "false", label: "Chưa đọc" },
    { value: "true", label: "Đã đọc" },
];

export default function NotificationList() {
    const [type, setType] = useState("all");
    const [isReadFilter, setIsReadFilter] = useState<string>("all");
    const [page, setPage] = useState(1);
    const limit = 10;

    const isRead =
        isReadFilter === "all" ? undefined : isReadFilter === "true";

    const { notifications, isLoading, total } = useNotifications({
        page,
        limit,
        type: type === "all" ? undefined : type,
        isRead,
    });

    const { markRead } = useMarkRead();
    const { markAllRead, isPending: isMarkingAll } = useMarkAllRead();

    const totalPages = Math.max(1, Math.ceil(total / limit));

    const handleTypeChange = (value: string) => {
        setType(value);
        setPage(1);
    };

    const handleReadChange = (value: string) => {
        setIsReadFilter(value);
        setPage(1);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
                {/* Page heading */}
                <div className="mb-6">
                    <h1 className="text-3xl font-black text-gray-900 mb-1">Thông báo của tôi</h1>
                    <p className="text-gray-500 font-medium">Theo dõi các thông báo mới nhất</p>
                </div>

                {/* Filter bar */}
                <div className="flex flex-wrap items-center gap-3 mb-6 bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
                    {/* Type filter */}
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-semibold text-gray-600 whitespace-nowrap">
                            Loại:
                        </label>
                        <select
                            value={type}
                            onChange={(e) => handleTypeChange(e.target.value)}
                            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                        >
                            {TYPE_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Read filter */}
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-semibold text-gray-600 whitespace-nowrap">
                            Trạng thái:
                        </label>
                        <select
                            value={isReadFilter}
                            onChange={(e) => handleReadChange(e.target.value)}
                            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                        >
                            {READ_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Spacer */}
                    <div className="flex-1" />

                    {/* Mark all read */}
                    <button
                        onClick={() => markAllRead()}
                        disabled={isMarkingAll}
                        className="text-sm font-semibold text-blue-600 hover:text-blue-800 disabled:opacity-50 px-4 py-1.5 rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors cursor-pointer bg-transparent"
                    >
                        Đánh dấu tất cả đã đọc
                    </button>
                </div>

                {/* Content */}
                {isLoading ? (
                    <div className="space-y-3">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div
                                key={i}
                                className="bg-white rounded-xl border border-gray-100 p-4 animate-pulse flex items-start gap-4"
                            >
                                <div className="w-2.5 h-2.5 rounded-full bg-gray-200 mt-1.5 shrink-0" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-gray-200 rounded w-1/3" />
                                    <div className="h-3 bg-gray-200 rounded w-2/3" />
                                    <div className="h-3 bg-gray-200 rounded w-1/4" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg
                                className="w-8 h-8 text-gray-300"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                                />
                            </svg>
                        </div>
                        <h3 className="text-lg font-black text-gray-900 mb-1">
                            Không có thông báo nào
                        </h3>
                        <p className="text-gray-400 text-sm">
                            Bạn chưa có thông báo nào phù hợp với bộ lọc hiện tại.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {notifications.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => markRead(item.id)}
                                className={`w-full text-left rounded-xl border-l-4 border border-gray-100 p-4 flex items-start gap-4 transition-all hover:shadow-md cursor-pointer ${
                                    TYPE_BORDER[item.type]
                                } ${
                                    !item.isRead
                                        ? "bg-blue-50 hover:bg-blue-100"
                                        : "bg-gray-50 hover:bg-gray-100"
                                }`}
                            >
                                {/* Dot */}
                                <span
                                    className={`mt-1.5 shrink-0 w-2.5 h-2.5 rounded-full ${TYPE_DOT[item.type]}`}
                                />

                                {/* Body */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                        <p className="text-sm font-bold text-gray-900 leading-snug">
                                            {item.title}
                                        </p>
                                        {!item.isRead && (
                                            <span className="shrink-0 inline-block w-2 h-2 rounded-full bg-blue-500 mt-1" />
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-600 mt-0.5 line-clamp-2">
                                        {item.message}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        {getRelativeTime(item.createdAt)}
                                    </p>
                                </div>
                            </button>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {!isLoading && notifications.length > 0 && (
                    <div className="flex items-center justify-center gap-4 mt-8">
                        <button
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page <= 1}
                            className="px-4 py-2 text-sm font-semibold rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                        >
                            Trước
                        </button>

                        <span className="text-sm font-semibold text-gray-600">
                            Trang {page} / {totalPages}
                        </span>

                        <button
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            disabled={page >= totalPages}
                            className="px-4 py-2 text-sm font-semibold rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                        >
                            Tiếp
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
