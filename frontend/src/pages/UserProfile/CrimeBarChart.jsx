import {
  BarChart,
  Bar,
  Cell,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function CrimeBarChart({ userReports }) {
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
    <div className="flex-1 bg-slate-100 shadow-lg rounded-lg p-4 sm:p-6 sm:ml-6">
      <h2 className="text-2xl font-bold mb-6 border-b pb-3">
        Crimes Reported by Type
      </h2>

      {chartData.length ? (
        <div className="h-90 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              width={150}
              height={40}
              data={chartData}
              margin={{
                top: 5,
                right: 30,
                left: 0,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value">
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p className="text-gray-500">No reports yet to display chart.</p>
      )}
    </div>
  );
}

export default CrimeBarChart;
