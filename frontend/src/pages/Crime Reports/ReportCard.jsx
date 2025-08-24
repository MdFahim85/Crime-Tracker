import { ReportCardDetails } from "../../components/ReportCardDetails";

import "leaflet/dist/leaflet.css";

export function ReportCard({ cardRefs, report, selectedId }) {
  return (
    <li
      ref={(el) => (cardRefs.current[report._id] = el)}
      className={`
                col-span-12 sm:col-span-6 lg:col-span-4
                rounded-lg overflow-hidden bg-white border border-slate-200
                shadow-sm hover:shadow-md transition
                ${selectedId === report._id ? "ring-2 ring-sky-500" : ""}
              `}
    >
      <ReportCardDetails report={report} />
    </li>
  );
}
