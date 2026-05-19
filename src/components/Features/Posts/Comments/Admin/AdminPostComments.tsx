"use client";

import { useState, Fragment } from "react";
import Image from "next/image";
import api from "@/lib/api/client";
import { adminEndpoints } from "@/lib/api/endpoints";
import { useCrudList } from "@/hooks";
import SkeletonLoader from "@/components/UI/Feedback/SkeletonLoader";
import ConfirmModal from "@/components/UI/Feedback/ConfirmModal";
import Actions from "@/components/UI/DataDisplay/Actions";
import Pagination from "@/components/UI/DataDisplay/Pagination";
import PostCommentsFilter from "./PostCommentsFilter";
import { PostComment } from "@/types/api";
import { User, MessageSquare, CornerDownRight, FileText } from "lucide-react";
import Modal from "@/components/UI/Feedback/Modal";
import { formatDateTime as formatDate } from "@/utils/formatters";

const endpoints = adminEndpoints.postComments;

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
    visible: { label: "Công khai", className: "bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200" },
    hidden: { label: "Tạm ẩn", className: "bg-rose-100 text-rose-800 border-rose-200 hover:bg-rose-200" },
    spam: { label: "Spam", className: "bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200" },
    deleted: { label: "Đã xóa", className: "bg-gray-100 text-gray-800 border-gray-200" },
};

interface AdminPostCommentsProps {
    title?: string;
}

