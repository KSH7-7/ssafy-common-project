'use client'; // 클라이언트 컴포넌트로 설정

import * as React from 'react';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';

export default function UsernameFormPage() {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
      }}
    >
      <Paper elevation={3} sx={{ padding: '32px', maxWidth: '400px', width: '100%', borderRadius: '10px' }}>
        <Stack spacing={3} justifyContent="center" alignItems="center">
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', textAlign: 'center', marginBottom: '16px' }}>
            물품 보관
          </h1>
          <div style={{ width: '100%' }}>
            <label htmlFor="username" className="block text-sm/6 font-medium text-gray-900">
              이름
            </label>
            <div className="mt-2">
              <div className="flex items-center rounded-md bg-white pl-3 outline outline-1 -outline-offset-1 outline-gray-300 focus-within:outline focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                <input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="홍길동"
                  className="block min-w-0 grow py-1.5 pl-1 pr-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-0 sm:text-sm/6"
                />
              </div>
            </div>
          </div>
          <div style={{ width: '100%' }}>
            <label htmlFor="phonenumber" className="block text-sm/6 font-medium text-gray-900">
              휴대전화 번호
            </label>
            <div className="mt-2">
              <div className="flex items-center rounded-md bg-white pl-3 outline outline-1 -outline-offset-1 outline-gray-300 focus-within:outline focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                <div className="shrink-0 select-none text-base text-gray-500 sm:text-sm/6">010</div>
                <input
                  id="phonenumber"
                  name="phonenumber"
                  type="text"
                  placeholder="12345678"
                  className="block min-w-0 grow py-1.5 pl-1 pr-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-0 sm:text-sm/6"
                />
              </div>
            </div>
          </div>
          <div className="mt-6 flex items-center justify-end gap-x-6">
        <button type="button" className="text-sm/6 font-semibold text-gray-900">
          돌아가기
        </button>
        <button
          type="submit"
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          접수
        </button>
      </div>
        </Stack>
      </Paper>
    </Box>
  );
}
