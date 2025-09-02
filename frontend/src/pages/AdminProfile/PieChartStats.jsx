import { Card } from "@/components/ui/card";
import { PieChart as PieChartIcon, AlertCircle, Target } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#2563eb",
  "#dc2626",
  "#ea580c",
  "#ca8a04",
  "#9333ea",
  "#059669",
];

export default function PieChartStats({ reports }) {
  const filterdReports = reports.filter(
    (report) => report.status === "approved"
  );

  const crimeCounts = filterdReports.reduce((acc, report) => {
    acc[report.crimeType] = (acc[report.crimeType] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.entries(crimeCounts).map(([name, value]) => ({
    name,
    value,
  }));

  const totalReports = chartData.reduce((sum, item) => sum + item.value, 0);

  if (chartData.length === 0) {
    return (
      <Card className="w-full h-full bg-white/80 backdrop-blur-sm shadow-xl border border-blue-100 rounded-2xl p-6 lg:p-8 hover:shadow-2xl transition-all duration-300">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-100 rounded-xl">
            <PieChartIcon className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 tracking-tight">
            Crime Distribution
          </h3>
        </div>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="p-4 bg-blue-50 rounded-full mb-4">
            <AlertCircle className="w-8 h-8 text-blue-400" />
          </div>
          <p className="text-gray-500 font-medium">
            No approved reports available
          </p>
          <p className="text-gray-400 text-sm mt-1">
            Chart will appear when data is available
          </p>
        </div>
      </Card>
    );
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const percentage = ((data.value / totalReports) * 100).toFixed(1);
      return (
        <div className="bg-white/95 backdrop-blur-sm border border-blue-200 rounded-xl shadow-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: data.payload.fill }}
            ></div>
            <span className="font-semibold text-gray-800">{data.name}</span>
          </div>
          <p className="text-sm text-gray-600">Reports: {data.value}</p>
          <p className="text-sm text-gray-600">Percentage: {percentage}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="w-full bg-white/80 backdrop-blur-sm shadow-xl border border-blue-100 rounded-2xl p-6 lg:p-8 hover:shadow-2xl transition-all duration-300">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg">
          <PieChartIcon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800 tracking-tight">
            Crime Distribution
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Breakdown by crime category
          </p>
        </div>
      </div>

      <div className="relative">
        <div className="bg-gradient-to-br from-blue-25 to-slate-25 rounded-xl p-4 border border-blue-50">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={100}
                paddingAngle={2}
                strokeWidth={2}
                stroke="#ffffff"
              >
                {chartData.map((entry, idx) => (
                  <Cell
                    key={entry.name}
                    fill={COLORS[idx % COLORS.length]}
                    className="hover:opacity-80 transition-opacity duration-200"
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{
                  paddingTop: "20px",
                  fontSize: "12px",
                  color: "#475569",
                }}
                iconType="circle"
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-blue-100">
        <div className="flex items-center justify-center gap-2 text-sm">
          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
          <span className="text-gray-600">Categories: {chartData.length}</span>
        </div>
      </div>
    </Card>
  );
}
