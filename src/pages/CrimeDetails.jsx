import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { deleteReport } from "../feature/reportSlice";
import Button from "../components/Button";
import toast from "react-hot-toast";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function CrimeDetails() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const report = useSelector((state) =>
    state.report.reports.find((r) => r.id == id)
  );
  function handelDelete(id) {
    dispatch(deleteReport(id));
    navigate("/allreports");
    toast.success("Successfully Deleted");
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
            className="text-emerald-600 border-2 border-emerald-600 hover:bg-emerald-600 hover:text-white px-2 py-1 rounded"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-15 p-4 space-y-6">
      <Button
        type={"button"}
        text={"Back to reports"}
        onClick={() => navigate(-1)}
        className="text-emerald-600 border-2 border-emerald-600 hover:bg-emerald-600 hover:text-white px-2 py-1 rounded"
      />
      <h2 className="mt-5 text-2xl font-bold">{report.crimeType}</h2>
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
        style={{ height: "350px", width: "100%" }}
        className="rounded-md shadow"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={[report.position.lat, report.position.lng]}>
          <Popup>
            {report.crimeType} at {report.street}
          </Popup>
        </Marker>
      </MapContainer>
      <div className="flex justify-start gap-2">
        <Button
          className={
            "block mt-2 md:mt-0 px-2 py-1 rounded border-2 text-red-500 border-red-500 hover:bg-red-500 hover:text-white"
          }
          onClick={() => handelDelete(report.id)}
          text={"Delete"}
        />
        <Button
          className={
            "text-emerald-600 block mt-2 md:mt-0 px-5 py-1 rounded border-2 border-emerald-500 hover:bg-emerald-500 hover:text-white"
          }
          onClick={() => navigate(`/crime/${report.id}/edit`)}
          text={"Edit"}
        />
      </div>
    </div>
  );
}
