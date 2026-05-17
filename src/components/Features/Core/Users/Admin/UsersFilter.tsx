"use client";

import { useMemo } from "react";
import SelectFilter from "@/components/UI/Filters/SelectFilter";
import AdminFilter from "@/components/Shared/Admin/AdminFilter";

interface UsersFilterProps {
  initialFilters?: Record<string, any>;
  statusEnums?: Array<{ value: string; label: string; name?: string }>;
  onUpdateFilters?: (filters: Record<string, any>) => void;
  onFilterChange?: () => void;
}

export default function UsersFilter({
  initialFilters = {},
  statusEnums = [],
  onUpdateFilters,
  onFilterChange,
}: UsersFilterProps) {
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

  const sortOptions = [
    { value: "createdAt:DESC", label: "Mới nhất" },
    { value: "createdAt:ASC", label: "Cũ nhất" },
    { value: "username:ASC", label: "Tên đăng nhập (A-Z)" },
    { value: "username:DESC", label: "Tên đăng nhập (Z-A)" },
    { value: "email:ASC", label: "Email (A-Z)" },
    { value: "email:DESC", label: "Email (Z-A)" },
  ];

  return (
    <AdminFilter
      initialFilters={initialFilters}
      sortOptions={sortOptions}
      sortField="sort"
      searchField="search"
      searchPlaceholder="Tìm theo tên đăng nhập, email..."
      hasAdvancedFilters={true}
      onUpdateFilters={onUpdateFilters}
      onFilterChange={onFilterChange}
      advancedFilters={({ filters, onChange }) => (
        <div>
          <SelectFilter
            value={filters["status"] || ""}
            options={statusOptions}
            placeholder="Tất cả trạng thái"
            onChange={(value) => {
              filters["status"] = value;
              onChange();
            }}
          />
        </div>
      )}
    />
  );
}




