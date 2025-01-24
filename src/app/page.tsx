"use client"

import Image from "next/image"
import { useState } from "react"
import { ChevronLeft, ChevronRight, Luggage, RotateCcw } from "lucide-react"
import { useRouter } from "next/navigation"
import { useLanguage } from "./contexts/LanguageContext"

const translations = {
  ko: {
    monthlyNews: "이달의 소식",
    luggageStorage: "짐 보관",
    luggagePickup: "짐 수령",
    checkQueue: "수령 대기열 확인",
    korean: "한국어",
    english: "ENGLISH",
  },
  en: {
    monthlyNews: "Monthly News",
    luggageStorage: "Store Luggage",
    luggagePickup: "Pick Up Luggage",
    checkQueue: "Check Pickup Queue",
    korean: "한국어",
    english: "ENGLISH",
  },
}

export default function Page() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const router = useRouter()
  const { language, setLanguage } = useLanguage()
  const t = translations[language]

  const slides = [
    "/placeholder.svg?height=600&width=800",
    "/placeholder.svg?height=600&width=800",
    "/placeholder.svg?height=600&width=800",
    "/placeholder.svg?height=600&width=800",
  ]

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] justify-between px-4 sm:px-6 md:px-8 py-4 sm:py-6 md:py-8">
      {/* News Carousel */}
      <section className="mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-xl md:text-2xl font-bold mb-2 sm:mb-4">{t.monthlyNews}</h2>
        <div className="relative">
          <div className="aspect-[4/3] bg-gray-200 rounded-lg overflow-hidden relative">
            <Image
              src={slides[currentSlide] || "/placeholder.svg"}
              alt={`Slide ${currentSlide + 1}`}
              fill
              className="object-cover"
            />
            <button
              onClick={prevSlide}
              className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-white/50 p-2 md:p-3 rounded-full"
            >
              <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-white/50 p-2 md:p-3 rounded-full"
            >
              <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
            </button>
          </div>
          <div className="flex justify-center gap-2 mt-2 sm:mt-4">
            {slides.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 md:w-3 md:h-3 rounded-full ${
                  currentSlide === index ? "bg-blue-500" : "bg-gray-300"
                }`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Action Buttons */}
      <section className="mb-4 sm:mb-6 md:mb-8">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          <button
            onClick={() => router.push("/luggage/save")}
            className="bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-md flex flex-col items-center justify-center hover:shadow-lg transition-shadow"
          >
            <Luggage className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 mb-2 md:mb-4 text-gray-700" />
            <span className="text-base sm:text-lg md:text-xl font-medium">{t.luggageStorage}</span>
          </button>
          <button
            onClick={() => router.push("/luggage/pickup")}
            className="bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-md flex flex-col items-center justify-center hover:shadow-lg transition-shadow"
          >
            <RotateCcw className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 mb-2 md:mb-4 text-gray-700" />
            <span className="text-base sm:text-lg md:text-xl font-medium">{t.luggagePickup}</span>
          </button>
          <button className="bg-cyan-400 text-white p-4 sm:p-6 md:p-8 rounded-lg shadow-md flex flex-col items-center justify-center hover:shadow-lg transition-shadow col-span-2 md:col-span-1">
            <span className="text-base sm:text-lg md:text-xl font-medium text-center">{t.checkQueue}</span>
          </button>
        </div>
      </section>

      {/* Language Selection */}
      <section className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6">
        <button
          onClick={() => setLanguage("ko")}
          className="bg-blue-900 text-white py-2 sm:py-3 md:py-4 rounded-lg text-base sm:text-lg md:text-xl font-medium hover:bg-blue-800 transition-colors"
        >
          {t.korean}
        </button>
        <button
          onClick={() => setLanguage("en")}
          className="bg-blue-900 text-white py-2 sm:py-3 md:py-4 rounded-lg text-base sm:text-lg md:text-xl font-medium hover:bg-blue-800 transition-colors"
        >
          {t.english}
        </button>
      </section>
    </div>
  )
}

