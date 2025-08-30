import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import Sidebar from "./Sidebar";
import StatsCards from "./StatsCards";
import PieChartStats from "./PieChartStats";
import LineChartStats from "./LineChartStats";
import ReportTable from "./ReportTable";
import UserTable from "./UserTable";
import PendingReportTable from "./PendingReportTable";
import RegionTable from "./RegionTable";
import API from "../../api/axios";

export default function AdminDashboard() {
  const [view, setView] = useState("dashboard");
  const [reports, setReports] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await API.get(`/reports`);
      setReports(response.data.reports);
      setLoading(false);
    } catch (error) {
      console.log(error);
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
      console.log(error);
      setUsers([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchReports();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100 flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-blue-100 p-8 flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100">
      <div className="flex flex-col lg:flex-row min-h-screen pt-10 sm:pt-16 lg:pt-24 pb-16 gap-4 ">
        <div className="w-full lg:w-128 flex-shrink-0 px-4 lg:px-6">
          <div className="lg:sticky lg:top-24">
            <Sidebar onMenuClick={setView} />
          </div>
        </div>

        <div className="flex flex-col w-full px-4 lg:pr-6">
          <div className="mb-6">
            <StatsCards
              onUsersClick={() => setView("users")}
              onReportsClick={() => setView("reports")}
              onPendingClick={() => setView("pending")}
            />
          </div>

          {view === "dashboard" && (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
              <PieChartStats reports={reports} />
              <LineChartStats reports={reports} />
            </div>
          )}

          {view === "dashboard" && <ReportTable fetchReports={fetchReports} />}
          {view === "reports" && <ReportTable fetchReports={fetchReports} />}
          {view === "pending" && (
            <PendingReportTable fetchReports={fetchReports} />
          )}
          {view === "users" && <UserTable fetchUsers={fetchUsers} />}
          {view === "regions" && <RegionTable setUsers={setUsers} />}
        </div>
      </div>
    </div>
  );
}
