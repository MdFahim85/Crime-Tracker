import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  FileText,
  MapPin,
  User,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
  Lightbulb,
  X,
} from "lucide-react";

export default function ReportModal({ report, open, onClose }) {
  if (!report) return null;

  const getStatusConfig = (status) => {
    switch (status) {
      case "approved":
        return {
          icon: CheckCircle,
          style: "bg-green-100 text-green-800 border-green-200",
          color: "text-green-600",
        };
      case "pending":
        return {
          icon: Clock,
          style: "bg-yellow-100 text-yellow-800 border-yellow-200",
          color: "text-yellow-600",
        };
      case "rejected":
        return {
          icon: XCircle,
          style: "bg-red-100 text-red-800 border-red-200",
          color: "text-red-600",
        };
      default:
        return {
          icon: AlertTriangle,
          style: "bg-gray-100 text-gray-800 border-gray-200",
          color: "text-gray-600",
        };
    }
  };

  const statusConfig = getStatusConfig(report.status);
  const StatusIcon = statusConfig.icon;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl rounded-2xl p-0 bg-white shadow-2xl border-0 overflow-hidden">
        <div className="bg-gradient-to-r from-red-50 to-orange-50 px-8 py-6 border-b border-gray-200">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-red-100 rounded-xl">
                <FileText className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">
                  {report.title}
                </h1>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(report.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {report.user?.username || "Anonymous"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="px-8 py-6 space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                <span className="font-semibold text-gray-700">Crime Type</span>
              </div>
              <span className="inline-block px-4 py-2 bg-orange-100 text-orange-800 rounded-lg text-sm font-medium border border-orange-200">
                {report.crimeType}
              </span>
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <StatusIcon className={`h-5 w-5 ${statusConfig.color}`} />
                <span className="font-semibold text-gray-700">Status</span>
              </div>
              <div
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border ${statusConfig.style}`}
              >
                <StatusIcon className="h-4 w-4" />
                {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="h-5 w-5 text-blue-600" />
              <span className="font-semibold text-gray-700">Location</span>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <p className="text-gray-800 font-medium">{report.street}</p>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <FileText className="h-5 w-5 text-purple-600" />
              <span className="font-semibold text-gray-700">Description</span>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-gray-800 leading-relaxed">{report.details}</p>
            </div>
          </div>
          {report.suggestion && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="h-5 w-5 text-yellow-600" />
                <span className="font-semibold text-gray-700">Suggestion</span>
              </div>
              <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg p-4 border border-yellow-200">
                <p className="text-gray-800 font-medium">{report.suggestion}</p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
