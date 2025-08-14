import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function MyCrimeReports() {
  const user = useSelector((state) => state.auth.user);
  const reports = useSelector((state) => state.report.reports);
  const userReports = reports.filter(
    (report) => report.user === user?.username
  );

  return (
    <div className="sm:px-10 py-6">
      <h1 className="text-2xl font-bold mb-4">My Crime Reports</h1>

      <ul className="grid grid-cols-12 gap-4 ">
        {userReports.length === 0 ? (
          <p className="col-span-12 text-gray-800 text-center">
            No reports found.
          </p>
        ) : (
          userReports.map((report) => (
            <li
              key={report.id}
              className="
          col-span-12
          sm:col-span-6
          lg:col-span-4
          rounded-lg overflow-hidden bg-white border border-slate-200 shadow-sm hover:shadow-md transition
        "
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
                      style={{ height: "180px", width: "100%" }}
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
                      <p>Date: {report.date}</p>
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
