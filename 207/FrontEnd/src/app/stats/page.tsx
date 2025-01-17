'use client';

export const dynamic = 'force-static';

import { useEffect, useState } from 'react';

function CircularProgress({
  label,
  totalVolume,
  currentVolume,
}: {
  label: string;
  totalVolume: number;
  currentVolume: number;
}) {
  const [progress, setProgress] = useState(0); // 퍼센트 상태
  const [showPercentage, setShowPercentage] = useState(true); // %와 비율 전환 상태
  const size = 250;
  const strokeWidth = 15;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  const percentage = (currentVolume / totalVolume) * 100;

  // 색상 계산 함수
  const getColorByPercentage = (percentage: number) => {
    if (percentage <= 30) return '#00BFFF'; // 파랑
    if (percentage <= 50) return '#32CD32'; // 초록
    if (percentage <= 80) return '#FFD700'; // 노랑
    if (percentage <= 99) return '#FFA500'; // 주황
    return '#FF0000'; // 빨강
  };
  // const getColorByPercentage = (percentage: number) => {
  //   const hue = (120 * (100 - percentage)) / 100; // 초록(120) -> 빨강(0)
  //   return `hsl(${hue}, 100%, 50%)`;
  // };
  

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
    <div className="relative flex items-center justify-center">
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
      <div className="absolute flex flex-col items-center">
        <span className="text-4xl font-bold">{label}</span>
        <span
          className="text-xl cursor-pointer transform transition-transform duration-500 ease-in-out hover:scale-110"
          onClick={toggleDisplay}
        >
          {showPercentage
            ? `${progress.toFixed(1)}%`
            : `${currentVolume}/${totalVolume}`}
        </span>
      </div>
    </div>
  );
}

export default function StatsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <CircularProgress
            label="A"
            totalVolume={90}
            currentVolume={30}
          />
          <CircularProgress
            label="B"
            totalVolume={60}
            currentVolume={15}
          />
          <CircularProgress
            label="C"
            totalVolume={80}
            currentVolume={45}
          />
        </div>
      </main>
    </div>
  );
}
