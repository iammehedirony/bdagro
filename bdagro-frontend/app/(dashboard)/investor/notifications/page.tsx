import NotificationsBoard from "@/components/notifications/NotificationBoard";
import type { NotificationType } from "@/lib/services/notification.service";

export default function InvestorNotifications() {
  const investorTabs = ["সব", "বিনিয়োগ", "ফান্ডিং", "পেমেন্ট"];
  const categories: Record<string, NotificationType[]> = {
    "বিনিয়োগ": ["investment"],
    "ফান্ডিং": ["funding"],
    "পেমেন্ট": ["payment"],
  };

  return (
    <NotificationsBoard
      tabs={investorTabs}
      categories={categories}
    />
  );
}
