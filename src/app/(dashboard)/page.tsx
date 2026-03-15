import OverviewDashboard from "@/components/Dashboard/Overview/Overview";
import RecentUser from "@/components/Dashboard/Overview/recent-users";

export default function page() {
  return (
    <div className="space-y-8">
      <OverviewDashboard />
      <RecentUser />
    </div>
  );
}
