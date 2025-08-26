import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import StatsCards from "./StatsCards";
import PieChartStats from "./PieChartStats";
import LineChartStats from "./LineChartStats";
import ReportTable from "./ReportTable";
import UserTable from "./UserTable";
import PendingReportTable from "./PendingReportTable";
import RegionTable from "./RegionTable";
import API from "../../api/axios";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function AdminDashboard() {
  const [view, setView] = useState("dashboard");
  const [reports, setReports] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await API.get("/reports");
      setReports(response.data.reports);
      setLoading(false);
    } catch (error) {
      setReports([]);
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await API.get("/users");
      setUsers(res.data.users);
      setLoading(false);
    } catch (error) {
      setUsers([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchReports();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

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
                <PieChartStats reports={reports} />
              </div>
              <div className="w-full md:w-1/2">
                <LineChartStats reports={reports} />
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
