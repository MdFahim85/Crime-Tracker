import { ReportCard } from "./ReportCard";
import { useState, useRef, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import OptionList from "./OptionList";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import NoReportFound from "../../components/NoReportFound";
import RegionFilter from "./RegionFilter";
import Heatmap from "./Heatmap";
import API from "../../api/axios";
import LoadingSpinner from "../../components/LoadingSpinner";
import { Pagination } from "../../components/Pagination";
import {
  Map,
  Filter,
  Maximize2,
  Minimize2,
  X,
  Layers,
  List,
} from "lucide-react";
import FilterDateRange from "./FilterDateRange";
import CustomDatePicker from "./CustomDatePicker";

function AllCrimeReports() {
  const [regions, setRegions] = useState([]);
  const [filterType, setFilterType] = useState("");
  const [filterStreet, setFilterStreet] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [isHeatmap, setIsHeatmap] = useState(false);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [next, setNext] = useState();
  const [prev, setPrev] = useState();
  const [isFullscreenMap, setIsFullscreenMap] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await API.get(`/reports?page=${page}&limit=12`);
      setReports(response.data.reports);
      setNext(response.data.next);
      setPrev(response.data.prev);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setReports([]);
      setLoading(false);
    }
  };

  const fetchRegions = async () => {
    try {
      const res = await API.get("/regions");
      setRegions(res.data.regions);
    } catch (error) {
      console.log(error);
      setRegions([]);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [page]);

  useEffect(() => {
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

  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const lastWeek = new Date();
  lastWeek.setDate(today.getDate() - 7);

  const lastMonth = new Date();
  lastMonth.setMonth(today.getMonth() - 1);

  const lastYear = new Date();
  lastYear.setYear(today.getFullYear() - 1);

  const [state, setState] = useState({
    startDate: new Date(),
    endDate: new Date(),
  });

  const filteredReports = reports.filter((r) => {
    const reportDate = new Date(r.date);
    return (
      (filterType === "" || r.crimeType === filterType) &&
      (filterStreet === "" ||
        r.street.toLowerCase().includes(filterStreet.toLowerCase())) &&
      (filterDate === "" ||
        (filterDate === "Today" &&
          reportDate.toDateString() === today.toDateString()) ||
        (filterDate === "Yesterday" &&
          reportDate.toDateString() === yesterday.toDateString()) ||
        (filterDate === "Last week" &&
          reportDate >= lastWeek &&
          reportDate <= today) ||
        (filterDate === "Last month" &&
          reportDate >= lastMonth &&
          reportDate <= today) ||
        (filterDate === "Last year" &&
          reportDate >= lastYear &&
          reportDate <= today) ||
        (filterDate === "Custom" &&
          reportDate >= state.startDate &&
          reportDate <= state.endDate))
    );
  });

  const approvedReports = filteredReports.filter(
    (r) => r.status === "approved"
  );

  function clearFilters() {
    setFilterDate("");
    setFilterStreet("");
    setFilterType("");
  }

  const MapComponent = ({ height = "400px" }) => (
    <div className="relative">
      <MapContainer
        center={region ? [region.lat, region.lng] : [23.8041, 90.4152]}
        zoom={region ? 14 : 11}
        zoomControl={false}
        style={{ height, width: "100%", zIndex: 10 }}
        className="rounded-lg shadow-lg"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {isHeatmap ? <Heatmap points={approvedReports} /> : ""}

        {region && (
          <Circle
            center={[region.lat, region.lng]}
            radius={2000}
            pathOptions={{
              color: "#3b82f6",
              fillColor: "#3b82f6",
              fillOpacity: 0.1,
              weight: 2,
              dashArray: "5, 5",
            }}
          />
        )}

        {!isHeatmap &&
          approvedReports.map((report) => (
            <Marker
              key={report._id}
              position={report.position}
              eventHandlers={{
                click: () => !isFullscreenMap && scrollToCard(report._id),
              }}
            >
              <Popup>
                <div className="p-2">
                  <strong className="text-slate-900">{report.title}</strong>
                  <br />
                  <span className="text-slate-600">{report.street}</span>
                  <br />
                  <span className="text-slate-500 text-sm">
                    {new Date(report.date).toLocaleDateString("en-GB")}
                  </span>
                </div>
              </Popup>
            </Marker>
          ))}
      </MapContainer>

      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        <Button
          size="sm"
          variant="default"
          onClick={() => setIsHeatmap(!isHeatmap)}
          className="shadow-lg"
        >
          <Layers className="w-4 h-4 mr-1" />
          {isHeatmap ? "Markers" : "Heatmap"}
        </Button>

        {!isFullscreenMap && (
          <Button
            size="sm"
            variant="default"
            onClick={() => setIsFullscreenMap(true)}
            className="shadow-lg"
          >
            <Maximize2 className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <div className="min-h-screen bg-slate-50 mt-12">
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                Crime Reports Dashboard
              </h1>
              <p className="text-slate-600">
                Explore and analyze crime reports in your area
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-full mx-auto">
          <div className="bg-slate-50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 py-6">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-1">
                  {/* PC Filters */}
                  <div className="hidden lg:block">
                    <Card className={`shadow-lg border-0`}>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Filter className="w-5 h-5 text-blue-600" />
                          Filter Reports
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label className="text-sm font-medium text-slate-700 mb-2 block">
                            Search by Crime Type
                          </Label>
                          <OptionList
                            crimeType={filterType}
                            setCrimeType={setFilterType}
                          />
                        </div>

                        <div>
                          <Label className="text-sm font-medium text-slate-700 mb-2 block">
                            Search by Location
                          </Label>
                          <RegionFilter
                            street={filterStreet}
                            setStreet={setFilterStreet}
                            regions={regions}
                          />
                        </div>

                        <div>
                          {filterDate !== "Custom" ? (
                            <FilterDateRange
                              filterDate={filterDate}
                              setFilterDate={setFilterDate}
                            />
                          ) : (
                            <>
                              <CustomDatePicker
                                state={state}
                                setState={setState}
                                label={"Select start date"}
                              />
                              <CustomDatePicker
                                state={state}
                                setState={setState}
                                label={"Select last date"}
                              />
                            </>
                          )}
                        </div>

                        <Button
                          onClick={clearFilters}
                          variant="outline"
                          className="w-full mt-4 border-slate-300 text-slate-600 hover:bg-slate-50"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Clear Filters
                        </Button>

                        {(filterType || filterStreet || filterDate) && (
                          <div className="pt-2 border-t">
                            <div className="text-xs text-slate-600 mb-2">
                              Active Filters:
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {filterType && (
                                <Badge variant="ghost" className="text-xs">
                                  Type: {filterType}
                                </Badge>
                              )}
                              {filterStreet && (
                                <Badge variant="ghost" className="text-xs">
                                  Location: {filterStreet}
                                </Badge>
                              )}
                              {filterDate && (
                                <Badge variant="ghost" className="text-xs">
                                  Date: {filterDate}
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                  {/* Mobile Filters */}
                  <div className="lg:hidden">
                    <Dialog open={showFilters} onOpenChange={setShowFilters}>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="w-full">
                          <Filter className="w-4 h-4 mr-2" />
                          Show Filters
                          {(filterType || filterStreet || filterDate) && (
                            <Badge className="ml-2 bg-blue-100 text-blue-800">
                              {
                                [filterType, filterStreet, filterDate].filter(
                                  Boolean
                                ).length
                              }
                            </Badge>
                          )}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Filter Crime Reports</DialogTitle>
                        </DialogHeader>
                        <Card className={`shadow-none border-0`}>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-lg flex items-center gap-2">
                              <Filter className="w-5 h-5 text-blue-600" />
                              Filter Reports
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div>
                              <Label className="text-sm font-medium text-slate-700 mb-2 block">
                                Search by Crime Type
                              </Label>
                              <OptionList
                                crimeType={filterType}
                                setCrimeType={setFilterType}
                              />
                            </div>

                            <div>
                              <Label className="text-sm font-medium text-slate-700 mb-2 block">
                                Search by Location
                              </Label>
                              <RegionFilter
                                street={filterStreet}
                                setStreet={setFilterStreet}
                                regions={regions}
                              />
                            </div>

                            <div>
                              {filterDate !== "Custom" ? (
                                <FilterDateRange
                                  filterDate={filterDate}
                                  setFilterDate={setFilterDate}
                                />
                              ) : (
                                <>
                                  <CustomDatePicker
                                    state={state}
                                    setState={setState}
                                    label={"Select start date"}
                                  />
                                  <CustomDatePicker
                                    state={state}
                                    setState={setState}
                                    label={"Select last date"}
                                  />
                                </>
                              )}
                            </div>

                            <Button
                              onClick={clearFilters}
                              variant="outline"
                              className="w-full mt-4 border-slate-300 text-slate-600 hover:bg-slate-50"
                            >
                              <X className="w-4 h-4 mr-2" />
                              Clear Filters
                            </Button>

                            {(filterType || filterStreet || filterDate) && (
                              <div className="pt-2 border-t">
                                <div className="text-xs text-slate-600 mb-2">
                                  Active Filters:
                                </div>
                                <div className="flex flex-wrap gap-1">
                                  {filterType && (
                                    <Badge variant="ghost" className="text-xs">
                                      Type: {filterType}
                                    </Badge>
                                  )}
                                  {filterStreet && (
                                    <Badge variant="ghost" className="text-xs">
                                      Location: {filterStreet}
                                    </Badge>
                                  )}
                                  {filterDate && (
                                    <Badge variant="ghost" className="text-xs">
                                      Date: {filterDate}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>

                <div className="lg:col-span-3 ">
                  {approvedReports.length > 0 ? (
                    <Card className="border-0 shadow-lg overflow-hidden pb-4">
                      <CardHeader>
                        <span className="flex items-center gap-2">
                          <Map className=" text-blue-600" />
                          Crime Locations Map
                        </span>
                        <MapComponent />
                      </CardHeader>
                    </Card>
                  ) : (
                    <NoReportFound />
                  )}
                </div>
              </div>
            </div>
          </div>

          {approvedReports.length > 0 && (
            <div className="bg-slate-50 py-8">
              <div className="max-w-7xl mx-auto px-4">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                    <List className="w-6 h-6 text-blue-600" />
                    Crime Reports
                  </h2>
                  <p className="text-slate-600 mt-1">
                    Detailed view of all crime reports in the selected area
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 list-none">
                  {approvedReports.map((report) => (
                    <ReportCard
                      key={report._id}
                      cardRefs={cardRefs}
                      report={report}
                      selectedId={selectedId}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {(next || prev) && (
          <div className="bg-white border-t">
            <div className="max-w-7xl mx-auto px-4 py-6">
              <Pagination
                setPage={setPage}
                prev={prev}
                page={page}
                next={next}
              />
            </div>
          </div>
        )}
      </div>

      {isFullscreenMap && (
        <div className="fixed inset-0 z-50 bg-white">
          <div className="relative h-full w-full">
            <MapComponent height="100vh" />

            <Button
              size="sm"
              variant="default"
              onClick={() => setIsFullscreenMap(false)}
              className="absolute top-4 left-4 z-10 shadow-lg"
            >
              <Minimize2 className="w-4 h-4 mr-1" />
              Exit Fullscreen
            </Button>

            <div className="absolute top-20 right-4 z-10 w-80 max-h-[80vh] overflow-y-auto hidden lg:block">
              <Card className={`border-0 shadow-none`}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Filter className="w-5 h-5 text-blue-600" />
                    Filter Reports
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-slate-700 mb-2 block">
                      Search by Crime Type
                    </Label>
                    <OptionList
                      crimeType={filterType}
                      setCrimeType={setFilterType}
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-slate-700 mb-2 block">
                      Search by Location
                    </Label>
                    <RegionFilter
                      street={filterStreet}
                      setStreet={setFilterStreet}
                      regions={regions}
                    />
                  </div>

                  <div>
                    {filterDate !== "Custom" ? (
                      <FilterDateRange
                        filterDate={filterDate}
                        setFilterDate={setFilterDate}
                      />
                    ) : (
                      <>
                        <CustomDatePicker
                          state={state}
                          setState={setState}
                          label={"Select start date"}
                        />
                        <CustomDatePicker
                          state={state}
                          setState={setState}
                          label={"Select last date"}
                        />
                      </>
                    )}
                  </div>

                  <Button
                    onClick={clearFilters}
                    variant="outline"
                    className="w-full mt-4 border-slate-300 text-slate-600 hover:bg-slate-50"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Clear Filters
                  </Button>

                  {(filterType || filterStreet || filterDate) && (
                    <div className="pt-2 border-t">
                      <div className="text-xs text-slate-600 mb-2">
                        Active Filters:
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {filterType && (
                          <Badge variant="ghost" className="text-xs">
                            Type: {filterType}
                          </Badge>
                        )}
                        {filterStreet && (
                          <Badge variant="ghost" className="text-xs">
                            Location: {filterStreet}
                          </Badge>
                        )}
                        {filterDate && (
                          <Badge variant="ghost" className="text-xs">
                            Date: {filterDate}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            <div className="lg:hidden absolute bottom-4 right-10  z-10 w-80 max-h-[80vh] overflow-y-auto">
              <Dialog open={showFilters} onOpenChange={setShowFilters}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <Filter className="w-4 h-4 mr-2" />
                    Show Filters
                    {(filterType || filterStreet || filterDate) && (
                      <Badge className="ml-2 bg-blue-100 text-blue-800">
                        {
                          [filterType, filterStreet, filterDate].filter(Boolean)
                            .length
                        }
                      </Badge>
                    )}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Filter Crime Reports</DialogTitle>
                  </DialogHeader>
                  <Card className={`shadow-none border-0`}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Filter className="w-5 h-5 text-blue-600" />
                        Filter Reports
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium text-slate-700 mb-2 block">
                          Search by Crime Type
                        </Label>
                        <OptionList
                          crimeType={filterType}
                          setCrimeType={setFilterType}
                        />
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-slate-700 mb-2 block">
                          Search by Location
                        </Label>
                        <RegionFilter
                          street={filterStreet}
                          setStreet={setFilterStreet}
                          regions={regions}
                        />
                      </div>

                      <div>
                        <FilterDateRange
                          filterDate={filterDate}
                          setFilterDate={setFilterDate}
                        />
                      </div>

                      <Button
                        onClick={clearFilters}
                        variant="outline"
                        className="w-full mt-4 border-slate-300 text-slate-600 hover:bg-slate-50"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Clear Filters
                      </Button>

                      {(filterType || filterStreet || filterDate) && (
                        <div className="pt-2 border-t">
                          <div className="text-xs text-slate-600 mb-2">
                            Active Filters:
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {filterType && (
                              <Badge variant="ghost" className="text-xs">
                                Type: {filterType}
                              </Badge>
                            )}
                            {filterStreet && (
                              <Badge variant="ghost" className="text-xs">
                                Location: {filterStreet}
                              </Badge>
                            )}
                            {filterDate && (
                              <Badge variant="ghost" className="text-xs">
                                Date: {filterDate}
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AllCrimeReports;
