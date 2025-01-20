import Comment from "../Models/Comment";
import { handleError } from "../utils";
import { Request, Response } from "express";

export const createComment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { content, postId } = req.body;

    const comment = new Comment({ content, postId, user: req.user });
    await comment.save();

    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ error: handleError(err) });
  }
};

export const getAllComments = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const comments = await Comment.find();
    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({ error: handleError(err) });
  }
};

export const updateComment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    const comment = await Comment.findByIdAndUpdate(
      id,
      { content, user: req.user },
      { new: true, runValidators: true }
    );

    if (!comment) {
      res.status(404).json({ error: "Comment not found" });
      return;
    }

    res.status(200).json(comment);
  } catch (err) {
    res.status(500).json({ error: handleError(err) });
  }
};

export const deleteComment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const comment = await Comment.findById(id);

    if (!comment) {
      res.status(404).json({ error: "Comment not found" });
      return;
    } else if (
      (comment.user as any).toString() !== (req.user as any).toString()
    ) {
      res.status(405).json({ error: "Not comment owner" });
      return;
    }

    await Comment.findByIdAndDelete(id);
    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: handleError(err) });
  }
};

export const getCommentsByPostId = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { postId } = req.params;

    const comments = await Comment.find({ postId });
    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({ error: handleError(err) });
  }
};
