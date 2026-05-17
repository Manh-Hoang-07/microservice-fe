"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Modal from "@/components/UI/Feedback/Modal";
import FormField from "@/components/UI/Forms/FormField";
import SearchableSelect from "@/components/UI/Forms/SearchableSelect";
import SingleSelectEnhanced from "@/components/UI/Forms/SingleSelectEnhanced";
import { adminEndpoints } from "@/lib/api/endpoints";
import { groupSchema, type GroupFormValues } from "./Constants/schemas";
import { type GroupFormProps } from "./Constants/types";

const STATUS_OPTIONS = [
  { value: "active", label: "Hoạt động" },
  { value: "inactive", label: "Ngừng hoạt động" },
];

export default function GroupForm({
  show,
  group,
  apiErrors = {},
  loading = false,
  onSubmit,
  onCancel,
}: GroupFormProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<GroupFormValues>({
    resolver: zodResolver(groupSchema),
    defaultValues: {
      type: "",
      code: "",
      name: "",
      description: "",
      ownerId: "",
      status: "active",
    },
  });

  // Reset/Initialize
  useEffect(() => {
    if (show) {
      if (group) {
        reset({
          type: group.type || "",
          code: group.code || "",
          name: group.name || "",
          description: group.description || "",
          ownerId: group.ownerId != null ? String(group.ownerId) : "",
          status: (group.status as "active" | "inactive") || "active",
        });
      } else {
        reset({
          type: "",
          code: "",
          name: "",
          description: "",
          ownerId: "",
          status: "active",
        });
      }
    }
  }, [group, show, reset]);

  // Map API Errors
  useEffect(() => {
    if (apiErrors) {
      Object.keys(apiErrors).forEach((key) => {
        const message = Array.isArray(apiErrors[key]) ? apiErrors[key][0] : String(apiErrors[key]);
        setError(key as keyof GroupFormValues, { message });
      });
    }
  }, [apiErrors, setError]);

  const handleFormSubmit = (data: GroupFormValues) => {
    const isEdit = !!group;
    const payload: Record<string, unknown> = {
      name: data.name,
      description: data.description || undefined,
    };
    if (data.ownerId) payload.ownerId = data.ownerId;
    if (isEdit) {
      payload.status = data.status;
    } else {
      payload.type = data.type;
      payload.code = data.code;
    }
    onSubmit?.(payload);
  };

  const formTitle = group ? "Chỉnh sửa nhóm" : "Thêm nhóm mới";

  if (!show) return null;

  return (
    <Modal show={show} onClose={onCancel || (() => { })} title={formTitle} size="xl" loading={loading || isSubmitting}>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8 p-1">

        {/* SECTION: THÔNG TIN CHÍNH */}
        <section className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 space-y-6">
          <header className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Thông tin nhóm</h3>
              <p className="text-xs text-gray-500">Phân loại và định danh nhóm</p>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Loại nhóm"
              {...register("type")}
              error={errors.type?.message}
              disabled={!!group}
              placeholder="team, studio, department..."
              required
              helpText={group ? "Không thể thay đổi loại nhóm" : "2-50 ký tự, chỉ a-z 0-9 _ -"}
            />

            <FormField
              label="Mã code"
              {...register("code")}
              error={errors.code?.message}
              disabled={!!group}
              placeholder="team-alpha, studio-01..."
              required
              helpText={group ? undefined : "Unique trong cùng loại nhóm"}
            />

            <FormField
              label="Tên nhóm"
              {...register("name")}
              error={errors.name?.message}
              placeholder="Ví dụ: Team Alpha, Studio Comic..."
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chủ nhóm (Owner)
              </label>
              <Controller
                name="ownerId"
                control={control}
                render={({ field }) => (
                  <SearchableSelect
                    value={field.value ?? null}
                    onChange={(value) => field.onChange(value == null ? "" : String(value))}
                    searchApi={adminEndpoints.users.simple}
                    labelField="name"
                    placeholder="Chọn chủ nhóm..."
                    error={errors.ownerId?.message}
                  />
                )}
              />
              <p className="text-xs text-gray-500 mt-1">User được chọn sẽ tự động được gán role <code>group_owner</code>.</p>
            </div>

            {group && (
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <SingleSelectEnhanced
                    {...field}
                    label="Trạng thái"
                    options={STATUS_OPTIONS}
                    placeholder="-- Chọn trạng thái --"
                    error={errors.status?.message}
                    required
                  />
                )}
              />
            )}
          </div>

          <FormField
            label="Mô tả"
            type="textarea"
            rows={4}
            {...register("description")}
            error={errors.description?.message}
            placeholder="Nhập mô tả chi tiết về nhóm..."
            helpText="Tối đa 1000 ký tự"
          />
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
            disabled={isSubmitting || loading}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
          >
            {isSubmitting ? "Đang xử lý..." : group ? "Cập nhật nhóm" : "Thêm nhóm mới"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
