import { Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import NoReportFound from "../../components/NoReportFound";
import API from "../../api/axios";
import LoadingSpinner from "../../components/LoadingSpinner";
import { Pagination } from "../../components/Pagination";
import {
  MapPin,
  Filter,
  FileText,
  CheckCircle,
  MessageSquare,
  Clock,
  XCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

function MyCrimeReports() {
  const [filter, setFilter] = useState("all");
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [next, setNext] = useState();
  const [prev, setPrev] = useState();

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await API.get(`/reports/my?page=${page}&limit=10`);
      setReports(response.data.reports);
      setNext(response.data.next);
      setPrev(response.data.prev);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setReports([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [page]);

  const filteredReports =
    filter === "all"
      ? reports
      : reports.filter((report) => report.status === filter);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-3 h-3" />;
      case "pending":
        return <Clock className="w-3 h-3" />;
      case "rejected":
        return <XCircle className="w-3 h-3" />;
      default:
        return <FileText className="w-3 h-3" />;
    }
  };

  return (
    <div className="sm:px-0 py-6 min-h-screen">
      <div className="mt-4 mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              My Crime Reports
            </h1>
            <p className="text-slate-600">
              Track and manage your submitted reports
            </p>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <Filter className="w-5 h-5 text-slate-600" />
            <Label className="text-lg font-semibold text-slate-700">
              Filter Reports
            </Label>
          </div>
          <div className="w-full max-w-xs">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-full border-2 border-slate-200 hover:border-blue-300 transition-colors duration-200">
                <SelectValue placeholder="Filter Reports" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  All Reports
                </SelectItem>
                <SelectItem
                  value="approved"
                  className="flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Approved
                </SelectItem>
                <SelectItem value="pending" className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-yellow-500" />
                  Pending
                </SelectItem>
                <SelectItem
                  value="rejected"
                  className="flex items-center gap-2"
                >
                  <XCircle className="w-4 h-4 text-red-500" />
                  Rejected
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <ul className="grid grid-cols-12 gap-6">
        {filteredReports.length === 0 ? (
          <div className="col-span-12">
            <NoReportFound />
          </div>
        ) : (
          filteredReports.map((report) => (
            <li
              key={report._id}
              className="col-span-12 lg:col-span-6 xl:col-span-4 rounded-2xl overflow-hidden bg-white border border-slate-200  transition-all duration-300 group"
            >
              <Link
                to={`/crime/${report._id}`}
                className="block h-full hover:scale-105 transition-all duration-300 group"
              >
                <Card className="h-full gap-y-0 overflow-hidden border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1 bg-white">
                  <CardHeader className="relative">
                    <div className="relative h-48 overflow-hidden rounded-xl">
                      <MapContainer
                        center={[report.position.lat, report.position.lng]}
                        zoom={16}
                        minZoom={16}
                        maxZoom={16}
                        zoomControl={false}
                        scrollWheelZoom={false}
                        doubleClickZoom={false}
                        dragging={false}
                        touchZoom={false}
                        boxZoom={false}
                        keyboard={false}
                        tap={false}
                        style={{
                          height: "100%",
                          width: "100%",
                          zIndex: 10,
                        }}
                        className="rounded-t-lg"
                      >
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <Marker position={report.position} />
                      </MapContainer>
                    </div>
                    <div className="p-0 pt-2 bg-white flex-1 flex flex-col ">
                      <div className="flex justify-end items-start">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                            report.status === "approved"
                              ? "bg-green-100 text-green-800 border border-green-200"
                              : report.status === "pending"
                              ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                              : report.status === "rejected"
                              ? "bg-red-100 text-red-800 border border-red-200"
                              : "bg-gray-100 text-gray-800 border border-gray-200"
                          }`}
                        >
                          {getStatusIcon(report.status)}
                          {report.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="py-4 px-8 flex-1 flex flex-col">
                    <h3 className="font-semibold text-lg text-slate-900 mb-2 line-clamp-2 group-hover:text-blue-700 transition-colors">
                      {report.title}
                    </h3>

                    <div className="flex items-center gap-2 text-slate-600">
                      <MapPin className="" />
                      <p className="text-sm truncate">{report.street}</p>
                    </div>
                    <div className="space-y-2.5 mt-2">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <MessageSquare className="h-4 w-4 text-slate-400" />
                        <Badge
                          variant="outline"
                          className="text-xs px-2 py-0.5 bg-slate-50"
                        >
                          {report.comments.length}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </li>
          ))
        )}
      </ul>

      {(next || prev) && (
        <div className="mt-12 flex justify-center">
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-2">
            <Pagination setPage={setPage} prev={prev} page={page} next={next} />
          </div>
        </div>
      )}
    </div>
  );
}

export default MyCrimeReports;
