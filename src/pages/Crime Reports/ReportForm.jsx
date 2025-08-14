import { useDispatch, useSelector } from "react-redux";
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

function ReportForm({
  latlng,
  setLatLng,
  street,
  setStreet,
  title,
  setTitle,
  details,
  setDetails,
}) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [crimeType, setCrimeType] = useState("Select a crime type");
  const [date, setDate] = useState("");
  const navigate = useNavigate();
  function handleSubmit() {
    if (!latlng || !street || !details) {
      toast.error("Please fill out all fields and select a location.");
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
      title,
      details,
      date: date.toISOString().split("T")[0],
      user: user.username,
    };

    dispatch(addReport(report));
    toast.success("Report Added Successfully");
    navigate("/allreports");

    setLatLng(null);
    setStreet("");
    setTitle("");
    setDetails("");
    setCrimeType("");
  }
  return (
    <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
      <div className="z-99">
        <Label htmlFor="search" className="mb-2">
          Add street name
        </Label>
        <Input
          type="text"
          id="search"
          placeholder="eg. Mirpur-10"
          value={street}
          onChange={(e) => setStreet(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <OptionList
          label={"Crime type"}
          crimeType={crimeType}
          setCrimeType={setCrimeType}
        />
      </div>
      <div className="mb-4">
        <DateSelector date={date} setDate={setDate} />
      </div>
      <div className="z-99">
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
        <Label htmlFor="message" className="mb-2">
          Description
        </Label>
        <Textarea
          placeholder="Describe the incident"
          id="message"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
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
