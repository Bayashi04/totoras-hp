"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { X, Calendar, Clock, BookOpen, MessageSquare, MessageCircle } from "lucide-react"
import { TOTORASLogo } from "@/components/totoras-logo"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("events")
  const menuRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // メニュー外クリックでメニューを閉じる
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMenuOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isMenuOpen])

  // スクロール位置に応じてアクティブセクションを更新
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["events", "upcoming", "all-events"]
      const scrollPosition = window.scrollY + 100 // ヘッダーの高さを考慮

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const offsetTop = element.offsetTop
          const offsetHeight = element.offsetHeight

          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  // TOTORASカラー
  const colors = {
    events: "#4ecdc4",
    upcoming: "#ff6b6b",
    "all-events": "#ffd93d",
  }

  return (
    <header className="sticky top-0 z-40 w-full bg-white shadow-md">
      <div className="container flex h-14 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/images/logo.png" alt="TOTORAS Logo" width={36} height={36} />
          <TOTORASLogo size="sm" />
        </Link>

        <nav className="hidden md:flex items-center bg-gray-50 rounded-full px-3 py-1 shadow-inner">
          <Link
            href="#events"
            className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors flex items-center gap-1.5 ${
              activeSection === "events" ? "bg-[#4ecdc4] text-white" : "text-gray-800 hover:bg-gray-200"
            }`}
          >
            <Calendar className="h-3.5 w-3.5" />
            <span>イベント内容</span>
          </Link>
          <Link
            href="/events"
            className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors flex items-center gap-1.5 ${
              activeSection === "upcoming" ? "bg-[#ff6b6b] text-white" : "text-gray-800 hover:bg-gray-200"
            }`}
          >
            <Clock className="h-3.5 w-3.5" />
            <span>次回のイベント</span>
          </Link>
          <Link
            href="/reports"
            className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors flex items-center gap-1.5 ${
              activeSection === "all-events" ? "bg-[#ffd93d] text-white" : "text-gray-800 hover:bg-gray-200"
            }`}
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span>これまでのイベント</span>
          </Link>
          <Link
            href="/contact"
            className="text-xs font-semibold px-3 py-1.5 rounded-full transition-colors flex items-center gap-1.5 text-gray-800 hover:bg-gray-200"
          >
            <MessageSquare className="h-3.5 w-3.5" />
            <span>お問い合わせ</span>
          </Link>
        </nav>

        <button
          ref={buttonRef}
          className="md:hidden relative w-7 h-5"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="メニューを開く"
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
        >
          {isMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <div className="flex flex-col justify-between h-full">
              <span className="block h-1 w-full rounded-full bg-[#ff6b6b]"></span>
              <span className="block h-1 w-full rounded-full bg-[#4ecdc4]"></span>
              <span className="block h-1 w-full rounded-full bg-[#ffd93d]"></span>
            </div>
          )}
        </button>
      </div>

      {/* モバイルメニュー */}
      {isMenuOpen && (
        <div
          id="mobile-menu"
          className="md:hidden fixed inset-0 top-14 z-50 bg-white/95 backdrop-blur-sm p-4 overflow-y-auto"
          role="navigation"
          aria-label="モバイルメニュー"
        >
          <nav ref={menuRef} className="flex flex-col gap-3 bg-gray-50 rounded-xl p-3 shadow-inner relative">
            <button
              className="absolute top-2 right-2 p-1 rounded-full bg-white shadow-sm"
              onClick={() => setIsMenuOpen(false)}
              aria-label="メニューを閉じる"
            >
              <X className="h-4 w-4 text-gray-500" />
            </button>
            <Link
              href="#events"
              className="text-base font-semibold p-2 rounded-lg flex items-center transition-colors bg-white shadow-sm hover:bg-gray-100 text-[#4ecdc4]"
              onClick={() => setIsMenuOpen(false)}
            >
              <Calendar className="h-5 w-5 mr-3" />
              <span>イベント内容</span>
            </Link>
            <Link
              href="/events"
              className="text-base font-semibold p-2 rounded-lg flex items-center transition-colors bg-white shadow-sm hover:bg-gray-100 text-[#ff6b6b]"
              onClick={() => setIsMenuOpen(false)}
            >
              <Clock className="h-5 w-5 mr-3" />
              <span>次回のイベント</span>
            </Link>
            <Link
              href="/reports"
              className="text-base font-semibold p-2 rounded-lg flex items-center transition-colors bg-white shadow-sm hover:bg-gray-100 text-[#ffd93d]"
              onClick={() => setIsMenuOpen(false)}
            >
              <BookOpen className="h-5 w-5 mr-3" />
              <span>これまでのイベント</span>
            </Link>
            <Link
              href="/contact"
              className="text-base font-semibold p-2 rounded-lg flex items-center transition-colors bg-white shadow-sm hover:bg-gray-100 text-gray-800"
              onClick={() => setIsMenuOpen(false)}
            >
              <MessageSquare className="h-5 w-5 mr-3" />
              <span>お問い合わせ</span>
            </Link>
            <a
              href="https://lin.ee/DQTr7Il"
              className="text-base font-semibold p-2 rounded-lg flex items-center transition-colors bg-[#06C755] shadow-sm hover:bg-[#05b249] text-white"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsMenuOpen(false)}
            >
              <MessageCircle className="h-5 w-5 mr-3" />
              <span>LINE友だち追加</span>
            </a>
          </nav>
        </div>
      )}
    </header>
  )
}
