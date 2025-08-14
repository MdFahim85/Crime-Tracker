import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import OptionList from "./OptionList";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import DateSelector from "./DateSelector";

function AllCrimeReports() {
  const reports = useSelector((state) => state.report.reports);
  const [filterType, setFilterType] = useState("Select a crime type");
  const [filterStreet, setFilterStreet] = useState("");
  const [filterDate, setFilterDate] = useState("");

  const cardRefs = useRef({});
  const [selectedId, setSelectedId] = useState(null);

  const scrollToCard = (id) => {
    setSelectedId(id);
    const el = cardRefs.current[id];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(() => setSelectedId(null), 500);
    }
  };

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
    <div className="px-5">
      <div>
        <h2 className="text-2xl font-semibold text-center mt-20 mb-0 sm:mb-5">
          Browse Crime Reports
        </h2>
      </div>

      <div className="grid grid-cols-12 gap-4 max-w-7xl mx-auto py-4">
        <aside className="col-span-12 md:col-span-3 mt-9 rounded p-4 shadow-md bg-slate-100 h-fit sm:h-100">
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
            onClick={clearFilters}
            className="mt-4 text-sm"
            variant="primary"
          >
            Clear filters
          </Button>
        </aside>

        {filteredReports.length > 0 ? (
          <>
            {" "}
            <main className="col-span-12 md:col-span-9 space-y-4">
              {filteredReports.length > 0 && (
                <div>
                  <Label className="block text-slate-700 mb-2 text-xl">
                    Crime Locations Map
                  </Label>
                  <MapContainer
                    center={[23.8041, 90.4152]}
                    zoom={11}
                    zoomControl={false}
                    style={{ height: "400px", width: "100%" }}
                    className="rounded-md shadow"
                  >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    {filteredReports.map((report) => (
                      <Marker
                        key={report.id}
                        position={report.position}
                        eventHandlers={{
                          click: () => scrollToCard(report.id),
                        }}
                      >
                        <Popup>
                          <strong>{report.title}</strong>
                          <br />
                          {report.street}
                          <br />
                          {report.date}
                        </Popup>
                      </Marker>
                    ))}
                  </MapContainer>
                </div>
              )}
            </main>
            <section className="col-span-12 mt-10">
              <hr />
              <Label className="block mt-2 text-slate-700 mb-2 text-xl text-center">
                All Crime Reports
              </Label>
              <ul className="grid grid-cols-12 gap-4">
                {filteredReports.map((report) => (
                  <li
                    key={report.id}
                    ref={(el) => (cardRefs.current[report.id] = el)}
                    className={`
                    col-span-12 sm:col-span-6 lg:col-span-4
                    rounded-lg overflow-hidden bg-white border border-slate-200
                    shadow-sm hover:shadow-md transition
                    ${selectedId === report.id ? "ring-2 ring-sky-500" : ""}
                  `}
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
                            <Marker position={report.position} />
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
                ))}
              </ul>
            </section>
          </>
        ) : (
          <div className="col-span-12 md:col-span-9 space-y-4">
            <div className="flex flex-col items-center justify-center py-12 text-center text-slate-500 text-nowrap">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-slate-400 mb-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-xl font-medium">No reports found</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AllCrimeReports;
