"use client"

import type React from "react"

import { useState } from "react"

interface LineButtonProps {
  size?: "sm" | "md" | "lg"
  className?: string
  children?: React.ReactNode
}

export function LineButton({ size = "md", className = "", children }: LineButtonProps) {
  const [isHovered, setIsHovered] = useState(false)

  const sizeClasses = {
    sm: "py-1 px-3 text-xs",
    md: "py-2 px-4 text-sm",
    lg: "py-2.5 px-5 text-base",
  }

  return (
    <a
      href="https://lin.ee/DQTr7Il"
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
        sizeClasses[size]
      } ${className}`}
      style={{
        backgroundColor: isHovered ? "#05b249" : "#06C755",
        color: "white",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4 mr-2"
      >
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
      </svg>
      {children || "LINE友だち追加"}
    </a>
  )
}
