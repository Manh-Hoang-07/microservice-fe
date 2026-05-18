"use client";

import { useState } from "react";
import { useAdminNotificationList, useDeleteNotification } from "@/hooks/data/admin/useAdminNotifications";
import SkeletonLoader from "@/components/UI/Feedback/SkeletonLoader";
import Pagination from "@/components/UI/DataDisplay/Pagination";
import ConfirmModal from "@/components/UI/Feedback/ConfirmModal";

const TYPE_BADGE_CLASSES: Record<string, string> = {
    info: "bg-blue-100 text-blue-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-amber-100 text-amber-800",
    error: "bg-red-100 text-red-800",
};

export default function NotificationListTab() {
    const [userId, setUserId] = useState("");
    const [type, setType] = useState("all");
    const [status, setStatus] = useState("all");
    const [isRead, setIsRead] = useState("all");
    const [page, setPage] = useState(1);
    const limit = 10;

    const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);

    const { notifications, isLoading, total } = useAdminNotificationList({
        page,
        limit,
        userId: userId || undefined,
        type: type !== "all" ? type : undefined,
        status: status !== "all" ? status : undefined,
        isRead: isRead === "all" ? undefined : isRead === "true",
    });

    const { deleteNotification, isPending } = useDeleteNotification();

    const openDeleteModal = (id: string, title: string) => {
        setDeleteTarget({ id, title });
    };

    const handleDeleteConfirm = () => {
        if (deleteTarget) {
            deleteNotification(deleteTarget.id);
            setDeleteTarget(null);
        }
    };

    const handleUserIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserId(e.target.value);
        setPage(1);
    };

    const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setType(e.target.value);
        setPage(1);
    };

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setStatus(e.target.value);
        setPage(1);
    };

    const handleIsReadChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setIsRead(e.target.value);
        setPage(1);
    };

    return (
        <div>
            {/* Filter bar */}
            <div className="flex flex-row gap-3 mb-4 flex-wrap">
                <input
                    type="text"
                    value={userId}
                    onChange={handleUserIdChange}
                    placeholder="Lọc theo User ID"
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[180px]"
                />

                <select
                    value={type}
                    onChange={handleTypeChange}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="all">Tất cả</option>
                    <option value="info">info</option>
                    <option value="success">success</option>
                    <option value="warning">warning</option>
                    <option value="error">error</option>
                </select>

                <select
                    value={status}
                    onChange={handleStatusChange}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="all">Tất cả</option>
                    <option value="active">active</option>
                    <option value="archived">archived</option>
                    <option value="deleted">deleted</option>
                </select>

                <select
                    value={isRead}
                    onChange={handleIsReadChange}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="all">Tất cả</option>
                    <option value="false">Chưa đọc</option>
                    <option value="true">Đã đọc</option>
                </select>
            </div>

            {/* Table */}
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                {isLoading ? (
                    <SkeletonLoader type="table" rows={10} columns={7} />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                                        STT
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        User ID
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Tiêu đề
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                                        Loại
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                                        Đã đọc
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Ngày tạo
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-right">
                                        Thao tác
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {notifications.length > 0 ? (
                                    notifications.map((notification, index) => (
                                        <tr key={notification.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                                                {(page - 1) * limit + index + 1}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-mono">
                                                {notification.userId}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900">
                                                {notification.title}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <span
                                                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${TYPE_BADGE_CLASSES[notification.type] ?? "bg-gray-100 text-gray-800"}`}
                                                >
                                                    {notification.type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                {notification.isRead ? (
                                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                        Đã đọc
                                                    </span>
                                                ) : (
                                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-600">
                                                        Chưa đọc
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(notification.createdAt).toLocaleString("vi-VN")}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    onClick={() => openDeleteModal(notification.id, notification.title)}
                                                    className="px-3 py-1 bg-red-600 text-white rounded-md text-xs hover:bg-red-700 transition-colors"
                                                >
                                                    Xóa
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-12 text-center text-gray-400 italic">
                                            Không có thông báo nào
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {total > 0 && (
                <Pagination
                    currentPage={page}
                    totalPages={Math.ceil(total / limit)}
                    totalItems={total}
                    onPageChange={setPage}
                />
            )}

            {/* Delete confirm modal */}
            <ConfirmModal
                show={!!deleteTarget}
                title="Xác nhận xóa"
                message={`Bạn có chắc chắn muốn xóa thông báo "${deleteTarget?.title ?? ""}"? Hành động này không thể hoàn tác.`}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleDeleteConfirm}
            />
        </div>
    );
}
