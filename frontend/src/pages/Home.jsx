import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ReportCardDetails } from "../components/ReportCardDetails";
import "leaflet/dist/leaflet.css";
import {
  Area,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useMemo, useState } from "react";
import Footer from "../components/Footer";
import LoadingSpinner from "../components/LoadingSpinner";
import API from "../api/axios";
import {
  TrendingUp,
  AlertTriangle,
  Eye,
  ArrowRight,
  BarChart3,
  MapPin,
} from "lucide-react";

function Home() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await API.get("/reports");
      setReports(response.data.reports);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setReports([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const approvedReports = reports.filter((r) => r.status === "approved");

  const recentReports = [...approvedReports]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 6);

  const reportsByMonth = useMemo(() => {
    const counts = {};
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "June",
      "July",
      "Aug",
      "Sept",
      "Oct",
      "Nov",
      "Dec",
    ];

    approvedReports.forEach(({ date }) => {
      const reportDate = new Date(date);
      const year = reportDate.getFullYear();
      const month = reportDate.getMonth();
      const monthKey = `${year}-${String(month + 1).padStart(2, "0")}`;
      const monthLabel = `${monthNames[month]} ${year}`;

      if (!counts[monthKey]) {
        counts[monthKey] = { month: monthLabel, count: 0, sortKey: monthKey };
      }
      counts[monthKey].count += 1;
    });

    return Object.values(counts)
      .sort((a, b) => a.sortKey.localeCompare(b.sortKey))
      .map(({ month, count }) => ({ month, count }));
  }, [approvedReports]);

  const stats = useMemo(() => {
    const totalReports = approvedReports.length;
    const thisWeek = approvedReports.filter((r) => {
      const reportDate = new Date(r.date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return reportDate >= weekAgo;
    }).length;

    const crimeTypes = {};
    approvedReports.forEach((r) => {
      crimeTypes[r.crimeType] = (crimeTypes[r.crimeType] || 0) + 1;
    });
    const mostCommonCrime = Object.entries(crimeTypes).sort(
      ([, a], [, b]) => b - a
    )[0];

    return {
      totalReports,
      thisWeek,
      mostCommonCrime: mostCommonCrime ? mostCommonCrime[0] : "N/A",
    };
  }, [approvedReports]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <section className="relative min-h-[85vh] flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-[url(/bg.jpg)] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <h1 className="text-4xl md:text-6xl xl:text-7xl font-bold text-white mb-6 leading-tight">
            <span className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              CrimeTracker
            </span>
          </h1>

          <h2 className="text-xl md:text-2xl xl:text-3xl text-slate-200 font-medium mb-4">
            Report, Track, Prevent - For a Safer Tomorrow
          </h2>

          <p className="text-base md:text-lg text-slate-400 mb-8 max-w-2xl mx-auto leading-relaxed">
            Safeguarding Together - Your Bridge to a Secure Environment. Join
            our community in creating safer neighborhoods through collaborative
            reporting and awareness.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              asChild
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <Link to="/allreports" className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                View Map & Reports
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
      <section className="py-12 px-4 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">
                      Total Reports
                    </p>
                    <p className="text-3xl font-bold text-slate-900">
                      {stats.totalReports}
                    </p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <BarChart3 className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">
                      This Week
                    </p>
                    <p className="text-3xl font-bold text-slate-900">
                      {stats.thisWeek}
                    </p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">
                      Most Common
                    </p>
                    <p className="text-lg font-bold text-slate-900 capitalize">
                      {stats.mostCommonCrime}
                    </p>
                  </div>
                  <div className="p-3 bg-orange-100 rounded-full">
                    <AlertTriangle className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-12 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                    <BarChart3 className="w-6 h-6 text-blue-600" />
                    Crime Statistics
                  </CardTitle>
                  <CardDescription className="text-slate-600 mt-1">
                    Monthly crime reports over time
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {reportsByMonth.length > 0 ? (
                <div className="w-full" style={{ minHeight: 300 }}>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={reportsByMonth}>
                      <defs>
                        <linearGradient
                          id="colorGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#3b82f6"
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor="#3b82f6"
                            stopOpacity={0.05}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis
                        dataKey="month"
                        tick={{ fontSize: 12, fill: "#64748b" }}
                        tickLine={{ stroke: "#cbd5e1" }}
                        axisLine={{ stroke: "#cbd5e1" }}
                        textAnchor="end"
                        height={80}
                        interval={0}
                      />
                      <YAxis
                        allowDecimals={false}
                        tick={{ fontSize: 12, fill: "#64748b" }}
                        tickLine={{ stroke: "#cbd5e1" }}
                        axisLine={{ stroke: "#cbd5e1" }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #e2e8f0",
                          borderRadius: "8px",
                          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                        }}
                        labelFormatter={(label) => `Month: ${label}`}
                        formatter={(value) => [`${value} reports`, "Reports"]}
                      />
                      <Area
                        type="monotone"
                        dataKey="count"
                        stroke="#3b82f6"
                        fill="url(#colorGradient)"
                        strokeWidth={3}
                        activeDot={{
                          r: 6,
                          fill: "#3b82f6",
                          strokeWidth: 2,
                          stroke: "white",
                        }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="flex items-center justify-center h-64 text-slate-500">
                  <div className="text-center">
                    <BarChart3 className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                    <p>No reports available to display chart</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="py-12 px-4 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
                <MapPin className="w-8 h-8 text-blue-600" />
                Recent Crime Reports
              </h2>
              <p className="text-slate-600 mt-2">
                Latest incidents reported by the community
              </p>
            </div>
            {recentReports.length > 6 && (
              <Button asChild variant="outline" className="hidden sm:flex">
                <Link to="/allreports" className="flex items-center gap-2">
                  View All
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            )}
          </div>

          {recentReports.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentReports.map((report) => (
                  <ReportCardDetails key={report._id} report={report} />
                ))}
              </div>
            </>
          ) : (
            <Card className="border-0 shadow-md">
              <CardContent className="p-12">
                <div className="text-center text-slate-500">
                  <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                  <h3 className="text-xl font-semibold mb-2">
                    No Recent Reports
                  </h3>
                  <p>
                    No recent reports found. Be the first to report an incident.
                  </p>
                  <Button asChild className="mt-4">
                    <Link to="/report">Report an Incident</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Home;
