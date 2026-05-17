"use client";

import { useMemo } from "react";
import AdminFilter from "@/components/Shared/Admin/AdminFilter";
import SelectFilter from "@/components/UI/Filters/SelectFilter";
import { adminEndpoints } from "@/lib/api/endpoints";

interface ProvinceFilterProps {
  initialFilters?: Record<string, any>;
  onUpdateFilters?: (filters: Record<string, any>) => void;
}

export default function ProvinceFilter({
  initialFilters = {},
  onUpdateFilters,
}: ProvinceFilterProps) {
  const statusOptions = useMemo(
    () => [
      { value: "", label: "Tất cả trạng thái" },
      { value: "active", label: "Hoạt động" },
      { value: "inactive", label: "Ngừng hoạt động" },
    ],
    []
  );

  const sortOptions = [
    { value: "name:ASC", label: "Tên (A-Z)" },
    { value: "name:DESC", label: "Tên (Z-A)" },
    { value: "code:ASC", label: "Mã (A-Z)" },
    { value: "code:DESC", label: "Mã (Z-A)" },
    { value: "createdAt:DESC", label: "Ngày tạo (mới nhất)" },
    { value: "createdAt:ASC", label: "Ngày tạo (cũ nhất)" },
  ];

  const countryOptions = useMemo(
    () => [
      { value: "", label: "Tất cả quốc gia" },
    ],
    []
  );

  return (
    <AdminFilter
      initialFilters={initialFilters}
      sortOptions={sortOptions}
      sortField="sort"
      searchField="search"
      searchPlaceholder="Tìm theo tên, mã tỉnh/thành..."
      hasAdvancedFilters={true}
      onUpdateFilters={onUpdateFilters}
      advancedFilters={({ filters, onChange }) => (
        <div className="flex flex-col space-y-3 min-w-[260px]">
          <SelectFilter
            value={filters["countryId"] || ""}
            apiEndpoint={adminEndpoints.location.countries.simple}
            apiParams={{ limit: 1000 }}
            placeholder="Quốc gia"
            labelField="name"
            valueField="id"
            onChange={(value) => {
              filters["countryId"] = value;
              onChange();
            }}
          />
          <SelectFilter
            value={filters["status"] || ""}
            options={statusOptions}
            placeholder="Trạng thái"
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


