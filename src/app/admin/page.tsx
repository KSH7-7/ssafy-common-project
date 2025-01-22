export default function HomePage() {
  return (
    <div className="min-h-screen">
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">운영안내</h1>
        <div className="relative bg-gray-200 aspect-[16/9] rounded-lg overflow-hidden"> {/* 슬라이드 예시 */}
          <div className="absolute inset-0 flex items-center justify-between p-4">
            <button className="p-2 rounded-full bg-white/80 hover:bg-white">
              &lt;
            </button>
            <button className="p-2 rounded-full bg-white/80 hover:bg-white">
              &gt;
            </button>
          </div>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
            {[0, 1, 2, 3, 4].map((i) => (
              <button
                key={i}
                className={`w-3 h-3 rounded-full ${
                  i === 0 ? 'bg-black' : 'bg-gray-500'
                }`}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
