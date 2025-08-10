import { useSelector } from "react-redux";
import {
  BarChart,
  Bar,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function ViewProfile() {
  const user = useSelector((state) => state.auth.user);
  const reports = useSelector((state) => state.report.reports);

  const userReports = reports.filter((report) => report.userId === user.id);

  const crimeCounts = userReports.reduce((acc, report) => {
    acc[report.crimeType] = (acc[report.crimeType] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.entries(crimeCounts).map(([type, count]) => ({
    name: type,
    value: count,
  }));

  const COLORS = ["#3B82F6", "#F59E0B", "#EF4444", "#10B981", "#8B5CF6"];

  return (
    <div className="flex min-h-screen bg-gray-100 py-20 px-10">
      <div className="w-1/4 bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-6 border-b pb-3">My Profile</h2>
        <div className="space-y-4">
          <div>
            <p className="text-gray-500 text-sm">Name</p>
            <p className="font-semibold">{user?.username}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Reports Submitted</p>
            <p className="font-semibold">{userReports.length}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-white shadow-lg rounded-lg p-6 ml-6">
        <h2 className="text-2xl font-bold mb-6 border-b pb-3">
          Crimes Reported by Type
        </h2>

        {chartData.length ? (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart>
              <Bar
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} (${(percent * 100).toFixed(0)}%)`
                }
                outerRadius={120}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Bar>
              <Tooltip />
              <Legend />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500">No reports yet to display chart.</p>
        )}
      </div>
    </div>
  );
}

export default ViewProfile;
