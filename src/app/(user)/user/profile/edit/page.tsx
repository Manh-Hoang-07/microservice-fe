import { Metadata } from "next";
import EditProfileForm from "@/components/Features/Users/User/Profile/EditProfileForm";

export const metadata: Metadata = {
  title: "Chỉnh sửa thông tin | User",
};

export default function EditProfilePage() {
  return <EditProfileForm />;
}
