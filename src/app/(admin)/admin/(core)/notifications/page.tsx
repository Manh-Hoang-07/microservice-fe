import { Metadata } from "next";
import PageMeta from "@/components/UI/Navigation/PageMeta";
import AdminNotifications from "@/components/Features/Notification/Admin/AdminNotifications";

export const metadata: Metadata = {
  title: "Quản lý Thông báo | Admin",
  description: "Quản lý và gửi thông báo đến người dùng",
};

export default function AdminNotificationsPage() {
  return (
    <div className="w-full p-4">
      <PageMeta
        title="Quản lý Thông báo"
        breadcrumbs={[
          { label: "Trang quản trị", href: "/admin" },
          { label: "Thông báo" },
        ]}
      />
      <AdminNotifications />
    </div>
  );
}
