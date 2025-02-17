'use client';

import { useState } from 'react';
import { Line, Bar, Radar, Scatter, Doughnut, Pie } from 'react-chartjs-2';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Modal from '../components/Modal';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  ScatterController,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  ScatterController,
  Title,
  Tooltip,
  Legend
);

interface LogData {
  logId: number;
  lockerId: number;
  userId: number;
  storeTime: string;
  storeRobotId: number | null;
  retrieveTime: string | null;
  retrieveRobotId: number | null;
}

type ChartType = 'line' | 'bar' | 'radar' | 'scatter' | 'doughnut' | 'pie';

export default function AnalysisModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [logData, setLogData] = useState<LogData[]>([]);
  const [activeView, setActiveView] = useState<'daily' | 'monthly' | 'yearly'>('daily');
  const [chartType, setChartType] = useState<ChartType>('line');

  const fetchData = async () => {
    try {
      const response = await fetch('/api/analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          startDate: startDate.toISOString().slice(0, 16).replace('T', ' '),
          endDate: endDate.toISOString().slice(0, 16).replace('T', ' '),
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setLogData(data);
    } catch (error) {
      console.error('데이터 가져오기 실패:', error);
      alert('데이터를 가져오는데 실패했습니다. API 서버 상태를 확인해주세요.');
    }
  };

  // API로부터 받은 logData를 기반으로 고유 날짜별 보관 건수를 계산합니다.
  const uniqueDates = Array.from(
    new Set(logData.map((log) => new Date(log.storeTime).toISOString().split('T')[0]))
  );
  uniqueDates.sort();
  const counts = uniqueDates.map((date) =>
    logData.filter((log) => new Date(log.storeTime).toISOString().split('T')[0] === date).length
  );

  const chartData = {
    labels: uniqueDates.length > 0 ? uniqueDates : ['2025-01-01', '2025-01-02', '2025-01-03'],
    datasets: [
      {
        label: '보관 건수',
        data: uniqueDates.length > 0 ? counts : [10, 20, 30],
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
        fill: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
  };

  // 각 기간별로 다른 드롭다운 옵션을 제공합니다.
  const getAvailableChartTypes = () => {
    switch (activeView) {
      case 'daily':
        return [
          { value: 'line', label: '꺾은선형' },
          { value: 'bar', label: '막대형' },
          { value: 'radar', label: '방사형' },
          { value: 'scatter', label: '산점도' },
        ];
      case 'monthly':
        return [
          { value: 'line', label: '꺾은선형' },
          { value: 'bar', label: '막대형' },
          { value: 'doughnut', label: '도넛' },
          { value: 'scatter', label: '산점도' },
        ];
      case 'yearly':
        return [
          { value: 'line', label: '꺾은선형' },
          { value: 'bar', label: '막대형' },
          { value: 'doughnut', label: '도넛' },
        ];
      default:
        return [];
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">사용량 분석</h2>
        {/* 날짜 선택 영역 */}
        <div className="mb-4 flex gap-4">
          <DatePicker
            selected={startDate}
            onChange={(date: Date | null) => {
              if (date) setStartDate(date);
            }}
            showTimeSelect
            dateFormat="yyyy-MM-dd HH:mm"
            className="border p-2 rounded"
          />
          <DatePicker
            selected={endDate}
            onChange={(date: Date | null) => {
              if (date) setEndDate(date);
            }}
            showTimeSelect
            dateFormat="yyyy-MM-dd HH:mm"
            className="border p-2 rounded"
          />
          <button onClick={fetchData} className="bg-blue-500 text-white px-4 py-2 rounded">
            조회
          </button>
        </div>

        {/* 기간별 필터 버튼 */}
        <div className="flex gap-2 mb-4">
          {['daily', 'monthly', 'yearly'].map((view) => (
            <button
              key={view}
              onClick={() => setActiveView(view as 'daily' | 'monthly' | 'yearly')}
              className={`px-4 py-2 rounded ${
                activeView === view ? 'bg-blue-500 text-white' : 'bg-gray-200'
              }`}
            >
              {view === 'daily' ? '일별' : view === 'monthly' ? '월별' : '연별'}
            </button>
          ))}
        </div>

        {/* 차트 유형 선택 드롭다운 */}
        <div className="mb-4">
          <select
            value={chartType}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setChartType(e.target.value as ChartType)
            }
            className="px-4 py-2 rounded border"
          >
            {getAvailableChartTypes().map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* 차트 렌더링 영역 */}
        <div className="h-[400px] flex items-center justify-center">
          {logData.length > 0 ? (
            chartType === 'line' ? (
              <Line data={chartData} options={options} />
            ) : chartType === 'bar' ? (
              <Bar data={chartData} options={options} />
            ) : chartType === 'radar' ? (
              <Radar data={chartData} options={options} />
            ) : chartType === 'scatter' ? (
              <Scatter data={chartData} options={options} />
            ) : chartType === 'doughnut' ? (
              <Doughnut data={chartData} options={options} />
            ) : chartType === 'pie' ? (
              <Pie data={chartData} options={options} />
            ) : null
          ) : (
            <p className="text-gray-500">데이터가 없습니다.</p>
          )}
        </div>
      </div>
    </Modal>
  );
}
