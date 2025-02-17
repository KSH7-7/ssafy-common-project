import { motion } from "framer-motion";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Modal1({ isOpen, onClose }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-8">
      <motion.div
        style={{ fontFamily: "'검색'" }}
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="w-[70vw] h-[70vh] flex flex-col bg-white text-gray-900 rounded-lg shadow-lg p-6 "
      >

        <header className="text-center mb-4">
          <h1 className="text-4xl font-bold">
            <span className="bg-gradient-to-r from-purple-500 to-sky-300 bg-clip-text text-transparent drop-shadow-md">
              Keepro
            </span>{" "}
            소개
          </h1>
        </header>
        <main className="flex-1 overflow-y-auto scroll2 space-y-4 text-base pr-2">
          <p>
            Keepro는 사용자가 소지품을 안전하고 신속하게 보관 및 회수할 수 있도록 돕는 첨단 자동화 보관 서비스입니다.
            
          </p>
          <section>
            <h2 className="text-2xl font-semibold mb-2">창고 정보</h2>
            <p>
              Keepro는 세 개의 창고, A, B, C를 운영합니다. 각 창고는 60자리의 수납 공간을 보유하여,
              다양한 크기의 물건도 효율적으로 보관할 수 있습니다.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-2">자동화 시스템</h2>
            <p>
              사용자가 물건을 맡기면 첨단 로봇이 수납 및 수령 과정을 자동으로 진행합니다.
              이로써, 보다 빠르고 정확한 물품 관리 서비스를 경험할 수 있습니다.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-2">사용 방법</h2>
            <ol className="list-decimal list-inside ml-4 space-y-2">
              <li>창고 정보 및 수납 공간을 확인하고 원하는 창고(A, B, 또는 C)를 선택합니다.</li>
              <li>물건을 맡기면 로봇이 자동으로 수납을 처리합니다.</li>
              <li>물건이 필요할 때 앱 또는 웹사이트에서 요청하면 로봇이 회수해드립니다.</li>
            </ol>
          </section>
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
