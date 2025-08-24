import { Card } from "@/components/ui/card";
import { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import { useReports } from "../../hooks/useReports";

export default function AreaChartStats() {
  const { reports } = useReports();

  const filterdReports = reports.filter(
    (report) => report.status === "approved"
  );

  const crimeTypes = [
    "Theft",
    "Assault",
    "Robbery",
    "Vandalism",
    "Drug-related",
    "Other",
  ];

  const reportsByDate = useMemo(() => {
    const counts = {};

    filterdReports.forEach(({ date, crimeType }) => {
      const day = new Date(date).toLocaleDateString("en-US");

      if (!counts[day]) {
        counts[day] = { date: day };
        crimeTypes.forEach((type) => {
          counts[day][type] = 0;
        });
      }

      counts[day][crimeType] = (counts[day][crimeType] || 0) + 1;
    });

    return Object.values(counts).sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
  }, [reports]);

  if (reportsByDate.length === 0) {
    return (
      <Card className="w-full h-full max-w-6xl p-4 bg-slate-100 shadow-md">
        <h3 className="text-xl font-bold text-slate-800 mb-4">
          Crime Types Statistics
        </h3>
        <p className="text-gray-500">No reports available to display chart.</p>
      </Card>
    );
  }

  const colors = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#6372ff"];

  return (
    <Card className="w-full max-w-6xl p-4 bg-slate-100 shadow-md h-full">
      <h2 className="text-xl font-bold text-slate-800 mb-4">
        Crime Statistics
      </h2>
      <div className="w-full max-w-6xl pt-4" style={{ minHeight: 210 }}>
        <ResponsiveContainer width="100%" height={210} className="text-sm">
          <AreaChart data={reportsByDate}>
            <defs>
              {crimeTypes.map((type, idx) => (
                <linearGradient
                  key={type}
                  id={`color${type}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor={colors[idx]} stopOpacity={0.8} />
                  <stop
                    offset="95%"
                    stopColor={colors[idx]}
                    stopOpacity={0.1}
                  />
                </linearGradient>
              ))}
            </defs>

            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10 }}
              minTickGap={8}
              interval="preserveStartEnd"
            />
            <YAxis allowDecimals={false} />
            <Legend />

            {crimeTypes.map((type, idx) => (
              <Area
                key={type}
                type="monotone"
                dataKey={type}
                stroke={colors[idx]}
                fillOpacity={1}
                fill={`url(#color${type})`}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
