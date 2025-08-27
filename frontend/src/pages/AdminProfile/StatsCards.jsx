import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import API from "../../api/axios";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function StatsCards({
  onUsersClick,
  onReportsClick,
  onPendingClick,
}) {
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState([]);

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
  const pendingReports =
    reports?.filter((r) => r.status === "pending").length || 0;

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <Card
        className="w-full cursor-pointer text-center bg-slate-100"
        onClick={onUsersClick}
      >
        <h3>Total Users</h3>
        <p className="text-3xl font-bold">👤 {users.length}</p>
      </Card>
      <Card
        className="w-full cursor-pointer text-center bg-slate-100"
        onClick={onReportsClick}
      >
        <h3>Total Reports</h3>
        <p className="text-3xl font-bold">📝 {reports.length}</p>
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
