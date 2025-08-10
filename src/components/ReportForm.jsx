import Button from "../components/Button";
import { useDispatch, useSelector } from "react-redux";
import { addReport } from "../feature/reportSlice";
import { useState } from "react";
import toast from "react-hot-toast";
import DateSelector from "./DateSelector";
import OptionList from "./OptionList";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

function ReportForm({
  latlng,
  setLatLng,
  street,
  setStreet,
  details,
  setDetails,
}) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [crimeType, setCrimeType] = useState("Select a crime type");
  const [date, setDate] = useState("");
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
      <div className="z-99">
        <Label htmlFor="search" className="mb-2">
          Search by street
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
        <OptionList crimeType={crimeType} setCrimeType={setCrimeType} />
      </div>
      <div className="mb-4">
        <DateSelector date={date} setDate={setDate} />
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
        type={"submit"}
        className={
          "bg-slate-600 text-white py-2 px-4 rounded hover:bg-slate-700"
        }
        onClick={() => handleSubmit()}
        text={"Submit"}
      />
    </form>
  );
}

export default ReportForm;
