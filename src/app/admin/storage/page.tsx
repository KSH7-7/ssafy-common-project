'use client';

export const dynamic = 'force-static';

import { useEffect, useState } from 'react';
import Modal from '../components/Modal';

// 타입 정의
interface Locker {
  lockerId: number;
  lockerStatus: string;
}

interface WarehouseData {
  totalVolume: number;
  currentVolume: number;
  lockers: Locker[];
}

type StoreData = Record<string, WarehouseData>;

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
  const size = 250; // ✅ 원래 크기로 복구
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
    <div className="relative flex flex-col items-center mb-[200px]">
      <div
        className="relative flex items-center justify-center"
        style={{ width: size, height: size }}
      >
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
          <span className="text-3xl font-bold text-center">{label}</span>
          <span
            className="text-xl cursor-pointer transform transition-transform duration-500 ease-in-out hover:scale-110 text-center"
            onClick={toggleDisplay}
          >
            {showPercentage
              ? `${progress.toFixed(1)}%`
              : `${currentVolume}/${totalVolume}`}
          </span>
        </div>
        {/* ✅ 상세보기 버튼을 원 안에 배치 */}
        <button
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-24 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-700 text-sm"
          onClick={onDetailsClick}
        >
          상세 보기
        </button>
      </div>
    </div>
  );
}

function DetailsPopup({
  label,
  data,
  onClose,
}: {
  label: string;
  data: Locker[];
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      ></div>
      <div
        className="relative bg-white p-8 rounded shadow-lg grid gap-2"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(10, 1fr)`,
          gridTemplateRows: `repeat(${Math.ceil(data.length / 10)}, 1fr)`,
        }}
      >
        <h2 className="text-2xl font-bold mb-4 col-span-full text-center">
          {label} 창고 상세 정보
        </h2>
        {data.map((locker) => (
          <div
            key={locker.lockerId}
            className={`w-12 h-12 flex items-center justify-center text-xs font-bold rounded shadow-md ${
              locker.lockerStatus === '사용중' ? 'bg-red-400' : 'bg-green-400'
            }`}
          >
            {locker.lockerId}
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
  const [selectedWarehouse, setSelectedWarehouse] = useState<{ label: string } | null>(null);
  const [storeData, setStoreData] = useState<StoreData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`./api/current_store`);
        const data = (await response.json()) as StoreData;
        console.log('Fetched data:', data);
        setStoreData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const openDetails = (label: string) => {
    setSelectedWarehouse({ label });
  };

  const closeDetails = () => {
    setSelectedWarehouse(null);
  };

  if (!storeData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            창고 관리
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 place-items-center">
          {['A', 'B', 'C'].map((sector) => (
            <CircularProgress
              key={sector}
              label={sector}
              totalVolume={storeData[sector].totalVolume}
              currentVolume={storeData[sector].currentVolume}
              onDetailsClick={() => openDetails(sector)}
            />
          ))}
        </div>
      </main>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">창고 관리</h2>
          {/* 모달 내용을 여기에 추가하세요 */}
        </div>
      </Modal>

      {selectedWarehouse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity">
          <div className="bg-white rounded-lg p-8 max-w-lg w-full mx-4 transform transition-all">
            <DetailsPopup
              label={selectedWarehouse.label}
              data={storeData[selectedWarehouse.label].lockers}
              onClose={closeDetails}
            />
          </div>
        </div>
      )}
    </div>
  );
}
