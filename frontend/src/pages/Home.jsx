import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { ReportCardDetails } from "../components/ReportCardDetails";
import "leaflet/dist/leaflet.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useMemo } from "react";
import Footer from "../components/Footer";

function Home() {
  const reports = useSelector((state) => state.report.reports);

  const approvedReports = reports.filter((r) => r.status === "approved");

  const recentReports = [...approvedReports]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 6);

  const reportsByDate = useMemo(() => {
    const counts = {};
    approvedReports.forEach(({ date }) => {
      const day = new Date(date).toISOString().slice(0, 10);
      counts[day] = (counts[day] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [approvedReports]);

  return (
    <div className="flex flex-col min-h-screen bg-slate-800">
      <div className="flex flex-col gap-y-5 justify-center items-center h-[80vh] bg-[url(/bg.jpg)] bg-cover bg-center bg-slate-800 bg-blend-overlay">
        <div className="px-2 space-y-4 text-center">
          <h1 className="py-2 text-xl md:text-3xl xl:text-6xl text-white font-semibold">
            CrimeTracker
          </h1>
          <h3 className="text-lg md:text-2xl xl:text-3xl text-white font-semibold">
            Report, Track, Prevent - For a Safer Tomorrow
          </h3>
          <p className="text-wrap text-sm md:text-lg text-white font-medium">
            Safeguarding Together - Your Bridge to a Secure Environment
          </p>
        </div>
        <Link to="/report">
          <Button className="bg-slate-500 text-white hover:bg-slate-700">
            Report a Crime
          </Button>
        </Link>
      </div>

      <section className="bg-white w-full py-8 px-0 pe-8 md:pe-0 md:px-8 flex flex-col items-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">
          Crime Statistics
        </h2>
        {reportsByDate.length > 0 ? (
          <div className="w-full max-w-6xl" style={{ minHeight: 210 }}>
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
        ) : (
          <p className="text-slate-500">
            No reports available to display chart..
          </p>
        )}
      </section>

      <section className="bg-white w-full py-8 px-2 md:px-8 flex flex-col items-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">
          Recent Crime Reports
        </h2>

        {recentReports.length > 0 ? (
          <ul className="w-full max-w-7xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentReports.map((report) => (
              <li
                key={report.id}
                className="
                  rounded-lg overflow-hidden bg-white border border-slate-200 shadow-sm hover:shadow-md transition
                  flex flex-col h-full
                "
              >
                <ReportCardDetails report={report} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-slate-500">No recent reports found.</p>
        )}

        <Link to="/allreports" className="mt-6">
          <Button className="bg-slate-500 text-white hover:bg-slate-700">
            View All Reports
          </Button>
        </Link>
      </section>
      <Footer />
    </div>
  );
}

export default Home;
