import { useState } from "react";
import { useSelector } from "react-redux";
import Sidebar from "./Sidebar";
import StatsCards from "./StatsCards";
import PieChartStats from "./PieChartStats";
import LineChartStats from "./LineChartStats";
import ReportTable from "./ReportTable";
import UserTable from "./UserTable";
import PendingReportTable from "./PendingReportTable";

export default function AdminDashboard() {
  const users = useSelector((state) => state.register.users);
  const reports = useSelector((state) => state.report.reports);

  const [view, setView] = useState("dashboard");

  return (
    <div className="flex flex-col md:flex-row h-screen mt-10 sm:mt-15 md:mt-20 mx-8">
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
          <>
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="w-full md:w-1/2">
                <PieChartStats />
              </div>
              <div className="w-full md:w-1/2">
                <LineChartStats />
              </div>
            </div>
            <div className="w-full">
              <PendingReportTable />
            </div>
          </>
        )}
        {view === "reports" && <ReportTable />}
        {view === "pending" && <PendingReportTable />}
        {view === "users" && <UserTable />}
      </main>
    </div>
  );
}
