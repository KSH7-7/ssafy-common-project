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
            介绍
          </h1>
        </header>
        <main className="flex-1 overflow-y-auto scroll2 space-y-4 text-base pr-2">
          <p>
          Keepro是一个先进的自动化存储服务, 帮助用户安全快速地存放和取回物品。
            
          </p>
          <section>
            <h2 className="text-2xl font-semibold mb-2">仓库信息</h2>
            <p>
            Keepro运营三个仓库, A、B、C。每个仓库拥有60个存储空间, 可以有效地存放各种大小的物品。
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-2">自动化系统</h2>
            <p>
            用户交付物品后，先进的机器人会自动进行存放和取回过程。
            这样，用户可以体验到更快更准确的物品管理服务。
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-2">使用方法</h2>
            <ol className="list-decimal list-inside ml-4 space-y-2">
              <li>查看仓库信息和存储空间，选择所需的仓库 (A、B或C) 。</li>
              <li>交付物品后，机器人会自动处理存放。</li>
              <li>当需要物品时，通过应用程序或网站请求，机器人会为您取回。</li>
            </ol>
          </section>
        </main>

        <footer className="mt-4">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-700 text-gray-200 hover:bg-gray-600"
          >
            关闭
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
