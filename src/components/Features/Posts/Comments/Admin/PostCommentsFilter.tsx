import { useMemo, useState, useEffect } from "react";
import AdminFilter from "@/components/Shared/Admin/AdminFilter";
import SelectFilter from "@/components/UI/Filters/SelectFilter";
import api from "@/lib/api/client";
import { adminEndpoints } from "@/lib/api/endpoints";

interface PostCommentsFilterProps {
    initialFilters: Record<string, string | number>;
    onUpdateFilters: (filters: Record<string, string | number>) => void;
}

export default function PostCommentsFilter({
    initialFilters,
    onUpdateFilters,
}: PostCommentsFilterProps) {
    const [posts, setPosts] = useState<{ value: string; label: string }[]>([]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await api.get(adminEndpoints.posts.simple);
                const data = response.data?.data || [];
                if (Array.isArray(data)) {
                    setPosts(data.map((post: Record<string, unknown>) => ({
                        value: String(post.id),
                        label: post.name as string,
                    })));
                }
            } catch (error) {
                console.error("Failed to fetch posts for filter", error);
            }
        };
        fetchPosts();
    }, []);

    const statusOptions = [
        { value: "", label: "Tất cả trạng thái" },
        { value: "visible", label: "Công khai" },
        { value: "hidden", label: "Đang ẩn" },
        { value: "spam", label: "Spam" },
        { value: "deleted", label: "Đã xóa" },
    ];

    const sortOptions = [
        { value: "createdAt:desc", label: "Mới nhất" },
        { value: "createdAt:asc", label: "Cũ nhất" },
    ];

    const postOptions = [
        { value: "", label: "Tất cả bài viết" },
        ...posts
    ];

    return (
        <AdminFilter
            initialFilters={initialFilters}
            sortOptions={sortOptions}
            sortField="sort"
            searchField="search"
            searchPlaceholder="Tìm kiếm nội dung..."
            onUpdateFilters={onUpdateFilters}
            hasAdvancedFilters={true}
            advancedFilters={({ filters, onChange }) => (
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="w-full md:w-48">
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
                    <div className="w-full md:w-64">
                        <SelectFilter
                            value={filters["postId"] || ""}
                            options={postOptions}
                            placeholder="Bài viết"
                            onChange={(value) => {
                                filters["postId"] = value;
                                onChange();
                            }}
                        />
                    </div>
                </div>
            )}
        />
    );
}
