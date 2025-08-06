import { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { useDispatch } from "react-redux";
import { addReport } from "../feature/reportSlice";
import Button from "../components/Button";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
});

function LocationPicker({ setLatLng }) {
  useMapEvents({
    click(e) {
      setLatLng(e.latlng);
    },
  });
  return null;
}

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

      <div className="h-[400px] mb-6 rounded overflow-hidden">
        <MapContainer
          center={[23.8103, 90.4125]}
          zoom={13}
          className="h-full w-full"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
          <LocationPicker setLatLng={setLatLng} />
          {latlng && <Marker position={latlng} />}
        </MapContainer>
      </div>

      <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
        <div>
          <label className="block font-semibold">Street Name</label>
          <input
            type="text"
            className="w-full border p-2 rounded"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            placeholder="e.g., Mirpur 10"
          />
        </div>
        <div>
          <label className="block font-semibold">Crime Details</label>
          <textarea
            className="w-full border p-2 rounded"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            rows="4"
            placeholder="Describe the incident..."
          ></textarea>
        </div>
        <Button
          type={"submit"}
          className={
            "bg-emerald-600 text-white py-2 px-4 rounded hover:bg-emerald-700"
          }
          dispatchHandler={handleSubmit}
          text={"Submit"}
        />
      </form>
    </div>
  );
}
