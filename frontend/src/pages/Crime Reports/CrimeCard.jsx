import AlertBtn from "../../components/AlertBtn";
import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Calendar, User, Edit3, Trash2, FileText } from "lucide-react";

export function CrimeCard({ report, user, handelDelete, navigate }) {
  return (
    <div className="border-0 bg-transparent">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <FileText className="w-6 h-6 text-blue-600" />
          {report.title}
        </CardTitle>
        <CardContent>
          <p className="text-slate-600 leading-relaxed">{report.details}</p>
        </CardContent>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-3 p-4 bg-slate-100 rounded-lg">
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-slate-500" />
            <span className="text-slate-600">{report.street}</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-slate-500" />
            <span className="text-slate-600">
              {new Date(report.date).toLocaleDateString("en-GB")}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <User className="w-4 h-4 text-slate-500" />
            <span className="text-slate-600">{report.user.username}</span>
          </div>
        </div>

        {user && user.username === report.user.username && (
          <div className="flex gap-3 pt-4 border-t">
            <AlertBtn
              btnText={
                <span className="flex items-center gap-2">
                  <Trash2 className="w-4 h-4" />
                  Delete
                </span>
              }
              textMsg={"Are you sure to delete this report ?"}
              onClick={() => handelDelete(report._id)}
              textDescription={
                "This action cannot be undone. This will permanently delete this report and corresponding images."
              }
            />
            <Button
              onClick={() => navigate(`/crime/${report._id}/edit`)}
              className="flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              <Edit3 className="w-4 h-4" />
              Edit
            </Button>
          </div>
        )}
      </CardContent>
    </div>
  );
}
