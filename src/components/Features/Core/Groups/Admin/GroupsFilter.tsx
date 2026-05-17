"use client";

import { useMemo } from "react";
import SelectFilter from "@/components/UI/Filters/SelectFilter";
import AdminFilter from "@/components/Shared/Admin/AdminFilter";

interface GroupsFilterProps {
  initialFilters?: Record<string, any>;
  statusEnums?: Array<{ value: string; label: string; name?: string; id?: number }>;
  onUpdateFilters?: (filters: Record<string, any>) => void;
  onFilterChange?: () => void;
}

export default function GroupsFilter({
  initialFilters = {},
  statusEnums = [],
  onUpdateFilters,
  onFilterChange,
}: GroupsFilterProps) {
  const typeOptions = [
    { value: "", label: "Tất cả" },
    { value: "shop", label: "Shop" },
    { value: "team", label: "Team" },
    { value: "project", label: "Project" },
    { value: "department", label: "Department" },
    { value: "organization", label: "Organization" },
  ];

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
    { value: "type:ASC", label: "Loại (A-Z)" },
    { value: "type:DESC", label: "Loại (Z-A)" },
    { value: "createdAt:ASC", label: "Ngày tạo (cũ nhất)" },
    { value: "createdAt:DESC", label: "Ngày tạo (mới nhất)" },
  ];

  return (
    <AdminFilter
      initialFilters={initialFilters}
      sortOptions={sortOptions}
      sortField="sort"
      searchField="search"
      searchPlaceholder="Tìm theo mã code, tên group..."
      hasAdvancedFilters={true}
      onUpdateFilters={onUpdateFilters}
      onFilterChange={onFilterChange}
      advancedFilters={({ filters, onChange }) => (
        <>
          <SelectFilter
            value={filters["type"] || ""}
            options={typeOptions}
            placeholder="Tất cả loại"
            onChange={(value) => {
              filters["type"] = value;
              onChange();
            }}
          />
          <SelectFilter
            value={filters["status"] || ""}
            options={statusOptions}
            placeholder="Tất cả trạng thái"
            onChange={(value) => {
              filters["status"] = value;
              onChange();
            }}
          />
        </>
      )}
    />
  );
}





