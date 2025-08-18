import { Label } from "@/components/ui/label";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function Map({ report }) {
  return (
    <>
      <MapContainer
        center={[report.position.lat, report.position.lng]}
        zoom={17}
        minZoom={17}
        maxZoom={17}
        zoomControl={false}
        scrollWheelZoom={false}
        doubleClickZoom={false}
        dragging={false}
        touchZoom={false}
        boxZoom={false}
        keyboard={false}
        tap={false}
        className="rounded-md shadow"
        style={{
          height: "300px",
          width: "100%",
          zIndex: 10,
        }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={[report.position.lat, report.position.lng]}>
          <Popup>
            {report.title} at {report.street}
          </Popup>
        </Marker>
      </MapContainer>
      <Label className="block text-slate-700 my-2 text-xl">
        Crime Location
      </Label>
      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-slate-900 text-md font-medium px-2 py-1 rounded shadow z-20">
        {report.crimeType}
      </div>
    </>
  );
}
