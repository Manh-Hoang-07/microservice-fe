"use client";

import AdminFilter from "@/components/Shared/Admin/AdminFilter";

interface MemberFilterProps {
  initialFilters?: Record<string, any>;
  onUpdateFilters?: (filters: Record<string, any>) => void;
  onFilterChange?: () => void;
}

export default function MemberFilter({
  initialFilters = {},
  onUpdateFilters,
  onFilterChange,
}: MemberFilterProps) {
  const sortOptions = [
    { value: "joinedAt:DESC", label: "Mới nhất" },
    { value: "joinedAt:ASC", label: "Cũ nhất" },
  ];

  return (
    <AdminFilter
      initialFilters={initialFilters}
      sortOptions={sortOptions}
      sortField="sort"
      searchField="search"
      searchPlaceholder="Tìm theo tên đăng nhập, email..."
      hasAdvancedFilters={false}
      onUpdateFilters={onUpdateFilters}
      onFilterChange={onFilterChange}
    />
  );
}
