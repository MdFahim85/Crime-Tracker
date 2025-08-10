import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function MyCrimeReports() {
  const user = useSelector((state) => state.auth.user);
  const reports = useSelector((state) => state.report.reports);
  const userReports = reports.filter(
    (report) => report.user === user?.username
  );

  return (
    <div className="px-10 py-6">
      <h1 className="text-2xl font-bold mb-4">My Crime Reports</h1>

      {userReports.length === 0 ? (
        <p className="text-gray-500 text-center">
          You have not reported any crimes yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {userReports.map((report) => (
            <Link to={`/crime/${report.id}`}>
              <div
                key={report.id}
                className="bg-white rounded shadow-sm p-4 border border-slate-300 hover:bg-slate-100 hover:shadow-lg transition duration-150 ease-in-out "
              >
                <h2 className="text-xl font-semibold text-slate-600">
                  {report.crimeType}
                </h2>
                <p className="text-gray-600 text-sm mb-2">
                  Street: {report.street} <br />
                  Date: {report.date}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyCrimeReports;
