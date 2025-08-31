import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function SuggestionTrigger({ r, handleSuggest, suggestion, setSuggestion }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="second" size="sm">
          Reject
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>Reject Report</AlertDialogTitle>
          <AlertDialogDescription>
            Please provide a suggestion or reason for rejection.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Input
          placeholder="Write your suggestion..."
          value={suggestion}
          onChange={(e) => setSuggestion(e.target.value)}
          className="my-2"
        />

        <AlertDialogFooter className="flex gap-2">
          <AlertDialogAction
            onClick={() => {
              handleSuggest(r._id, suggestion);
              setSuggestion("");
            }}
            className="border border-blue-500 bg-white text-blue-500 hover:text-white hover:bg-blue-500"
          >
            Suggest
          </AlertDialogAction>
          <AlertDialogCancel className="border border-red-500 bg-white text-red-500 hover:text-white hover:bg-red-500">
            Cancel
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default SuggestionTrigger;
