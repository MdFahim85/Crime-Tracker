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

function AlertBtn({ btnText, textMsg, textDescription, onClick }) {
  return (
    <div className="z-999">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="second">{btnText}</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{textMsg}</AlertDialogTitle>
            <AlertDialogDescription>{textDescription}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border border-slate-500 bg-white text-slate-500 hover:text-white hover:bg-slate-500">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="border border-red-500 bg-white text-red-500 hover:text-white hover:bg-red-500"
              onClick={() => onClick()}
            >
              {btnText}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default AlertBtn;
