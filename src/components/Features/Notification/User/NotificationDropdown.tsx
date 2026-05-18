"use client";

import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    useNotifications,
    useMarkRead,
    useMarkAllRead,
    Notification,
} from "@/hooks/data/user/useNotifications";

interface NotificationDropdownProps {
    onClose: () => void;
}

function getRelativeTime(dateStr: string): string {
    const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (diff < 60) return "vừa xong";
    if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
    return `${Math.floor(diff / 86400)} ngày trước`;
}

const TYPE_COLOR: Record<Notification["type"], string> = {
    info: "bg-blue-500",
    success: "bg-green-500",
    warning: "bg-amber-500",
    error: "bg-red-500",
};

export default function NotificationDropdown({ onClose }: NotificationDropdownProps) {
    const router = useRouter();

    const { notifications, isLoading } = useNotifications({ limit: 10, page: 1 });
    const { markRead } = useMarkRead();
    const { markAllRead, isPending: isMarkingAll } = useMarkAllRead();

    const handleItemClick = (item: Notification) => {
        markRead(item.id);
        if (item.data?.url) {
            onClose();
            router.push(item.data.url as string);
        }
    };

    const content = (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-[9998]"
                onClick={onClose}
            />

            {/* Panel */}
            <div className="fixed right-4 top-14 w-80 max-h-96 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden z-[9999] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 shrink-0">
                    <span className="font-semibold text-slate-800 text-sm">Thông báo</span>
                    <button
                        onClick={() => markAllRead()}
                        disabled={isMarkingAll}
                        className="text-xs text-blue-600 hover:text-blue-800 disabled:opacity-50 cursor-pointer border-none bg-transparent"
                    >
                        Đánh dấu tất cả đã đọc
                    </button>
                </div>

                {/* Content */}
                <div className="overflow-y-auto flex-1">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-8 text-sm text-slate-400">
                            Đang tải...
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="flex items-center justify-center py-8 text-sm text-slate-400">
                            Không có thông báo
                        </div>
                    ) : (
                        notifications.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => handleItemClick(item)}
                                className={`w-full text-left px-4 py-3 flex items-start gap-3 hover:bg-slate-50 transition-colors border-none cursor-pointer border-b border-slate-50 last:border-b-0 ${
                                    !item.isRead ? "bg-blue-50" : "bg-white"
                                }`}
                            >
                                {/* Type dot */}
                                <span
                                    className={`mt-1 shrink-0 w-2.5 h-2.5 rounded-full ${TYPE_COLOR[item.type]}`}
                                />

                                {/* Text */}
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-slate-800 truncate">
                                        {item.title}
                                    </p>
                                    <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">
                                        {item.message}
                                    </p>
                                    <p className="text-[10px] text-slate-400 mt-1">
                                        {getRelativeTime(item.createdAt)}
                                    </p>
                                </div>
                            </button>
                        ))
                    )}
                </div>

                {/* Footer */}
                <div className="border-t border-slate-100 shrink-0">
                    <Link
                        href="/user/notifications"
                        onClick={onClose}
                        className="block text-center text-sm text-blue-600 hover:text-blue-800 py-3 transition-colors"
                    >
                        Xem tất cả
                    </Link>
                </div>
            </div>
        </>
    );

    return createPortal(content, document.body);
}
