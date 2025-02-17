"use client";

import * as React from "react";
import { useState } from "react";
import { DataGrid, GridColDef, GridSortModel } from "@mui/x-data-grid";
import { Card, Grid, Pagination, Box, TextField } from "@mui/material";

// API로부터 받아오는 고객 사용량 데이터의 타입
interface UserUsageApi {
  phoneNumber: string;
  usageCount: number;
}

// DataGrid에 사용할 행 데이터의 타입
interface UserUsageRow {
  id: number;
  phone_number: string;
  playtime: string;
  count: number;
}

// DataGrid 열 정의
const columns: GridColDef[] = [
  {
    field: "phone_number",
    headerName: "연락처",
    width: 150,
    minWidth: 150,
    maxWidth: 150,
    align: "center",
    headerAlign: "center",
    disableColumnMenu: true,
  },
  {
    field: "count",
    headerName: "이용횟수",
    type: "number",
    width: 150,
    minWidth: 150,
    maxWidth: 150,
    align: "center",
    headerAlign: "center",
    disableColumnMenu: true,
  },
];

export default function UserUsageTable() {
  const [rows, setRows] = useState<UserUsageRow[]>([]);
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [inputPage, setInputPage] = useState("");
  const pageSize = 30;

  React.useEffect(() => {
    async function fetchUserUsage() {
      try {
        const response = await fetch("/api/user-usage");
        if (!response.ok) {
          throw new Error("네트워크 응답이 올바르지 않습니다.");
        }
        const data = (await response.json()) as UserUsageApi[];
        const mappedRows: UserUsageRow[] = data.map((user: UserUsageApi, index: number) => ({
          id: index + 1,
          phone_number: user.phoneNumber,
          playtime: "N/A",
          count: user.usageCount,
        }));
        setRows(mappedRows);
      } catch (error) {
        console.error("고객 데이터를 불러오는 중 오류 발생:", error);
      }
    }
    fetchUserUsage();
  }, []);

  const sortedRows = React.useMemo(() => {
    const processedRows = [...rows];

    if (sortModel.length > 0) {
      const sort = sortModel[0];
      processedRows.sort((a, b) => {
        const valueA = a[sort.field as keyof UserUsageRow];
        const valueB = b[sort.field as keyof UserUsageRow];

        if (typeof valueA === "number" && typeof valueB === "number") {
          return sort.sort === "asc" ? valueA - valueB : valueB - valueA;
        }
        if (typeof valueA === "string" && typeof valueB === "string") {
          return sort.sort === "asc" ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
        }
        return 0;
      });
    }

    return processedRows;
  }, [rows, sortModel]);

  const paginatedRows = sortedRows.slice(currentPage * pageSize, (currentPage + 1) * pageSize);

  const chunkSize = 10;
  const splitRows = [
    paginatedRows.slice(0, chunkSize),
    paginatedRows.slice(chunkSize, chunkSize * 2),
    paginatedRows.slice(chunkSize * 2, chunkSize * 3),
  ];

  const totalPages = Math.ceil(rows.length / pageSize);

  const handlePageInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputPage(event.target.value);
  };

  const handlePageInputSubmit = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      const pageNum = parseInt(inputPage, 10);
      if (!isNaN(pageNum) && pageNum > 0 && pageNum <= totalPages) {
        setCurrentPage(pageNum - 1);
      }
      setInputPage("");
    }
  };

  return (
    
    <Card sx={{ width: "70%", margin: "20px auto", boxShadow: 3, padding: 2 }}>
      {/* 페이지 입력 필드 (페이지네이션 위쪽) */}
      <Box display="flex" justifyContent="center" alignItems="center" mt={1} mb={2}>
        <TextField
          size="small"
          label={currentPage + 1} 
          variant="outlined"
          value={inputPage}
          onChange={handlePageInputChange}
          onKeyDown={handlePageInputSubmit}
          sx={{ width: 75, textAlign: "center", "& .MuiOutlinedInput-root": { textAlign: "center" } }}
        />
      </Box>
      <Grid container spacing={1} sx={{ display: "flex", justifyContent: "center" }}> 
        {splitRows.map((rowChunk, index) => (
          <Grid item key={index} sx={{ display: "flex", justifyContent: "center", width: "auto" }}>
            <Box sx={{ width: 300 }}> 
              <DataGrid
                rows={rowChunk}
                columns={columns}
                autoHeight
                rowHeight={48}
                sortModel={sortModel}
                onSortModelChange={(model) => setSortModel(model)}
                paginationMode="client"
                hideFooter={true}
                sx={{
                  width: 301.5,
                  maxWidth: 301.5,
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
          </Grid>
        ))}
      </Grid>
      {/* 페이지네이션 */}
      <Box display="flex" justifyContent="center" alignItems="center" mt={1}>
        <Pagination
          count={totalPages}
          page={currentPage + 1}
          onChange={(_, page) => setCurrentPage(page - 1)}
          color="primary"
        />
      </Box>
    </Card>
  );
}
