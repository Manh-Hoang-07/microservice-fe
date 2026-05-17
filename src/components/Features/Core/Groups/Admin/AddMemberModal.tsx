"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/UI/Feedback/Modal";
import SearchableSelect from "@/components/UI/Forms/SearchableSelect";
import api from "@/lib/api/client";
import { adminEndpoints } from "@/lib/api/endpoints";

interface AddMemberModalProps {
  show: boolean;
  groupId: number | string;
  onMemberAdded?: () => void;
  onClose?: () => void;
}

export default function AddMemberModal({
  show,
  groupId,
  onMemberAdded,
  onClose,
}: AddMemberModalProps) {
  const [userId, setUserId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!show) {
      setUserId(null);
      setErrorMessage(null);
      setSubmitting(false);
    }
  }, [show]);

  const handleSubmit = async () => {
    if (!groupId) return;
    if (!userId) {
      setErrorMessage("Vui lòng chọn user");
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);

    try {
      await api.post(adminEndpoints.groups.members.add(groupId), { userId });
      onMemberAdded?.();
      onClose?.();
    } catch (err: unknown) {
      const payload = (err as { response?: { data?: { message?: string | string[] } } })?.response?.data;
      const msg = Array.isArray(payload?.message)
        ? payload.message.join(", ")
        : payload?.message || "Không thể thêm thành viên";
      setErrorMessage(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (!show) return null;

  return (
    <Modal show={show} onClose={onClose ?? (() => {})} title="Thêm thành viên" size="lg" loading={submitting}>
      <div className="space-y-6 p-1">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Chọn user <span className="text-red-500">*</span>
          </label>
          <SearchableSelect
            value={userId}
            onChange={(value) => {
              setUserId(value == null ? null : String(value));
              setErrorMessage(null);
            }}
            searchApi={adminEndpoints.users.simple}
            placeholder="Tìm kiếm user theo tên/email..."
            labelField="name"
            error={errorMessage ?? undefined}
          />
          <p className="text-xs text-gray-500 mt-1">
            User sẽ trở thành thành viên của nhóm. Không gán vai trò ở đây — vai trò được quản lý tại trang Tài khoản.
          </p>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 text-sm font-bold rounded-xl hover:bg-gray-50 transition-all active:scale-95"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting || !userId}
            className="px-8 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
          >
            {submitting ? "Đang thêm..." : "Thêm thành viên"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
