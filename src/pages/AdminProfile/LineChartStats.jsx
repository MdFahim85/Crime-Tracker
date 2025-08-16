import { Card } from "@/components/ui/card";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

export default function LineChartStats() {
  const reports = useSelector((state) => state.report.reports);

  const reportsByDate = useMemo(() => {
    const counts = {};
    reports.forEach(({ date }) => {
      const day = new Date(date).toISOString().slice(0, 10);
      counts[day] = (counts[day] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [reports]);

  if (reportsByDate.length === 0) {
    return (
      <Card className="w-full h-full max-w-6xl p-4 bg-slate-100 shadow-md">
        <h3 className="text-xl font-bold text-slate-800 mb-4">
          Crime Types Percentage
        </h3>
        <p className="text-gray-500">No reports available to display chart.</p>
      </Card>
    );
  }
  return (
    <Card className="w-full max-w-6xl p-4 bg-slate-100 shadow-md h-full">
      <h2 className="text-xl font-bold text-slate-800 mb-4">
        Crime Statistics
      </h2>
      <div className="w-full max-w-6xl pt-4" style={{ minHeight: 210 }}>
        <ResponsiveContainer width="100%" height={210}>
          <LineChart data={reportsByDate}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10 }}
              minTickGap={8}
              interval="preserveStartEnd"
            />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#2563eb"
              activeDot={{ r: 2 }}
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
