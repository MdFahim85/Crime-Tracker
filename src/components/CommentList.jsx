import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";

function CommentList({ comment, deleteCommentHandler }) {
  const user = useSelector((state) => state.auth.user);
  return (
    <li className="p-3 bg-slate-50 rounded shadow-sm">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-md font-semibold">{comment.user.username}</p>
          <p className="text-gray-700 text-sm">{comment.comment}</p>
        </div>
        {user ? (
          comment.user.username == user.username ? (
            <Button
              className="border border-red-500 bg-white text-red-500 hover:text-white hover:bg-red-500"
              onClick={() => deleteCommentHandler(comment.id)}
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
