import { useSelector } from "react-redux";
import CrimeBarChart from "./CrimeBarChart";
import MyCrimeReports from "./MyCrimeReports";
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
    <div className="flex flex-col md:flex-row px-4 sm:px-0 py-10 max-w-7xl mx-auto gap-6 sm:mt-10 ">
      <div className="w-full md:w-1/4 h-fit bg-slate-100 shadow-lg rounded-lg p-6 mt-10 sm:mt-0">
        <div className="flex justify-between items-center border-b pb-3">
          <h2 className="text-xl font-bold">My Profile</h2>
          <Link
            to="/edit-profile"
            className="text-slate-500 text-sm hover:underline"
          >
            Edit
          </Link>
        </div>
        <div className="space-y-4 text-sm mt-4">
          <div>
            <p className="text-gray-500">Name</p>
            <p className="font-medium">{thisUser[0]?.username}</p>
          </div>
          <div>
            <p className="text-gray-500">Joined on</p>
            <p className="font-medium">{thisUser[0]?.date}</p>
          </div>
          <div>
            <p className="text-gray-500">Reports Submitted</p>
            <p className="font-medium">{userReports.length}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-12 gap-6">
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
