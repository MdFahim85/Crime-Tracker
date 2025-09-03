import { useEffect, useState } from "react";
import {
  Calendar,
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  Edit3,
  ChartColumnDecreasingIcon,
} from "lucide-react";
import CrimeBarChart from "./CrimeBarChart";
import MyCrimeReports from "./MyCrimeReports";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import API from "../../api/axios";
import LoadingSpinner from "../../components/LoadingSpinner";
import UserReportsTable from "./UserReportsTable";

function ViewProfile() {
  const [user, setUser] = useState("");
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("analytics");

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await API.get("/reports/my");
      setReports(response.data.reports);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setReports([]);
      setLoading(false);
    }
  };
  const fetchUser = async () => {
    try {
      setLoading(true);
      const response = await API.get("/users/profile");
      setUser(response.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      throw new Error("Failed to fetch user profile");
    }
  };

  useEffect(() => {
    fetchReports();
    fetchUser();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  const approvedReports = reports.filter((r) => r.status === "approved");
  const pendingReports = reports.filter((r) => r.status === "pending");
  const rejectedReports = reports.filter((r) => r.status === "rejected");

  const joinDate = user ? user.date.split("T")[0] : "N/A";

  return (
    <div className="flex flex-col px-4 sm:px-0 py-10 max-w-7xl mx-auto gap-6 sm:mt-10 md:mt-16 bg-gradient-to-br min-h-screen">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/4 bg-white shadow-xl rounded-2xl p-6 mt-10 sm:mt-0 border border-slate-200">
          <div className="flex justify-between items-center border-b border-slate-200 pb-4 mb-6">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-x-3">
              <div className="relative">
                <img
                  className="w-14 h-14 rounded-full border-4 border-blue-100 shadow-lg object-cover"
                  src={
                    user?.image?.url ||
                    "https://imgs.search.brave.com/6G4l561oIhgssjfbYvozwAIa5jx6fv6YhMrFjEGbdhM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4x/Lmljb25maW5kZXIu/Y29tL2RhdGEvaWNv/bnMvYXZhdGFyLXZv/bC05LzUxMi80LTEy/OC5wbmc"
                  }
                  alt="Profile Picture"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span>{user.username}</span>
                </div>
              </div>
            </h2>
            <Link to="/edit-profile">
              <Button className="border border-blue-500 bg-white text-blue-500 hover:bg-blue-500 hover:text-white transition-all duration-200 shadow-md hover:shadow-lg">
                <Edit3 className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </Link>
          </div>

          <div className="flex flex-col justify-between">
            <div>
              <div className="py-3 rounded-lg bg-slate-50 px-4 mb-6 border border-slate-200">
                <p className="text-slate-600 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-500" />
                  <span className="font-bold text-slate-800">
                    Joined on : {joinDate}
                  </span>
                </p>
              </div>
              <div
                onClick={() => setView("analytics")}
                className="py-3 rounded-lg bg-slate-50 px-4 mb-6 border border-slate-200 hover:cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out"
              >
                <p className="text-slate-600 flex items-center gap-2">
                  <ChartColumnDecreasingIcon className="w-4 h-4 text-slate-500" />
                  <span className="font-bold text-slate-800">Analytics</span>
                </p>
              </div>
              <div className="pt-2">
                <h2 className="text-lg text-slate-700 font-bold mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-slate-600" />
                  Report Summary
                </h2>
                <div className="space-y-3">
                  <div
                    onClick={() => setView("submitted")}
                    className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100 hover:cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out"
                  >
                    <p className="text-slate-600 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-500" />
                      Submitted :{" "}
                      <span className="font-bold text-slate-800 text-lg">
                        {reports.length}
                      </span>
                    </p>
                  </div>
                  <div
                    onClick={() => setView("approved")}
                    className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-100 hover:cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out"
                  >
                    <p className="text-slate-600 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Approved :{" "}
                      <span className="font-bold text-green-700 text-lg">
                        {approvedReports.length}
                      </span>
                    </p>
                  </div>
                  <div
                    onClick={() => setView("pending")}
                    className="bg-gradient-to-r from-yellow-50 to-amber-50 p-4 rounded-xl border border-yellow-100 hover:cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out"
                  >
                    <p className="text-slate-600 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-yellow-500" />
                      Pending :{" "}
                      <span className="font-bold text-yellow-700 text-lg">
                        {pendingReports.length}
                      </span>
                    </p>
                  </div>
                  <div
                    onClick={() => setView("rejected")}
                    className="bg-gradient-to-r from-red-50 to-rose-50 p-4 rounded-xl border border-red-100 hover:cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out"
                  >
                    <p className="text-slate-600 flex items-center gap-2">
                      <XCircle className="w-4 h-4 text-red-500" />
                      Rejected :{" "}
                      <span className="font-bold text-red-700 text-lg">
                        {rejectedReports.length}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 ">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 h-full">
            {view == "analytics" && <CrimeBarChart userReports={reports} />}
            {view == "submitted" && <UserReportsTable view={view} />}
            {view == "approved" && <UserReportsTable view={view} />}
            {view == "rejected" && <UserReportsTable view={view} />}
            {view == "pending" && <UserReportsTable view={view} />}
          </div>
        </div>
      </div>

      <div className="w-full">
        <MyCrimeReports />
      </div>
    </div>
  );
}

export default ViewProfile;
