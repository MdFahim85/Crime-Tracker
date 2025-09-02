import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import API from "../../api/axios";
import { Loader2, Users, FileText, Clock } from "lucide-react";

export default function StatsCards({
  onUsersClick,
  onReportsClick,
  onPendingClick,
}) {
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await API.get("/reports");
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

  const pendingReports =
    reports?.filter((r) => r.status === "pending").length || 0;

  if (loading) {
    return (
      <div className="w-full flex justify-center items-center py-10">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      {/* Users Card */}
      <Card
        onClick={onUsersClick}
        className="cursor-pointer group bg-white/70 backdrop-blur-sm rounded-2xl shadow-md border border-slate-200 p-6 transition hover:shadow-xl hover:scale-105"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-gray-500 text-sm font-medium">Total Users</p>
            <p className="text-2xl font-bold">{users.length}</p>
          </div>
        </div>
      </Card>

      {/* Reports Card */}
      <Card
        onClick={onReportsClick}
        className="cursor-pointer group bg-white/70 backdrop-blur-sm rounded-2xl shadow-md border border-slate-200 p-6 transition hover:shadow-xl hover:scale-105"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-green-100 text-green-600 group-hover:bg-green-600 group-hover:text-white transition">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-gray-500 text-sm font-medium">Total Reports</p>
            <p className="text-2xl font-bold">{reports.length}</p>
          </div>
        </div>
      </Card>

      {/* Pending Reports Card */}
      <Card
        onClick={onPendingClick}
        className="cursor-pointer group bg-white/70 backdrop-blur-sm rounded-2xl shadow-md border border-slate-200 p-6 transition hover:shadow-xl hover:scale-105"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-orange-100 text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-gray-500 text-sm font-medium">Pending Reports</p>
            <p className="text-2xl font-bold">{pendingReports}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
