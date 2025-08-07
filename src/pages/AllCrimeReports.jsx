import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function AllCrimeReports() {
  const reports = useSelector((state) => state.report.reports);
  const [filterType, setFilterType] = useState("");
  const [filterStreet, setFilterStreet] = useState("");
  const [filterDate, setFilterDate] = useState("");

  const filteredReports = reports.filter((r) => {
    return (
      (filterType === "" || r.crimeType === filterType) &&
      (filterStreet === "" ||
        r.street.toLowerCase().includes(filterStreet.toLowerCase())) &&
      (filterDate === "" || r.date === filterDate)
    );
  });

  return (
    <div className="flex flex-col md:flex-row h-full p-4 gap-4 max-w-7xl mx-auto">
      <aside className="mt-15 md:w-1/4 w-full rounded p-4 shadow-sm bg-gray-50 h-fit">
        <h2 className="text-lg font-semibold mb-4">Filter Reports</h2>

        <div className="mb-4">
          <label className="block text-sm mb-1">Crime Type</label>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value="">All Types</option>
            <option value="Robbery">Robbery</option>
            <option value="Assault">Assault</option>
            <option value="Theft">Theft</option>
            <option value="Vandalism">Vandalism</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm mb-1">Street Name</label>
          <input
            type="text"
            value={filterStreet}
            onChange={(e) => setFilterStreet(e.target.value)}
            placeholder="Enter street"
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Date</label>
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>
      </aside>

      <main className="flex-1 space-y-6">
        <h2 className="text-2xl font-semibold">Crime Reports</h2>

        {filteredReports.length > 0 && (
          <MapContainer
            center={[
              filteredReports[0].position.lat,
              filteredReports[0].position.lng,
            ]}
            zoom={13}
            zoomControl={false}
            style={{ height: "400px", width: "100%" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {filteredReports.map((report) => (
              <Marker key={report.id} position={report.position}>
                <Popup>
                  <strong>{report.crimeType}</strong>
                  <br />
                  {report.street}
                  <br />
                  {report.date}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        )}
        <ul className="space-y-4">
          {filteredReports.length === 0 ? (
            <p className="text-gray-500 text-center">No reports found.</p>
          ) : (
            filteredReports.map((report) => (
              <li
                key={report.id}
                className="rounded p-4 bg-emerald-100 hover:bg-emerald-300 transition"
              >
                <Link to={`/crime/${report.id}`}>
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold text-lg">
                        {report.crimeType}
                      </h3>
                      <p className="text-gray-600">{report.street}</p>
                      <p className="text-gray-500 text-sm">
                        Date: {report.date}
                      </p>
                      <p className="text-gray-500 text-sm">
                        Reported By: {report.user}
                      </p>
                    </div>
                  </div>
                </Link>
              </li>
            ))
          )}
        </ul>
      </main>
    </div>
  );
}

export default AllCrimeReports;
