function DateSelector({ date, setDate }) {
  const today = new Date().toISOString().split("T")[0];

  return (
    <>
      <label className="block mb- font-medium text-slate-700">
        Date of Crime
      </label>
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        max={today}
        className="border border-slate-300 rounded px-2 py-1 focus:outline-0 focus:border-2 focus:border-slate-600"
      />
    </>
  );
}

export default DateSelector;
