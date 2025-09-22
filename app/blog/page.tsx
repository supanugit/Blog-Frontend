"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import Loading from "./loading";
import { useRouter } from "next/navigation";
import {
  FiMoreVertical,
  FiEdit,
  FiTrash2,
  FiEye,
  FiCalendar,
  FiUser,
} from "react-icons/fi";

type Blog = {
  _id: string;
  title: string;
  description: string;
  image: string;
  author: {
    _id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
};

type Data = {
  blog: Blog[];
  author: string[]; // IDs of blogs current user authored
};

export default function AllBlogsPage() {
  const [data, setData] = useState<Data>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([]);
  const router = useRouter();

  const fetchBlogs = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/blogs/`,
        {
          withCredentials: true,
        }
      );
      if (res.data.success) {
        setData(res.data.data);
        setFilteredBlogs(res.data.data.blog);
      } else {
        setError(res.data.message || "Failed to fetch blogs");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to fetch blogs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    if (data?.blog) {
      const filtered = data.blog.filter(
        (blog) =>
          blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          blog.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          blog.author.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredBlogs(filtered);
    }
  }, [searchTerm, data]);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleDelete = async (blogId: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;

    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/blogs/${blogId}`,
        { withCredentials: true }
      );
      fetchBlogs();
      setOpenMenuId(null);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to delete blog");
    }
  };

  if (loading) return <Loading />;
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 bg-gray-900">
        <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
          <h2 className="text-xl font-bold mb-2">Error</h2>
          <p>{error}</p>
          <button
            onClick={fetchBlogs}
            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors">
            Try Again
          </button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 mb-2">
            Blog Posts
          </h1>
          <p className="text-gray-400">
            Discover the latest articles and insights
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8 max-w-2xl mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search blogs by title, content, or author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-white placeholder-gray-500"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-3 text-gray-500 hover:text-white">
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Results Count */}
        {searchTerm && (
          <div className="mb-6 text-center">
            <p className="text-gray-400">
              Found {filteredBlogs.length} result
              {filteredBlogs.length !== 1 ? "s" : ""} for "{searchTerm}"
            </p>
          </div>
        )}

        {/* Blog Grid */}
        {filteredBlogs.length === 0 ? (
          <div className="text-center py-16">
            <h3 className="text-2xl font-semibold text-gray-300 mb-2">
              {searchTerm
                ? "No matching blogs found"
                : "No blogs available yet"}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm
                ? "Try a different search term"
                : "Be the first to create a blog post!"}
            </p>
            {!searchTerm && (
              <Link
                href="/blog/create-blog"
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors">
                Create Your First Blog
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBlogs.map((blog) => {
              const isAuthor = data?.author.includes(blog._id);
              return (
                <div
                  key={blog._id}
                  className="group relative bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                  {/* Blog Image */}
                  {blog.image && (
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={blog.image}
                        alt={blog.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-70"></div>
                      {isAuthor && (
                        <div className="absolute top-3 right-3">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setOpenMenuId(
                                openMenuId === blog._id ? null : blog._id
                              );
                            }}
                            className="p-1.5 bg-gray-900/70 hover:bg-gray-800/90 rounded-full backdrop-blur-sm transition-colors">
                            <FiMoreVertical className="text-white" />
                          </button>

                          {openMenuId === blog._id && (
                            <div className="absolute right-0 mt-2 w-36 bg-gray-800 rounded-lg shadow-xl z-50 overflow-hidden border border-gray-700">
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  router.push(`/blog/edit/${blog._id}`);
                                  setOpenMenuId(null);
                                }}
                                className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-700 transition-colors">
                                <FiEdit className="mr-2" /> Edit
                              </button>
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleDelete(blog._id);
                                }}
                                className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-gray-700 transition-colors">
                                <FiTrash2 className="mr-2" /> Delete
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Blog Content */}
                  <Link href={`/blog/${blog._id}`}>
                    <div className="p-5">
                      <h2 className="text-xl font-bold mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">
                        {blog.title}
                      </h2>
                      <p className="text-gray-400 mb-4 line-clamp-3">
                        {blog.description}
                      </p>

                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center">
                          <FiUser className="mr-1" />
                          <span>{blog.author?.name}</span>
                        </div>
                        <div className="flex items-center">
                          <FiCalendar className="mr-1" />
                          <span>{formatDate(blog.createdAt)}</span>
                        </div>
                      </div>

                      <div className="mt-4 flex justify-between items-center">
                        <span className="inline-flex items-center text-blue-400 text-sm">
                          <FiEye className="mr-1" /> Read more
                        </span>
                        {!blog.image && isAuthor && (
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setOpenMenuId(
                                openMenuId === blog._id ? null : blog._id
                              );
                            }}
                            className="p-1 text-gray-500 hover:text-white rounded-full">
                            <FiMoreVertical />
                          </button>
                        )}
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
