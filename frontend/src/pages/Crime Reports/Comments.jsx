import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CommentList from "./CommentList";
import API from "../../api/axios";
import { useEffect, useState } from "react";
import { Send, MessageCircle } from "lucide-react";

function Comments({ comment, setComment, user, report }) {
  const [comments, setComments] = useState([]);
  const fetchComments = async () => {
    try {
      const res = await API.get(`/reports/${report._id}/comments`);
      setComments(res.data.comments);
    } catch (error) {
      console.log(error);
      setComments([]);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  async function addCommentHandler() {
    if (!user) {
      toast.error("Please log in to comment");
      return;
    }
    if (!comment.length) {
      toast.error("Please write a comment");
      return;
    }
    const commentObj = {
      user: user._id,
      comment,
      report: report._id,
    };
    try {
      const res = await API.post(`/reports/${report._id}/comments`, commentObj);
      toast.success(res.data.message);
      fetchComments();
    } catch (error) {
      console.log(error);
    }

    setComment("");
  }

  async function deleteCommentHandler(id) {
    try {
      const res = await API.delete(`/reports/${report._id}/comments/${id}`);
      toast.success(res.data.message);
      fetchComments();
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <>
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 max-h-[400px]">
        <ul>
          {comments.length ? (
            comments.map((comment) => (
              <CommentList
                comment={comment}
                deleteCommentHandler={deleteCommentHandler}
                key={comment._id}
              />
            ))
          ) : (
            <li className="flex flex-col items-center py-8 text-center">
              <MessageCircle className="w-12 h-12 text-slate-400 mb-3" />
              <p className="text-slate-500 font-medium">No comments yet</p>
              <p className="text-slate-400 text-sm">
                Be the first to share your thoughts
              </p>
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
          onClick={() => addCommentHandler()}
          className="bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Send className="w-4 h-4" />
          Comment
        </Button>
      </form>
    </>
  );
}

export default Comments;
