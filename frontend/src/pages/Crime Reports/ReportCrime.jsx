import { useState } from "react";
import ReportMap from "./ReportMap";
import ReportForm from "./ReportForm";
import { useSelector } from "react-redux";

export default function ReportCrime() {
  const user = useSelector((state) => state.auth.user);

  const [reportData, setReportData] = useState({
    latlng: null,
    street: "",
    title: "",
    details: "",
    document: "",
    crimeType: "Select a crime type",
    user: user ? user.username : "",
  });

  return (
    <div className="max-w-3xl mx-auto mt-15 p-4">
      <h2 className="text-2xl font-bold my-4 text-slate-700">Report a Crime</h2>

      <ReportMap reportData={reportData} setReportData={setReportData} />
      <ReportForm reportData={reportData} setReportData={setReportData} />
    </div>
  );
}
