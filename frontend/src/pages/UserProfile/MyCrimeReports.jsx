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
import NoReportFound from "../../components/NoReportFound";
import API from "../../api/axios";
import LoadingSpinner from "../../components/LoadingSpinner";

function MyCrimeReports() {
  const [filter, setFilter] = useState("all");
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await API.get("/reports/my");
      setReports(response.data.reports);
      setLoading(false);
    } catch (error) {
      setReports([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const filteredReports =
    filter === "all"
      ? reports
      : reports.filter((report) => report.status === filter);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="sm:px-10 py-6">
      <h1 className="text-2xl font-bold mb-4">My Crime Reports</h1>

      <div className="mb-6 w-48 z-99">
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Filter Reports" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Reports</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <ul className="grid grid-cols-12 gap-4">
        {filteredReports.length === 0 ? (
          <div className="col-span-12">
            <NoReportFound />
          </div>
        ) : (
          filteredReports.map((report) => (
            <li
              key={report._id}
              className="col-span-12 md:col-span-6 rounded-lg overflow-hidden bg-white border border-slate-200 shadow-sm hover:shadow-md transition"
            >
              <Link to={`/crime/${report._id}`} className="block h-full">
                <div className="grid grid-rows-[220px_auto] h-full">
                  <div className="p-3 pb-0">
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
                      style={{ height: "180px", width: "100%", zIndex: "10" }}
                      className="rounded-md shadow"
                    >
                      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                      <Marker position={report.position}></Marker>
                    </MapContainer>
                  </div>

                  <div className="p-4 pt-0 bg-white flex justify-between">
                    <Label className="block text-slate-700 text-xl">
                      Crime Location
                    </Label>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        report.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : report.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : report.status === "rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {report.status}
                    </span>
                  </div>
                  <div className="p-4 pt-0">
                    <h3 className="font-semibold text-lg text-slate-900">
                      {report.title}
                    </h3>

                    <p className="text-slate-600 mt-1">{report.street}</p>
                    <div className="mt-2 text-sm text-slate-700 space-y-1 pt-2">
                      <p>
                        <strong>Date:</strong>{" "}
                        {new Date(report.date).toLocaleDateString("en-GB")}
                      </p>
                      <p>
                        <strong>Author:</strong> {report.user.username}
                      </p>
                      <p>
                        <strong>Total Comments:</strong>{" "}
                        {report.comments.length > 0
                          ? report.comments.length
                          : "No comments yet"}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default MyCrimeReports;
