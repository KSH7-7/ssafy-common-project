import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Modal2({ isOpen, onClose }: ModalProps) {
  const currentMonth = new Date().getMonth() + 1;
  const paddedMonth = currentMonth < 10 ? `0${currentMonth}` : currentMonth.toString();
  const defaultImage = `month_${paddedMonth}.png`;

  const [selectedImage, setSelectedImage] = useState(defaultImage);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [finalWidth, setFinalWidth] = useState<number | null>(null); // 추가된 상태
  // 억지로 회피
  console.log(finalWidth);
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedImage(e.target.value);
  };

  const imageSrc = `/month/${selectedImage}`;

  useEffect(() => {
    if (!isOpen) return;
    setProcessedImage(null);
    const img = new window.Image();
    img.src = imageSrc;
    img.onload = () => {
      const naturalWidth = img.naturalWidth;
      const naturalHeight = img.naturalHeight;
      const topCrop = naturalHeight * 0.3;
      const bottomCrop = naturalHeight * 0.07;
      const cropHeight = naturalHeight - topCrop - bottomCrop;

      const canvas = document.createElement("canvas");
      canvas.width = cropHeight;
      canvas.height = naturalWidth;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.translate(cropHeight, 0);
        ctx.rotate(Math.PI / 2);
        ctx.drawImage(
          img,
          0,
          topCrop,
          naturalWidth,
          cropHeight,
          0,
          0,
          naturalWidth,
          cropHeight
        );
        const dataUrl = canvas.toDataURL();
        setProcessedImage(dataUrl);
        setFinalWidth(cropHeight); // 상태 업데이트
      }
    };
  }, [imageSrc, isOpen]);

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-8">
          <motion.div
            style={{ fontFamily: "'검색'" }}
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="w-[70vw] h-[70vh] flex flex-col bg-white text-gray-900 rounded-lg shadow-lg p-6"
          >
            <header className="flex items-center justify-center mb-4 space-x-4">
              <h1 className="text-2xl md:text-3xl font-bold">월 이미지 선택</h1>
              <select
                value={selectedImage}
                onChange={handleSelectChange}
                className="p-2 border border-gray-300 rounded"
              >
                {Array.from({ length: 12 }, (_, index) => {
                  const monthNumber = index + 1;
                  const padded = monthNumber < 10 ? `0${monthNumber}` : monthNumber.toString();
                  return (
                    <option key={monthNumber} value={`month_${padded}.png`}>
                      {monthNumber}월
                    </option>
                  );
                })}
              </select>
            </header>
            <main className="flex-1 flex flex-col">
              <div className="flex-1 flex flex-col items-center justify-center bg-white">
                {processedImage ? (
                  <Image
                    src={processedImage}
                    alt={`Cropped Month ${selectedImage}`}
                    className="max-w-full max-h-full"
                    style={{ objectFit: "contain", backgroundColor: "white" }}
                  />
                ) : (
                  <div>로딩 중...</div>
                )}
              </div>
            </main>
            <footer className="mt-4">
              <button
                onClick={onClose}
                className="w-full px-4 py-2 bg-gray-700 text-gray-200 hover:bg-gray-600"
              >
                닫기
              </button>
            </footer>
          </motion.div>
        </div>
      )}
    </>
  );
}
