import { useSelector } from "react-redux";
import Button from "./Button";

function CommentList({ comment, deleteCommentHandler }) {
  const user = useSelector((state) => state.auth.user);
  return (
    <li className="p-3 bg-slate-50 rounded shadow-sm">
      <div className="flex justify-between">
        <div>
          <p className="text-md font-semibold">{comment.user.username}</p>
          <p className="text-gray-700 text-sm">{comment.comment}</p>
        </div>
        {user ? (
          comment.user.username == user.username ? (
            <Button
              type={"button"}
              text={"delete"}
              className={
                "block mt-2 md:mt-0 px-2 py-1 rounded border-2 text-red-500 border-red-500 hover:bg-red-500 hover:text-white"
              }
              onClick={() => deleteCommentHandler(comment.id)}
            />
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
