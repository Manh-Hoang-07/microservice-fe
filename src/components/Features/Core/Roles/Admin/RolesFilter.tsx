"use client";

import { useMemo } from "react";
import SelectFilter from "@/components/UI/Filters/SelectFilter";
import AdminFilter from "@/components/Shared/Admin/AdminFilter";

interface RolesFilterProps {
  initialFilters?: Record<string, any>;
  statusEnums?: Array<{ value: string; label: string; name?: string; id?: number }>;
  onUpdateFilters?: (filters: Record<string, any>) => void;
  onFilterChange?: () => void;
}

export default function RolesFilter({
  initialFilters = {},
  statusEnums = [],
  onUpdateFilters,
  onFilterChange,
}: RolesFilterProps) {
  const statusOptions = useMemo(() => {
    const options = [{ value: "", label: "Tất cả" }];
    if (statusEnums && Array.isArray(statusEnums)) {
      statusEnums.forEach((item) => {
        options.push({
          value: item.value || String(item.id),
          label: item.label || item.name || item.value,
        });
      });
    }
    return options;
  }, [statusEnums]);

  const sortOptions = [
    { value: "code:ASC", label: "Mã code (A-Z)" },
    { value: "code:DESC", label: "Mã code (Z-A)" },
    { value: "name:ASC", label: "Tên (A-Z)" },
    { value: "name:DESC", label: "Tên (Z-A)" },
    { value: "createdAt:ASC", label: "Ngày tạo (cũ nhất)" },
    { value: "createdAt:DESC", label: "Ngày tạo (mới nhất)" },
  ];

  return (
    <AdminFilter
      initialFilters={initialFilters}
      sortOptions={sortOptions}
      sortField="sort"
      searchField="search"
      searchPlaceholder="Tìm theo mã code, tên vai trò..."
      hasAdvancedFilters={true}
      onUpdateFilters={onUpdateFilters}
      onFilterChange={onFilterChange}
      advancedFilters={({ filters, onChange }) => (
        <SelectFilter
          value={filters["status"] || ""}
          options={statusOptions}
          placeholder="Tất cả trạng thái"
          onChange={(value) => {
            filters["status"] = value;
            onChange();
          }}
        />
      )}
    />
  );
}






