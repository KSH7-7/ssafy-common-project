'use client';

export const dynamic = 'force-static';

import { useEffect, useState } from 'react';
import Modal from '../components/Modal';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// ──────────────────────────────
// 타입 정의
// ──────────────────────────────
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

interface LogData {
  logId: number;
  lockerId: number;
  userId: number;
  storeTime: string;
  storeRobotId: number | null;
  retrieveTime: string | null;
  retrieveRobotId: number | null;
}

// ──────────────────────────────
// DailyStatsChart 컴포넌트 (그대로)
// ──────────────────────────────
function DailyStatsChart({ period }: { period: 'week' | 'month' }) {
  const [logData, setLogData] = useState<LogData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogData = async () => {
      try {
        const now = new Date();
        let startDate: Date;
        if (period === 'week') {
          // 최근 일주일: 오늘 포함 이전 6일
          startDate = new Date(now);
          startDate.setDate(startDate.getDate() - 6);
        } else {
          // 최근 한달: 오늘 포함 이전 29일
          startDate = new Date(now);
          startDate.setDate(startDate.getDate() - 29);
        }
        const response = await fetch('/api/analysis', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            startDate: startDate.toISOString().slice(0, 16).replace('T', ' '),
            endDate: now.toISOString().slice(0, 16).replace('T', ' '),
          }),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setLogData(data);
      } catch (error) {
        console.error('로그 데이터 가져오기 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogData();
  }, [period]);

  // 창고 타입 판별 함수
  const getWarehouseType = (lockerId: number) => {
    const prefix = Math.floor(lockerId / 100);
    switch (prefix) {
      case 1:
        return 'A';
      case 2:
        return 'B';
      case 3:
        return 'C';
      default:
        return '기타';
    }
  };

  // 시작일부터 종료일까지의 날짜 배열 생성 (YYYY-MM-DD)
  const generateDateLabels = (start: Date, end: Date): string[] => {
    const labels = [];
    const current = new Date(start);
    while (current <= end) {
      labels.push(current.toISOString().split('T')[0]);
      current.setDate(current.getDate() + 1);
    }
    return labels;
  };

  const now = new Date();
  let start: Date;
  if (period === 'week') {
    start = new Date(now);
    start.setDate(start.getDate() - 6);
  } else {
    start = new Date(now);
    start.setDate(start.getDate() - 29);
  }
  const labels = generateDateLabels(start, now);

  // 날짜별 그룹화 (전체, A, B, C)
  const groupedData: { [date: string]: { 전체: number; A: number; B: number; C: number } } = {};
  labels.forEach((label) => {
    groupedData[label] = { 전체: 0, A: 0, B: 0, C: 0 };
  });

  logData.forEach((log) => {
    const dateKey = new Date(log.storeTime).toISOString().split('T')[0];
    if (groupedData[dateKey]) {
      const warehouse = getWarehouseType(log.lockerId);
      groupedData[dateKey].전체++;
      if (warehouse === 'A' || warehouse === 'B' || warehouse === 'C') {
        groupedData[dateKey][warehouse]++;
      }
    }
  });

  const chartData = {
    labels,
    datasets: [
      {
        label: '전체',
        data: labels.map((date) => groupedData[date].전체),
        borderColor: 'rgba(255, 206, 86, 1)',
        backgroundColor: 'rgba(255, 206, 86, 0.5)',
        fill: false,
      },
      {
        label: 'A창고',
        data: labels.map((date) => groupedData[date].A),
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        fill: false,
      },
      {
        label: 'B창고',
        data: labels.map((date) => groupedData[date].B),
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        fill: false,
      },
      {
        label: 'C창고',
        data: labels.map((date) => groupedData[date].C),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        fill: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true, // 부모 컨테이너 비율 유지
    plugins: {
      legend: { position: 'top' as const },
      title: { display: false },
    },
    scales: {
      x: { title: { display: true, text: '날짜' } },
      y: { title: { display: true, text: '보관 건수' }, beginAtZero: true },
    },
  };

  if (loading) {
    return <p>로딩 중...</p>;
  }

  return <Line data={chartData} options={options} />;
}

// ──────────────────────────────
// CircularProgress 컴포넌트 (창고 진행률, 그대로 사용)
// ──────────────────────────────
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
    <div className="relative flex flex-col items-center mb-10">
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

// ──────────────────────────────
// StatsPage 컴포넌트 (메인 페이지)
// ──────────────────────────────
export default function StatsPage() {
  const [selectedWarehouse, setSelectedWarehouse] = useState<{ label: string } | null>(null);
  const [storeData, setStoreData] = useState<StoreData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        const response = await fetch(`/api/current_store3`);
        const data = (await response.json()) as StoreData;

        // 사용중 및 수리중 상태 개수를 합산하여 currentVolume 업데이트
        Object.keys(data).forEach((sector) => {
          const totalOccupied = data[sector].lockers.filter(
            (locker) =>
              locker.lockerStatus === '사용중' || locker.lockerStatus === '수리중'
          ).length;
          data[sector].currentVolume = totalOccupied;
        });

        setStoreData(data);
      } catch (error) {
        console.error('Error fetching store data:', error);
      }
    };

    fetchStoreData();
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
         {/* ✅ 블럭 의미 설명 추가 */}
         <div className="flex justify-center space-x-4 mb-6">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-400 rounded"></div>
            <span className="text-sm">사용 가능</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-yellow-400 rounded"></div>
            <span className="text-sm">수리 중</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-400 rounded"></div>
            <span className="text-sm">사용 중</span>
          </div>
        </div>
        {/* 상단: 창고별 진행률 */}
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

        {/* 하단: 두 차트와 창고관리 버튼 */}
        <div className="flex flex-col md:flex-row items-center justify-around gap-4 mt-12">
          {/* 최근 일주일 차트 (40% 너비, 16:9 비율) */}
          <div className="w-full md:w-[40%]">
            <div className="relative" style={{ paddingBottom: '56.25%' }}>
              <div className="absolute inset-0">
                <DailyStatsChart period="week" />
              </div>
            </div>
            <h2 className="mt-2 text-center text-lg font-bold">최근 일주일</h2>
          </div>

          {/* 창고관리 버튼 (20% 너비) */}
          <div className="w-full md:w-[20%] flex justify-center">
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              창고 관리
            </button>
          </div>

          {/* 최근 한달 차트 (40% 너비, 16:9 비율) */}
          <div className="w-full md:w-[40%]">
            <div className="relative" style={{ paddingBottom: '56.25%' }}>
              <div className="absolute inset-0">
                <DailyStatsChart period="month" />
              </div>
            </div>
            <h2 className="mt-2 text-center text-lg font-bold">최근 한달</h2>
          </div>
        </div>
      </main>

      {/* 창고관리 모달 (Modal 컴포넌트 사용) */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">창고 관리</h2>
          {/* 창고 관리 관련 내용 추가 */}
        </div>
      </Modal>

      {/* 상세보기 모달 (오버레이와 모달 콘텐츠 분리, 고정 크기 적용) */}
      {selectedWarehouse && (
  <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
    {/* 오버레이 */}
    <div
      className="fixed inset-0 bg-black bg-opacity-50"
      onClick={closeDetails}
    ></div>
    {/* 모달 콘텐츠 */}
    <div
      className="relative z-50 bg-white rounded-lg p-4 overflow-auto flex flex-col items-center"
      style={{ width: '600px', height: '450px' }}
    >
      <h2 className="text-2xl font-bold mb-4 text-center">
        {selectedWarehouse.label} 창고 상세 정보
      </h2>
      <div
        className="grid place-items-center"
        style={{
          gridTemplateColumns: 'repeat(10, 48px)',
          gridGap: '4px',
        }}
      >
        {storeData[selectedWarehouse.label].lockers.map((locker) => (
          <div
            key={locker.lockerId}
            style={{ width: '48px', height: '48px' }}
            className={`flex items-center justify-center text-xs font-bold rounded shadow-md ${
              locker.lockerStatus === '사용중'
                ? 'bg-red-400'
                : locker.lockerStatus === '수리중'
                ? 'bg-yellow-400'
                : 'bg-green-400'
            }`}
          >
            {locker.lockerId}
          </div>
        ))}
      </div>
      <button
        className="mt-4 w-1/2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
        onClick={closeDetails}
      >
        닫기
      </button>
    </div>
  </div>
)}

    </div>
  );
}
