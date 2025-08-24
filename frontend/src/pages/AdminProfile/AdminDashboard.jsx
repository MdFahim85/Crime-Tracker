import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Sidebar from "./Sidebar";
import StatsCards from "./StatsCards";
import PieChartStats from "./PieChartStats";
import LineChartStats from "./LineChartStats";
import ReportTable from "./ReportTable";
import UserTable from "./UserTable";
import PendingReportTable from "./PendingReportTable";
import RegionTable from "./RegionTable";
import { useUsers } from "../../hooks/useUsers";
import { useReports } from "../../hooks/useReports";
export default function AdminDashboard() {
  const [view, setView] = useState("dashboard");

  const { users, fetchUsers } = useUsers();
  const { reports, fetchReports } = useReports();

  useEffect(() => {
    fetchUsers();
    fetchReports();
  }, []);

  return (
    <div className="flex flex-col md:flex-row h-screen mt-10 sm:mt-16 md:mt-24 mx-8 mb-16">
      <Sidebar onMenuClick={setView} />
      <main className="flex-1 px-4 sm:px-8 ">
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
              <ReportTable reports={reports} fetchReports={fetchReports} />
            </div>
          </>
        )}
        {view === "reports" && (
          <ReportTable reports={reports} fetchReports={fetchReports} />
        )}
        {view === "pending" && (
          <PendingReportTable reports={reports} fetchReports={fetchReports} />
        )}
        {view === "users" && (
          <UserTable users={users} fetchUsers={fetchUsers} />
        )}
        {view === "regions" && <RegionTable />}
      </main>
    </div>
  );
}
