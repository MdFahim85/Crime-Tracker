import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import RegionFilter from "./RegionFilter";
import API from "../../api/axios";
import { MapPin, Search, Globe } from "lucide-react";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
});

function LocationPicker({ setReportData }) {
  useMapEvents({
    async click(e) {
      const latlng = e.latlng;
      setReportData((prev) => ({ ...prev, latlng }));

      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${latlng.lat}&lon=${latlng.lng}&format=json`
        );
        const data = await res.json();
        if (data && data.display_name) {
          setReportData((prev) => ({ ...prev, street: data.display_name }));
        } else {
          setReportData((prev) => ({ ...prev, street: "Unknown location" }));
        }
      } catch (err) {
        console.error("Reverse geocoding failed", err);
        setReportData((prev) => ({
          ...prev,
          street: "Error fetching location",
        }));
      }
    },
  });
  return null;
}

function SearchFly({ latlng }) {
  const map = useMap();
  useEffect(() => {
    if (latlng) {
      map.flyTo(latlng, 16);
    }
  }, [latlng, map]);
  return null;
}

function ReportMap({ reportData, setReportData }) {
  const [filterStreet, setFilterStreet] = useState("");
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(true);

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
    fetchRegions();
  }, []);

  const selectedRegion = () => {
    return regions.find((region) => region.name == filterStreet);
  };

  const region = selectedRegion();

  const handleSearch = async () => {
    if (!reportData.street.trim()) {
      toast.error("Please enter a location");
      return;
    }
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          reportData.street
        )}&format=json`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        setReportData((prev) => ({
          ...prev,
          latlng: { lat: parseFloat(lat), lng: parseFloat(lon) },
        }));
      } else {
        toast.error("Location not found.");
      }
    } catch (err) {
      console.error("Geocoding failed", err);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="overflow-hidden">
      <div className="px-0 py-4 space-y-4">
        <div className="flex flex-col lg:flex-row gap-3">
          <RegionFilter
            street={filterStreet}
            setStreet={setFilterStreet}
            regions={regions}
          />
          <div className="flex gap-2 flex-1">
            <Input
              type="text"
              value={reportData.street}
              onChange={(e) =>
                setReportData({ ...reportData, street: e.target.value })
              }
              onKeyDown={handleKeyDown}
              placeholder="Search for a location..."
              className="flex-1 border-2 border-slate-200 focus:border-blue-400 transition-colors"
            />
            <Button
              onClick={handleSearch}
              className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white shadow"
            >
              <Search className="w-4 h-4" />
              Search
            </Button>
          </div>
        </div>
      </div>

      <div className="h-[400px] ">
        <MapContainer
          center={[23.8103, 90.4125]}
          zoom={13}
          zoomControl={false}
          className="h-full w-full"
          style={{ zIndex: "1" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
          <LocationPicker setReportData={setReportData} />
          {region && <SearchFly latlng={[region.lat, region.lng]} />}
          {reportData.latlng && <SearchFly latlng={reportData.latlng} />}
          {reportData.latlng && <Marker position={reportData.latlng} />}
        </MapContainer>
      </div>
    </div>
  );
}

export default ReportMap;
