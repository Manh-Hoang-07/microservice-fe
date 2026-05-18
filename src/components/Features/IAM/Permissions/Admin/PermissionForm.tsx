"use client";

import { useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Modal from "@/components/UI/Feedback/Modal";
import FormField from "@/components/UI/Forms/FormField";
import SearchableSelect from "@/components/UI/Forms/SearchableSelect";
import SingleSelectEnhanced from "@/components/UI/Forms/SingleSelectEnhanced";
import { adminEndpoints } from "@/lib/api/endpoints";
import { permissionSchema, type PermissionFormValues } from "./Constants/schemas";
import { type PermissionFormProps } from "./Constants/types";

const getBasicStatusArray = (): Array<{ value: string; label: string; name?: string }> => [
  { value: "active", label: "Hoạt động" },
  { value: "inactive", label: "Ngừng hoạt động" },
];


export default function PermissionForm({
  show,
  permission,
  statusEnums = [],
  apiErrors = {},
  loading = false,
  onSubmit,
  onCancel,
}: PermissionFormProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<PermissionFormValues>({
    resolver: zodResolver(permissionSchema),
    defaultValues: {
      code: "",
      name: "",
      parentId: "",
      status: "active",
    },
  });

  const statusOptions = useMemo(() => {
    const statusArray = statusEnums && statusEnums.length > 0 ? statusEnums : getBasicStatusArray();
    return statusArray.map((opt) => ({
      value: opt.value,
      label: opt.label || opt.name || opt.value,
    }));
  }, [statusEnums]);

  // Reset/Initialize
  useEffect(() => {
    if (show) {
      if (permission) {
        reset({
          code: permission.code || "",
          name: permission.name || "",
          parentId: permission.parentId != null ? String(permission.parentId) : "",
          status: permission.status || "active",
        });
      } else {
        reset({
          code: "",
          name: "",
          parentId: "",
          status: "active",
        });
      }
    }
  }, [permission, show, reset]);

  // Map API Errors
  useEffect(() => {
    if (apiErrors) {
      Object.keys(apiErrors).forEach((key) => {
        const message = Array.isArray(apiErrors[key]) ? apiErrors[key][0] : String(apiErrors[key]);
        setError(key as keyof PermissionFormValues, { message });
      });
    }
  }, [apiErrors, setError]);

  const formTitle = permission ? "Chỉnh sửa quyền" : "Thêm quyền mới";

  if (!show) return null;

  return (
    <Modal show={show} onClose={onCancel || (() => { })} title={formTitle} size="xl" loading={loading || isSubmitting}>
      <form onSubmit={handleSubmit((data) => {
        const isEdit = !!permission;
        const payload: Record<string, unknown> = {
          name: data.name || undefined,
          parentId: data.parentId ? String(data.parentId) : null,
        };
        if (isEdit) {
          payload.status = data.status;
        } else {
          payload.code = data.code;
        }
        onSubmit?.(payload);
      })} className="space-y-8 p-1">

        {/* SECTION: THÔNG TIN QUYỀN */}
        <section className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 space-y-6">
          <header className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Thông tin quyền</h3>
              <p className="text-xs text-gray-500">Mã định danh hệ thống và phân cấp</p>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Mã định danh (Code)"
              {...register("code")}
              placeholder="Ví dụ: post.create, user.manage"
              error={errors.code?.message}
              required
              disabled={!!permission}
              helpText={permission ? "Code không thể thay đổi sau khi tạo" : "Dùng để kiểm tra quyền trong code (ví dụ: hasPermission('user.manage'))"}
            />
            <FormField
              label="Tên quyền"
              {...register("name")}
              placeholder="Ví dụ: Quản lý bài viết"
              error={errors.name?.message}
            />

            <Controller
              name="parentId"
              control={control}
              render={({ field }) => (
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">Quyền cha</label>
                  <SearchableSelect
                    value={field.value ?? null}
                    onChange={(value) => field.onChange(value == null ? "" : String(value))}
                    searchApi={adminEndpoints.permissions.simple}
                    placeholder="Tìm kiếm quyền cha..."
                    excludeId={permission?.id}
                    labelField="name"
                    error={errors.parentId?.message}
                  />
                </div>
              )}
            />

            <Controller
              name="status"
              control={control}
              render={({ field: { value, onChange } }) => (
                <div className="space-y-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Trạng thái <span className="text-red-500">*</span></label>
                  <SingleSelectEnhanced
                    value={value}
                    options={statusOptions}
                    onChange={onChange}
                    placeholder="Chọn trạng thái..."
                  />
                  {errors.status && <p className="text-xs text-red-500">{errors.status.message}</p>}
                </div>
              )}
            />
          </div>
        </section>

        {/* FOOTER ACTIONS */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-100">
          <button
            type="button"
            onClick={onCancel}
            className="px-8 py-3 bg-white border border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all active:scale-95"
          >
            Hủy bỏ
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
          >
            {isSubmitting ? "Đang xử lý..." : permission ? "Cập nhật quyền" : "Thêm quyền mới"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
