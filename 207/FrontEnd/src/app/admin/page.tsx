"use client"

import { useState } from 'react'
import Image from 'next/image'

export default function HomePage() {
  // public 폴더에 있는 이미지 파일명들을 배열에 추가합니다.
  const images = [
    '/main1.jpg',
    '/main2.jpg',
    '/main3.jpg',
    '/main4.jpg', 
  ]

  const [current, setCurrent] = useState(0)

  // 이전 슬라이드로 이동하는 함수
  const goPrev = () => {
    setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  // 다음 슬라이드로 이동하는 함수
  const goNext = () => {
    setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  return (
    <div className="min-h-screen">
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">운영안내</h1>
        <div className="relative bg-gray-200 aspect-[16/9] rounded-lg overflow-hidden">
          {/* 이미지 슬라이드 영역 */}
          <div className="relative h-full w-full">
            <Image 
              src={images[current]} 
              alt={`슬라이드 이미지 ${current + 1}`} 
              fill
              style={{ objectFit: 'cover' }}
              priority
            />
          </div>
          {/* 좌우 이동 버튼 */}
          <div className="absolute inset-0 flex items-center justify-between p-4">
            <button 
              className="p-2 rounded-full bg-white/80 hover:bg-white"
              onClick={goPrev}
            >
              &lt;
            </button>
            <button 
              className="p-2 rounded-full bg-white/80 hover:bg-white"
              onClick={goNext}
            >
              &gt;
            </button>
          </div>
          {/* 슬라이드 인디케이터 */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
            {images.map((_, i) => (
              <button
                key={i}
                className={`w-3 h-3 rounded-full ${i === current ? 'bg-black' : 'bg-gray-500'}`}
                onClick={() => setCurrent(i)}
              />
            ))}
          </div>
    
</div>
      </main>
    </div>
  )
}