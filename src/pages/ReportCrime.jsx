import { useState } from "react";
import { useDispatch } from "react-redux";
import { addReport } from "../feature/reportSlice";
import Button from "../components/Button";
import ReportMap from "../components/ReportMap";
import ReportForm from "../components/ReportForm";

export default function ReportCrime() {
  const dispatch = useDispatch();
  const [latlng, setLatLng] = useState(null);
  const [street, setStreet] = useState("");
  const [details, setDetails] = useState("");

  function handleSubmit() {
    if (!latlng || !street || !details) {
      alert("Please fill out all fields and select a location.");
      return;
    }

    const report = {
      id: Date.now(),
      latlng: {
        lat: latlng.lat,
        lng: latlng.lng,
      },

      street,
      details,
    };

    dispatch(addReport(report));

    console.log("Crime Report Submitted:", report);
    alert("Report Submitted Successfully!");

    setLatLng(null);
    setStreet("");
    setDetails("");
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 p-4">
      <h2 className="text-2xl font-bold my-4">Report a Crime</h2>

      <ReportMap latlng={latlng} setLatLng={setLatLng} />
      <ReportForm
        street={street}
        setStreet={setStreet}
        details={details}
        setDetails={setDetails}
      />
    </div>
  );
}
