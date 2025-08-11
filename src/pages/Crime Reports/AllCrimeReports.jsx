import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import OptionList from "../../components/OptionList";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import DateSelector from "../../components/DateSelector";

function AllCrimeReports() {
  const reports = useSelector((state) => state.report.reports);
  const [filterType, setFilterType] = useState("Select a crime type");
  const [filterStreet, setFilterStreet] = useState("");
  const [filterDate, setFilterDate] = useState("");

  const filteredReports = reports.filter((r) => {
    return (
      (filterType === "Select a crime type" || r.crimeType === filterType) &&
      (filterStreet === "" ||
        r.street.toLowerCase().includes(filterStreet.toLowerCase())) &&
      (filterDate === "" || r.date === filterDate)
    );
  });

  function clearFilters() {
    setFilterDate("");
    setFilterStreet("");
    setFilterType("Select a crime type");
  }

  return (
    <div className="flex flex-col md:flex-row h-full p-4 gap-4 max-w-7xl mx-auto">
      <aside className="mt-15 md:w-1/4 w-full rounded p-4 shadow-md bg-slate-100 h-fit">
        <h2 className="text-lg font-semibold mb-4">Filter Reports</h2>

        <div className="mb-4">
          <OptionList
            label={"Search by type"}
            crimeType={filterType}
            setCrimeType={setFilterType}
          />
        </div>

        <div className="mb-4">
          <div className="grid w-full max-w-sm items-center gap-3">
            <Label htmlFor="search">Search by street</Label>
            <Input
              type="text"
              id="search"
              placeholder="eg. Mirpur-10"
              value={filterStreet}
              onChange={(e) => setFilterStreet(e.target.value)}
            />
          </div>
        </div>

        <div>
          <DateSelector date={filterDate} setDate={setFilterDate} />
        </div>

        <Button
          onClick={() => clearFilters()}
          className="mt-4 text-sm border border-slate-500 bg-white text-slate-500 hover:text-white hover:bg-slate-500"
        >
          Clear filters
        </Button>
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
            <p className="text-gray-800 text-center">No reports found.</p>
          ) : (
            filteredReports.map((report) => (
              <li
                key={report.id}
                className="rounded p-4 bg-slate-200 hover:bg-slate-400 transition"
              >
                <Link to={`/crime/${report.id}`}>
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold text-lg">
                        {report.crimeType}
                      </h3>
                      <p className="text-gray-600">{report.street}</p>
                      <p className="text-gray-800 text-sm">
                        Date: {report.date}
                      </p>
                      <p className="text-gray-800 text-sm">
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
