"use client";

import { useState } from "react";
import { contactAdminService } from "@/lib/api/admin/contacts";
import { useToastContext } from "@/lib/toast";

interface ContactReplyModalProps {
    contactId: string | number;
    contactName: string;
    onClose: () => void;
    onSuccess: () => void;
}

export default function ContactReplyModal({
    contactId,
    contactName,
    onClose,
    onSuccess,
}: ContactReplyModalProps) {
    const [reply, setReply] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { showSuccess, showError } = useToastContext();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!reply.trim()) return;
        setIsSubmitting(true);
        try {
            await contactAdminService.reply(contactId, reply.trim());
            showSuccess("Đã gửi phản hồi thành công");
            onSuccess();
            onClose();
        } catch {
            showError("Không thể gửi phản hồi. Vui lòng thử lại.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4">
                <div className="flex items-center justify-between px-6 py-4 border-b">
                    <h3 className="text-lg font-semibold text-gray-900">
                        Phản hồi liên hệ từ <span className="text-primary">{contactName}</span>
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nội dung phản hồi <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={reply}
                            onChange={(e) => setReply(e.target.value)}
                            rows={6}
                            maxLength={20000}
                            required
                            placeholder="Nhập nội dung phản hồi..."
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
                        />
                        <p className="text-xs text-gray-400 mt-1 text-right">{reply.length}/20.000</p>
                    </div>
                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || !reply.trim()}
                            className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {isSubmitting ? "Đang gửi..." : "Gửi phản hồi"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
