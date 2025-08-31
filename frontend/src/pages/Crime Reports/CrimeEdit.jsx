import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import DateSelector from "./DateSelector";
import OptionList from "./OptionList";
import ReportMap from "./ReportMap";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import API from "../../api/axios";
import LoadingSpinner from "../../components/LoadingSpinner";

function CrimeEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchReport = async () => {
    try {
      const res = await API.get(`/reports/${id}`);
      setReport(res.data);
    } catch (error) {
      console.log(error);
      setReport("");
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const [reportData, setReportData] = useState({
    crimeType: "",
    title: "",
    details: "",
    street: "",
    latlng: { lat: 23.8103, lng: 90.4125 },
    document: "",
  });

  useEffect(() => {
    if (report) {
      setReportData({
        crimeType: report.crimeType,
        title: report.title,
        details: report.details,
        street: report.street,
        latlng: report.position,
        document: report.document,
      });
      setDate(report.date);
    }
  }, [report]);

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!reportData.title) newErrors.title = "Please provide a valid title.";
    if (!reportData.details) newErrors.details = "Please provide more details.";
    if (reportData.crimeType == "Select a crime type")
      newErrors.crimeType = "Please select a crime type.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDocumentChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setReportData((prev) => ({ ...prev, document: file }));
    }
  };

  async function handleEdit() {
    if (reportData.latlng == null || reportData.street == "") {
      toast.error("Please select a location");
      return;
    }
    if (!validate()) {
      toast.error("Please fix the errors in the form.");
      return;
    }

    const formData = new FormData();
    formData.append("crimeType", reportData.crimeType);
    formData.append("street", reportData.street);
    formData.append("title", reportData.title);
    formData.append("details", reportData.details);
    formData.append("date", date);
    formData.append("lat", reportData.latlng.lat);
    formData.append("lng", reportData.latlng.lng);

    if (reportData.document) {
      formData.append("image", reportData.document);
    }

    try {
      setLoading(true);
      const response = await API.put(`/reports/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success(response.data.message || "Report updated successfully");
      setLoading(false);
    } catch (error) {
      console.log(error);
      console.log(error);
      const msg = error.response?.data?.message || "Failed to updated report";
      toast.error(msg);
      setLoading(false);
    }

    navigate(`/crime/${id}`);
  }

  if (!report) {
    return (
      <div className="p-4 text-red-600 font-semibold">Report not found.</div>
    );
  }
  if (loading) {
    return <LoadingSpinner />;
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
          {errors.crimeType && (
            <p className="text-red-500">{errors.crimeType}</p>
          )}
        </div>
        <div className="mb-4">
          <DateSelector date={date} setDate={(newdate) => setDate(newdate)} />
          {errors.date && <p className="text-red-500">{errors.date}</p>}
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
