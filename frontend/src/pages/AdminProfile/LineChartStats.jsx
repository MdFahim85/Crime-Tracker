import { Card } from "@/components/ui/card";
import { useMemo } from "react";
import { TrendingUp, AlertCircle } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  Tooltip,
} from "recharts";

export default function AreaChartStats({ reports }) {
  const filterdReports = reports.filter(
    (report) => report.status === "approved"
  );

  const crimeTypes = [
    "Theft",
    "Assault",
    "Robbery",
    "Murder",
    "Vandalism",
    "Drugs",
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
      <Card className="w-full h-full bg-white/80 backdrop-blur-sm shadow-xl border border-blue-100 rounded-2xl p-6 lg:p-8 hover:shadow-2xl transition-all duration-300">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-100 rounded-xl">
            <TrendingUp className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 tracking-tight">
            Crime Trends Analysis
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

  const colors = [
    "#2563eb",
    "#dc2626",
    "#ea580c",
    "#ca8a04",
    "#9333ea",
    "#059669",
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-sm border border-blue-200 rounded-xl shadow-lg p-4">
          <p className="font-semibold text-gray-800 mb-2">{`Date: ${label}`}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              ></div>
              <span className="text-gray-600">{entry.dataKey}:</span>
              <span className="font-medium text-gray-800">{entry.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="w-full bg-white/80 backdrop-blur-sm shadow-xl border border-blue-100 rounded-2xl p-6 lg:p-8 hover:shadow-2xl transition-all duration-300">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg">
          <TrendingUp className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800 tracking-tight">
            Crime Trends Analysis
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Daily crime statistics by category
          </p>
        </div>
      </div>

      <div
        className="w-full bg-gradient-to-br from-blue-25 to-slate-25 rounded-xl p-4 border border-blue-50"
        style={{ minHeight: 280 }}
      >
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart
            data={reportsByDate}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              {crimeTypes.map((type, idx) => (
                <linearGradient
                  key={type}
                  id={`gradient${type}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor={colors[idx]} stopOpacity={0.3} />
                  <stop
                    offset="95%"
                    stopColor={colors[idx]}
                    stopOpacity={0.05}
                  />
                </linearGradient>
              ))}
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e2e8f0"
              strokeOpacity={0.6}
            />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: "#64748b" }}
              tickLine={{ stroke: "#94a3b8" }}
              axisLine={{ stroke: "#cbd5e1" }}
              minTickGap={10}
              interval="preserveStartEnd"
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 11, fill: "#64748b" }}
              tickLine={{ stroke: "#94a3b8" }}
              axisLine={{ stroke: "#cbd5e1" }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{
                paddingTop: "20px",
                fontSize: "12px",
                color: "#475569",
              }}
            />

            {crimeTypes.map((type, idx) => (
              <Area
                key={type}
                type="monotone"
                dataKey={type}
                stroke={colors[idx]}
                strokeWidth={2}
                fillOpacity={1}
                fill={`url(#gradient${type})`}
                activeDot={{
                  r: 4,
                  fill: colors[idx],
                  stroke: "#fff",
                  strokeWidth: 2,
                }}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 pt-6 border-t border-blue-100">
        <div className="flex items-center justify-center text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            <span>Total Reports: {filterdReports.length}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
