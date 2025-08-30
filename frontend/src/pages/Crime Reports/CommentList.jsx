import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

function CommentList({ comment, deleteCommentHandler }) {
  const authUser = useSelector((state) => state.auth.user);
  return (
    <li className="p-4 bg-slate-50 rounded-lg shadow-sm mt-4 border border-slate-200">
      <div className="flex justify-between items-center gap-4">
        <div className="flex items-center gap-3 flex-1">
          <img
            src={
              authUser.image.url
                ? authUser.image.url
                : "https://imgs.search.brave.com/6G4l561oIhgssjfbYvozwAIa5jx6fv6YhMrFjEGbdhM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4x/Lmljb25maW5kZXIu/Y29tL2RhdGEvaWNv/bnMvYXZhdGFyLXZv/bC05LzUxMi80LTEy/OC5wbmc"
            }
            alt={`${authUser.username}'s profile`}
            className="w-10 h-10 rounded-full object-cover border-2 border-slate-300"
          />
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
