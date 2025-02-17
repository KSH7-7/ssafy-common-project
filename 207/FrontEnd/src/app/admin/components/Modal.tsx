'use client';

export const dynamic = 'force-static';

import { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode; // 부모에서 전달한 모든 JSX가 여기에 들어옵니다.
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-[800px] shadow-lg">
        {children}
        <button
          onClick={onClose}
          className="mt-4 bg-gray-500 text-white px-4 py-2 rounded w-full"
        >
          닫기
        </button>
      </div>
    </div>
  );
}
