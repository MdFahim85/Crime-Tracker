import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Button from "../components/Button";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function CrimeReports() {
  const allReports = useSelector((state) => state.report.reports);
  const navigate = useNavigate();

  if (!allReports.length) {
    return (
      <div className="max-w-3xl mx-auto mt-15 p-4 space-y-6">
        <div className="p-4 text-red-600 font-semibold">
          No reports found
          <Link to="/report" className="text-blue-600 underline">
            Go back
          </Link>
        </div>
      </div>
    );
  }

  const defaultCenter = { lat: 23.7806, lng: 90.4 };

  return (
    <div className="max-w-6xl mx-auto mt-15 p-4 space-y-6">
      <h2 className="text-2xl font-bold mb-4">All Crime Reports</h2>

      <MapContainer
        center={[defaultCenter.lat, defaultCenter.lng]}
        zoom={13}
        scrollWheelZoom={true}
        style={{ height: "400px", width: "100%" }}
        className="rounded-md shadow-md"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {allReports.map((report) => (
          <Marker
            key={report.id}
            position={[report.position.lat, report.position.lng]}
          >
            <Popup>
              {report.crimeType} - {report.street}
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {allReports.map((report) => (
          <div
            key={report.id}
            onClick={() => navigate(`/crime/${report.id}`)}
            className="cursor-pointer border border-gray-200 shadow-sm rounded-lg p-4 hover:shadow-md hover:bg-gray-50 transition-all"
          >
            <h3 className="text-xl font-semibold text-blue-700">
              {report.crimeType}
            </h3>
            <p className="text-gray-600 mt-1">
              <strong>Street:</strong> {report.street}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
