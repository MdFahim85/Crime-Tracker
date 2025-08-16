// components/PieChartStats.jsx
import { Card } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useSelector } from "react-redux";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#6372ff"];

export default function PieChartStats() {
  const reports = useSelector((state) => state.report.reports);

  // Count reports per crime type
  const crimeCounts = reports.reduce((acc, report) => {
    acc[report.crimeType] = (acc[report.crimeType] || 0) + 1;
    return acc;
  }, {});

  // Convert to array for Recharts
  const chartData = Object.entries(crimeCounts).map(([name, value]) => ({
    name,
    value,
  }));

  if (chartData.length === 0) {
    return (
      <Card className="w-full max-w-6xl p-4 bg-white shadow-md">
        <h3 className="mb-3 font-semibold">Crime Types Percentage</h3>
        <p className="text-gray-500">No reports available to display chart.</p>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-6xl p-4 bg-slate-100 shadow-md">
      <h2 className="text-xl font-bold text-slate-800 mb-4">Crime Types</h2>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            labelLine={false}
            label={({ name, percent }) =>
              `${name} ${(percent * 100).toFixed(0)}%`
            }
          >
            {chartData.map((entry, idx) => (
              <Cell key={entry.name} fill={COLORS[idx % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
}
