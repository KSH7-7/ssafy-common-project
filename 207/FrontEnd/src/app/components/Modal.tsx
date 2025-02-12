import { motion } from "framer-motion";
import Image from "next/image";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
}

export default function Modal({ isOpen, onClose, imageSrc }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="bg-white rounded-lg overflow-hidden max-w-lg w-full relative"
      >
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 bg-gray-200 p-2 rounded-full"
        >
          ✕
        </button>

        {/* 모달 내부 이미지 */}
        <Image
          src={imageSrc}
          alt="Slide Image"
          width={800}
          height={600}
          className="w-full h-auto object-cover"
        />
      </motion.div>
    </div>
  );
}
