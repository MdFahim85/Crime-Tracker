import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";

function CommentList({ comment, deleteCommentHandler }) {
  const authUser = useSelector((state) => state.auth.user);
  return (
    <li className="p-3 bg-slate-50 rounded shadow-sm mt-4">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-md font-semibold">{comment.user.username}</p>
          <p className="text-gray-700 text-sm">{comment.comment}</p>
        </div>
        {authUser ? (
          comment.user.username == authUser.username ? (
            <Button
              variant="second"
              onClick={() => deleteCommentHandler(comment._id)}
            >
              Delete
            </Button>
          ) : (
            ""
          )
        ) : (
          ""
        )}
      </div>
    </li>
  );
}

export default CommentList;
