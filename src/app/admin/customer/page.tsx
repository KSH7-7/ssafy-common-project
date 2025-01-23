import * as React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

const columns: GridColDef[] = [
  { 
    field: "phone", 
    headerName: "연락처", 
    width: 130, 
    align: "center", 
    headerAlign: "center"   
  },
  { 
    field: "playtime", 
    headerName: "이용시간",
    type: "number",
    width: 90,
    align: "center", 
    headerAlign: "center" 
  },
  {
    field: "count",
    headerName: "이용횟수",
    type: "number",
    width: 100,
    align: "center", 
    headerAlign: "center" 
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

const paginationModel = { page: 0, pageSize: 10 };

export default function DataTable() {
  return (
    <Card sx={{ width: "50%", margin: "20px auto", boxShadow: 3}}>
      <CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        {/* <Typography variant="h6" component="div" sx={{ marginBottom: 2 }}>
          사용자 데이터
        </Typography> */}
        <Paper sx={{ height: "60%", width: "60%", justifyContent: "center" ,justifyItems: "center"}}>
          <DataGrid
            rows={rows}
            columns={columns}
            initialState={{ pagination: { paginationModel } }}
            pageSizeOptions={[10, 20]}
            rowHeight={42} // 각 행의 높이 (기본값: 52)
            sx={{
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
        </Paper>
      </CardContent>
    </Card>
  );
}
