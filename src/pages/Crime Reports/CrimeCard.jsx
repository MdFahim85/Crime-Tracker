import AlertBtn from "../../components/AlertBtn";
import { Button } from "@/components/ui/button";

export function CrimeCard({ report, user, handelDelete, navigate }) {
  return (
    <div className="mt-4">
      <h2 className="text-2xl font-bold">{report.title}</h2>
      <p className="text-gray-600 mt-2">{report.details}</p>
      <div className="mt-3 space-y-1 text-sm text-gray-500">
        <p>
          <strong>Street:</strong> {report.street}
        </p>
        <p>
          <strong>Date:</strong>{" "}
          {new Date(report.date).toLocaleDateString("en-GB")}
        </p>
        <p>
          <strong>Author:</strong> {report.user}
        </p>
      </div>

      <div
        className={
          user && user.username === report.user
            ? "flex justify-start gap-2 pt-3"
            : "hidden"
        }
      >
        <AlertBtn
          btnText={"Delete"}
          textMsg={"Are you sure to delete this report ?"}
          onClick={() => handelDelete(report.id)}
          textDescription={
            "This action cannot be undone. This will permanently delete your account and remove your data from our servers."
          }
        />
        <Button
          variant="primary"
          onClick={() => navigate(`/crime/${report.id}/edit`)}
        >
          Edit
        </Button>
      </div>
    </div>
  );
}
