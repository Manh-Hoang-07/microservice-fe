"use client";

import { useState, useEffect } from "react";
import { useUnreadCount } from "@/hooks/data/user/useNotifications";
import NotificationDropdown from "./NotificationDropdown";

export default function NotificationBell() {
    const [isOpen, setIsOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const { count } = useUnreadCount();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const toggleDropdown = () => {
        setIsOpen((prev) => !prev);
    };

    const closeDropdown = () => {
        setIsOpen(false);
    };

    const badgeLabel = count > 99 ? "99+" : String(count);

    return (
        <div className="relative">
            <button
                onClick={toggleDropdown}
                aria-label="Thông báo"
                aria-expanded={isOpen}
                className="relative w-9 h-9 rounded-lg bg-transparent border-none cursor-pointer flex items-center justify-center hover:bg-slate-100"
            >
                {/* Bell SVG */}
                <svg
                    className="w-5 h-5 text-slate-600"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.437L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                </svg>

                {/* Unread badge */}
                {isMounted && count > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold px-1">
                        {badgeLabel}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            {isMounted && isOpen && (
                <NotificationDropdown onClose={closeDropdown} />
            )}
        </div>
    );
}
