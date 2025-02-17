import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Modal2({ isOpen, onClose }: ModalProps) {
  if (!isOpen) return null;

  // Get the current month (1-12) and create a padded string to match file naming.
  const currentMonth = new Date().getMonth() + 1;
  const paddedMonth = currentMonth < 10 ? `0${currentMonth}` : currentMonth.toString();
  const defaultImage = `month_${paddedMonth}.png`;

  // State for the selected image.
  const [selectedImage, setSelectedImage] = useState(defaultImage);
  // State for the processed (cropped and rotated) image.
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  // State for the final width (in pixels) after processing.
  const [finalWidth, setFinalWidth] = useState<number | null>(null);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedImage(e.target.value);
  };

  // Construct the image src – images are stored in /public/month.
  const imageSrc = `/month/${selectedImage}`;

  useEffect(() => {
    // Reset image while new one is being processed.
    setProcessedImage(null);
    const img = new Image();
    // Uncomment if you have cross-origin issues:
    // img.crossOrigin = "anonymous";
    img.src = imageSrc;
    img.onload = () => {
      const naturalWidth = img.naturalWidth;
      const naturalHeight = img.naturalHeight;
      // Calculate the crop amounts.
      const topCrop = naturalHeight * 0.30;
      const bottomCrop = naturalHeight * 0.07;
      const cropHeight = naturalHeight - topCrop - bottomCrop; // 63% of the original height
      
      // Create a canvas where after a 90° clockwise rotation:
      // • The final image's width equals the cropped height.
      // • The final image's height equals the original width.
      const canvas = document.createElement("canvas");
      canvas.width = cropHeight;
      canvas.height = naturalWidth;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        // Rotate canvas 90 deg clockwise.
        ctx.translate(cropHeight, 0);
        ctx.rotate(Math.PI / 2);
        // Draw the cropped region.
        // Source: from (0, topCrop) with width = naturalWidth and height = cropHeight.
        // Destination: (0,0) with the same dimensions (in the rotated coordinate system).
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
        // The final width after rotation is the cropped height.
        setFinalWidth(cropHeight);
      }
    };
  }, [imageSrc]);

  return (
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
          {/* Image preview area */}
          <div className="flex-1 flex flex-col items-center justify-center bg-white">
            {processedImage ? (
              <img
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
      <style jsx global>{`
        .scroll2::-webkit-scrollbar {
          width: 5px;
        }
      
        .scroll2::-webkit-scrollbar-thumb {
          background: #666;
        }
      
        .scroll2::-webkit-scrollbar-track {
          background: transparent;
        }
      `}</style>
    </div>
  );
}
