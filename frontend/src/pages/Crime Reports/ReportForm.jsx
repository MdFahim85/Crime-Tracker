import { useDispatch } from "react-redux";
import { addReport } from "../../feature/reportSlice";
import { useState } from "react";
import toast from "react-hot-toast";
import DateSelector from "./DateSelector";
import OptionList from "./OptionList";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Eraser } from "lucide-react";

function ReportForm({ reportData, setReportData }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [date, setDate] = useState("");

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

  function handleSubmit() {
    if (reportData.latlng == null || reportData.street == "") {
      toast.error("Please select a location");
      return;
    }
    if (!validate()) {
      toast.error("Please fix the errors in the form.");
      return;
    }

    const report = {
      id: Date.now(),
      latlng: {
        lat: reportData.latlng.lat,
        lng: reportData.latlng.lng,
      },
      crimeType: reportData.crimeType,
      street: reportData.street,
      title: reportData.title,
      details: reportData.details,
      document: reportData.document,
      date,
      user: reportData.user,
    };

    dispatch(addReport(report));
    toast.success("Your report has been submitted and is under review.");
    navigate("/allreports");
  }
  return (
    <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
      <div className="mb-4">
        <OptionList
          label={"Crime type"}
          crimeType={reportData.crimeType}
          setCrimeType={(data) =>
            setReportData({ ...reportData, crimeType: data })
          }
        />
        {errors.crimeType && reportData.crimeType == "Select a crime type" && (
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
      <Button
        className="border border-slate-500 bg-white text-slate-500 hover:text-white hover:bg-slate-500"
        onClick={() => handleSubmit()}
      >
        Submit
      </Button>
    </form>
  );
}

export default ReportForm;
