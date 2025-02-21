"use client"

import { useState, useEffect } from "react"
import { Line, Bar, Radar, Scatter } from "react-chartjs-2"
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

type ChartType = "line" | "bar" | "radar" | "scatter"

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

  // 선택한 기간(일별, 월별, 연별)에 따른 라벨 생성
  const generateLabels = (start: Date, end: Date, period: "daily" | "monthly" | "yearly"): string[] => {
    let labels: string[] = []
    if (period === "daily") {
      const current = new Date(start)
      while (current <= end) {
        labels.push(current.toISOString().split("T")[0])
        current.setDate(current.getDate() + 1)
      }
    } else if (period === "monthly") {
      const current = new Date(start.getFullYear(), start.getMonth(), 1)
      const endMonth = new Date(end.getFullYear(), end.getMonth(), 1)
      while (current <= endMonth) {
        labels.push(`${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, "0")}`)
        current.setMonth(current.getMonth() + 1)
      }
    } else if (period === "yearly") {
      const current = new Date(start.getFullYear(), 0, 1)
      const endYear = new Date(end.getFullYear(), 0, 1)
      while (current <= endYear) {
        labels.push(`${current.getFullYear()}`)
        current.setFullYear(current.getFullYear() + 1)
      }
    }
    return labels
  }

  // lockerId를 이용해 창고 타입(A, B, C)을 구분
  const getWarehouseType = (lockerId: number) => {
    const prefix = Math.floor(lockerId / 100)
    switch (prefix) {
      case 1:
        return "A"
      case 2:
        return "B"
      case 3:
        return "C"
      default:
        return "기타"
    }
  }

  const labels = generateLabels(startDate, endDate, activeView)

  // 라벨별로 전체 및 각 창고(A, B, C) 건수를 집계
  const groupedData: Record<string, { 전체: number; A: number; B: number; C: number }> = {}
  labels.forEach((label) => {
    groupedData[label] = { 전체: 0, A: 0, B: 0, C: 0 }
  })

  logData.forEach((log) => {
    const logDate = new Date(log.storeTime)
    let label = ""
    if (activeView === "daily") {
      label = logDate.toISOString().split("T")[0]
    } else if (activeView === "monthly") {
      label = `${logDate.getFullYear()}-${String(logDate.getMonth() + 1).padStart(2, "0")}`
    } else if (activeView === "yearly") {
      label = `${logDate.getFullYear()}`
    }
    if (groupedData[label]) {
      groupedData[label].전체++
      const warehouse = getWarehouseType(log.lockerId)
      if (warehouse === "A" || warehouse === "B" || warehouse === "C") {
        groupedData[label][warehouse]++
      }
    }
  })

  // 차트 타입에 따라 데이터 구성 (산점도는 {x,y} 포맷)
  let chartData, scatterChartData
  if (chartType === "scatter") {
    scatterChartData = {
      datasets: [
        {
          label: "전체",
          data: labels.map((label) => ({ x: label, y: groupedData[label].전체 })),
          backgroundColor: "rgba(255, 206, 86, 1)",
        },
        {
          label: "A창고",
          data: labels.map((label) => ({ x: label, y: groupedData[label].A })),
          backgroundColor: "rgba(255, 99, 132, 1)",
        },
        {
          label: "B창고",
          data: labels.map((label) => ({ x: label, y: groupedData[label].B })),
          backgroundColor: "rgba(54, 162, 235, 1)",
        },
        {
          label: "C창고",
          data: labels.map((label) => ({ x: label, y: groupedData[label].C })),
          backgroundColor: "rgba(75, 192, 192, 1)",
        },
      ],
    }
  } else {
    chartData = {
      labels,
      datasets: [
        {
          label: "전체",
          data: labels.map((label) => groupedData[label].전체),
          borderColor: "rgba(255, 206, 86, 1)",
          backgroundColor: "rgba(255, 206, 86, 0.5)",
          fill: false,
        },
        {
          label: "A창고",
          data: labels.map((label) => groupedData[label].A),
          borderColor: "rgba(255, 99, 132, 1)",
          backgroundColor: "rgba(255, 99, 132, 0.5)",
          fill: false,
        },
        {
          label: "B창고",
          data: labels.map((label) => groupedData[label].B),
          borderColor: "rgba(54, 162, 235, 1)",
          backgroundColor: "rgba(54, 162, 235, 0.5)",
          fill: false,
        },
        {
          label: "C창고",
          data: labels.map((label) => groupedData[label].C),
          borderColor: "rgba(75, 192, 192, 1)",
          backgroundColor: "rgba(75, 192, 192, 0.5)",
          fill: false,
        },
      ],
    }
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" as const },
      title: { display: false },
    },
    scales:
      chartType === "scatter"
        ? {
            x: { type: "category", title: { display: true, text: "날짜" } },
            y: { title: { display: true, text: "보관 건수" }, beginAtZero: true },
          }
        : {
            x: { title: { display: true, text: "날짜" } },
            y: { title: { display: true, text: "보관 건수" }, beginAtZero: true },
          },
  }

  const getAvailableChartTypes = () => {
    return [
      { value: "line", label: "선형 차트" },
      { value: "bar", label: "막대 차트" },
      { value: "radar", label: "레이더 차트" },
      { value: "scatter", label: "산점도" },
    ]
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
        <div className="h-[400px]">
          {logData.length > 0 ? (
            chartType === "scatter" ? (
              <Scatter data={scatterChartData} options={options} />
            ) : chartType === "line" ? (
              <Line data={chartData} options={options} />
            ) : chartType === "bar" ? (
              <Bar data={chartData} options={options} />
            ) : (
              <Radar data={chartData} options={options} />
            )
          ) : (
            <p className="text-gray-500">데이터가 없습니다.</p>
          )}
        </div>
      </div>
    </Modal>
  )
}
