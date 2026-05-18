import { Metadata } from "next";
import PageMeta from "@/components/UI/Navigation/PageMeta";
import NotificationList from "@/components/Features/Notification/User/NotificationList";

export const metadata: Metadata = {
  title: "Thông báo | User",
  description: "Trang xem thông báo cá nhân",
};

export default function UserNotificationsPage() {
  return (
    <>
      <PageMeta
        title="Thông báo của tôi"
        breadcrumbs={[
          { label: "Trang chủ", href: "/" },
          { label: "Cá nhân", href: "/user" },
          { label: "Thông báo" },
        ]}
      />
      <NotificationList />
    </>
  );
}
