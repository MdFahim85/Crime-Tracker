import { useState } from "react";
import ReportMap from "../../components/ReportMap";
import ReportForm from "../../components/ReportForm";

export default function ReportCrime() {
  const [latlng, setLatLng] = useState(null);
  const [street, setStreet] = useState("");
  const [details, setDetails] = useState("");

  return (
    <div className="max-w-3xl mx-auto mt-15 p-4">
      <h2 className="text-2xl font-bold my-4 text-slate-700">Report a Crime</h2>

      <ReportMap latlng={latlng} setLatLng={setLatLng} />
      <ReportForm
        latlng={latlng}
        setLatLng={setLatLng}
        street={street}
        setStreet={setStreet}
        details={details}
        setDetails={setDetails}
      />
    </div>
  );
}
