import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function MyCrimeReports() {
  const user = useSelector((state) => state.auth.user);
  const reports = useSelector((state) => state.report.reports);
  const [filter, setFilter] = useState("all");

  const userReports = reports.filter(
    (report) => report.user === user?.username
  );

  const filteredReports =
    filter === "all"
      ? userReports
      : userReports.filter((report) => report.status === filter);

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
          </SelectContent>
        </Select>
      </div>

      <ul className="grid grid-cols-12 gap-4">
        {filteredReports.length === 0 ? (
          <p className="col-span-12 text-gray-800 text-center">
            No reports found.
          </p>
        ) : (
          filteredReports.map((report) => (
            <li
              key={report.id}
              className="col-span-12 md:col-span-6 rounded-lg overflow-hidden bg-white border border-slate-200 shadow-sm hover:shadow-md transition"
            >
              <Link to={`/crime/${report.id}`} className="block h-full">
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

                  <div className="p-4 pt-0">
                    <h3 className="font-semibold text-lg text-slate-900">
                      {report.title}
                    </h3>
                    <p className="text-slate-600 mt-1">{report.street}</p>
                    <div className="mt-2 text-sm text-slate-700">
                      <p>
                        Date:{" "}
                        {new Date(report.date).toLocaleDateString("en-GB")}
                      </p>
                      <p>Reported By: {report.user}</p>
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
