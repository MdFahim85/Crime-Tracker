import { useState } from "react";
import toast from "react-hot-toast";
import DateSelector from "./DateSelector";
import OptionList from "./OptionList";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import {
  AlertCircle,
  FileText,
  Calendar,
  Upload,
  MessageSquare,
  Send,
  ImageIcon,
} from "lucide-react";

function ReportForm({ reportData, setReportData, setLoading }) {
  const navigate = useNavigate();

  const [date, setDate] = useState("");

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!reportData.title) newErrors.title = "Please provide a valid title.";
    if (!reportData.details) newErrors.details = "Please provide more details.";
    if (reportData.crimeType == "")
      newErrors.crimeType = "Please select a crime type.";
    if (!date) newErrors.date = "Please select a date.";

    setErrors(newErrors);
    console.log(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDocumentChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setReportData((prev) => ({ ...prev, document: file }));
    }
  };

  const handleSubmit = async () => {
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
      await API.post("/reports", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setLoading(false);

      toast.success(
        "Report submitted successfully. Please wait for admin approval"
      );
      navigate("/my-profile");
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to submit report";
      toast.error(msg);
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
        <div className="grid grid-cols-12">
          <div className="col-span-12 lg:col-span-6">
            {" "}
            {/* Crime Type Section */}
            <div className="px-6 py-2">
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-slate-800">
                  Crime Information
                </h3>
              </div>
              <div className="mb-4">
                <OptionList
                  label={"Crime type"}
                  crimeType={reportData.crimeType}
                  setCrimeType={(data) =>
                    setReportData({ ...reportData, crimeType: data })
                  }
                />
                {errors.crimeType && reportData.crimeType == "" && (
                  <div className="flex items-center gap-2 mt-2 text-red-600 bg-red-50 px-3 py-0 rounded-lg border border-red-200">
                    <AlertCircle className="w-4 h-4" />
                    <p className="text-sm">{errors.crimeType}</p>
                  </div>
                )}
              </div>
            </div>
            {/* Date of crime */}
            <div className="px-6 py-2">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-green-600" />
                <h3 className="text-lg font-semibold text-slate-800">
                  When did this happen?
                </h3>
              </div>
              <div className="mb-4">
                <DateSelector date={date} setDate={setDate} />
                {errors.date && date == "" && (
                  <div className="flex items-center gap-2 mt-2 text-red-600 bg-red-50 px-3 py-0 rounded-lg border border-red-200">
                    <AlertCircle className="w-4 h-4" />
                    <p className="text-sm">{errors.date}</p>
                  </div>
                )}
              </div>
            </div>
            {/* File Upload Section */}
            <div className="px-6 py-2">
              <div className="flex items-center gap-2 mb-4">
                <ImageIcon className="w-5 h-5 text-purple-600" />
                <h3 className="text-lg font-semibold text-slate-800">
                  Evidence
                </h3>
              </div>
              <div className="mb-4">
                <Label
                  htmlFor="document"
                  className="flex items-center gap-2 text-slate-700 font-medium mb-3"
                >
                  <Upload className="w-4 h-4" />
                  Add an Image (Optional)
                </Label>
                <Input
                  id="document"
                  name="document"
                  type="file"
                  accept="image/*, application/pdf"
                  placeholder="Upload a document or image"
                  onChange={handleDocumentChange}
                  className=""
                />
                <p className="text-sm text-slate-500 mt-2">
                  Supported formats: JPG, PNG, PDF (Max 10MB)
                </p>
              </div>
            </div>
          </div>
          <div className="col-span-12 lg:col-span-6">
            <div className="px-6 py-0 ">
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare className="w-5 h-5 text-orange-600" />
                <h3 className="text-lg font-semibold text-slate-800">
                  Report Details
                </h3>
              </div>

              <div className="space-y-6">
                <div className="z-99">
                  <Label
                    htmlFor="title"
                    className="flex items-center gap-2 text-slate-700 font-medium mb-3"
                  >
                    <FileText className="w-4 h-4" />
                    Report Title
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
                    className={`border-2 transition-colors duration-200 ${
                      reportData.title == "" && errors.title
                        ? "border-red-500 bg-red-50"
                        : "border-orange-100 hover:border-orange-300 focus:border-orange-400"
                    }`}
                  />
                  {errors.title && reportData.title == "" && (
                    <div className="flex items-center gap-2 mt-2 text-red-600 bg-red-50 px-3 py-0 rounded-lg border border-red-200">
                      <AlertCircle className="w-4 h-4" />
                      <p className="text-sm">{errors.title}</p>
                    </div>
                  )}
                </div>

                <div>
                  <Label
                    htmlFor="message"
                    className="flex items-center gap-2 text-slate-700 font-medium mb-3"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Description
                  </Label>
                  <Textarea
                    placeholder={`${
                      reportData.details == "" && errors.details
                        ? errors.details
                        : "Describe the incident in detail..."
                    }`}
                    id="message"
                    value={reportData.details}
                    onChange={(e) =>
                      setReportData({ ...reportData, details: e.target.value })
                    }
                    className={`border-2 transition-colors duration-200 min-h-[120px] ${
                      reportData.details == "" && errors.details
                        ? "border-red-500 bg-red-50"
                        : "border-orange-100 hover:border-orange-300 focus:border-orange-400"
                    }`}
                  />
                  {errors.details && reportData.details == "" && (
                    <div className="flex items-center gap-2 mt-2 text-red-600 bg-red-50 px-3 py-0 rounded-lg border border-red-200">
                      <AlertCircle className="w-4 h-4" />
                      <p className="text-sm">{errors.details}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-slate-200">
          <Button
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 py-3 text-lg font-semibold"
            onClick={() => handleSubmit()}
          >
            <Send className="w-5 h-5 mr-2" />
            Submit Report
          </Button>
          <p className="text-center text-sm text-slate-500 mt-3">
            Your report will be reviewed by our team before being published
          </p>
        </div>
      </form>
    </>
  );
}

export default ReportForm;
