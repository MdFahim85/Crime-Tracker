import { useSelector } from "react-redux";
import CrimeBarChart from "./CrimeBarChart";
import MyCrimeReports from "./MyCrimeReports";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

function ViewProfile() {
  const user = useSelector((state) => state.auth.user);
  const regUsers = useSelector((state) => state.register.users);

  const thisUser = regUsers.filter(
    (regUser) => regUser.username === user?.username
  );
  const reports = useSelector((state) => state.report.reports);

  const userReports = reports.filter(
    (report) => report.user === user?.username
  );
  const approvedReports = userReports.filter((r) => r.status === "approved");

  return (
    <div className="flex flex-col px-4 sm:px-8 py-10 max-w-7xl mx-auto gap-6 sm:mt-10">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/4 bg-slate-100 shadow-lg rounded-lg p-6 mt-10 sm:mt-0 ">
          <div className="flex justify-between items-center border-b pb-3 mb-4">
            <h2 className="text-xl font-bold text-slate-900">
              👤 {thisUser[0]?.username}
            </h2>
            <Link to="/edit-profile">
              <Button className="border border-slate-500 bg-slate-100 text-slate-500 hover:bg-slate-500 hover:text-white">
                Edit
              </Button>
            </Link>
          </div>

          <div className=" flex flex-col justify-between">
            <div>
              <div className="py-2 rounded ">
                <p className="text-gray-500">
                  📅 Joined On :{" "}
                  <span className="font-bold ">{thisUser[0]?.date}</span>
                </p>
              </div>
              <div className="pt-4">
                <h2 className="text-lg text-slate-700 font-bold">
                  Report Summary
                </h2>
                <div className="text-nowrap py-4">
                  <div className="py-2 rounded ">
                    <p className="text-gray-500">
                      📝 Submitted :{" "}
                      <span className="font-bold ">{userReports.length}</span>
                    </p>
                  </div>
                  <div className="py-2 rounded ">
                    <p className="text-gray-500">
                      ✅ Approved :{" "}
                      <span className="font-bold ">
                        {" "}
                        {approvedReports.length}
                      </span>
                    </p>
                  </div>
                  <div className="py-2 rounded">
                    <p className="text-gray-500">
                      ⌛ Pending :{" "}
                      <span className="font-bold ">
                        {userReports.length - approvedReports.length}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {thisUser[0]?.role === "admin" && (
              <Link
                to="/admin"
                className="block  rounded hover:bg-slate-100 transition-colors duration-200"
              >
                <Button variant="primary">Admin Dashboard</Button>
              </Link>
            )}
          </div>
        </div>

        <div className="flex-1">
          <CrimeBarChart userReports={approvedReports} />
        </div>
      </div>

      <div className="w-full">
        <MyCrimeReports />
      </div>
    </div>
  );
}

export default ViewProfile;
