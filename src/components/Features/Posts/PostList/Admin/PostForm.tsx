"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { postSchema, type PostFormValues } from "./postSchema";
import Modal from "@/components/UI/Feedback/Modal";
import FormField from "@/components/UI/Forms/FormField";
import ImageUploader from "@/components/UI/Forms/ImageUploader";
import dynamic from "next/dynamic";
const CKEditor = dynamic(() => import("@/components/UI/Forms/CKEditor"), {
  ssr: false,
  loading: () => <div className="h-[400px] bg-gray-50 border border-gray-200 rounded animate-pulse" />,
});
import SingleSelectEnhanced from "@/components/UI/Forms/SingleSelectEnhanced";
import MultipleSelect from "@/components/UI/Forms/MultipleSelect";
import { adminEndpoints } from "@/lib/api/endpoints";
import api from "@/lib/api/client";
import { format as formatDateFns } from "date-fns";

interface PostFormProps {
  show: boolean;
  post?: Record<string, unknown>;
  statusEnums?: Array<{ value: string; label: string; name?: string }>;
  postTypeEnums?: Array<{ value: string; label: string; name?: string }>;
  categoryEnums?: Array<{ value: number; label: string; name?: string }>;
  tagEnums?: Array<{ value: number; label: string; name?: string }>;
  apiErrors?: Record<string, string | string[]>;
  loading?: boolean;
  onSubmit?: (data: PostFormValues) => void;
  onCancel?: () => void;
}


