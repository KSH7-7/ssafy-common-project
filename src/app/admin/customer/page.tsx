import * as React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Card from "@mui/material/Card";

const columns: GridColDef[] = [

  {
    field: "user_id",
    headerName: "아이디",
    width: 100, // 기본 열 너비
    align: "center",
    headerAlign: "center",
  },
  {
    field: "phone_number",
    headerName: "연락처",
    width: 130, // 기본 열 너비
    align: "center",
    headerAlign: "center",
  },
  {
    field: "count",
    headerName: "이용횟수",
    type: "number",
    width: 150, // 기본 열 너비
    align: "center",
    headerAlign: "center",
  },
];

const rows = [

  { id: 1, user_id: 1, phone_number: "010-0000-0000", count: 4 },
  { id: 2, user_id: 2, phone_number: "010-1234-5678", count: 3 },
  { id: 3, user_id: 3, phone_number: "010-2345-6789", count: 5 },
  { id: 4, user_id: 4, phone_number: "010-3456-7890", count: 4 },
  { id: 5, user_id: 5, phone_number: "010-4567-8901", count: 3.5 },
  { id: 6, user_id: 6, phone_number: "010-5678-9012", count: 4.2 },
  { id: 7, user_id: 7, phone_number: "010-6789-0123", count: 3.8 },
  { id: 8, user_id: 8, phone_number: "010-4569-0124", count: 3.8 },
  { id: 9, user_id: 9, phone_number: "010-2789-5523", count: 3.8 },
  { id: 10, user_id: 10, phone_number: "010-6734-0177", count: 3.8 },
  { id: 11, user_id: 11, phone_number: "010-5252-0177", count: 3.8 },

];

export default function DataTable() {
  return (
    <Card sx={{ width: "60%", margin: "20px auto", boxShadow: 3 }}>
        <div
          style={{
            width: "100%",
            overflowX: "auto", // 가로 스크롤 활성화
          }}
        >
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
              minWidth: "500px", // 최소 너비 설정
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
