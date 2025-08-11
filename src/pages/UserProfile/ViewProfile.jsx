import { useSelector } from "react-redux";
import CrimeBarChart from "../../components/CrimeBarChart";
import MyCrimeReports from "./MyCrimeReports";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

function ViewProfile() {
  const user = useSelector((state) => state.auth.user);
  const regUsers = useSelector((state) => state.register.users);
  const reports = useSelector((state) => state.report.reports);
  const thisUser = regUsers.filter(
    (regUser) => regUser.username === user?.username
  );
  const userReports = reports.filter(
    (report) => report.user === user?.username
  );

  return (
    <div className="flex bg-gray-100 py-20 px-10">
      <div className="w-1/4 h-120 bg-white shadow-lg rounded-lg p-6">
        <div className="flex justify-between items-center border-b pb-3">
          <h2 className="text-xl font-bold">My Profile</h2>
          <Link to="/edit-profile" className="text-slate-500">
            Edit
          </Link>
        </div>
        <div className="space-y-4 text-sm mt-4">
          <div>
            <p className="text-gray-500 ">Name</p>
            <p className="font-medium ">{thisUser[0]?.username}</p>
          </div>
          <div>
            <p className="text-gray-500 ">Joined on</p>
            <p className="font-medium ">{thisUser[0]?.date}</p>
          </div>
          <div>
            <p className="text-gray-500 ">Reports Submitted</p>
            <p className="font-medium ">{userReports.length}</p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-12 w-full">
        <div className="col-span-12">
          <CrimeBarChart userReports={userReports} />
        </div>
        <div className="col-span-12">
          <MyCrimeReports />
        </div>
      </div>
    </div>
  );
}

export default ViewProfile;
