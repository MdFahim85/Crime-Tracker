import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function Home() {
  const reports = useSelector((state) => state.report.reports);
  const recentReports = [...reports]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 6);

  return (
    <div className="flex flex-col min-h-screen bg-slate-800">
      <div className="flex flex-col gap-y-5 justify-center items-center h-[80vh] bg-[url(/bg.jpg)] bg-cover bg-center bg-slate-800 bg-blend-overlay">
        <div className="px-2 space-y-4 text-center">
          <h1 className="py-2 text-xl md:text-3xl xl:text-6xl text-white font-semibold">
            CrimeTracker
          </h1>
          <h3 className="text-lg md:text-2xl xl:text-3xl text-white font-semibold">
            Report, Track, Prevent - For a Safer Tomorrow
          </h3>
          <p className="text-wrap text-sm md:text-lg text-white font-medium">
            Safeguarding Together - Your Bridge to a Secure Environment
          </p>
        </div>
        <Link to="/report">
          <Button className="bg-slate-500 text-white hover:bg-slate-700">
            Report a Crime
          </Button>
        </Link>
      </div>

      <section className="bg-white w-full py-10 px-4 md:px-8 flex flex-col items-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">
          Recent Crime Reports
        </h2>

        {recentReports.length > 0 ? (
          <ul className="w-full max-w-7xl grid grid-cols-12 gap-4">
            {recentReports.map((report) => (
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
                        <Marker position={report.position} />
                      </MapContainer>
                    </div>

                    <div className="p-4 pt-0">
                      <h3 className="font-semibold text-lg text-slate-900">
                        {report.title || report.crimeType}
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
        ) : (
          <p className="text-slate-500">No recent reports found.</p>
        )}

        <Link to="/allreports" className="mt-6">
          <Button className="bg-slate-500 text-white hover:bg-slate-700">
            View All Reports
          </Button>
        </Link>
      </section>

      <footer className="bg-slate-900 text-white text-center py-4 mt-auto">
        © 2025 All rights reserved
      </footer>
    </div>
  );
}

export default Home;
