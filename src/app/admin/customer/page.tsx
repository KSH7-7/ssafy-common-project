"use client";

import * as React from "react";
import { useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Card from "@mui/material/Card";

// API로부터 받아오는 고객 사용량 데이터의 타입
interface UserUsageApi {
  phoneNumber: string;
  usageCount: number;
}

// DataGrid에 사용할 행 데이터의 타입
interface UserUsageRow {
  id: number; // DataGrid에서 필요한 고유 id
  phone_number: string;
  playtime: string; // API에 해당 정보가 없으므로 기본값 처리
  count: number;
}

// DataGrid 열 정의
const columns: GridColDef[] = [
  {

    field: "userId",
    headerName: "고객ID",
    width: 130,

    align: "center",
    headerAlign: "center",
  },
  {
    field: "phone_number",
    headerName: "연락처",
    width: 130,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "count",
    headerName: "이용횟수",
    type: "number",
    width: 150,
    align: "center",
    headerAlign: "center",
  },
];

export default function UserUsageTable() {
  // 구체적인 타입으로 상태 변수 선언
  const [rows, setRows] = useState<UserUsageRow[]>([]);

  React.useEffect(() => {
    async function fetchUserUsage() {
      try {
        const response = await fetch("./api/user-usage");
        if (!response.ok) {
          throw new Error("네트워크 응답이 올바르지 않습니다.");
        }
        // API 응답을 UserUsageApi[] 타입으로 가정
        const data = (await response.json()) as UserUsageApi[];
        const mappedRows: UserUsageRow[] = data.map((user: UserUsageApi, index: number) => ({
          id: index + 1, // DataGrid에서 사용하는 고유 id
          phone_number: user.phoneNumber,
          playtime: "N/A", // API에 해당 값이 없으므로 기본값 처리
          count: user.usageCount,
        }));
        setRows(mappedRows);
      } catch (error) {
        console.error("고객 데이터를 불러오는 중 오류 발생:", error);
      }
    }
    fetchUserUsage();
  }, []);


  return (
    <Card sx={{ width: "60%", margin: "20px auto", boxShadow: 3 }}>
      <div style={{ width: "100%", overflowX: "auto" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          autoHeight
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          pageSizeOptions={[10, 20]}
          sx={{
            minWidth: "500px",
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
    </Card>
  );
}
