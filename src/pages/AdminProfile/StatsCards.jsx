import { Card } from "@/components/ui/card";

export default function StatsCards({
  totalUsers,
  totalReports,
  pendingReports,
  onUsersClick,
  onReportsClick,
  onPendingClick,
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <Card
        className="w-full cursor-pointer text-center bg-slate-100"
        onClick={onUsersClick}
      >
        <h3>Total Users</h3>
        <p className="text-3xl font-bold">👤 {totalUsers}</p>
      </Card>
      <Card
        className="w-full cursor-pointer text-center bg-slate-100"
        onClick={onReportsClick}
      >
        <h3>Total Reports</h3>
        <p className="text-3xl font-bold">📝 {totalReports}</p>
      </Card>
      <Card
        className="w-full cursor-pointer text-center bg-slate-100"
        onClick={onPendingClick}
      >
        <h3>Pending Reports</h3>
        <p className="text-3xl font-bold">⌛ {pendingReports}</p>
      </Card>
    </div>
  );
}
