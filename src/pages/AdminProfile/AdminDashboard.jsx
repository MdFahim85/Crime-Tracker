import { useState } from "react";
import { useSelector } from "react-redux";
import Sidebar from "./Sidebar";
import StatsCards from "./StatsCards";
import PieChartStats from "./PieChartStats";
import LineChartStats from "./LineChartStats";
import ReportTable from "./ReportTable";
import UserTable from "./UserTable"; // <- make this
import PendingReportTable from "./PendingReportTable";

export default function AdminDashboard() {
  const users = useSelector((state) => state.register.users);
  const reports = useSelector((state) => state.report.reports);

  const [view, setView] = useState("dashboard");

  // Pie data
  const crimeTypeCounts = reports.reduce((acc, report) => {
    const type = report.title || "Other";
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});
  const pieData = Object.entries(crimeTypeCounts).map(([name, value]) => ({
    name,
    value,
  }));

  // Line data
  const reportCountsByDate = reports.reduce((acc, report) => {
    const date = report.date || "Unknown";
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});
  const lineData = Object.entries(reportCountsByDate)
    .map(([date, reportsCount]) => ({ date, reports: reportsCount }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div className="flex flex-col md:flex-row h-full mt-10 sm:mt-15 md:mt-20 mx-8">
      <Sidebar onMenuClick={setView} />
      <main className="flex-1 px-4 sm:px-8 overflow-y-auto">
        <StatsCards
          totalUsers={users?.length || 0}
          totalReports={reports?.length || 0}
          pendingReports={
            reports?.filter((r) => r.status === "pending").length || 0
          }
          onUsersClick={() => setView("users")}
          onReportsClick={() => setView("reports")}
          onPendingClick={() => setView("pending")}
        />
        {view === "dashboard" && (
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="w-full md:w-1/2">
              <PieChartStats data={pieData} />
            </div>
            <div className="w-full md:w-1/2">
              <LineChartStats data={lineData} />
            </div>
          </div>
        )}
        {view === "reports" && <ReportTable reports={reports} />}
        {view === "pending" && <PendingReportTable reports={reports} />}
        {view === "users" && <UserTable users={users} />}
      </main>
    </div>
  );
}
