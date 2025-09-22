"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { FiHome, FiPlus, FiMenu, FiX, FiBookOpen } from "react-icons/fi";
import { useState } from "react";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  return (
    <header className="w-full bg-gray-900/90 backdrop-blur-md border-b border-gray-700 text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between py-3 px-4 sm:px-6">
        {/* Logo */}
        <div
          className="text-2xl font-bold cursor-pointer bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"
          onClick={() => router.push("/")}>
          DevSpark Blog
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-4">
          <button
            onClick={() => router.push("/")}
            className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
              isActive("/")
                ? "bg-blue-600 text-white"
                : "text-gray-300 hover:text-white hover:bg-gray-800"
            }`}>
            <FiHome className="mr-2" /> Home
          </button>

          <button
            onClick={() => router.push("/blog/create-blog")}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all px-4 py-2 rounded-lg font-semibold flex items-center gap-2 shadow-lg hover:shadow-blue-500/25">
            <FiPlus className="h-5 w-5" /> Create Blog
          </button>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-gray-800 transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? (
            <FiX className="h-6 w-6" />
          ) : (
            <FiMenu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-800 border-t border-gray-700 px-4 py-4">
          <div className="flex flex-col space-y-3">
            <button
              onClick={() => {
                router.push("/");
                setIsMenuOpen(false);
              }}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                isActive("/")
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:text-white hover:bg-gray-700"
              }`}>
              <FiHome className="mr-2" /> Home
            </button>

            <button
              onClick={() => {
                router.push("/blog/create-blog");
                setIsMenuOpen(false);
              }}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all px-4 py-2 rounded-lg font-semibold flex items-center gap-2 justify-center">
              <FiPlus className="h-5 w-5" /> Create Blog
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
