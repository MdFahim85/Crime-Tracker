import { ReportCard } from "./ReportCard";
import { useSelector } from "react-redux";

import { useState, useRef, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import OptionList from "./OptionList";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import DateSelector from "./DateSelector";
import NoReportFound from "../../components/NoReportFound";
import RegionFilter from "./RegionFilter";
import Heatmap from "./Heatmap";
import API from "../../api/axios";
import LoadingSpinner from "../../components/LoadingSpinner";

function AllCrimeReports() {
  const [regions, setRegions] = useState([]);
  const [filterType, setFilterType] = useState("");
  const [filterStreet, setFilterStreet] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [isHeatmap, setIsHeatmap] = useState(false);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await API.get("/reports");
      setReports(response.data.reports);
      setLoading(false);
    } catch (error) {
      setReports([]);
      setLoading(false);
    }
  };

  const fetchRegions = async () => {
    try {
      setLoading(true);
      const res = await API.get("/regions");
      setRegions(res.data.regions);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setRegions([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
    fetchRegions();
  }, []);

  const selectedRegion = () => {
    return regions.find((region) => region.name == filterStreet);
  };

  const region = selectedRegion();

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
      (filterType === "" || r.crimeType === filterType) &&
      (filterStreet === "" ||
        r.street.toLowerCase().includes(filterStreet.toLowerCase())) &&
      (filterDate === "" || r.date === filterDate)
    );
  });

  function clearFilters() {
    setFilterDate("");
    setFilterStreet("");
    setFilterType("");
  }

  if (loading) {
    return <LoadingSpinner />;
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
            <RegionFilter
              street={filterStreet}
              setStreet={setFilterStreet}
              regions={regions}
            />
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

        {!loading &&
        filteredReports.length > 0 &&
        filteredReports.some((r) => r.status === "approved") ? (
          <>
            <main className="col-span-12 md:col-span-9 space-y-4">
              {filteredReports.some((r) => r.status === "approved") && (
                <div className="relative">
                  <Label className="block text-slate-700 mb-2 text-xl">
                    Crime Locations Map
                  </Label>
                  <MapContainer
                    center={
                      region
                        ? [region.latlng[0], region.latlng[1]]
                        : [23.8041, 90.4152]
                    }
                    zoom={region ? 14 : 11}
                    zoomControl={false}
                    style={{ height: "400px", width: "100%" }}
                    className="rounded-md shadow"
                    key={region ? region.name : "default"}
                  >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    {isHeatmap ? <Heatmap points={filteredReports} /> : ""}

                    {region && (
                      <Circle
                        center={[region.latlng[0], region.latlng[1]]}
                        radius={2000}
                        pathOptions={{
                          color: "#eb5247",
                          fillColor: "#eb5247",
                          fillOpacity: 0.1,
                          weight: 2,
                          dashArray: "3, 3",
                        }}
                      />
                    )}
                    {isHeatmap == false &&
                      filteredReports
                        .filter((report) => report.status === "approved")
                        .map((report) => (
                          <Marker
                            key={report._id}
                            position={report.position}
                            eventHandlers={{
                              click: () => scrollToCard(report._id),
                            }}
                          >
                            <Popup>
                              <strong>{report.title}</strong>
                              <br />
                              {report.street}
                              <br />
                              {new Date(report.date).toLocaleDateString(
                                "en-GB"
                              )}
                            </Popup>
                          </Marker>
                        ))}
                  </MapContainer>
                  <Button
                    className={`${
                      isHeatmap
                        ? "bg-slate-500 text-white"
                        : "bg-slate-200 text-slate-500"
                    } cursor-pointer absolute top-12 right-2 z-9998 hover:bg-slate-400 hover:text-white transition duration-300 ease-in-out`}
                    onClick={() => setIsHeatmap(!isHeatmap)}
                  >
                    HeatMap
                  </Button>
                </div>
              )}
            </main>

            <section className="col-span-12 mt-10">
              <hr />
              <Label className="block mt-2 text-slate-700 mb-2 text-xl text-center">
                All Crime Reports
              </Label>
              <ul className="grid grid-cols-12 gap-4">
                {filteredReports
                  .filter((report) => report.status === "approved")
                  .map((report) => (
                    <ReportCard
                      key={report._id}
                      cardRefs={cardRefs}
                      report={report}
                      selectedId={selectedId}
                    />
                  ))}
              </ul>
            </section>
          </>
        ) : (
          <div className="col-span-12 md:col-span-9 space-y-4">
            <NoReportFound />
          </div>
        )}
      </div>
    </div>
  );
}

export default AllCrimeReports;
