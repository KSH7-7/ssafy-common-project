"use client"

import { useState } from "react"
import { Line, Bar, Radar, Scatter, Doughnut, Pie } from "react-chartjs-2"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import Modal from "../components/Modal"
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, RadialLinearScale, ScatterController, Title, Tooltip, Legend } from "chart.js"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, RadialLinearScale, ScatterController, Title, Tooltip, Legend)

interface LogData {
  logId: number
  lockerId: number
  userId: number
  storeTime: string
  storeRobotId: number | null
  retrieveTime: string | null
  retrieveRobotId: number | null
}

type ChartType = "line" | "bar" | "radar" | "scatter" | "doughnut" | "pie"

export default function AnalysisModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [startDate, setStartDate] = useState<Date>(new Date())
  const [endDate, setEndDate] = useState<Date>(new Date())
  const [logData, setLogData] = useState<LogData[]>([])
  const [activeView, setActiveView] = useState<"daily" | "monthly" | "yearly">("daily")
  const [chartType, setChartType] = useState<ChartType>("line")

  const fetchData = async () => {
    try {
      const response = await fetch("/api/analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          startDate: startDate.toISOString().slice(0, 16).replace("T", " "),
          endDate: endDate.toISOString().slice(0, 16).replace("T", " "),
        }),
      })

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)

      const data = await response.json()
      setLogData(data)
    } catch (error) {
      console.error("데이터 가져오기 실패:", error)
      alert("데이터를 가져오는데 실패했습니다. API 서버 상태를 확인해주세요.")
    }
  }

  const groupDataByPeriod = (data: LogData[], period: "daily" | "monthly" | "yearly") => {
    const groupedData: { [key: string]: number } = {}

    data.forEach((log) => {
      const date = new Date(log.storeTime)
      let key = ""

      if (period === "daily") key = date.toISOString().split("T")[0] // YYYY-MM-DD
      else if (period === "monthly") key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}` // YYYY-MM
      else if (period === "yearly") key = `${date.getFullYear()}` // YYYY

      groupedData[key] = (groupedData[key] || 0) + 1
    })

    const sortedKeys = Object.keys(groupedData).sort()
    return { labels: sortedKeys, counts: sortedKeys.map((key) => groupedData[key]) }
  }

  const { labels, counts } = groupDataByPeriod(logData, activeView)

  // 일반 차트 데이터 (선형, 막대, 레이더)
  const chartData = {
    labels: labels.length > 0 ? labels : ["2025-01", "2025-02", "2025-03"],
    datasets: [
      {
        label: "보관 건수",
        data: counts.length > 0 ? counts : [10, 20, 30],
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: "rgba(75,192,192,0.2)",
        fill: false,
      },
    ],
  }

  // 산점도 차트 데이터 (x축은 이미 포맷된 label 사용)
  const scatterChartData = {
    datasets: [
      {
        label: "보관 건수",
        data: labels.map((label, index) => ({
          x: label,
          y: counts[index],
        })),
        backgroundColor: "rgba(75,192,192,1)",
      },
    ],
  }

  // 산점도 옵션 (x축을 문자열 카테고리로 설정)
  const scatterOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: "category",
      },
    },
  }

  // 도넛 및 원형 차트에 사용할 색상 배열 생성 함수
  const generateColors = (num: number) => {
    const baseColors = ["rgba(255, 99, 132, 0.6)", "rgba(54, 162, 235, 0.6)", "rgba(255, 206, 86, 0.6)", "rgba(75, 192, 192, 0.6)", "rgba(153, 102, 255, 0.6)", "rgba(255, 159, 64, 0.6)"]
    if (num <= baseColors.length) {
      return baseColors.slice(0, num)
    } else {
      const colors = [...baseColors]
      while (colors.length < num) {
        const r = Math.floor(Math.random() * 256)
        const g = Math.floor(Math.random() * 256)
        const b = Math.floor(Math.random() * 256)
        colors.push(`rgba(${r}, ${g}, ${b}, 0.6)`)
      }
      return colors
    }
  }

  // 도넛 및 원형 차트 데이터 (각 데이터마다 다른 색상 적용)
  const doughnutChartData = {
    labels: labels.length > 0 ? labels : ["2025-01", "2025-02", "2025-03"],
    datasets: [
      {
        label: "보관 건수",
        data: counts.length > 0 ? counts : [10, 20, 30],
        backgroundColor: generateColors(counts.length > 0 ? counts.length : 3),
      },
    ],
  }

  const options = { responsive: true, maintainAspectRatio: false }

  // activeView에 따라 사용 가능한 차트 유형 옵션 (한글 표시)
  const getAvailableChartTypes = () => {
    if (activeView === "daily") {
      return [
        { value: "line", label: "선형 차트" },
        { value: "bar", label: "막대 차트" },
        { value: "radar", label: "레이더 차트" },
        { value: "scatter", label: "산점도" },
      ]
    } else if (activeView === "monthly") {
      return [
        { value: "line", label: "선형 차트" },
        { value: "bar", label: "막대 차트" },
        { value: "doughnut", label: "도넛 차트" },
        { value: "scatter", label: "산점도" },
      ]
    } else if (activeView === "yearly") {
      return [
        { value: "line", label: "선형 차트" },
        { value: "bar", label: "막대 차트" },
        { value: "doughnut", label: "도넛 차트" },
      ]
    } else {
      return []
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">사용량 분석</h2>

        {/* 날짜 선택 */}
        <div className="mb-4 flex gap-4">
          <DatePicker selected={startDate} onChange={(date) => date && setStartDate(date)} showTimeSelect dateFormat="yyyy-MM-dd HH:mm" className="border p-2 rounded" />
          <DatePicker selected={endDate} onChange={(date) => date && setEndDate(date)} showTimeSelect dateFormat="yyyy-MM-dd HH:mm" className="border p-2 rounded" />
          <button onClick={fetchData} className="bg-blue-500 text-white px-4 py-2 rounded">
            조회
          </button>
        </div>

        {/* 기간 선택 */}
        <div className="flex gap-2 mb-4">
          {["daily", "monthly", "yearly"].map((view) => (
            <button key={view} onClick={() => setActiveView(view as "daily" | "monthly" | "yearly")} className={`px-4 py-2 rounded ${activeView === view ? "bg-blue-500 text-white" : "bg-gray-200"}`}>
              {view === "daily" ? "일별" : view === "monthly" ? "월별" : "연별"}
            </button>
          ))}
        </div>

        {/* 차트 유형 선택 */}
        <div className="mb-4">
          <select value={chartType} onChange={(e) => setChartType(e.target.value as ChartType)} className="px-4 py-2 rounded border">
            {getAvailableChartTypes().map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* 차트 렌더링 */}
        <div className="h-[400px] flex items-center justify-center">
          {logData.length > 0 ? (
            chartType === "scatter" ? (
              <Scatter data={scatterChartData} options={scatterOptions} />
            ) : chartType === "line" ? (
              <Line data={chartData} options={options} />
            ) : chartType === "bar" ? (
              <Bar data={chartData} options={options} />
            ) : chartType === "radar" ? (
              <Radar data={chartData} options={options} />
            ) : chartType === "doughnut" ? (
              <Doughnut data={doughnutChartData} options={options} />
            ) : (
              <Pie data={doughnutChartData} options={options} />
            )
          ) : (
            <p className="text-gray-500">데이터가 없습니다.</p>
          )}
        </div>
      </div>
    </Modal>
  )
}
