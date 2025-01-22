'use client';

export const dynamic = 'force-static';

import { useEffect, useState } from 'react';

function CircularProgress({
  label,
  totalVolume,
  currentVolume,
  onDetailsClick,
}: {
  label: string;
  totalVolume: number;
  currentVolume: number;
  onDetailsClick: () => void;
}) {
  const [progress, setProgress] = useState(0);
  const [showPercentage, setShowPercentage] = useState(true);
  const size = 250;
  const strokeWidth = 15;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  const percentage = (currentVolume / totalVolume) * 100;

  const getColorByPercentage = (percentage: number) => {
    if (percentage <= 30) return '#00BFFF';
    if (percentage <= 50) return '#32CD32';
    if (percentage <= 80) return '#FFD700';
    if (percentage <= 99) return '#FFA500';
    return '#FF0000';
  };

  const color = getColorByPercentage(percentage);

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(percentage);
    }, 100);
    return () => clearTimeout(timer);
  }, [percentage]);

  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const toggleDisplay = () => {
    setShowPercentage(!showPercentage);
  };

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          stroke="#e5e7eb"
          fill="none"
          strokeWidth={strokeWidth}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          stroke={color}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          r={radius}
          cx={size / 2}
          cy={size / 2}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-4xl font-bold text-center">{label}</span>
        <span
          className="text-xl cursor-pointer transform transition-transform duration-500 ease-in-out hover:scale-110 text-center"
          onClick={toggleDisplay}
        >
          {showPercentage
            ? `${progress.toFixed(1)}%`
            : `${currentVolume}/${totalVolume}`}
        </span>
      </div>
      <button
        className="absolute px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700" style={{ bottom: '-80px' }}
        onClick={onDetailsClick}
      >
        상세 보기
      </button>
    </div>
  );
}

function DetailsPopup({
  label,
  totalVolume,
  onClose,
}: {
  label: string;
  totalVolume: number;
  onClose: () => void;
}) {
  const rows = 5;
  const columns = Math.ceil(totalVolume / rows);
  const data = Array.from({ length: totalVolume }, (_, index) => ({
    id: index + 1,
    status: Math.random() > 0.5 ? '사용 중' : '비어 있음',
  }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <div
        className="relative bg-white p-8 rounded shadow-lg"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`,
          gap: '1px',
        }}
      >
        <h2 className="text-2xl font-bold mb-4 col-span-full text-center">{label} 창고 상세 정보</h2>
        {data.map((item) => (
          <div
            key={item.id}
            className={`w-12 h-12 flex items-center justify-center text-xs font-bold rounded shadow-md ${
              item.status === '사용 중' ? 'bg-red-400' : 'bg-green-400'
            }`}
          >
            {item.id}
          </div>
        ))}
        <button
          className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700 col-span-full"
          onClick={onClose}
        >
          닫기
        </button>
      </div>
    </div>
  );
}

export default function StatsPage() {
  const [selectedWarehouse, setSelectedWarehouse] = useState<{
    label: string;
    totalVolume: number;
  } | null>(null);

  const openDetails = (label: string, totalVolume: number) => {
    setSelectedWarehouse({ label, totalVolume });
  };

  const closeDetails = () => {
    setSelectedWarehouse(null);
  };

  return (
    <div className="min-h-screen">
      <main className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-1 place-items-center">
        <CircularProgress
          label="A"
          totalVolume={90}
          currentVolume={30}
          onDetailsClick={() => openDetails('A', 90)}
          />
          <CircularProgress
          label="B"
          totalVolume={60}
          currentVolume={15}
          onDetailsClick={() => openDetails('B', 60)}
          />
          <CircularProgress
          label="C"
          totalVolume={80}
          currentVolume={45}
          onDetailsClick={() => openDetails('C', 80)}
          />
          </div>
      </main>
      {selectedWarehouse && (
        <DetailsPopup
          label={selectedWarehouse.label}
          totalVolume={selectedWarehouse.totalVolume}
          onClose={closeDetails}
        />
      )}
    </div>
  );
}
