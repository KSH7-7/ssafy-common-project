"use client";

import * as React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';

import Link from 'next/link';

// columns 수정
const columns: GridColDef[] = [
  { field: 'robot_id', headerName: '로봇식별자', width: 130 },
  {
    field: 'robot_name',
    headerName: '로봇명',
    width: 130,
    renderCell: (params) => (
      <Link href={`/control/${params.row.robot_id}`} style={{ color: 'blue', textDecoration: 'underline' }}>
        {params.value}
      </Link>
    ),
  },
  { field: 'completed_tasks', headerName: '완료된 작업 수', width: 200 },
  {
    field: 'last_maintenance',
    headerName: '마지막 유지보수 시간',
    type: 'number',
    width: 160,
  },
  {
    field: 'robot_status',
    headerName: '상태',
    type: 'string',
    width: 100,
  },
  {
    field: 'robot_is_auto',
    headerName: '로봇 모드',
    type: 'string',
    width: 120,
  },
];


const rows = [
  { id: 1, robot_id: 'ef92la211p3', robot_name: '에이봇_1', completed_tasks: 34, last_maintenance: 24, robot_status: '작업 중', robot_is_auto: '자동' },
  { id: 2, robot_id: 'ef5628117p1', robot_name: '에이봇_2', completed_tasks: 56, last_maintenance: 56, robot_status: '대기 중', robot_is_auto: '수동' },
  { id: 3, robot_id: 'ef789op4213', robot_name: '비봇_1', completed_tasks: 12, last_maintenance: 72, robot_status: '이상', robot_is_auto: '자동' },
  { id: 4, robot_id: 'ef3467891p9', robot_name: '비봇_2', completed_tasks: 47, last_maintenance: 14, robot_status: '작업 중', robot_is_auto: '수동' },
  { id: 5, robot_id: 'ef4123478p0', robot_name: '에이봇_3', completed_tasks: 23, last_maintenance: 34, robot_status: '대기 중', robot_is_auto: '자동' },
  { id: 6, robot_id: 'ef9012456p7', robot_name: '씨봇_1', completed_tasks: 19, last_maintenance: 44, robot_status: '이상', robot_is_auto: '수동' },
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
