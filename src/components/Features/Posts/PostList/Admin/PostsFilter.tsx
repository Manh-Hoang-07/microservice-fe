"use client";

import { useMemo } from "react";
import SelectFilter from "@/components/UI/Filters/SelectFilter";
import AdminFilter from "@/components/Shared/Admin/AdminFilter";

interface PostsFilterProps {
  initialFilters?: Record<string, any>;
  statusEnums?: Array<{ value: string; label: string; name?: string }>;
  categoryEnums?: Array<{ id: number; name: string }>;
  onUpdateFilters?: (filters: Record<string, any>) => void;
  onFilterChange?: () => void;
}

export default function PostsFilter({
  initialFilters = {},
  statusEnums = [],
  categoryEnums = [],
  onUpdateFilters,
  onFilterChange,
}: PostsFilterProps) {
  const statusOptions = useMemo(() => {
    const options = [{ value: "", label: "Tất cả" }];
    if (statusEnums && Array.isArray(statusEnums)) {
      statusEnums.forEach((item) => {
        options.push({
          value: item.value,
          label: item.label || item.name || item.value,
        });
      });
    }
    return options;
  }, [statusEnums]);

  const categoryOptions = useMemo(() => {
    const options = [{ value: "", label: "Tất cả" }];
    if (categoryEnums && Array.isArray(categoryEnums)) {
      categoryEnums.forEach((item) => {
        options.push({
          value: String(item.id),
          label: item.name,
        });
      });
    }
    return options;
  }, [categoryEnums]);

  const sortOptions = [
    { value: "publishedAt:desc", label: "Mới xuất bản nhất" },
    { value: "publishedAt:asc", label: "Cũ nhất" },
    { value: "viewCount:desc", label: "Nhiều lượt xem nhất" },
    { value: "name:asc", label: "Tên (A-Z)" },
    { value: "name:desc", label: "Tên (Z-A)" },
    { value: "createdAt:desc", label: "Ngày tạo mới nhất" },
    { value: "updatedAt:desc", label: "Cập nhật gần nhất" },
  ];

  const postTypeOptions = [
    { value: "", label: "Tất cả loại" },
    { value: "text", label: "Văn bản" },
    { value: "video", label: "Video" },
    { value: "image", label: "Hình ảnh" },
    { value: "audio", label: "Âm thanh" },
  ];

  return (
    <AdminFilter
      initialFilters={initialFilters}
      sortOptions={sortOptions}
      sortField="sort"
      searchField="search"
      searchPlaceholder="Tìm theo tiêu đề..."
      hasAdvancedFilters={true}
      onUpdateFilters={onUpdateFilters}
      onFilterChange={onFilterChange}
      advancedFilters={({ filters, onChange }) => (
        <div className="mt-4 flex flex-wrap gap-4">
          <div className="min-w-[150px]">
            <SelectFilter
              value={filters["status"] || ""}
              options={statusOptions}
              placeholder="Chọn trạng thái"
              onChange={(value) => {
                filters["status"] = value;
                onChange();
              }}
            />
          </div>
          <div className="min-w-[150px]">
            <SelectFilter
              value={filters["categoryId"] || ""}
              options={categoryOptions}
              placeholder="Chọn danh mục"
              onChange={(value) => {
                filters["categoryId"] = value;
                onChange();
              }}
            />
          </div>
          <div className="min-w-[150px]">
            <SelectFilter
              value={filters["postType"] || ""}
              options={postTypeOptions}
              placeholder="Loại bài viết"
              onChange={(value) => {
                filters["postType"] = value;
                onChange();
              }}
            />
          </div>
        </div>
      )}
    />
  );
}
