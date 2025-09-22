"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import {
  FiArrowLeft,
  FiCalendar,
  FiUser,
  FiMessageSquare,
  FiSend,
  FiClock,
} from "react-icons/fi";

type Blog = {
  _id: string;
  title: string;
  description: string;
  image: string;
  author: { name: string };
  createdAt: string;
  updatedAt: string;
};

type CommentType = {
  _id: string;
  comment: string;
  userId: { email: string; name?: string };
  createdAt: string;
};

export default function SingleBlogPage() {
  const { id } = useParams();
  const router = useRouter();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<
    "success" | "error" | "warning"
  >("warning");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchBlogAndComments = async () => {
      try {
        // Fetch blog

        const blogRes = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/blogs/${id}`,
          {
            withCredentials: true,
          }
        );

        if (blogRes.data.success) setBlog(blogRes.data.data);

        // Fetch comments
        const commentRes = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/blogs/comments/${id}`,
          { withCredentials: true }
        );
        console.log(commentRes);
        if (commentRes.data.success) setComments(commentRes.data.data);
      } catch (err: any) {
        console.error(err);
        setError(
          err.response?.data?.message || "Failed to fetch blog or comments"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchBlogAndComments();
  }, [id]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) {
      setMessage("⚠️ Comment cannot be empty!");
      setMessageType("warning");
      return;
    }

    try {
      setSubmitting(true);
      setMessage("");
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/blogs/comment/${id}`,
        { id, ucomment: commentText },
        { withCredentials: true }
      );

      if (res.data.success) {
        setMessage("✅ Comment added successfully!");
        setMessageType("success");
        setCommentText("");

        // Refresh comments
        const commentRes = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/blogs/comments/${id}`,
          { withCredentials: true }
        );
        if (commentRes.data.success) setComments(commentRes.data.data);

        // Clear success message after 3 seconds
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage("❌ Failed to add comment");
        setMessageType("error");
      }
    } catch (err: any) {
      console.error(err);
      setMessage(err.response?.data?.message || "❌ Failed to add comment");
      setMessageType("error");
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const timeSince = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";

    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";

    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";

    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";

    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";

    return Math.floor(seconds) + " seconds ago";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-white text-lg">Loading blog post...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="text-center p-8 bg-gray-800/70 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-700 max-w-md">
          <h2 className="text-2xl font-bold text-red-400 mb-4">Error</h2>
          <p className="text-gray-300 mb-6">Login First</p>
          <button
            onClick={() => router.replace("/login")}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors text-white flex items-center mx-auto">
            <FiArrowLeft className="mr-2" /> Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-400 hover:text-white transition-colors mb-6 p-2 rounded-lg hover:bg-gray-800/50">
          <FiArrowLeft className="mr-2" /> Back to Blogs
        </button>

        {/* Blog Content */}
        <article className="bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden shadow-2xl border border-gray-700 mb-8">
          {/* Blog Image */}
          {blog?.image && (
            <div className="w-full h-80 sm:h-96 overflow-hidden">
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Blog Content */}
          <div className="p-6 sm:p-8">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              {blog?.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-400">
              <div className="flex items-center">
                <FiUser className="mr-2 text-blue-400" />
                <span>{blog?.author?.name}</span>
              </div>
              <div className="flex items-center">
                <FiCalendar className="mr-2 text-purple-400" />
                <span>{blog?.createdAt && formatDate(blog.createdAt)}</span>
              </div>
            </div>

            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 leading-7 text-lg whitespace-pre-line">
                {blog?.description}
              </p>
            </div>
          </div>
        </article>

        {/* Comments Section */}
        <section className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 shadow-2xl">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <FiMessageSquare className="mr-2 text-blue-400" />
            Comments {comments.length > 0 && `(${comments.length})`}
          </h2>

          {/* Add Comment Form */}
          <form onSubmit={handleCommentSubmit} className="mb-8">
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <div className="flex-1">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Share your thoughts..."
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-white placeholder-gray-500 resize-none"
                  rows={3}
                  maxLength={500}
                />
                <p className="text-xs text-gray-500 mt-1 text-right">
                  {commentText.length}/500 characters
                </p>
              </div>
              <button
                type="submit"
                disabled={submitting || !commentText.trim()}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg font-medium transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed h-12">
                {submitting ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <FiSend className="mr-2" /> Post
                  </>
                )}
              </button>
            </div>

            {message && (
              <div
                className={`mt-4 p-3 rounded-lg ${
                  messageType === "success"
                    ? "bg-green-900/30 text-green-400 border border-green-800"
                    : messageType === "error"
                    ? "bg-red-900/30 text-red-400 border border-red-800"
                    : "bg-yellow-900/30 text-yellow-400 border border-yellow-800"
                }`}>
                {message}
              </div>
            )}
          </form>

          {/* Comments List */}
          <div className="space-y-4">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div
                  key={comment._id}
                  className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
                        {comment.userId.name![0].toLocaleUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-white">
                          {comment.userId.name}
                        </p>
                        <p className="text-xs text-gray-400 flex items-center">
                          <FiClock className="mr-1" />{" "}
                          {timeSince(comment.createdAt)}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">
                      {formatDate(comment.createdAt)}
                    </span>
                  </div>
                  <p className="text-gray-300 ml-11">{comment.comment}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-400">
                <FiMessageSquare className="text-4xl mx-auto mb-4 opacity-50" />
                <p>No comments yet. Be the first to share your thoughts!</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
