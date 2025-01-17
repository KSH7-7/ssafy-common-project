import * as React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';

const columns: GridColDef[] = [
  { field: 'name', headerName: '이름', width: 130 },
  { field: 'phone', headerName: '연락처', width: 130 },
  { field: 'email', headerName: '이메일', width: 200 },
  {
    field: 'playtime',
    headerName: '이용시간',
    type: 'number',
    width: 90,
  },
  {
    field: 'count',
    headerName: '이용횟수',
    type: 'number',
    width: 100,
  },
  {
    field: 'avgcount',
    headerName: '평균이용횟수',
    type: 'number',
    width: 120,
  },
];

const rows = [
  { id: 1, name: '김더미', phone: '010-0000-0000', email: 'samsung@ssafy.com', playtime: 24, count: 4, avgcount: 6.2 },
  { id: 2, name: '신유정', phone: '010-1234-5678', email: 'you@naver.com', playtime: 22, count: 3, avgcount: 5.8 },
  { id: 3, name: '김성현', phone: '010-2345-6789', email: 'kimsh@dummy.com', playtime: 30, count: 5, avgcount: 7.0 },
  { id: 4, name: '김태원', phone: '010-3456-7890', email: 'taewon@dummy.com', playtime: 18, count: 4, avgcount: 6.5 },
  { id: 5, name: '오지원', phone: '010-4567-8901', email: 'ojiwon@dummy.com', playtime: 26, count: 3.5, avgcount: 5.9 },
  { id: 6, name: '이진기', phone: '010-5678-9012', email: 'jinlee@dummy.com', playtime: 20, count: 4.2, avgcount: 6.3 },
  { id: 7, name: '전상혁', phone: '010-6789-0123', email: 'sanghyuk@dummy.com', playtime: 28, count: 3.8, avgcount: 6.7 },
];

const paginationModel = { page: 0, pageSize: 5 };

export default function DataTable() {
  return (
    <Paper sx={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
        sx={{
          border: 0,
          '& .MuiDataGrid-cell': {
            justifyContent: 'center',
            textAlign: 'center',
          },
          '& .MuiDataGrid-columnHeaders': {
            justifyContent: 'center',
            textAlign: 'center',
          },
        }}
      />
    </Paper>
  );
}
