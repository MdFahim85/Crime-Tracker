import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { editReport } from "../../feature/reportSlice";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import DateSelector from "./DateSelector";
import OptionList from "./OptionList";
import ReportMap from "./ReportMap";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function CrimeEdit() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const report = useSelector((state) =>
    state.report.reports.find((r) => r.id == id)
  );

  const [crimeType, setCrimeType] = useState(report?.crimeType || "");
  const [title, setTitle] = useState(report?.title || "");
  const [details, setDetails] = useState(report?.details || "");
  const [street, setStreet] = useState(report?.street || "");
  const [latlng, setLatLng] = useState(report?.position || [23.8103, 90.4125]);
  const [date, setDate] = useState(report?.date || "");

  if (!report) {
    return (
      <div className="p-4 text-red-600 font-semibold">Report not found.</div>
    );
  }

  function handleEdit() {
    toast.success("Successfully Editted!");

    dispatch(
      editReport({
        id: report.id,
        latlng,
        street,
        crimeType,
        title,
        details,
        date,
        user,
      })
    );

    navigate(`/crime/${id}`);
  }

  return (
    <div className="max-w-3xl mx-auto mt-20 mb-5  p-4 space-y-6 border border-slate-300 rounded">
      <h2 className="text-2xl font-bold mb-4">Edit Crime Report</h2>
      <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
        <div className="mb-4">
          <OptionList crimeType={crimeType} setCrimeType={setCrimeType} />
        </div>

        <div>
          <Label htmlFor="title" className="mb-2">
            Add a crime title
          </Label>
          <Input
            type="text"
            id="title"
            placeholder="Add a title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
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



        <div className="mb-4">
          <DateSelector date={date} setDate={setDate} />
        </div>

        <div>
          <label className="block font-semibold mb-1 text-slate-700">
            Select Location on Map:
          </label>
          <ReportMap latlng={latlng} setLatLng={setLatLng} street={street} setStreet={setStreet} />
        </div>

        <p className="text-sm text-gray-500">
          <strong>Selected Coordinates:</strong> {latlng.lat.toFixed(5)},{" "}
          {latlng.lng.toFixed(5)}
        </p>

        <div className="flex justify-start gap-2">
          <Button
            type="button"
            onClick={() => handleEdit()}
            className="border border-slate-500 bg-white text-slate-500 hover:text-white hover:bg-slate-500"
          >
            Save Changes
          </Button>

          <Button
            type="button"
            onClick={() => navigate(-1)}
            className="border border-red-500 bg-white text-red-500 hover:text-white hover:bg-red-500"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}

export default CrimeEdit;
