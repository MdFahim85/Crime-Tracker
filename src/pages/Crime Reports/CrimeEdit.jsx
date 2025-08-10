import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { editReport } from "../../feature/reportSlice";
import { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Button from "../../components/Button";
import toast from "react-hot-toast";
import DateSelector from "../../components/DateSelector";
import OptionList from "../../components/OptionList";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function LocationSelector({ setLat, setLng }) {
  useMapEvents({
    click(e) {
      setLat(e.latlng.lat);
      setLng(e.latlng.lng);
    },
  });
  return null;
}

function CrimeEdit() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const report = useSelector((state) =>
    state.report.reports.find((r) => r.id == id)
  );

  const [crimeType, setCrimeType] = useState(report?.crimeType || "");
  const [details, setDetails] = useState(report?.details || "");
  const [street, setStreet] = useState(report?.street || "");
  const [lat, setLat] = useState(report?.position.lat || 23.8103);
  const [lng, setLng] = useState(report?.position.lng || 90.4125);
  const [date, setDate] = useState(report?.date || "");

  if (!report) {
    return (
      <div className="p-4 text-red-600 font-semibold">Report not found.</div>
    );
  }

  function handleEdit(e) {
    e.preventDefault();

    dispatch(
      editReport({
        id: report.id,
        latlng: { lat, lng },
        street,
        crimeType,
        details,
        date,
        user,
      })
    );
    toast.success("Successfully Editted!");
    navigate(`/crime/${id}`);
  }

  return (
    <div className="max-w-3xl mx-auto mt-20 mb-5  p-4 space-y-6 border border-slate-300 rounded">
      <h2 className="text-2xl font-bold mb-4">Edit Crime Report</h2>
      <form onSubmit={handleEdit} className="space-y-4">
        <div className="mb-4">
          <OptionList crimeType={crimeType} setCrimeType={setCrimeType} />
        </div>

        <div>
          <label className="block font-semibold text-slate-700">Details:</label>
          <textarea
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            className="w-full p-2 border border-slate-300 rounded focus:outline-0 focus:border-2 focus:border-slate-600"
            required
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700">Street:</label>
          <input
            type="text"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            className="w-full p-2 border border-slate-300 rounded focus:outline-0 focus:border-2 focus:border-slate-600"
            required
          />
        </div>

        <div className="mb-4">
          <DateSelector date={date} setDate={setDate} />
        </div>

        <div>
          <label className="block font-semibold mb-1 text-slate-700">
            Select Location on Map:
          </label>
          <MapContainer
            center={[lat, lng]}
            zoom={15}
            zoomControl={false}
            style={{ height: "300px", width: "100%" }}
            className="rounded"
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <LocationSelector setLat={setLat} setLng={setLng} />
            <Marker position={[lat, lng]} />
          </MapContainer>
        </div>

        <p className="text-sm text-gray-500">
          <strong>Selected Coordinates:</strong> {lat.toFixed(5)},{" "}
          {lng.toFixed(5)}
        </p>

        <div className="flex justify-start gap-2">
          <Button
            type={"submit"}
            className={
              "px-4 py-2 border-2 text-slate-600 border-slate-600 rounded hover:bg-slate-600 hover:text-white"
            }
            text={"Save Changes"}
            onClick={() => handleEdit}
          />
          <Button
            type={"button"}
            className={
              "block mt-2 md:mt-0 px-2 py-1 rounded border-2 text-red-500 border-red-500 hover:bg-red-500 hover:text-white"
            }
            onClick={() => navigate(`/crime/${report.id}`)}
            text={"Cancel"}
          />
        </div>
      </form>
    </div>
  );
}

export default CrimeEdit;
