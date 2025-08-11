import { HeatmapLayer } from "react-leaflet-heatmap-layer-v3";
function Heatmap({ reports }) {
  const points = reports.map((report) => [report.lat, report.lng, 1]);
  return (
    <div>
      <HeatmapLayer
        fitBoundsOnLoad
        fitBoundsOnUpdate
        points={points}
        longitudeExtractor={(m) => m[1]}
        latitudeExtractor={(m) => m[0]}
        intensityExtractor={(m) => m[2]}
        radius={25}
        blur={15}
        max={1.0}
      />
    </div>
  );
}

export default Heatmap;
