function NoReportFound() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center text-slate-500 text-nowrap">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-12 w-12 text-slate-400 mb-3"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <p className="text-xl font-medium">No reports found</p>
    </div>
  );
}

export default NoReportFound;
