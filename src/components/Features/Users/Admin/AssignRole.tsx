"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Modal from "@/components/UI/Feedback/Modal";
import api from "@/lib/api/client";
import { adminEndpoints } from "@/lib/api/endpoints";
import { useToastContext } from "@/contexts/ToastContext";

import { type AssignRoleProps } from "./Constants/types";

type Id = string | number;

interface RoleRow {
  id: Id;
  name?: string | null;
  code?: string | null;
}

function toStrId(v: Id): string {
  return String(v);
}

export default function AssignRole({
  show,
  target,
  onSuccess,
  onClose,
}: AssignRoleProps) {
  const [allRoles, setAllRoles] = useState<RoleRow[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [baseline, setBaseline] = useState<Set<string>>(new Set());
  const [loadingRoles, setLoadingRoles] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showError, showSuccess } = useToastContext();

  const fetchData = useCallback(async () => {
    if (!target?.user?.id) return;
    setLoadingRoles(true);
    try {
      const [rolesRes, userRolesRes] = await Promise.all([
        api.get(`${adminEndpoints.roles.list}?limit=1000&status=active`),
        api.get(adminEndpoints.users.roles(target.user.id)),
      ]);

      const rolesData: unknown[] = rolesRes.data?.data ?? rolesRes.data ?? [];
      setAllRoles(
        (Array.isArray(rolesData) ? rolesData : []).map((r: any) => ({
          id: r.id,
          name: r.name,
          code: r.code,
        }))
      );

      const userRolesData: unknown[] = userRolesRes.data?.data ?? userRolesRes.data ?? [];
      const currentIds = new Set(
        (Array.isArray(userRolesData) ? userRolesData : []).map((r: any) =>
          toStrId(r.roleId ?? r.role?.id ?? r.id)
        )
      );
      setSelectedIds(currentIds);
      setBaseline(new Set(currentIds));
    } catch {
      showError("Không thể tải danh sách vai trò");
      setAllRoles([]);
      setSelectedIds(new Set());
      setBaseline(new Set());
    } finally {
      setLoadingRoles(false);
    }
  }, [target?.user?.id, showError]);

  useEffect(() => {
    if (show && target?.user?.id) {
      void fetchData();
    } else if (!show) {
      setAllRoles([]);
      setSelectedIds(new Set());
      setBaseline(new Set());
    }
  }, [show, target?.user?.id, fetchData]);

  const isDirty = useMemo(() => {
    if (selectedIds.size !== baseline.size) return true;
    for (const id of selectedIds) {
      if (!baseline.has(id)) return true;
    }
    return false;
  }, [selectedIds, baseline]);

  const onToggleRole = (roleId: string, checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (checked) next.add(roleId);
      else next.delete(roleId);
      return next;
    });
  };

  const handleCancel = () => {
    setSelectedIds(new Set(baseline));
    onClose?.();
  };

  const handleSave = async () => {
    if (!target?.user?.id) return;
    setIsSubmitting(true);
    try {
      await api.put(adminEndpoints.users.rolesSync(target.user.id), {
        roleIds: [...selectedIds],
      });
      showSuccess("Đã đồng bộ vai trò thành công");
      setBaseline(new Set(selectedIds));
      onSuccess?.();
      onClose?.();
    } catch (error: unknown) {
      const e = error as { response?: { data?: { message?: string } } };
      showError(e?.response?.data?.message || "Có lỗi khi lưu phân quyền");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!show || !target) return null;

  return (
    <Modal
      show={show}
      onClose={onClose || (() => {})}
      title="Phân quyền người dùng"
      size="lg"
      loading={loadingRoles || isSubmitting}
    >
      <div className="space-y-6">
        <header className="border-b border-gray-200 pb-3 flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </span>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Gán vai trò</h3>
            <p className="text-sm text-gray-500">
              Tick chọn các vai trò muốn gán cho người dùng. Lưu để cập nhật toàn bộ.
            </p>
          </div>
        </header>

        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
          <div className="text-sm text-gray-600 flex flex-wrap gap-x-4 gap-y-1">
            <span>
              <span className="font-medium text-gray-500">Họ tên:</span>{" "}
              <span className="text-gray-900 font-semibold">{target.user?.name || target.user?.username || "—"}</span>
            </span>
            <span>
              <span className="font-medium text-gray-500">Email:</span>{" "}
              <span className="text-gray-900">{target.user?.email || "—"}</span>
            </span>
          </div>
        </div>

        <div className="max-h-[min(420px,55vh)] overflow-y-auto pr-1 space-y-1">
          {loadingRoles && (
            <p className="text-sm text-gray-500 py-6 text-center">Đang tải danh sách vai trò...</p>
          )}
          {!loadingRoles && allRoles.length === 0 && (
            <p className="text-sm text-gray-500 py-8 text-center border border-dashed border-gray-200 rounded-xl">
              Không có vai trò nào trong hệ thống.
            </p>
          )}
          {!loadingRoles &&
            allRoles.map((role) => {
              const rid = toStrId(role.id);
              const isOn = selectedIds.has(rid);
              return (
                <label
                  key={rid}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={isOn}
                    onChange={(e) => onToggleRole(rid, e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 shrink-0"
                  />
                  <span className="flex-1 min-w-0">
                    <span className="text-sm font-medium text-gray-900 block">
                      {role.name || `Vai trò #${rid}`}
                    </span>
                    {role.code && (
                      <span className="text-xs text-gray-500 font-mono">{role.code}</span>
                    )}
                  </span>
                </label>
              );
            })}
        </div>

        <div className="flex justify-end space-x-4 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={handleCancel}
            className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 text-sm font-bold rounded-xl hover:bg-gray-50 transition-all active:scale-95"
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSubmitting || loadingRoles || !isDirty}
            className="px-8 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
          >
            {isSubmitting ? "Đang lưu..." : "Lưu"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
