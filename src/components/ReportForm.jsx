import Button from "../components/Button";

function ReportForm({ street, setStreet, details, setDetails }) {
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
        text={"Submit"}
      />
    </form>
  );
}

export default ReportForm;