export default function PostForm({
  show,
  post,
  statusEnums = [],
  postTypeEnums = [],
  categoryEnums,
  tagEnums,
  apiErrors = {},
  loading = false,
  onSubmit,
  onCancel,
}: PostFormProps) {
  const [categoryOptions, setCategoryOptions] = useState<Array<{ value: number; label: string }>>([]);
  const [tagOptions, setTagOptions] = useState<Array<{ value: number; label: string }>>([]);

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      name: "",
      excerpt: "",
      content: "",
      coverImage: "",
      image: "",
      postType: "text",
      videoUrl: "",
      audioUrl: "",
      status: "draft",
      publishedAt: "",
      categoryIds: [],
      tagIds: [],
      isFeatured: false,
      isPinned: false,
      seoTitle: "",
      seoDescription: "",
      seoKeywords: "",
    },
  });

  const postType = watch("postType");

  // Load Categories & Tags
  useEffect(() => {
    if (show) {
      if (categoryEnums || tagEnums) {
        if (categoryEnums) {
          setCategoryOptions(categoryEnums.map(c => ({ value: c.value, label: c.label || c.name || String(c.value) })));
        }
        if (tagEnums) {
          setTagOptions(tagEnums.map(t => ({ value: t.value, label: t.label || t.name || String(t.value) })));
        }
      }

      if (!categoryEnums || !tagEnums) {
        const fetchData = async () => {
          try {
            const [catRes, tagRes] = await Promise.all([
              !categoryEnums ? api.get(adminEndpoints.postCategories.list) : Promise.resolve({ data: { data: [] } }),
              !tagEnums ? api.get(adminEndpoints.postTags.list) : Promise.resolve({ data: { data: [] } })
            ]);

            if (!categoryEnums) {
              const catData = catRes.data?.data || [];
              setCategoryOptions(catData.map((c: { id: number | string; name?: string }) => ({ value: c.id as number, label: c.name ?? "" })));
            }
            if (!tagEnums) {
              const tagData = tagRes.data?.data || [];
              setTagOptions(tagData.map((t: { id: number | string; name?: string }) => ({ value: t.id as number, label: t.name ?? "" })));
            }
          } catch (err) {
            console.error("Failed to load options", err);
          }
        };
        fetchData();
      }
    }
  }, [show, categoryEnums, tagEnums]);

  // Reset/Initialize form
  useEffect(() => {
    if (show) {
      if (post) {
        reset({
          name: (post.name as string) || "",
          excerpt: (post.excerpt as string) || "",
          content: (post.content as string) || "",
          coverImage: (post.coverImage as string) || "",
          image: (post.image as string) || "",
          postType: (post.postType as string) || "text",
          videoUrl: (post.videoUrl as string) || "",
          audioUrl: (post.audioUrl as string) || "",
          status: (post.status as string) || "draft",
          publishedAt: post.publishedAt ? formatDateFns(new Date(post.publishedAt as string), "yyyy-MM-dd'T'HH:mm") : "",
          categoryIds: (post.categories as { id: number | string }[] | undefined)?.map((c) => c.id as number) ||
                       (post.categoryIds as number[] | undefined) || [],
          tagIds: (post.tags as { id: number | string }[] | undefined)?.map((t) => t.id as number) ||
                  (post.tagIds as number[] | undefined) || [],
          isFeatured: !!post.isFeatured,
          isPinned: !!post.isPinned,
          seoTitle: (post.seoTitle as string) || "",
          seoDescription: (post.seoDescription as string) || "",
          seoKeywords: (post.seoKeywords as string) || "",
        });
      } else {
        reset({
          name: "",
          excerpt: "",
          content: "",
          coverImage: "",
          image: "",
          postType: "text",
          videoUrl: "",
          audioUrl: "",
          status: "draft",
          publishedAt: "",
          categoryIds: [],
          tagIds: [],
          isFeatured: false,
          isPinned: false,
          seoTitle: "",
          seoDescription: "",
          seoKeywords: "",
        });
      }
    }
  }, [post, reset, show]);

  // Handle API Errors
  useEffect(() => {
    if (apiErrors) {
      Object.keys(apiErrors).forEach((key) => {
        const message = Array.isArray(apiErrors[key]) ? apiErrors[key][0] : String(apiErrors[key]);
        setError(key as any, { message });
      });
    }
  }, [apiErrors, setError]);

  const statusOptions = useMemo(() =>
    statusEnums.map(opt => ({ value: opt.value, label: opt.label || opt.name || opt.value })),
    [statusEnums]
  );

  const postTypeOptions = useMemo(() =>
    postTypeEnums.map(opt => ({ value: opt.value, label: opt.label || opt.name || opt.value })),
    [postTypeEnums]
  );

  const formTitle = post ? "Chỉnh sửa bài viết" : "Thêm bài viết mới";

  if (!show) return null;

  return (
    <Modal show={show} onClose={onCancel || (() => { })} title={formTitle} size="xl" loading={loading || isSubmitting}>
      <form onSubmit={handleSubmit((data) => onSubmit?.(data as PostFormValues))} className="space-y-8 p-1">

        {/* SECTION: THÔNG TIN BÀI VIẾT */}
        <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 space-y-6">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Thông tin bài viết</h3>
              <p className="text-xs text-gray-500">Tiêu đề, trạng thái và tóm tắt nội dung</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <FormField
                label="Tiêu đề"
                placeholder="Nhập tiêu đề bài viết"
                {...register("name")}
                error={errors.name?.message}
                required
              />
            </div>

            <FormField
              label="Ngày xuất bản"
              type="datetime-local"
              {...register("publishedAt")}
              error={errors.publishedAt?.message}
            />

            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <SingleSelectEnhanced
                  {...field}
                  options={statusOptions}
                  label="Trạng thái"
                  placeholder="-- Chọn trạng thái --"
                  error={errors.status?.message}
                  required
                />
              )}
            />

            <Controller
              name="postType"
              control={control}
              render={({ field }) => (
                <SingleSelectEnhanced
                  {...field}
                  options={postTypeOptions}
                  label="Loại bài viết"
                  placeholder="-- Chọn loại --"
                  error={errors.postType?.message}
                />
              )}
            />

            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-semibold text-gray-700">Tóm tắt</label>
              <Controller
                name="excerpt"
                control={control}
                render={({ field }) => (
                  <CKEditor
                    {...field}
                    value={field.value || ""}
                    height="180px"
                    placeholder="Nhập tóm tắt bài viết..."
                  />
                )}
              />
              {errors.excerpt && <p className="text-xs text-red-500 mt-1">{errors.excerpt.message}</p>}
            </div>
          </div>
        </div>

        {/* SECTION: HÌNH ẢNH */}
        <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 space-y-6">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Hình ảnh</h3>
              <p className="text-xs text-gray-500">Ảnh bìa và ảnh đại diện bài viết</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-gray-700">Ảnh bìa (Cover)</label>
              <Controller
                name="coverImage"
                control={control}
                render={({ field }) => (
                  <ImageUploader {...field} />
                )}
              />
            </div>
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-gray-700">Ảnh đại diện (Thumbnail)</label>
              <Controller
                name="image"
                control={control}
                render={({ field }) => (
                  <ImageUploader {...field} />
                )}
              />
            </div>
          </div>
        </div>

        {/* SECTION: NỘI DUNG CHI TIẾT */}
        <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">Nội dung chi tiết</h3>
          </div>
          <Controller
            name="content"
            control={control}
            render={({ field }) => (
              <CKEditor
                {...field}
                value={field.value || ""}
                height="450px"
              />
            )}
          />
          {errors.content && <p className="text-sm text-red-500 font-medium">{errors.content.message}</p>}

          {postType === "video" && (
            <FormField
              label="Video URL"
              placeholder="https://youtube.com/..."
              {...register("videoUrl")}
              error={errors.videoUrl?.message}
            />
          )}

          {postType === "audio" && (
            <FormField
              label="Audio URL"
              placeholder="https://..."
              {...register("audioUrl")}
              error={errors.audioUrl?.message}
            />
          )}
        </div>

        {/* SECTION: PHÂN LOẠI */}
        <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 space-y-6">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-green-100 rounded-lg text-green-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Phân loại & Hiển thị</h3>
              <p className="text-xs text-gray-500">Giúp người dùng dễ dàng tìm thấy bài viết</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Controller
              name="categoryIds"
              control={control}
              render={({ field }) => (
                <MultipleSelect
                  {...field}
                  options={categoryOptions}
                  label="Danh mục"
                  placeholder="Chọn danh mục"
                />
              )}
            />

            <Controller
              name="tagIds"
              control={control}
              render={({ field }) => (
                <MultipleSelect
                  {...field}
                  options={tagOptions}
                  label="Thẻ bài viết"
                  placeholder="Chọn thẻ"
                />
              )}
            />

            <div className="grid grid-cols-2 gap-4 h-fit self-end">
              <label className="flex items-center space-x-3 p-3 bg-white rounded-xl border border-gray-200 cursor-pointer hover:bg-blue-50 transition-colors">
                <input type="checkbox" {...register("isFeatured")} className="w-5 h-5 rounded text-blue-600" />
                <span className="text-sm font-medium text-gray-700">Nổi bật</span>
              </label>
              <label className="flex items-center space-x-3 p-3 bg-white rounded-xl border border-gray-200 cursor-pointer hover:bg-blue-50 transition-colors">
                <input type="checkbox" {...register("isPinned")} className="w-5 h-5 rounded text-blue-600" />
                <span className="text-sm font-medium text-gray-700">Ghim đầu</span>
              </label>
            </div>
          </div>
        </div>

        {/* SECTION: SEO */}
        <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 space-y-6">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Tối ưu SEO</h3>
              <p className="text-xs text-gray-500">Cấu hình thẻ Meta cho các công cụ tìm kiếm</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <FormField label="SEO Title" {...register("seoTitle")} error={errors.seoTitle?.message} placeholder="Tiêu đề SEO (tối đa 255 ký tự)" />
            </div>
            <div className="md:col-span-2">
              <FormField label="SEO Description" type="textarea" rows={2} {...register("seoDescription")} error={errors.seoDescription?.message} placeholder="Mô tả SEO (tối đa 2000 ký tự)" />
            </div>
            <div className="md:col-span-2">
              <FormField label="SEO Keywords" {...register("seoKeywords")} error={errors.seoKeywords?.message} placeholder="keyword1, keyword2, keyword3" />
            </div>
          </div>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="flex justify-end space-x-4 pt-8 border-t border-gray-100">
          <button
            type="button"
            onClick={onCancel}
            className="px-8 py-3 bg-white border border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all active:scale-95"
          >
            Hủy bỏ
          </button>
          <button
            type="submit"
            disabled={loading || isSubmitting}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
          >
            {loading || isSubmitting ? "Đang xử lý..." : post ? "Cập nhật bài viết" : "Tạo bài viết mới"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
