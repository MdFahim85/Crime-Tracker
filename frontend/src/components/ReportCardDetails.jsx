import { Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker } from "react-leaflet";

export function ReportCardDetails({ report }) {
  return (
    <Link to={`/crime/${report._id}`} className="block h-full">
      <div className="grid grid-rows-[220px_auto] h-full">
        <div className="relative p-3 pb-0">
          <div className="relative rounded-md shadow overflow-hidden">
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
                height: "180px",
                width: "100%",
              }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={report.position} />
            </MapContainer>

            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-slate-900 text-md font-medium px-2 py-1 rounded shadow z-[998]">
              {report.crimeType}
            </div>
          </div>
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
  );
}
