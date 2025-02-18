"use client"

import * as React from "react"
import { useState } from "react"
import { DataGrid, GridColDef } from "@mui/x-data-grid"
import { Card, Box } from "@mui/material"
import Link from "next/link"

// ✅ 한글 로케일을 직접 정의
const localeText = {
  noRowsLabel: "데이터가 없습니다.",
  columnMenuSortAsc: "오름차순 정렬",
  columnMenuSortDesc: "내림차순 정렬",
  columnMenuFilter: "필터",
  columnMenuHideColumn: "열 숨기기",
  columnMenuShowColumns: "열 보이기",
  columnMenuUnsort: "정렬 해제",
  columnHeaderSortIconLabel: "정렬",
  columnMenuManageColumns: "필터",
}

// DataGrid의 열 정의
const columns: GridColDef[] = [
  {
    field: "robot_id",
    headerName: "로봇식별자",
    width: 150,
    maxWidth: 150,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "robot_name",
    headerName: "로봇명",
    width: 150,
    maxWidth: 150,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => (
      <Link href={`/admin/control/${params.row.robot_id}`} style={{ color: "blue", textDecoration: "underline" }}>
        {params.value}
      </Link>
    ),
  },
  {
    field: "completed_tasks",
    headerName: "완료된 작업 수",
    width: 170,
    maxWidth: 170,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "last_maintenance",
    headerName: "마지막 유지보수",
    type: "string",
    width: 180,
    maxWidth: 180,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "robot_status",
    headerName: "상태",
    type: "string",
    width: 120,
    maxWidth: 120,
    align: "center",
    headerAlign: "center",
  },
]

// API에서 받아오는 로봇 데이터의 타입
interface RobotApi {
  robotId: number
  robotName: string
  completedTasks: number
  lastMaintenance: string
  robotStatus: string
}

// DataGrid에 사용할 데이터 행의 타입
interface RobotRow {
  id: number
  robot_id: number
  robot_name: string
  completed_tasks: number
  last_maintenance: string
  robot_status: string
  robot_is_auto: string
}

export default function DataTable() {
  const [rows, setRows] = useState<RobotRow[]>([])

  React.useEffect(() => {
    async function fetchRobots() {
      try {
        const response = await fetch("/api/robots")
        if (!response.ok) {
          throw new Error("네트워크 응답이 올바르지 않습니다.")
        }
        const data = (await response.json()) as RobotApi[]
        const mappedRows = data.map((robot: RobotApi, index: number) => ({
          id: index + 1,
          robot_id: robot.robotId + 5000,
          robot_name: robot.robotName,
          completed_tasks: robot.completedTasks,
          last_maintenance: new Date(robot.lastMaintenance).toLocaleString(),
          robot_status: robot.robotStatus,
          robot_is_auto: "N/A",
        }))

        setRows(mappedRows)
      } catch (error) {
        console.error("로봇 데이터를 불러오는 중 오류 발생:", error)
      }
    }
    fetchRobots()
  }, [])

  return (
    <Card sx={{ width: "56%", margin: "20px auto", boxShadow: 3, padding: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          autoHeight
          rowHeight={48} // ✅ 셀 높이를 48px로 맞춤 (UserUsageTable과 동일)
          localeText={localeText} // ✅ 한글 로케일 적용
          sx={{
            width: "100%",
            maxWidth: 770,
            border: 0, // ✅ 불필요한 테두리 제거
            "& .MuiDataGrid-cell": {
              justifyContent: "center",
              textAlign: "center",
            },
            "& .MuiDataGrid-columnHeaders": {
              justifyContent: "center",
              textAlign: "center",
            },
          }}
        />
      </Box>
    </Card>
  )
}
