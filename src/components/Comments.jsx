import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addComment, deleteComment } from "../feature/commentSlice";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CommentList from "./CommentList";
import { addNotification } from "../feature/notificationSlice";

function Comments({ comment, setComment, user, report }) {
  const dispatch = useDispatch();
  const comments = useSelector((state) => state.comment.comments);
  const filterComments = useMemo(() => {
    return comments.filter((comment) => comment.reportId === report.id);
  }, [comments, report.id]);

  function addCommentHandler() {
    if (!user) {
      toast.error("Please log in to comment");
      return;
    }
    if (!comment.length) {
      toast.error("Please write a comment");
      return;
    }
    const commentObj = {
      user,
      comment,
      reportId: report.id,
    };
    const message = `${user} commented on your report`;
    dispatch(addComment(commentObj));
    if (report.user != user) {
      dispatch(addNotification(report.user, message));
    }
    setComment("");
  }

  function deleteCommentHandler(id) {
    dispatch(deleteComment(id));
    toast.success("Comment Deleted Successfully");
  }
  return (
    <>
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 max-h-[400px]">
        <ul>
          {filterComments.length ? (
            filterComments.map((comment) => (
              <CommentList
                comment={comment}
                deleteCommentHandler={deleteCommentHandler}
                key={comment.id}
              />
            ))
          ) : (
            <li>
              <p className="text-red-500">No comments yet</p>
            </li>
          )}
        </ul>
      </div>
      <form className="flex space-x-2" onSubmit={(e) => e.preventDefault()}>
        <Input
          type="text"
          placeholder="Add a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-500"
        />
        <Button
          className="border border-slate-500 bg-white text-slate-500 hover:text-white hover:bg-slate-500"
          onClick={() => addCommentHandler()}
        >
          Comment
        </Button>
      </form>
    </>
  );
}

export default Comments;