export default function AdminPostComments({
    title = "Quản lý bình luận bài viết",
}: AdminPostCommentsProps) {
    const {
        data, actions, ui, toast,
        deleteModal, handleDeleteConfirm,
    } = useCrudList({
        endpoint: endpoints.list,
        deleteSuccessMessage: "Đã xóa bình luận thành công",
    });

    const { items, loading, pagination, filters, hasData } = data;
    const { getSerialNumber } = ui;

    const [togglingId, setTogglingId] = useState<string | number | null>(null);
    const [viewComment, setViewComment] = useState<PostComment | null>(null);

    const handleUpdateStatus = async (comment: PostComment, newStatus: string) => {
        setTogglingId(comment.id);
        try {
            await api.patch(adminEndpoints.postComments.update(comment.id), {
                status: newStatus,
            });
            const cfg = STATUS_CONFIG[newStatus];
            toast.success(`Đã đổi trạng thái thành "${cfg?.label || newStatus}"`);
            actions.refresh();
        } catch (error) {
            toast.error("Không thể cập nhật trạng thái bình luận");
        } finally {
            setTogglingId(null);
        }
    };

    const renderCommentRows = (comment: PostComment, index: number, depth = 0) => {
        const isReply = depth > 0;
        const statusCfg = STATUS_CONFIG[comment.status] || STATUS_CONFIG.hidden;

        return (
            <Fragment key={comment.id}>
                <tr className={`
                    ${comment.status === "hidden" || comment.status === "spam" || comment.status === "deleted" ? "bg-rose-50/30" : ""}
                    ${isReply ? "bg-gray-50/10" : "bg-white"}
                    hover:bg-gray-50/80 transition-colors
                `}>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {!isReply ? getSerialNumber(index) : ""}
                    </td>
                    <td className="px-6 py-4">
                        <div className="flex items-center" style={{ paddingLeft: `${depth * 1.5}rem` }}>
                            {isReply && <CornerDownRight className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />}
                            <div className="flex-shrink-0 h-8 w-8">
                                {comment.user?.image ? (
                                    <Image className="h-8 w-8 rounded-full object-cover border border-gray-200" src={comment.user.image} alt={comment.user.name || "User"} width={32} height={32} />
                                ) : (
                                    <div className="h-8 w-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400">
                                        <User className="w-4 h-4" />
                                    </div>
                                )}
                            </div>
                            <div className="ml-3 min-w-0 flex-1">
                                <div className="text-sm font-bold text-gray-900 truncate" title={comment.user?.name || "Người dùng"}>
                                    {comment.user?.name || `User #${comment.userId}`}
                                </div>
                                <div className="text-xs text-gray-500 truncate" title={comment.user?.email || ""}>
                                    {comment.user?.email || ""}
                                </div>
                            </div>
                        </div>
                    </td>
                    <td className="px-6 py-4">
                        <div className="text-sm text-gray-600 break-words max-w-md line-clamp-2" title={comment.content}>
                            {comment.content}
                        </div>
                        <div className="mt-2 flex items-center gap-1.5 text-[11px] text-gray-400">
                            {comment.post && (
                                <>
                                    <FileText className="w-3.5 h-3.5 flex-shrink-0 text-blue-400" />
                                    <span className="flex-shrink-0">Bài viết:</span>
                                    <a
                                        href={`/posts/${comment.post.slug}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="font-bold text-indigo-600 hover:text-indigo-800 hover:underline truncate max-w-[200px]"
                                        title={comment.post.name}
                                    >
                                        {comment.post.name}
                                    </a>
                                </>
                            )}
                        </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-center">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${statusCfg.className}`}>
                            {togglingId === comment.id ? (
                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current"></div>
                            ) : statusCfg.label}
                        </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-xs text-gray-500 font-medium font-primary">
                        {formatDate(comment.createdAt)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                        <Actions
                            item={comment}
                            showView={false}
                            showEdit={false}
                            showDelete={true}
                            onDelete={() => deleteModal.open({
                                id: comment.id,
                                displayName: comment.user?.name || `User #${comment.userId}`,
                                deleteApi: adminEndpoints.postComments.delete(comment.id)
                            })}
                            additionalActions={[
                                {
                                    label: "Xem chi tiết",
                                    action: () => setViewComment(comment),
                                    icon: "eye",
                                },
                                ...(comment.status !== "visible" ? [{
                                    label: "Hiện bình luận",
                                    action: () => handleUpdateStatus(comment, "visible"),
                                    icon: "eye" as const,
                                    className: "text-green-600 hover:text-green-700"
                                }] : []),
                                ...(comment.status === "visible" ? [{
                                    label: "Ẩn bình luận",
                                    action: () => handleUpdateStatus(comment, "hidden"),
                                    icon: "eye-off" as const,
                                    className: "text-amber-600 hover:text-amber-700"
                                }] : []),
                                ...(comment.status !== "spam" ? [{
                                    label: "Đánh dấu Spam",
                                    action: () => handleUpdateStatus(comment, "spam"),
                                    icon: "trash" as const,
                                    className: "text-orange-600 hover:text-orange-700"
                                }] : []),
                            ]}
                        />
                    </td>
                </tr>
                {comment.replies && comment.replies.length > 0 &&
                    comment.replies.map((reply, rIndex) => renderCommentRows(reply, rIndex, depth + 1))
                }
            </Fragment>
        );
    };

    return (
        <div className="admin-post-comments">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold flex items-center gap-2 font-primary text-gray-900 tracking-tight">
                    <MessageSquare className="text-blue-600 w-6 h-6" />
                    {title}
                </h1>
            </div>

            <PostCommentsFilter
                initialFilters={filters as Record<string, string | number>}
                onUpdateFilters={actions.updateFilters as (filters: Record<string, string | number>) => void}
            />

            <div className="bg-white shadow-md rounded-lg overflow-hidden mt-6 border border-gray-100">
                {loading ? (
                    <SkeletonLoader type="table" rows={10} columns={6} />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50/80">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-16">STT</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-64">Người gửi</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Nội dung & Thông tin</th>
                                    <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider w-32">Trạng thái</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-32">Ngày gửi</th>
                                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider w-24 pr-10">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {items.length > 0 ? items.map((comment: PostComment, index) => renderCommentRows(comment, index)) : (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-gray-500 italic">
                                            Chưa có bình luận nào trên hệ thống
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {hasData && (
                <div className="mt-8">
                    <Pagination
                        currentPage={pagination.page}
                        totalPages={pagination.totalPages}
                        totalItems={pagination.totalItems}
                        onPageChange={actions.changePage}
                    />
                </div>
            )}

            {/* View Detail Modal */}
            <Modal
                show={!!viewComment}
                title="Chi tiết bình luận"
                onClose={() => setViewComment(null)}
                footer={
                    <div className="flex justify-end gap-3 mt-2">
                        <button
                            onClick={() => setViewComment(null)}
                            className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-bold active:scale-95 shadow-sm text-sm"
                        >
                            Đóng
                        </button>
                        {viewComment && viewComment.status !== "visible" && (
                            <button
                                onClick={() => {
                                    handleUpdateStatus(viewComment, "visible");
                                    setViewComment(null);
                                }}
                                className="px-6 py-2.5 text-white rounded-xl transition-all font-bold active:scale-95 shadow-lg text-sm bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20"
                            >
                                Hiện bình luận
                            </button>
                        )}
                        {viewComment && viewComment.status === "visible" && (
                            <button
                                onClick={() => {
                                    handleUpdateStatus(viewComment, "hidden");
                                    setViewComment(null);
                                }}
                                className="px-6 py-2.5 text-white rounded-xl transition-all font-bold active:scale-95 shadow-lg text-sm bg-amber-500 hover:bg-amber-600 shadow-amber-500/20"
                            >
                                Ẩn bình luận
                            </button>
                        )}
                    </div>
                }
            >
                {viewComment && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 pb-5 border-b border-gray-100">
                            <div className="w-14 h-14 rounded-2xl bg-blue-50/50 flex items-center justify-center overflow-hidden border border-blue-100 shadow-sm">
                                {viewComment.user?.image ? (
                                    <Image src={viewComment.user.image} alt={viewComment.user.name || "User"} className="w-full h-full object-cover" width={56} height={56} />
                                ) : (
                                    <User className="text-blue-500 w-8 h-8" />
                                )}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xl font-black text-gray-900 leading-tight">
                                    {viewComment.user?.name || `User #${viewComment.userId}`}
                                </span>
                                <span className="text-sm text-gray-500 font-medium">
                                    {viewComment.user?.email || ""}
                                </span>
                            </div>
                            <div className="ml-auto flex flex-col items-end">
                                {(() => {
                                    const cfg = STATUS_CONFIG[viewComment.status] || STATUS_CONFIG.hidden;
                                    return (
                                        <span className={`px-2.5 py-1 text-[10px] font-black uppercase rounded-lg tracking-widest border ${cfg.className}`}>
                                            {cfg.label}
                                        </span>
                                    );
                                })()}
                                <span className="text-[10px] text-gray-400 font-bold mt-2 uppercase tracking-tight">{formatDate(viewComment.createdAt)}</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                             <div className="flex items-center gap-2 text-indigo-600">
                                <MessageSquare className="w-4 h-4" />
                                <span className="text-sm font-black uppercase tracking-wider">Nội dung bình luận</span>
                             </div>
                             <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 italic text-gray-800 leading-relaxed min-h-[120px] relative">
                                <span className="absolute top-2 left-2 text-4xl text-gray-200 font-serif leading-none">&ldquo;</span>
                                <div className="relative z-10 px-4">{viewComment.content}</div>
                                <span className="absolute bottom-2 right-2 text-4xl text-gray-200 font-serif leading-none">&rdquo;</span>
                             </div>
                        </div>

                        {viewComment.post && (
                            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-5 rounded-2xl border border-blue-100/50">
                                <div className="flex items-center gap-2 mb-2">
                                    <FileText className="w-4 h-4 text-blue-500" />
                                    <span className="text-[10px] font-black uppercase text-blue-500 tracking-widest">Bài viết liên quan</span>
                                </div>
                                <a
                                    href={`/posts/${viewComment.post.slug}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-indigo-800 font-black hover:underline text-lg block"
                                >
                                    {viewComment.post.name}
                                </a>
                            </div>
                        )}
                    </div>
                )}
            </Modal>

            {deleteModal.isOpen && deleteModal.data && (
                <ConfirmModal
                    show={deleteModal.isOpen}
                    title="Xác nhận xóa"
                    message={`Bình luận này sẽ bị xóa vĩnh viễn khỏi hệ thống. Bạn có chắc chắn muốn xóa bình luận của "${deleteModal.data.displayName}"?`}
                    onClose={deleteModal.close}
                    onConfirm={handleDeleteConfirm}
                    confirmText="Xác nhận xóa"
                    confirmButtonClass="bg-rose-600 hover:bg-rose-700 shadow-rose-600/20"
                />
            )}
        </div>
    );
}
