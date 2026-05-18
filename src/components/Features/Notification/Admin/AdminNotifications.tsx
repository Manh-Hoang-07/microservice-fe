"use client";

import { useState } from "react";
import NotificationListTab from "./NotificationListTab";
import SendNotificationForm from "./SendNotificationForm";

const TABS = [
    { id: "list", label: "Danh sách thông báo" },
    { id: "send", label: "Gửi thông báo" },
];

export default function AdminNotifications() {
    const [activeTab, setActiveTab] = useState<"list" | "send">("list");

    return (
        <div>
            {/* Tab buttons */}
            <div className="flex gap-1 mb-6 border-b border-gray-200">
                {TABS.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as "list" | "send")}
                        className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
                            activeTab === tab.id
                                ? "border-blue-500 text-blue-600"
                                : "border-transparent text-gray-500 hover:text-gray-700"
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab content */}
            {activeTab === "list" ? <NotificationListTab /> : <SendNotificationForm />}
        </div>
    );
}
