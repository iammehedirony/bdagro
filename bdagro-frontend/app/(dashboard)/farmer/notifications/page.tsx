import NotificationsBoard from "@/components/notifications/NotificationBoard";
import type { NotificationType } from "@/lib/services/notification.service";
export default function FarmerNotificationsPage() {
  const farmerTabs = ["সব", "প্রকল্প", "মুনাফা বণ্টন", "যাচাইকরণ"];
  const categories: Record<string, NotificationType[]> = {
    "প্রকল্প": ["project"],
    "মুনাফা বণ্টন": ["profit_distribution"],
    "যাচাইকরণ": ["verification"],
  };

  return (
    <NotificationsBoard
      tabs={farmerTabs}
      categories={categories}
    />
  );
}