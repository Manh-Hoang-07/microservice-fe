"use client";

import { useCallback, useMemo } from "react";
import UserForm from "./UserForm";
import { useFormModal } from "@/hooks";
import { type EditUserProps, type User } from "./Constants/types";
import { formatDate } from "@/utils/formatters";


const transformUserData = (data: Record<string, unknown>): Record<string, unknown> => {
  if (!data) return {};

  const profile = (data?.profile as Record<string, unknown>) || {};

  return {
    id: data?.id,
    username: (data?.username as string) || "",
    email: (data?.email as string) || "",
    phone: (data?.phone as string) || "",
    status: (data?.status as string) || "",
    name: (data?.name as string) || "",
    address: (profile?.address as string) || "",
    gender: (profile?.gender as string) || "",
    birthday: formatDate(profile?.birthday as string | undefined, "yyyy-MM-dd"),
    countryId: profile?.countryId != null ? String(profile.countryId) : null,
    provinceId: profile?.provinceId != null ? String(profile.provinceId) : null,
    wardId: profile?.wardId != null ? String(profile.wardId) : null,
    image: (data?.image as string) || null,
    about: (profile?.about as string) || "",
  };
};

const buildUserPayload = (formData: Record<string, unknown>) => {
  const data = formData || {};
  const baseKeys = ["username", "email", "phone", "status", "password", "name", "image"] as const;
  const profileKeys = ["gender", "birthday", "address", "about", "countryId", "provinceId", "wardId"] as const;

  const payload: Record<string, unknown> = {};
  baseKeys.forEach((key) => {
    const value = data[key];
    if (value !== undefined && value !== null && value !== "") {
      if (key === "password" && !value) return;
      payload[key] = value;
    }
  });

  const profile: Record<string, unknown> = {};
  profileKeys.forEach((key) => {
    const value = data[key];
    if (value !== undefined && value !== null && value !== "") {
      profile[key] = value;
    }
  });

  if (Object.keys(profile).length > 0) {
    payload.profile = profile;
  }

  return payload;
};

export default function EditUser({
  show,
  target,
  onSuccess,
  onClose,
}: EditUserProps) {
  const { entityData, loading, apiErrors, handleSubmit } = useFormModal(
    { mode: "edit", show, target },
    { updateSuccessMessage: "Cập nhật người dùng thành công", fetchErrorMessage: "Không thể tải thông tin người dùng", onSuccess, onClose }
  );

  const userData = useMemo(() => entityData ? transformUserData(entityData) as unknown as User : null, [entityData]);

  const handleFormSubmit = useCallback(
    (formData: Record<string, unknown>) => handleSubmit(buildUserPayload(formData)),
    [handleSubmit]
  );

  return (
    <UserForm
      show={show}
      user={userData}
      apiErrors={apiErrors}
      loading={loading}
      onSubmit={handleFormSubmit}
      onCancel={onClose}
    />
  );
}
