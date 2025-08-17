import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { deleteReport } from "../../feature/reportSlice";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { useState } from "react";
import Comments from "./Comments";
import AlertBtn from "../../components/AlertBtn";
import { Label } from "@/components/ui/label";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function CrimeDetails() {
  const [comment, setComment] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const report = useSelector((state) =>
    state.report.reports.find((r) => r.id == id)
  );
  const user = useSelector((state) => state.auth.user);
  function handelDelete(id) {
    dispatch(deleteReport(id));
    toast.success("Successfully Deleted");
    navigate("/allreports");
  }
  if (!report) {
    return (
      <div className="max-w-3xl mx-auto mt-15 p-4 space-y-6">
        {
          <div className="p-4 text-red-600 font-semibold">
            Report not found.
            <Button
              type={"button"}
              onClick={navigate(-1)}
              className="text-slate-600 border-2 border-slate-600 hover:bg-slate-600 hover:text-white px-2 py-1 rounded"
            >
              Go Back
            </Button>
          </div>
        }
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto mt-10 md:mt-20 px-2 py-4 space-y-6 ">
      <Button onClick={() => navigate(-1)} variant="primary">
        Back
      </Button>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-2/3 space-y-4">
          <div className="bg-white rounded-md border border-slate-200 shadow-sm p-4">
            {user &&
              (user.username === report.user || user.role === "admin") &&
              report.suggestion && (
                <h1 className="text-sm w-fit rounded font-bold mb-4 flex justify-end px-2 py-1 text-yellow-800 bg-yellow-100">
                  Suggestion - {report.suggestion}
                </h1>
              )}

            <div className="relative">
              <MapContainer
                center={[report.position.lat, report.position.lng]}
                zoom={17}
                minZoom={17}
                maxZoom={17}
                zoomControl={false}
                scrollWheelZoom={false}
                doubleClickZoom={false}
                dragging={false}
                touchZoom={false}
                boxZoom={false}
                keyboard={false}
                tap={false}
                className="rounded-md shadow"
                style={{ height: "300px", width: "100%", zIndex: 10 }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={[report.position.lat, report.position.lng]}>
                  <Popup>
                    {report.title} at {report.street}
                  </Popup>
                </Marker>
              </MapContainer>
              <Label className="block text-slate-700 my-2 text-xl">
                Crime Location
              </Label>
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-slate-900 text-md font-medium px-2 py-1 rounded shadow z-20">
                {report.crimeType}
              </div>
            </div>
            <div className="mt-4">
              <h2 className="text-2xl font-bold">{report.title}</h2>
              <p className="text-gray-600 mt-2">{report.details}</p>
              <div className="mt-3 space-y-1 text-sm text-gray-500">
                <p>
                  <strong>Street:</strong> {report.street}
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(report.date).toLocaleDateString("en-GB")}
                </p>
                <p>
                  <strong>Author:</strong> {report.user}
                </p>
              </div>

              <div
                className={
                  user && user.username === report.user
                    ? "flex justify-start gap-2 pt-3"
                    : "hidden"
                }
              >
                <AlertBtn
                  btnText={"Delete"}
                  textMsg={"Are you sure to delete this report ?"}
                  onClick={() => handelDelete(report.id)}
                  textDescription={
                    "This action cannot be undone. This will permanently delete your account and remove your data from our servers."
                  }
                />
                <Button
                  variant="primary"
                  onClick={() => navigate(`/crime/${report.id}/edit`)}
                >
                  Edit
                </Button>
              </div>
            </div>
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
