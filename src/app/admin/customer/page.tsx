import * as React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

const columns: GridColDef[] = [
  {
    field: "phone",
    headerName: "연락처",
    width: 130, // 기본 열 너비
    align: "center",
    headerAlign: "center",
  },
  {
    field: "playtime",
    headerName: "이용시간",
    type: "number",
    width: 120, // 기본 열 너비
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
  { id: 1, phone: "010-0000-0000", playtime: 24, count: 4 },
  { id: 2, phone: "010-1234-5678", playtime: 22, count: 3 },
  { id: 3, phone: "010-2345-6789", playtime: 30, count: 5 },
  { id: 4, phone: "010-3456-7890", playtime: 18, count: 4 },
  { id: 5, phone: "010-4567-8901", playtime: 26, count: 3.5 },
  { id: 6, phone: "010-5678-9012", playtime: 20, count: 4.2 },
  { id: 7, phone: "010-6789-0123", playtime: 28, count: 3.8 },
  { id: 8, phone: "010-4569-0124", playtime: 28, count: 3.8 },
  { id: 9, phone: "010-2789-5523", playtime: 28, count: 3.8 },
  { id: 10, phone: "010-6734-0177", playtime: 28, count: 3.8 },
  { id: 11, phone: "010-5252-0177", playtime: 28, count: 3.8 },
];

export default function DataTable() {
  return (
    <Card sx={{ width: "90%", margin: "20px auto", boxShadow: 3 }}>
      <CardContent>
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
      </CardContent>
    </Card>
  );
}
