import { CrimeCard } from "./CrimeCard";
import Map from "./Map";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { deleteReport } from "../../feature/reportSlice";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import Comments from "./Comments";
import L from "leaflet";
import FileReader from "./FileReader";
import API from "../../api/axios";
import LoadingSpinner from "../../components/LoadingSpinner";

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
      <div className="max-w-3xl mx-auto mt-15 p-4 space-y-6 flex justify-center items-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto mt-10 md:mt-20 px-2 py-4 space-y-6 ">
      <Button onClick={() => navigate(-1)} variant="primary">
        Back
      </Button>

      {!report && (
        <div className="max-w-3xl mx-auto mt-15 p-4 space-y-6">
          <div className="p-4 text-red-600 font-semibold">
            Report not found.
            <Button
              type="button"
              onClick={() => navigate(-1)}
              className="text-slate-600 border-2 border-slate-600 hover:bg-slate-600 hover:text-white px-2 py-1 rounded"
            >
              Go Back
            </Button>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-2/3 space-y-4">
          <div className="bg-white rounded-md border border-slate-200 shadow-sm p-4">
            {user &&
              (user.username === report.user.username ||
                user.role === "admin") &&
              report.suggestion && (
                <h1 className="text-sm w-fit rounded font-bold mb-4 flex justify-end px-2 py-1 text-yellow-800 bg-yellow-100">
                  Suggestion - {report.suggestion}
                </h1>
              )}

            <div className="flex gap-2 mb-4">
              <Button
                variant="primary"
                className={`${
                  activeTab === "location" ? "bg-slate-500 text-white" : ""
                }`}
                onClick={() => setActiveTab("location")}
              >
                Location
              </Button>
              {report.image && (
                <Button
                  variant="primary"
                  className={`${
                    activeTab === "document" ? "bg-slate-500 text-white" : ""
                  }`}
                  onClick={() => setActiveTab("document")}
                >
                  Image
                </Button>
              )}
            </div>

            <div className="relative">
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
            />
          </div>
        </div>

        {report.status === "approved" && (
          <div className="md:w-1/3">
            <div className="bg-white rounded-md border border-slate-200 shadow p-4 flex flex-col max-h-[500px] overflow-y-auto">
              <h3 className="text-xl font-semibold mb-4">Comments</h3>
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
    </div>
  );
}
