import { Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  User,
  MessageSquare,
  Clock,
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

export function ReportCardDetails({ report }) {
  const CrimeIcon = getCrimeTypeIcon(report.crimeType);
  const crimeColor = getCrimeTypeColor(report.crimeType);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Today";
    if (diffDays === 2) return "Yesterday";
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return date.toLocaleDateString("en-GB");
  };

  return (
    <Link
      to={`/crime/${report._id}`}
      className="block h-full hover:scale-105 transition-all duration-300 group"
    >
      <Card className="h-full overflow-hidden border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1 bg-white">
        <CardHeader className=" relative">
          <div className="relative h-48 overflow-hidden rounded-xl">
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
              style={{
                height: "100%",
                width: "100%",
                zIndex: 10,
              }}
              className="rounded-t-lg"
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={report.position} />
            </MapContainer>

            <div className="absolute top-3 left-3 z-10">
              <Badge
                className={`${crimeColor} text-white shadow-md hover:shadow-lg transition-shadow flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium`}
              >
                <CrimeIcon className="h-3.5 w-3.5" />
                {report.crimeType}
              </Badge>
            </div>

            <div className="absolute top-3 right-3 z-10">
              <Badge
                variant="secondary"
                className="bg-white/95 text-slate-700 shadow-md backdrop-blur-sm flex items-center gap-1 px-2.5 py-1"
              >
                <Clock className="h-3 w-3" />
                {formatDate(report.date)}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="py-4 px-8 flex-1 flex flex-col">
          <h3 className="font-semibold text-lg text-slate-900 mb-2 line-clamp-2 group-hover:text-blue-700 transition-colors">
            {report.title}
          </h3>

          <div className="flex items-center gap-2 text-slate-600">
            <MapPin className="" />
            <p className="text-sm truncate">{report.street}</p>
          </div>
          <div className="space-y-2.5 mt-auto">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <div className="flex items-center gap-2 flex-1">
                <User className="h-4 w-4 text-slate-400" />
                <div className="flex items-center gap-2">
                  <span className="truncate max-w-24">
                    {report.user?.username}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-slate-600">
              <MessageSquare className="h-4 w-4 text-slate-400" />
              <Badge
                variant="outline"
                className="text-xs px-2 py-0.5 bg-slate-50"
              >
                {report.comments.length}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
