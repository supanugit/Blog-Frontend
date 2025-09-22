"use client";

import React from "react";
import { FiLoader } from "react-icons/fi";

export default function Loading() {
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      {/* Animated spinner with icon */}
      <div className="relative w-16 h-16 mb-6">
        <div className="absolute inset-0 rounded-full border-4 border-blue-500/30"></div>
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 animate-spin"></div>
        <div className="absolute inset-2 rounded-full bg-blue-600 flex items-center justify-center">
          <FiLoader className="text-white text-lg animate-pulse" />
        </div>
      </div>

      {/* Bouncing dots */}
      <div className="flex space-x-2 mb-4">
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce"></div>
      </div>

      {/* Text content */}
      <p className="text-white/80 text-lg font-medium">
        Loading your content...
      </p>
    </div>
  );
}
