import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

function CommentList({ comment, deleteCommentHandler }) {
  const authUser = useSelector((state) => state.auth.user);
  return (
    <li className="p-4 bg-slate-50 rounded-lg shadow-sm mt-4 border border-slate-200">
      <div className="flex justify-between items-center gap-4">
        <div className="flex items-center gap-3 flex-1">
          <div className="flex-1">
            <p className="text-md font-semibold text-slate-800 mb-1">
              {comment.user.username}
            </p>
            <p className="text-gray-700 text-sm leading-relaxed">
              {comment.comment}
            </p>
          </div>
        </div>
        {authUser && comment.user.username == authUser.username && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => deleteCommentHandler(comment._id)}
            className="text-red-500 border-red-200 hover:bg-red-500 hover:text-white transition-colors flex items-center gap-1"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </Button>
        )}
      </div>
    </li>
  );
}

export default CommentList;
