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
            Introduction
          </h1>
        </header>
        <main className="flex-1 overflow-y-auto scroll2 space-y-4 text-base pr-2">
          <p>
            Keepro is an advanced automated storage service that helps users securely and quickly store and retrieve their belongings.
          </p>
          <section>
            <h2 className="text-2xl font-semibold mb-2">Warehouse Information</h2>
            <p>
              Keepro operates three warehouses, A, B, and C. Each warehouse has 60 storage spaces, allowing for efficient storage of items of various sizes.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-2">Automation System</h2>
            <p>
              When users hand over their items, advanced robots automatically handle the storage and retrieval processes.
              This allows for a faster and more accurate item management service.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-2">How to Use</h2>
            <ol className="list-decimal list-inside ml-4 space-y-2">
              <li>Check warehouse information and available storage space, then select the desired warehouse (A, B, or C).</li>
              <li>When you hand over the item, the robot will automatically handle the storage.</li>
              <li>When you need the item, request it through the app or website, and the robot will retrieve it for you.</li>
            </ol>
          </section>
        </main>

        <footer className="mt-4">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-700 text-gray-200 hover:bg-gray-600"
          >
            Close
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
