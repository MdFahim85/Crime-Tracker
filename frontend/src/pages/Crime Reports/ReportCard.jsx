import { ReportCardDetails } from "../../components/ReportCardDetails";

import "leaflet/dist/leaflet.css";

export function ReportCard({ cardRefs, report, selectedId }) {
  return (
    <li
      ref={(el) => (cardRefs.current[report._id] = el)}
      className={`${selectedId === report._id ? "ring-2 ring-sky-500" : ""}`}
    >
      <ReportCardDetails report={report} />
    </li>
  );
}
