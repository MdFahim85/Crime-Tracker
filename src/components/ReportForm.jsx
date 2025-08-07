import Button from "../components/Button";
import { useDispatch, useSelector } from "react-redux";
import { addReport } from "../feature/reportSlice";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function ReportForm({
  latlng,
  setLatLng,
  street,
  setStreet,
  details,
  setDetails,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const [crimeType, setCrimeType] = useState("");
  const [date, setDate] = useState("");
  const crimeTypes = [
    "Theft",
    "Assault",
    "Robbery",
    "Vandalism",
    "Drug-related",
    "Other",
  ];
  function handleSubmit() {
    if (!latlng || !street || !details) {
      toast.error("Please fill out all fields and select a location.");

      return;
    }
    if (!user) {
      toast.error("Please Log In to Submit a Report");
      navigate("/login");
      return;
    }

    const report = {
      id: Date.now(),
      latlng: {
        lat: latlng.lat,
        lng: latlng.lng,
      },
      crimeType,
      street,
      details,
      date,
      user: user.username,
    };

    dispatch(addReport(report));
    toast.success("Report Added Successfully");

    setLatLng(null);
    setStreet("");
    setDetails("");
    setCrimeType("");
  }
  return (
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
      <div className="mb-4">
        <label className="block mb-1 text-sm font-medium text-gray-700">
          Crime Type
        </label>
        <select
          value={crimeType}
          onChange={(e) => setCrimeType(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select a crime type</option>
          {crimeTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block mb-1 text-sm font-medium text-gray-700">
          Date of Crime
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full border p-2 rounded"
          required
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
        onClick={() => handleSubmit()}
        text={"Submit"}
      />
    </form>
  );
}

export default ReportForm;
