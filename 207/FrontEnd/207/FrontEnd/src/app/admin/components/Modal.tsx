import { useState, useEffect } from 'react';
import { Line, Bar, Pie, Doughnut, Scatter, Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
  ScatterController
} from 'chart.js';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

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

export default function AnalysisModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [logData, setLogData] = useState<LogData[]>([]);
  const [activeView, setActiveView] = useState<'daily' | 'monthly' | 'yearly'>('daily');
  const [chartType, setChartType] = useState<'line' | 'bar' | 'pie' | 'doughnut' | 'scatter' | 'radar'>('line');

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

  const getWarehouseType = (lockerId: number) => {
    const prefix = Math.floor(lockerId / 100);
    switch (prefix) {
      case 1: return 'A';
      case 2: return 'B';
      case 3: return 'C';
      default: return '기타';
    }
  };

  const processData = () => {
    if (chartType === 'scatter') {
      const getTimeInMinutes = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.getHours() * 60 + date.getMinutes();
      };

      const scatterData = {
        datasets: [
          {
            label: '전체',
            data: logData
              .filter(log => log.retrieveTime !== null)
              .map(log => ({
                x: getTimeInMinutes(log.storeTime),
                y: getTimeInMinutes(log.retrieveTime!)
              })),
            backgroundColor: 'rgba(255, 206, 86, 0.5)',
          },
          {
            label: 'A창고',
            data: logData
              .filter(log => getWarehouseType(log.lockerId) === 'A' && log.retrieveTime !== null)
              .map(log => ({
                x: getTimeInMinutes(log.storeTime),
                y: getTimeInMinutes(log.retrieveTime!)
              })),
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
          },
          {
            label: 'B창고',
            data: logData
              .filter(log => getWarehouseType(log.lockerId) === 'B' && log.retrieveTime !== null)
              .map(log => ({
                x: getTimeInMinutes(log.storeTime),
                y: getTimeInMinutes(log.retrieveTime!)
              })),
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
          },
          {
            label: 'C창고',
            data: logData
              .filter(log => getWarehouseType(log.lockerId) === 'C' && log.retrieveTime !== null)
              .map(log => ({
                x: getTimeInMinutes(log.storeTime),
                y: getTimeInMinutes(log.retrieveTime!)
              })),
            backgroundColor: 'rgba(75, 192, 192, 0.5)',
          }
        ]
      };
      return scatterData;
    }

    if (chartType === 'radar') {
      const timeRanges = Array.from({ length: 8 }, (_, i) => i * 3);
      const warehouseData = {
        전체: new Array(8).fill(0),
        A: new Array(8).fill(0),
        B: new Array(8).fill(0),
        C: new Array(8).fill(0)
      };

      logData.forEach(log => {
        const hour = new Date(log.storeTime).getHours();
        const timeIndex = Math.floor(hour / 3);
        const warehouse = getWarehouseType(log.lockerId);
        warehouseData.전체[timeIndex]++;
        if (warehouse in warehouseData) {
          warehouseData[warehouse][timeIndex]++;
        }
      });

      return {
        labels: timeRanges.map(hour => `${hour}시-${hour + 3}시`),
        datasets: [
          {
            label: '전체',
            data: warehouseData.전체,
            backgroundColor: 'rgba(255, 206, 86, 0.2)',
            borderColor: 'rgba(255, 206, 86, 1)',
          },
          {
            label: 'A창고',
            data: warehouseData.A,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
          },
          {
            label: 'B창고',
            data: warehouseData.B,
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
          },
          {
            label: 'C창고',
            data: warehouseData.C,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
          }
        ]
      };
    }

    const groupedData = {};
    logData.forEach((log) => {
      let dateKey = '';
      const date = new Date(log.storeTime);
      const warehouse = getWarehouseType(log.lockerId);

      switch (activeView) {
        case 'daily':
          dateKey = date.toISOString().split('T')[0];
          break;
        case 'monthly':
          dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          break;
        case 'yearly':
          dateKey = `${date.getFullYear()}`;
          break;
      }

      if (!groupedData[dateKey]) {
        groupedData[dateKey] = {
          전체: 0,
          A: 0,
          B: 0,
          C: 0
        };
      }
      groupedData[dateKey].전체++;
      groupedData[dateKey][warehouse]++;
    });

    return {
      labels: Object.keys(groupedData),
      datasets: [
        {
          label: '전체',
          data: Object.values(groupedData).map(d => d.전체),
          backgroundColor: 'rgba(255, 206, 86, 0.5)',
          borderColor: 'rgba(255, 206, 86, 1)',
        },
        {
          label: 'A창고',
          data: Object.values(groupedData).map(d => d.A),
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          borderColor: 'rgba(255, 99, 132, 1)',
        },
        {
          label: 'B창고',
          data: Object.values(groupedData).map(d => d.B),
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgba(54, 162, 235, 1)',
        },
        {
          label: 'C창고',
          data: Object.values(groupedData).map(d => d.C),
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          borderColor: 'rgba(75, 192, 192, 1)',
        }
      ]
    };
  };

  const renderChart = () => {
    const data = processData();
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      scales: chartType === 'scatter' ? {
        x: {
          title: {
            display: true,
            text: '보관 시간 (시:분)'
          },
          min: 0,
          max: 1440,
          ticks: {
            callback: function(value) {
              const hours = Math.floor(value / 60);
              const minutes = value % 60;
              return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
            },
            stepSize: 120
          }
        },
        y: {
          title: {
            display: true,
            text: '회수 시간 (시:분)'
          },
          min: 0,
          max: 1440,
          ticks: {
            callback: function(value) {
              const hours = Math.floor(value / 60);
              const minutes = value % 60;
              return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
            },
            stepSize: 120
          }
        }
      } : undefined
    };

    switch (chartType) {
      case 'bar':
        return <Bar data={data} options={options} />;
      case 'pie':
        return <Pie data={data} options={options} />;
      case 'doughnut':
        return <Doughnut data={data} options={options} />;
      case 'scatter':
        return <Scatter data={data} options={options} />;
      case 'radar':
        return <Radar data={data} options={options} />;
      case 'line':
      default:
        return <Line data={data} options={options} />;
    }
  };

  const getAvailableChartTypes = () => {
    switch (activeView) {
      case 'daily':
        return [
          { value: 'line', label: '꺾은선형' },
          { value: 'bar', label: '막대형' },
          { value: 'radar', label: '방사형' },
          { value: 'scatter', label: '산점도' }
        ];
      case 'monthly':
        return [
          { value: 'line', label: '꺾은선형' },
          { value: 'bar', label: '막대형' },
          { value: 'doughnut', label: '도넛' },
          { value: 'scatter', label: '산점도' }
        ];
      case 'yearly':
        return [
          { value: 'line', label: '꺾은선형' },
          { value: 'bar', label: '막대형' },
          { value: 'doughnut', label: '도넛' }
        ];
      default:
        return [];
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-[800px] shadow-lg">
        <h2 className="text-2xl font-bold mb-4">사용량 분석</h2>
        
        {/* 날짜 선택 */}
        <div className="flex gap-4 mb-4">
          <DatePicker
            selected={startDate}
            onChange={(date: Date) => setStartDate(date)}
            showTimeSelect
            dateFormat="yyyy-MM-dd HH:mm"
            className="border p-2 rounded"
          />
          <DatePicker
            selected={endDate}
            onChange={(date: Date) => setEndDate(date)}
            showTimeSelect
            dateFormat="yyyy-MM-dd HH:mm"
            className="border p-2 rounded"
          />
          <button
            onClick={fetchData}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            조회
          </button>
        </div>

        {/* 기간별 필터 */}
        <div className="flex gap-2 mb-4">
          {['daily', 'monthly', 'yearly'].map((view) => (
            <button
              key={view}
              onClick={() => setActiveView(view as 'daily' | 'monthly' | 'yearly')}
              className={`px-4 py-2 rounded ${activeView === view ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              {view === 'daily' ? '일별' : view === 'monthly' ? '월별' : '연별'}
            </button>
          ))}
        </div>

        {/* 차트 유형 선택 드롭다운 */}
        <div className="mb-4">
          <select
            value={chartType}
            onChange={(e) => setChartType(e.target.value as any)}
            className="px-4 py-2 rounded border"
          >
            {getAvailableChartTypes().map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* 차트 렌더링 */}
        <div className="h-[400px] flex items-center justify-center">
          {logData.length > 0 ? renderChart() : <p className="text-gray-500">데이터가 없습니다.</p>}
        </div>

        {/* 닫기 버튼 */}
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
