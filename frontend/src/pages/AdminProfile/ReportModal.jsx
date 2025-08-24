import { Dialog, DialogContent } from "@/components/ui/dialog";

export default function ReportModal({ report, open, onClose }) {
  if (!report) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg rounded-xl p-6 bg-white shadow-lg">
        <div className="flex justify-between items-start">
          <h1 className="text-2xl font-bold text-gray-800">{report.title}</h1>
        </div>

        <div className="space-y-1">
          <div className="flex  gap-2">
            <span className="font-semibold text-gray-700">Crime Type:</span>
            <span className="text-gray-600">{report.crimeType}</span>
          </div>

          <div className="flex gap-2">
            <span className="font-semibold text-gray-700">Description:</span>
            <span className="text-gray-600 ">{report.details}</span>
          </div>

          <div className="flex   gap-2">
            <span className="font-semibold text-gray-700">Location:</span>
            <span className="text-gray-600">{report.street}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-700">Status:</span>
            <span
              className={`p-2 rounded text-sm font-medium ${
                report.status === "pending"
                  ? "bg-yellow-100 text-yellow-800"
                  : report.status === "completed"
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {report.status}
            </span>
          </div>

          {report.suggestion ? (
            <div className="flex justify-center mt-10 rounded p-2 bg-yellow-100">
              <span className="text-gray-600">
                {report.suggestion.toUpperCase()}
              </span>
            </div>
          ) : (
            ""
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
