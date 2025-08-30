import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { BarChart3, TrendingUp, AlertTriangle } from "lucide-react";

function CrimeBarChart({ userReports }) {
  const crimeCounts = userReports.reduce((acc, report) => {
    acc[report.crimeType] = (acc[report.crimeType] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.entries(crimeCounts).map(([type, count]) => ({
    name: type,
    value: count,
  }));

  const COLORS = [
    "#3B82F6",
    "#F59E0B",
    "#EF4444",
    "#10B981",
    "#8B5CF6",
    "#F97316",
    "#06B6D4",
    "#84CC16",
  ];

  const totalReports = userReports.length;
  const uniqueCrimeTypes = chartData.length;
  const mostReportedCrime = chartData.reduce(
    (max, current) => (current.value > max.value ? current : max),
    chartData[0] || { name: "None", value: 0 }
  );

  return (
    <div className="flex-1 ">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              Crime Analytics
            </h2>
            <p className="text-sm text-slate-600">Reports by crime type</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg border border-blue-100">
          <TrendingUp className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-700">
            {totalReports} Total Reports
          </span>
        </div>
      </div>

      {chartData.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-4 rounded-xl border border-indigo-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm text-indigo-600 font-medium">
                  Crime Types
                </p>
                <p className="text-xl font-bold text-indigo-800">
                  {uniqueCrimeTypes}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-4 rounded-xl border border-orange-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm text-orange-600 font-medium">
                  Most Reported
                </p>
                <p className="text-lg font-bold text-orange-800 truncate">
                  {mostReportedCrime.name}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {chartData.length ? (
        <div className=" rounded-xl p-4">
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 20,
                }}
                barCategoryGap="20%"
              >
                <defs>
                  {COLORS.map((color, index) => (
                    <linearGradient
                      key={index}
                      id={`gradient${index}`}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor={color} stopOpacity={0.8} />
                      <stop offset="100%" stopColor={color} stopOpacity={0.6} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#E2E8F0"
                  opacity={0.7}
                />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12, fill: "#64748B" }}
                  axisLine={{ stroke: "#CBD5E1" }}
                  tickLine={{ stroke: "#CBD5E1" }}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "#64748B" }}
                  axisLine={{ stroke: "#CBD5E1" }}
                  tickLine={{ stroke: "#CBD5E1" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#9bbffa",
                    border: "none",
                    borderRadius: "12px",
                    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
                    color: "white",
                    fontSize: "14px",
                  }}
                  cursor={{ fill: "rgba(59, 130, 246, 0.1)" }}
                />
                <Legend wrapperStyle={{ paddingTop: "20px" }} />
                <Bar
                  dataKey="value"
                  radius={[6, 6, 0, 0]}
                  fill="#fff"
                  name="Number of Reports"
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={`url(#gradient${index % COLORS.length})`}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 bg-slate-50 rounded-xl border-2 border-dashed border-slate-300">
          <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mb-4">
            <BarChart3 className="w-8 h-8 text-slate-400" />
          </div>
          <p className="text-slate-500 text-lg font-medium mb-2">
            No Data Available
          </p>
          <p className="text-slate-400 text-sm text-center max-w-xs">
            No reports have been submitted yet. Chart will appear once you
            submit your first report.
          </p>
        </div>
      )}
    </div>
  );
}

export default CrimeBarChart;
