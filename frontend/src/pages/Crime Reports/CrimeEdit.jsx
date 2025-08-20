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
import { Textarea } from "@/components/ui/textarea";

function CrimeEdit() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const report = useSelector((state) =>
    state.report.reports.find((r) => r.id == id)
  );

  // const [crimeType, setCrimeType] = useState(report?.crimeType || "");
  // const [title, setTitle] = useState(report?.title || "");
  // const [details, setDetails] = useState(report?.details || "");
  // const [street, setStreet] = useState(report?.street || "");
  // const [latlng, setLatLng] = useState(report?.position || [23.8103, 90.4125]);
  const [date, setDate] = useState(report?.date || "");

  const [reportData, setReportData] = useState({
    crimeType: report?.crimeType || "",
    title: report?.title || "",
    details: report?.details || "",
    street: report?.street || "",
    latlng: report?.latlng || { lat: 23.8103, lng: 90.4125 },
    document: report?.document || "",
  });

  if (!report) {
    return (
      <div className="p-4 text-red-600 font-semibold">Report not found.</div>
    );
  }

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!reportData.title || reportData.title.length < 5)
      newErrors.title = "Please provide a valid title.";
    if (!reportData.details || reportData.details.length < 10)
      newErrors.details = "Please provide more details.";
    if (reportData.crimeType == "Select a crime type")
      newErrors.crimeType = "Please select a crime type.";
    if (!reportData.date) newErrors.date = "Please select a date.";

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleDocumentChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReportData((prev) => ({ ...prev, document: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  function handleEdit() {
    if (reportData.latlng == null || reportData.street == "") {
      toast.error("Please select a location");
      return;
    }
    if (!validate()) {
      toast.error("Please fix the errors in the form.");
      return;
    }

    toast.success("Successfully Editted!");

    dispatch(
      editReport({
        id: report.id,
        latlng: reportData.latlng,
        street: reportData.street,
        crimeType: reportData.crimeType,
        title: reportData.title,
        details: reportData.details,
        date,
        document: reportData.document,
        status: "pending",
      })
    );

    navigate(`/crime/${id}`);
  }

  return (
    <div className="max-w-3xl mx-auto mt-20 mb-5  p-4 space-y-6 border border-slate-300 rounded">
      <h2 className="text-2xl font-bold mb-4">Edit Crime Report</h2>
      <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
        <div className="mb-4">
          <OptionList
            label={"Crime type"}
            crimeType={reportData.crimeType}
            setCrimeType={(data) =>
              setReportData({ ...reportData, crimeType: data })
            }
          />
          {errors.crimeType &&
            reportData.crimeType == "Select a crime type" && (
              <p className="text-red-500">{errors.crimeType}</p>
            )}
        </div>
        <div className="mb-4">
          <DateSelector date={date} setDate={setDate} />
          {errors.crimeType && date == "" && (
            <p className="text-red-500">{errors.date}</p>
          )}
        </div>

        <div className="mb-4">
          <Label htmlFor="document" className="mb-2">
            Add an Image (Optional)
          </Label>
          <Input
            id="document"
            name="document"
            type="file"
            accept="image/*, application/pdf"
            placeholder="Upload a document or image"
            onChange={handleDocumentChange}
          />
        </div>

        <div className="z-99">
          <Label htmlFor="title" className="mb-2">
            Add a crime title
          </Label>
          <Input
            type="text"
            id="title"
            placeholder={`${
              reportData.title == "" && errors.title
                ? errors.title
                : "Add a title"
            }`}
            value={reportData.title}
            onChange={(e) => {
              setReportData({ ...reportData, title: e.target.value });
            }}
            className={`${
              reportData.title == "" && errors.title
                ? "border-2 border-red-500"
                : ""
            }`}
          />
        </div>
        <div>
          <Label htmlFor="message" className="mb-2">
            Description
          </Label>
          <Textarea
            placeholder={`${
              reportData.details == "" && errors.details
                ? errors.details
                : "Describe the incident..."
            }`}
            id="message"
            value={reportData.details}
            onChange={(e) =>
              setReportData({ ...reportData, details: e.target.value })
            }
            className={`${
              reportData.details == "" && errors.details
                ? "border-2 border-red-500"
                : ""
            }`}
          />
        </div>

        <div>
          <label className="block font-semibold mb-1 text-slate-700">
            Select Location on Map:
          </label>
          <ReportMap reportData={reportData} setReportData={setReportData} />
        </div>

        <p className="text-sm text-gray-500">
          <strong>Selected Coordinates:</strong>{" "}
          {reportData.latlng.lat.toFixed(5)}, {reportData.latlng.lng.toFixed(5)}
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
