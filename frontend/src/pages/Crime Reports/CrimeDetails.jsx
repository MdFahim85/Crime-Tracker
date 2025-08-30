import { CrimeCard } from "./CrimeCard";
import Map from "./Map";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import Comments from "./Comments";
import L from "leaflet";
import FileReader from "./FileReader";
import API from "../../api/axios";
import LoadingSpinner from "../../components/LoadingSpinner";
import NoReportFound from "../../components/NoReportFound";
import {
  ArrowLeft,
  MapPin,
  FileImage,
  MessageSquare,
  WandSparkles,
} from "lucide-react";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function CrimeDetails() {
  const [comment, setComment] = useState("");
  const [activeTab, setActiveTab] = useState("location");
  const [report, setReport] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();

  const user = useSelector((state) => state.auth.user);

  const fetchReport = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/reports/${id}`);
      setReport(res.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setReport("");
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  async function handelDelete(id) {
    try {
      setLoading(true);
      await API.delete(`/reports/${id}`);
      toast.success("Report deleted successfully");
      navigate("/allreports");
      setLoading(false);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto mt-20 py-20 flex justify-center items-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto mt-8 md:mt-16 px-4 py-8 space-y-8">
      <div className="flex items-center gap-1">
        <Button
          onClick={() => navigate(-1)}
          variant="outline"
          className="border border-slate-300 rounded-md bg-white shadow hover:bg-slate-100 transition group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
          Back
        </Button>
      </div>

      {!report && (
        <div className="max-w-3xl mx-auto mt-20 py-10 rounded-lg shadow bg-white">
          <div className="p-6 text-center text-red-600 font-semibold">
            <NoReportFound />
            <Button
              type="button"
              onClick={() => navigate(-1)}
              className="mt-6 text-slate-600 border border-slate-400 hover:bg-slate-600 hover:text-white px-4 py-2 rounded transition group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
              Go Back
            </Button>
          </div>
        </div>
      )}

      {report && (
        <div className="flex flex-col md:flex-row gap-8 animate-fadeIn">
          <div className="md:w-2/3 space-y-5">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6">
              {user &&
                (user.username === report.user?.username ||
                  user.role === "admin") &&
                report.suggestion && (
                  <div className="mb-5 flex items-center justify-end">
                    <span className="flex items-center gap-2 text-xs px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 font-semibold shadow">
                      <WandSparkles className="w-3 h-3" /> Suggestion:{" "}
                      {report.suggestion}
                    </span>
                  </div>
                )}

              <div className="flex gap-2 mb-6">
                <Button
                  variant="default"
                  className={`rounded-full px-6 py-2 text-sm font-bold hover:bg-blue-700 hover:text-white ${
                    activeTab === "location"
                      ? "bg-blue-600 text-white shadow"
                      : "bg-white text-slate-700 border-slate-300"
                  }`}
                  onClick={() => setActiveTab("location")}
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  Location Map
                </Button>
                {report.image && (
                  <Button
                    variant="default"
                    className={`rounded-full px-6 py-2 text-sm font-bold hover:bg-blue-700 hover:text-white ${
                      activeTab === "document"
                        ? "bg-blue-600 text-white shadow"
                        : "bg-white text-slate-700 border-slate-300"
                    }`}
                    onClick={() => setActiveTab("document")}
                  >
                    <FileImage className="w-4 h-4 mr-2" />
                    Evidence
                  </Button>
                )}
              </div>

              <div className="relative rounded-lg border border-slate-100 shadow-sm overflow-hidden mb-6">
                {activeTab === "location" && <Map report={report} />}
                {activeTab === "document" && (
                  <FileReader fileData={report.image} />
                )}
              </div>

              <CrimeCard
                report={report}
                user={user}
                handelDelete={handelDelete}
                navigate={navigate}
                className="mt-6"
              />
            </div>
          </div>

          {report.status === "approved" && (
            <div className="md:w-1/3">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6 flex flex-col max-h-[500px] overflow-y-auto">
                <div className="flex items-center gap-2 mb-4 text-slate-800 border-b pb-2">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                  <h3 className="text-2xl font-bold">Comments</h3>
                </div>
                <Comments
                  comment={comment}
                  setComment={setComment}
                  user={user}
                  report={report}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
