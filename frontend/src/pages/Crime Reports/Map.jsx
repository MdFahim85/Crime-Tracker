import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Badge } from "@/components/ui/badge";
import {  
  Shield,
  AlertTriangle,
  CircleAlert,
  PocketKnife,
  Smartphone,
  Zap,
} from "lucide-react";

const getCrimeTypeIcon = (crimeType) => {
  const iconMap = {
    theft: Smartphone,
    assault: Shield,
    robbery: CircleAlert,
    murder: PocketKnife,
    vandalism: Zap,
    drugs: AlertTriangle,
    other: AlertTriangle,
  };

  const normalizedType = crimeType.toLowerCase();
  for (const [key, Icon] of Object.entries(iconMap)) {
    if (normalizedType.includes(key)) {
      return Icon;
    }
  }
  return AlertTriangle;
};

const getCrimeTypeColor = (crimeType) => {
  const colorMap = {
    theft: "bg-orange-500",
    assault: "bg-orange-600",
    robbery: "bg-red-500",
    murder: "bg-red-600",
    vandalism: "bg-yellow-500",
    drugs: "bg-yellow-500",
    other: "bg-gray-500",
  };

  const normalizedType = crimeType.toLowerCase();
  for (const [key, color] of Object.entries(colorMap)) {
    if (normalizedType.includes(key)) {
      return color;
    }
  }
  return "bg-gray-500";
};

export default function Map({ report }) {
  const CrimeIcon = getCrimeTypeIcon(report.crimeType);
  const crimeColor = getCrimeTypeColor(report.crimeType);
  return (
    <div className="relative w-full">
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
        className="rounded-xl shadow-lg border border-slate-200"
        style={{
          height: "300px",
          width: "100%",
          zIndex: 10,
        }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={[report.position.lat, report.position.lng]}>
          <Popup>
            <div className="text-slate-800 text-base font-semibold">
              {report.title}
            </div>
            <div className="text-sm text-slate-600">{report.street}</div>
          </Popup>
        </Marker>
      </MapContainer>
      <div className="absolute top-3 left-3 z-10">
        <Badge
          className={`${crimeColor} text-white shadow-md hover:shadow-lg transition-shadow flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium`}
        >
          <CrimeIcon className="h-3.5 w-3.5" />
          {report.crimeType}
        </Badge>
      </div>
    </div>
  );
}
