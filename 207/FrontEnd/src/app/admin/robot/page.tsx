"use client";

import * as React from "react";
import { useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Card from "@mui/material/Card";
import Link from "next/link";

// DataGrid의 열 정의
const columns: GridColDef[] = [
  {
    field: "robot_id",
    headerName: "로봇식별자",
    width: 130,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "robot_name",
    headerName: "로봇명",
    width: 130,
    align: "center",
    headerAlign: "center",
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
    type: "string",
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
];

// API에서 받아오는 로봇 데이터의 타입
interface RobotApi {
  robotId: number;
  robotName: string;
  completedTasks: number;
  lastMaintenance: string;
  robotStatus: string;
}

// DataGrid에 사용할 데이터 행의 타입
interface RobotRow {
  id: number;
  robot_id: number;
  robot_name: string;
  completed_tasks: number;
  last_maintenance: string;
  robot_status: string;
  robot_is_auto: string;
}

export default function DataTable() {
  // 구체적인 타입으로 상태 변수 선언
  const [rows, setRows] = useState<RobotRow[]>([]);

  React.useEffect(() => {
    async function fetchRobots() {
      try {
        const response = await fetch("/api/robots");
        if (!response.ok) {
          throw new Error("네트워크 응답이 올바르지 않습니다.");
        }
        // API 응답을 RobotApi[] 타입으로 가정
        const data = (await response.json()) as RobotApi[];
        const mappedRows = data.map((robot: RobotApi, index: number) => ({
          id: index + 1,
          robot_id: robot.robotId + 5000, // 포트넘버 직접 연결을 위해 5000을 더함
          robot_name: robot.robotName,
          completed_tasks: robot.completedTasks,
          // 날짜를 현지 시간 문자열로 변환
          last_maintenance: new Date(robot.lastMaintenance).toLocaleString(),
          robot_status: robot.robotStatus,
          robot_is_auto: "N/A", // API에 해당 값이 없으므로 기본값 처리
        }));

        setRows(mappedRows);
      } catch (error) {
        console.error("로봇 데이터를 불러오는 중 오류 발생:", error);
      }
    }
    fetchRobots();
  }, []);

  // 페이지네이션 초기 설정
  const paginationModel = { page: 0, pageSize: 5 };

  return (
    <Card
      sx={{
        width: "60%",
        margin: "20px auto",
        boxShadow: 3,
      }}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        autoHeight
        initialState={{
          pagination: {
            paginationModel,
          },
        }}
        pageSizeOptions={[5, 10]}
        rowHeight={42}
        sx={{
          minWidth: "600px",
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
    </Card>
  );
}
