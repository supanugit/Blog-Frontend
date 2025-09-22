"use client";
import React, { useState, useRef } from "react";
import axios from "axios";
import {
  FiUpload,
  FiImage,
  FiEdit2,
  FiType,
  FiSave,
  FiArrowLeft,
} from "react-icons/fi";
import { useRouter } from "next/navigation";

type Props = {};

export default function Page({}: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<
    "success" | "error" | "warning"
  >("warning");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setMessage("❌ Image size must be less than 5MB");
        setMessageType("error");
        return;
      }

      // Check file type
      if (!file.type.startsWith("image/")) {
        setMessage("❌ Please select an image file");
        setMessageType("error");
        return;
      }

      setImage(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      setMessage("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      setMessage("⚠️ Title and description are required!");
      setMessageType("warning");
      return;
    }

    if (!image) {
      setMessage("⚠️ Please select an image for your blog");
      setMessageType("warning");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("description", description.trim());
      formData.append("image", image);

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/blogs/`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      setMessage("✅ Blog created successfully! Redirecting...");
      setMessageType("success");

      // Redirect to blogs page after 2 seconds
      setTimeout(() => {
        router.replace("/blog");
      }, 2000);
    } catch (error: any) {
      console.error(error);
      setMessage("❌ Failed to create blog. Please try again.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-400 hover:text-white transition-colors mr-4 p-2 rounded-full hover:bg-gray-800">
            <FiArrowLeft className="text-xl" />
          </button>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            Create New Blog Post
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload Section */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 shadow-lg">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <FiImage className="mr-2 text-blue-400" /> Blog Image
            </h2>

            <div className="flex flex-col md:flex-row gap-6 items-start">
              {/* Upload Area */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Upload Image
                </label>
                <div
                  onClick={triggerFileInput}
                  className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-blue-500 transition-colors bg-gray-900/50 p-4 text-center">
                  {imagePreview ? (
                    <div className="relative w-full h-full">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-contain rounded-md"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-60 flex items-center justify-center transition-opacity opacity-0 hover:opacity-100">
                        <FiUpload className="text-2xl text-white" />
                        <span className="text-white ml-2">Change Image</span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <FiUpload className="w-10 h-10 mb-3 text-gray-500" />
                      <p className="mb-2 text-sm text-gray-400">
                        Click to upload an image
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, JPEG (Max 5MB)
                      </p>
                    </>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    onChange={handleImageChange}
                    accept="image/*"
                    required
                  />
                </div>
              </div>

              {/* Requirements */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Image Guidelines
                </label>
                <div className="text-sm text-gray-400 space-y-2 p-4 bg-gray-900/50 rounded-lg">
                  <p>• Use high-quality images</p>
                  <p>• Recommended ratio: 16:9</p>
                  <p>• Max file size: 5MB</p>
                  <p>• Supported formats: JPG, PNG, JPEG</p>
                </div>
              </div>
            </div>
          </div>

          {/* Title Input */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 shadow-lg">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <FiType className="mr-2 text-blue-400" /> Blog Title
            </h2>
            <input
              type="text"
              placeholder="Enter a captivating title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-white placeholder-gray-500"
              required
              maxLength={100}
            />
            <p className="text-xs text-gray-500 mt-2 text-right">
              {title.length}/100 characters
            </p>
          </div>

          {/* Description Input */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 shadow-lg">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <FiEdit2 className="mr-2 text-blue-400" /> Blog Content
            </h2>
            <textarea
              placeholder="Write your blog content here..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-white placeholder-gray-500 min-h-40 resize-none"
              required
              maxLength={5000}
            />
            <p className="text-xs text-gray-500 mt-2 text-right">
              {description.length}/5000 characters
            </p>
          </div>

          {/* Message Display */}
          {message && (
            <div
              className={`p-4 rounded-lg ${
                messageType === "success"
                  ? "bg-green-900/30 text-green-400 border border-green-800"
                  : messageType === "error"
                  ? "bg-red-900/30 text-red-400 border border-red-800"
                  : "bg-yellow-900/30 text-yellow-400 border border-yellow-800"
              }`}>
              {message}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-end pt-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 border border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg font-medium transition-colors"
              disabled={loading}>
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg font-medium transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Creating...
                </>
              ) : (
                <>
                  <FiSave className="mr-2" /> Create Post
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
