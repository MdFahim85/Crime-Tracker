import { useEffect } from "react";
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
        alert("Location not found.");
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
    <div className="mb-6">
      <div className="flex mb-2 gap-2">
        <Input
          type="text"
          value={reportData.street}
          onChange={(e) =>
            setReportData({ ...reportData, street: e.target.value })
          }
          onKeyDown={handleKeyDown}
          placeholder="Search for a location..."
          className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-0 focus:border-2 focus:border-slate-600 "
        />

        <Button
          onClick={handleSearch}
          className="border border-slate-500 bg-white text-slate-500 hover:text-white hover:bg-slate-500"
        >
          Search
        </Button>
      </div>

      <div className="h-[400px] rounded overflow-hidden">
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
          {reportData.latlng && <SearchFly latlng={reportData.latlng} />}
          {reportData.latlng && <Marker position={reportData.latlng} />}
        </MapContainer>
      </div>
    </div>
  );
}

export default ReportMap;
