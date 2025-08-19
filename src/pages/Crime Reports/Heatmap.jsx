import { useMap } from "react-leaflet";
import "leaflet.heat";
import React from "react";

export default function Heatmap({ points }) {
  const map = useMap();

  function getIntensity(report) {
    let intensity = 1; // default

    switch (report.crimeType) {
      case "Murder":
        intensity = 50;
        break;
      case "Robbery":
        intensity = 40;
        break;
      case "Assault":
        intensity = 30;
        break;
      case "Vandalism":
        intensity = 20;
        break;
      case "Drug-related":
        intensity = 10;
        break;
      case "Theft":
        intensity = 5;
        break;
      case "Other":
        intensity = 5;
        break;
      default:
        intensity = 1;
    }

    return intensity;
  }

  React.useEffect(() => {
    if (!map) return;

    const heatLayer = L.heatLayer(
      points.map((p) => [p.position.lat, p.position.lng, getIntensity(p)]),
      { radius: 30, blur: 20, maxZoom: 17 }
    ).addTo(map);

    return () => {
      map.removeLayer(heatLayer);
    };
  }, [map, points]);

  return null;
}
