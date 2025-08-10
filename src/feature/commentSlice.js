import { createSlice } from "@reduxjs/toolkit";

const comments = () => {
  const stored = localStorage.getItem("comments");
  return stored ? JSON.parse(stored) : [];
};

const initialState = { comments: comments() };

const commentSlice = createSlice({
  name: "comment",
  initialState,
  reducers: {
    addComment: (state, action) => {
      state.comments.push({
        id: Date.now(),
        user: action.payload.user,
        comment: action.payload.comment,
        reportId: action.payload.reportId,
      });
      localStorage.setItem("comments", JSON.stringify(state.comments));
    },
    deleteComment: (state, action) => {
      state.comments = state.comments.filter(
        (comment) => comment.id != action.payload
      );
      localStorage.setItem("comments", JSON.stringify(state.comments));
    },
  },
});

export const { addComment, deleteComment } = commentSlice.actions;
export default commentSlice.reducer;
