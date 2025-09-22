"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import {
  FiArrowLeft,
  FiSave,
  FiEdit2,
  FiImage,
  FiLoader,
} from "react-icons/fi";

export default function EditBlogPage() {
  const { id } = useParams();
  const router = useRouter();
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Fetch blog by ID
  useEffect(() => {
    if (!id) return;

    const fetchBlog = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/blogs/${id}`,
          { withCredentials: true }
        );
        setBlog(res.data?.data);
        if (res.data?.data.image) {
          setImagePreview(res.data.data.image);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blog) return;

    try {
      setSaving(true);

      // Update the blog
      await axios.patch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/blogs/${id}`,
        {
          title: blog.title,
          description: blog.description,
        },
        { withCredentials: true }
      );

      alert("✅ Blog updated successfully!");
      router.replace(`/blog/${id}`);
    } catch (error) {
      console.error(error);
      alert("❌ Failed to update blog");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="flex flex-col items-center">
          <FiLoader className="animate-spin text-4xl text-blue-500 mb-4" />
          <p className="text-white text-lg">Loading blog content...</p>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="text-center p-8 bg-gray-800/70 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-700">
          <h2 className="text-2xl font-bold text-red-400 mb-4">
            ❌ Blog Not Found
          </h2>
          <p className="text-gray-300 mb-6">
            The blog you're trying to edit doesn't exist or you don't have
            permission to edit it.
          </p>
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center mx-auto px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors text-white">
            <FiArrowLeft className="mr-2" /> Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-400 hover:text-white transition-colors mr-4">
            <FiArrowLeft className="text-xl" />
          </button>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            Edit Blog Post
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Image Upload Section */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 shadow-lg">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <FiImage className="mr-2 text-blue-400" /> Blog Image
            </h2>

            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Image Preview
                </label>
                <div className="h-40 bg-gray-900/50 rounded-lg border border-gray-700 flex items-center justify-center overflow-hidden">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-500">No image selected</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Title Input */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 shadow-lg">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <FiEdit2 className="mr-2 text-blue-400" /> Blog Title
            </h2>
            <input
              type="text"
              value={blog.title}
              onChange={(e) => setBlog({ ...blog, title: e.target.value })}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-white placeholder-gray-500"
              placeholder="Enter a captivating title..."
              required
            />
          </div>

          {/* Description Input */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 shadow-lg">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <FiEdit2 className="mr-2 text-blue-400" /> Content
            </h2>
            <textarea
              value={blog.description}
              onChange={(e) =>
                setBlog({ ...blog, description: e.target.value })
              }
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-white placeholder-gray-500 h-60 resize-none"
              placeholder="Write your blog content here..."
              required
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-end pt-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 border border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg font-medium transition-colors flex items-center justify-center">
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg font-medium transition-all flex items-center justify-center disabled:opacity-50">
              {saving ? (
                <>
                  <FiLoader className="animate-spin mr-2" /> Saving...
                </>
              ) : (
                <>
                  <FiSave className="mr-2" /> Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
