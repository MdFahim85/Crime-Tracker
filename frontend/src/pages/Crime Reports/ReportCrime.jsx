import { useState } from "react";
import { AlertTriangle, MapPin, FileText } from "lucide-react";
import ReportForm from "./ReportForm";
import ReportMap from "./ReportMap";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function ReportCrime() {
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState({
    latlng: null,
    street: "",
    title: "",
    details: "",
    document: "",
    crimeType: "",
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-10 mt-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center shadow-2xl">
              <AlertTriangle className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
            Report a Crime
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Help make your community safer by reporting incidents. Your report
            will be reviewed and processed by our security team.
          </p>
        </div>

        <div className="space-y-8">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="flex items-center gap-4 bg-gradient-to-r from-blue-600 to-indigo-600 mx-8 py-5 px-5 rounded-xl mt-10">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Select Location
                </h2>
                <p className="text-blue-100">
                  Click on the map or search for the incident location
                </p>
              </div>
            </div>
            <div className="p-8">
              <ReportMap
                reportData={reportData}
                setReportData={setReportData}
              />
            </div>
            <div className="flex items-center gap-4 bg-gradient-to-r from-blue-600 to-indigo-600 mx-8 py-5 px-5 rounded-xl">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Report Details
                </h2>
                <p className="text-red-100">
                  Provide information about the incident
                </p>
              </div>
            </div>
            <div className="p-8">
              <ReportForm
                reportData={reportData}
                setReportData={setReportData}
                setLoading={setLoading}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
