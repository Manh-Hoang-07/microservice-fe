"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Modal from "@/components/UI/Feedback/Modal";
import FormWrapper from "@/components/UI/Forms/FormWrapper";
import MultipleSelect from "@/components/UI/Forms/MultipleSelect";
import api from "@/lib/api/client";
import { adminEndpoints } from "@/lib/api/endpoints";
import { normalizeDetailResponse, normalizeListResponse } from "@/lib/api/response-normalizer";
import { type AssignPermissionsProps } from "./Constants/types";

interface RolePermissionEntry {
  id?: string | number;
  permissionId?: string | number;
  permission?: { id?: string | number; code?: string; name?: string };
  code?: string;
  name?: string;
}

interface RoleDetail {
  id?: string | number;
  code?: string;
  name?: string;
  permissions?: RolePermissionEntry[];
}

interface PermissionItem {
  id: string | number;
  code?: string;
  name?: string;
}

export default function AssignPermissions({
  show,
  role,
  onPermissionsAssigned,
  onClose,
}: AssignPermissionsProps) {
  const [roleDetail, setRoleDetail] = useState<RoleDetail | null>(null);
  const [permissions, setPermissions] = useState<PermissionItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [apiErrors, setApiErrors] = useState<Record<string, string | string[]>>({});
  const [formData, setFormData] = useState<{ permissionIds: string[] }>({ permissionIds: [] });

  const roleId = role?.id as string | number | undefined;

  const fetchRoleDetail = useCallback(async () => {
    if (!roleId) return;
    try {
      const response = await api.get(adminEndpoints.roles.show(roleId));
      const data = normalizeDetailResponse<RoleDetail>(response.data);
      if (data) {
        setRoleDetail(data);
        const ids = Array.isArray(data.permissions)
          ? data.permissions.map((p) => String(p.permissionId ?? p.permission?.id ?? p.id))
          : [];
        setFormData({ permissionIds: ids });
      } else {
        setRoleDetail((role as RoleDetail) || {});
      }
    } catch {
      setRoleDetail((role as RoleDetail) || {});
    }
  }, [roleId, role]);

  const loadPermissions = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get(adminEndpoints.permissions.simple);
      const list = normalizeListResponse<PermissionItem>(response.data);
      if (list.length > 0) {
        setPermissions(list);
        return;
      }
      const fallback = await api.get(`${adminEndpoints.permissions.list}?limit=1000&status=active`);
      setPermissions(normalizeListResponse<PermissionItem>(fallback.data));
    } catch {
      setPermissions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (show && roleId) {
      void Promise.all([fetchRoleDetail(), loadPermissions()]);
    }
  }, [show, roleId, fetchRoleDetail, loadPermissions]);

  const permissionOptions = useMemo(() => {
    return permissions.map((opt) => ({
      value: String(opt.id),
      label: opt.name || opt.code || String(opt.id),
    }));
  }, [permissions]);

  const formTitle = `Gán quyền cho ${roleDetail?.name || roleDetail?.code || "vai trò"}`;

  const handleSubmit = async (data: Record<string, unknown>) => {
    if (!roleId) return;
    const rawIds = Array.isArray(data.permissionIds)
      ? (data.permissionIds as Array<string | number>)
      : [];
    const permissionIds = rawIds.map((v) => String(v));

    setLoading(true);
    setApiErrors({});
    try {
      await api.put(adminEndpoints.roles.assignPermissions(roleId), { permissionIds });
      onPermissionsAssigned?.();
      onClose?.();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { errors?: Record<string, string | string[]>; message?: string } } };
      if (e.response?.data?.errors) {
        setApiErrors(e.response.data.errors);
      } else {
        setApiErrors({ general: e.response?.data?.message || "Không thể gán quyền" });
      }
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <Modal show={show} onClose={onClose ?? (() => {})} title={formTitle} size="lg" loading={loading}>
      <FormWrapper
        defaultValues={formData}
        apiErrors={apiErrors}
        onSubmit={handleSubmit}
        onCancel={onClose}
        submitText="Cập nhật quyền"
      >
        {({ errors, clearError }) => {
          const permissionError = (errors.permissionIds ||
            (apiErrors.permissionIds
              ? Array.isArray(apiErrors.permissionIds)
                ? apiErrors.permissionIds[0]
                : String(apiErrors.permissionIds)
              : undefined)) as string | undefined;

          return (
            <>
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 space-y-1">
                  <div>
                    <span className="font-semibold">Mã code:</span> {roleDetail?.code || "—"}
                  </div>
                  <div>
                    <span className="font-semibold">Tên:</span> {roleDetail?.name || "—"}
                  </div>
                </div>
              </div>

              <MultipleSelect
                value={formData.permissionIds}
                onChange={(value) => {
                  setFormData({ permissionIds: (value as Array<string | number>).map(String) });
                  clearError("permissionIds");
                }}
                options={permissionOptions}
                placeholder="Chọn quyền..."
                error={permissionError}
              />
              {apiErrors.general && (
                <p className="mt-2 text-xs text-red-500">
                  {Array.isArray(apiErrors.general) ? apiErrors.general[0] : apiErrors.general}
                </p>
              )}
            </>
          );
        }}
      </FormWrapper>
    </Modal>
  );
}
