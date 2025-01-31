// app/robot/page.tsx
"use client";

import * as React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Link from "next/link";

// 열 정의
const columns: GridColDef[] = [
  {
    field: "robot_id",
    headerName: "로봇식별자",
    width: 130,
  },
  {
    field: "robot_name",
    headerName: "로봇명",
    width: 130,
    renderCell: (params) => (
      <Link
        href={`/admin/control/${params.row.robot_id}`}
        style={{ color: "blue", textDecoration: "underline" }}
      >
        {params.value}
      </Link>
    ),
  },
  {
    field: "completed_tasks",
    headerName: "완료된 작업 수",
    width: 200,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "last_maintenance",
    headerName: "마지막 유지보수 시간",
    type: "number",
    width: 160,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "robot_status",
    headerName: "상태",
    type: "string",
    width: 100,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "robot_is_auto",
    headerName: "로봇 모드",
    type: "string",
    width: 120,
    align: "center",
    headerAlign: "center",
  },
];

// 데이터 행
const rows = [
  // { id: 0, robot_id: ${robot_id}, robot_name: "에이봇_0", completed_tasks: 45, last_maintenance: 12, robot_status: "이상", robot_is_auto: "자동" }, robot_id와 id를 반드시 분리시켜야?
  { id: 1, robot_id: "5001", robot_name: "에이봇_1", completed_tasks: 34, last_maintenance: 24, robot_status: "작업 중", robot_is_auto: "자동" },
  { id: 2, robot_id: "5002", robot_name: "에이봇_2", completed_tasks: 56, last_maintenance: 56, robot_status: "대기 중", robot_is_auto: "수동" },
  { id: 3, robot_id: "5003", robot_name: "비봇_1", completed_tasks: 12, last_maintenance: 72, robot_status: "이상", robot_is_auto: "자동" },
  { id: 4, robot_id: "5004", robot_name: "비봇_2", completed_tasks: 47, last_maintenance: 14, robot_status: "작업 중", robot_is_auto: "수동" },
  { id: 5, robot_id: "5005", robot_name: "에이봇_3", completed_tasks: 23, last_maintenance: 34, robot_status: "대기 중", robot_is_auto: "자동" },
  { id: 6, robot_id: "5006", robot_name: "씨봇_1", completed_tasks: 19, last_maintenance: 44, robot_status: "이상", robot_is_auto: "수동" },
];

// 페이지네이션 설정
const paginationModel = { page: 0, pageSize: 5 };

export default function DataTable() {
  return (
    <Card
      sx={{
        width: "90%", // 반응형으로 화면 너비를 90%로 설정
        margin: "20px auto",
        boxShadow: 3,
      }}
    >
      <CardContent>
        {/* 가로 스크롤 가능하도록 설정 */}
        <div style={{ width: "100%", overflowX: "auto" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            autoHeight // 데이터 길이에 따라 높이를 자동 조정
            initialState={{
              pagination: {
                paginationModel,
              },
            }}
            pageSizeOptions={[5, 10]}
            rowHeight={42} // 각 행의 높이
            sx={{
              minWidth: "600px", // 가로 스크롤이 발생하도록 최소 너비 설정
              border: 0,
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
        </div>
      </CardContent>
    </Card>
  );
}
