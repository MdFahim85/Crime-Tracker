import { Dialog, DialogContent } from "@/components/ui/dialog";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Download, Locate } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PDFDownloadLink } from "@react-pdf/renderer";
import PdfRender from "./PdfRender";

function PDF({ report, open, onClose }) {
  if (!report) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-fit  rounded-2xl p-8 z-100 bg-white shadow-2xl border-0 overflow-hidden">
        <Button className="w-full h-full p-4 bg-blue-500">
          <PDFDownloadLink
            document={<PdfRender report={report} />}
            fileName="Report.pdf"
          >
            {({ blob, url, loading, error }) =>
              loading ? "Report loading..." : "Report ready to download"
            }
          </PDFDownloadLink>
        </Button>
      </DialogContent>
    </Dialog>
  );
}

export default PDF;
