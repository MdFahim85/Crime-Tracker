import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { deleteReport } from "../../feature/reportSlice";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { useState } from "react";
import Comments from "../../components/Comments";
import AlertBtn from "../../components/AlertBtn";

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
        <div className="p-4 text-red-600 font-semibold">
          Report not found.{" "}
          <Button
            type={"button"}
            text={"Go Back"}
            onClick={navigate(-1)}
            className="text-slate-600 border-2 border-slate-600 hover:bg-slate-600 hover:text-white px-2 py-1 rounded"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto mt-15 px-2 py-4 space-y-6">
      <Button
        onClick={() => navigate("/allreports")}
        className="border border-slate-500 bg-white text-slate-500 hover:text-white hover:bg-slate-500"
      >
        Back to reports
      </Button>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-2/3 space-y-4">
          <h2 className="text-2xl font-bold">{report.crimeType}</h2>
          <p className="text-gray-600">{report.details}</p>
          <p className="text-sm text-gray-500">
            <strong>Street:</strong> {report.street}
          </p>
          <p className="text-sm text-gray-500">
            <strong>Date:</strong> {report.date}
          </p>
          <p className="text-sm text-gray-500">
            <strong>Reported By:</strong> {report.user}
          </p>

          <MapContainer
            center={[report.position.lat, report.position.lng]}
            zoom={16}
            zoomControl={false}
            style={{ height: "350px", width: "100%", zIndex: "10" }}
            className="rounded-md shadow"
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={[report.position.lat, report.position.lng]}>
              <Popup>
                {report.crimeType} at {report.street}
              </Popup>
            </Marker>
          </MapContainer>

          <div
            className={
              user && user.username === report.user
                ? "flex justify-start gap-2"
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
              className="border border-slate-500 bg-white text-slate-500 hover:text-white hover:bg-slate-500"
              onClick={() => navigate(`/crime/${report.id}/edit`)}
            >
              Edit
            </Button>
          </div>
        </div>

        <div className="md:w-1/3 bg-white rounded shadow p-4 flex flex-col">
          <h3 className="text-xl font-semibold mb-4">Comments</h3>
          <Comments
            comment={comment}
            setComment={setComment}
            user={user}
            report={report}
          />
        </div>
      </div>
    </div>
  );
}
