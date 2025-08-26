import { useEffect, useState } from "react";
import CrimeBarChart from "./CrimeBarChart";
import MyCrimeReports from "./MyCrimeReports";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import API from "../../api/axios";
import LoadingSpinner from "../../components/LoadingSpinner";

function ViewProfile() {
  const [user, setUser] = useState("");
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await API.get("/reports/my");
      setReports(response.data.reports);
      setLoading(false);
    } catch (error) {
      setReports([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await API.get("/users/profile");
        setUser(response.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        throw new Error("Failed to fetch user profile");
      }
    };
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
    <div className="flex flex-col px-4 sm:px-8 py-10 max-w-7xl mx-auto gap-6 sm:mt-10 md:mt-16">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/4 bg-slate-100 shadow-lg rounded-lg p-6 mt-10 sm:mt-0">
          <div className="flex justify-between items-center border-b pb-3 mb-4">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-x-2">
              <img
                className="w-12 h-12 rounded-full"
                src={
                  user?.image?.url ||
                  "https://imgs.search.brave.com/6G4l561oIhgssjfbYvozwAIa5jx6fv6YhMrFjEGbdhM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4x/Lmljb25maW5kZXIu/Y29tL2RhdGEvaWNv/bnMvYXZhdGFyLXZv/bC05LzUxMi80LTEy/OC5wbmc"
                }
                alt="Profile Picture"
              />
              {user.username}
            </h2>
            <Link to="/edit-profile">
              <Button className="border border-slate-500 bg-slate-100 text-slate-500 hover:bg-slate-500 hover:text-white">
                Edit
              </Button>
            </Link>
          </div>

          <div className="flex flex-col justify-between">
            <div>
              <div className="py-2 rounded">
                <p className="text-gray-500">
                  📅 Joined On : <span className="font-bold">{joinDate}</span>
                </p>
              </div>
              <div className="pt-4">
                <h2 className="text-lg text-slate-700 font-bold">
                  Report Summary
                </h2>
                <div className="py-4">
                  <div className="py-2">
                    <p className="text-gray-500">
                      📝 Submitted :{" "}
                      <span className="font-bold">{reports.length}</span>
                    </p>
                  </div>
                  <div className="py-2">
                    <p className="text-gray-500">
                      ✅ Approved :{" "}
                      <span className="font-bold">
                        {approvedReports.length}
                      </span>
                    </p>
                  </div>
                  <div className="py-2">
                    <p className="text-gray-500">
                      ⌛ Pending :{" "}
                      <span className="font-bold">{pendingReports.length}</span>
                    </p>
                  </div>
                  <div className="py-2">
                    <p className="text-gray-500">
                      ❌ Rejected :{" "}
                      <span className="font-bold">
                        {rejectedReports.length}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {user.role === "admin" ||
              (user.role === "master_admin" && (
                <Link
                  to="/admin"
                  className="block rounded hover:bg-slate-100 transition-colors duration-200"
                >
                  <Button variant="primary">Admin Dashboard</Button>
                </Link>
              ))}
          </div>
        </div>

        <div className="flex-1">
          <CrimeBarChart userReports={reports} />
        </div>
      </div>

      <div className="w-full">
        <MyCrimeReports />
      </div>
    </div>
  );
}

export default ViewProfile;
