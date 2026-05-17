"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api/client";
import { adminEndpoints } from "@/lib/api/endpoints";
import { useToastContext } from "@/contexts/ToastContext";
import { normalizeDetailResponse, normalizeListResponse } from "@/lib/api/response-normalizer";
import SkeletonLoader from "@/components/UI/Feedback/SkeletonLoader";
import ConfirmModal from "@/components/UI/Feedback/ConfirmModal";
import Actions from "@/components/UI/DataDisplay/Actions";
import AddMemberModal from "./AddMemberModal";
import useModal from "@/hooks/ui-ux/useModal";
import { useCrudList } from "@/hooks";
import Pagination from "@/components/UI/DataDisplay/Pagination";
import { type Group } from "./Constants/types";

interface RawMember {
  userId?: string | number;
  groupId?: string | number;
  joinedAt?: string;
}

interface NormalizedMember {
  id: string;
  userId: string;
  joinedAt: string | null;
}

interface SimpleUser {
  id: string | number;
  name?: string;
  email?: string;
  image?: string | null;
  status?: string;
}

interface GroupMembersProps {
  groupId: number | string;
}

export default function GroupMembers({ groupId }: GroupMembersProps) {
  const router = useRouter();
  const { showError } = useToastContext();
  const [group, setGroup] = useState<Group | null>(null);
  const [userMap, setUserMap] = useState<Record<string, SimpleUser>>({});

  const endpoint = useMemo(() => adminEndpoints.groups.members.list(groupId), [groupId]);

  const transformItem = useCallback((item: unknown): NormalizedMember => {
    const m = item as RawMember;
    const uid = m.userId ?? "";
    return {
      id: String(uid),
      userId: String(uid),
      joinedAt: m.joinedAt ?? null,
    };
  }, []);

  const {
    data,
    actions,
    ui,
    deleteModal,
    handleDeleteConfirm,
    openDelete,
  } = useCrudList({
    endpoint,
    deleteSuccessMessage: "Đã xóa thành viên khỏi nhóm",
    transformItem,
  });

  const { items: rawItems, loading, pagination, hasData } = data;
  const items = rawItems as unknown as NormalizedMember[];
  const { getSerialNumber } = ui;

  const addMemberModal = useModal();

  // Load group info
  useEffect(() => {
    const loadGroup = async () => {
      try {
        const response = await api.get(adminEndpoints.groups.show(groupId));
        const groupData = normalizeDetailResponse<Group>(response.data);
        if (!groupData) {
          showError("Không tìm thấy nhóm");
          router.push("/admin/groups");
        } else {
          setGroup(groupData);
        }
      } catch {
        if (typeof window !== "undefined" && window.location.pathname.includes(`/admin/groups/${groupId}/members`)) {
          showError("Không thể tải thông tin nhóm");
          router.push("/admin/groups");
        }
      }
    };

    loadGroup();
  }, [groupId, router, showError]);

  // Load user info to map userId -> {name, email}
  useEffect(() => {
    if (items.length === 0) return;
    const unknownIds = items.filter((m) => !userMap[m.userId]).map((m) => m.userId);
    if (unknownIds.length === 0) return;

    let cancelled = false;
    const loadUsers = async () => {
      try {
        const response = await api.get(adminEndpoints.users.simple);
        const users = normalizeListResponse<SimpleUser>(response.data);
        if (cancelled) return;
        const next: Record<string, SimpleUser> = { ...userMap };
        users.forEach((u) => {
          next[String(u.id)] = u;
        });
        setUserMap(next);
      } catch {
        // Silent — fallback to userId display
      }
    };
    void loadUsers();
    return () => {
      cancelled = true;
    };
  }, [items, userMap]);

  const isOwner = (userId: string): boolean => {
    if (!group?.ownerId) return false;
    return String(group.ownerId) === userId;
  };

  const handleMemberAdded = () => {
    addMemberModal.close();
    actions.refresh();
  };

  const handleDeleteMember = (member: NormalizedMember) => {
    const mockEndpoints = {
      list: "",
      create: "",
      show: (_id: string | number) => "",
      update: (_id: string | number) => "",
      delete: (id: string | number) => adminEndpoints.groups.members.remove(groupId, id),
    };
    openDelete(member, mockEndpoints, "userId");
  };

  return (
    <div className="admin-group-members">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-primary">Quản lý thành viên</h1>
          {group && (
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-gray-500">Nhóm:</span>
              <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-bold rounded uppercase border border-blue-100">
                {group.name}
              </span>
              <code className="text-xs text-gray-400 bg-gray-50 px-1 rounded">{group.code}</code>
            </div>
          )}
        </div>
        <button
          onClick={() => addMemberModal.open()}
          className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 shadow-sm"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Thêm thành viên
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden mt-6">
        {loading ? (
          <SkeletonLoader type="table" rows={10} columns={5} />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">STT</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">User ID</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Tên</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Tham gia</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Thao tác</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {items.map((member, index) => {
                  const u = userMap[member.userId];
                  const displayName = u?.name || `User #${member.userId}`;
                  const owner = isOwner(member.userId);
                  return (
                    <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getSerialNumber(index)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <code className="text-xs px-2 py-1 bg-gray-100 rounded">{member.userId}</code>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs mr-3">
                            {(u?.name || "U").charAt(0).toUpperCase()}
                          </div>
                          <span className="text-sm font-medium text-gray-900">{displayName}</span>
                          {owner && (
                            <span className="ml-2 px-1.5 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-700 rounded uppercase">
                              Chủ nhóm
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{u?.email || "—"}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {member.joinedAt ? new Date(member.joinedAt).toLocaleDateString("vi-VN") : "—"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <Actions
                          item={member}
                          showView={false}
                          showEdit={false}
                          showDelete={!owner}
                          deleteTitle="Xóa thành viên"
                          onDelete={() => handleDeleteMember(member)}
                        />
                      </td>
                    </tr>
                  );
                })}
                {items.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500 italic">
                      {loading ? "Đang tải dữ liệu..." : "Chưa có thành viên trong nhóm"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {hasData && (
        <div className="mt-6">
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            totalItems={pagination.totalItems}
            onPageChange={actions.changePage}
          />
        </div>
      )}

      {addMemberModal.isOpen && (
        <AddMemberModal
          show={addMemberModal.isOpen}
          groupId={groupId}
          onClose={addMemberModal.close}
          onMemberAdded={handleMemberAdded}
        />
      )}

      {deleteModal.isOpen && deleteModal.data && (
        <ConfirmModal
          show={deleteModal.isOpen}
          title="Xác nhận xóa"
          message={`Bạn có chắc chắn muốn xóa thành viên này khỏi nhóm?`}
          onClose={deleteModal.close}
          onConfirm={handleDeleteConfirm}
          confirmText="Xác nhận xóa"
        />
      )}
    </div>
  );
}
