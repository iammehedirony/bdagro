import NotificationsBoard from "@/components/notifications/NotificationBoard";
import type { NotificationType } from "@/lib/services/notification.service";
export default function AdminNotificationsPage() {
  const adminTabs = ["সব", "যাচাইকরণ", "প্রকল্প", "লেনদেন"];
  const categories: Record<string, NotificationType[]> = {
    "যাচাইকরণ": ["verification"],
    "প্রকল্প": ["project"],
    "লেনদেন": ["transaction"],
  };

  return (
    <NotificationsBoard
      tabs={adminTabs}
      categories={categories}
    />
  );
}