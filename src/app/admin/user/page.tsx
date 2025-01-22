'use client'; // 클라이언트 컴포넌트로 설정

import * as React from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { purple } from '@mui/material/colors';
import Box from '@mui/material/Box';    
import { useRouter } from 'next/navigation';
import Brightness5Icon from '@mui/icons-material/Brightness5';
import CloudIcon from '@mui/icons-material/Cloud';
import AcUnitIcon from '@mui/icons-material/AcUnit';

// styled 함수는 클라이언트에서만 실행되어야 함
const LargeButton = styled(Button)(({ theme }) => ({
  color: theme.palette.getContrastText(purple[500]),
  backgroundColor: purple[500],
  fontSize: '24px',
  padding: '16px 32px',
  borderRadius: '8px',
  width: '50%',
  '&:hover': {
    backgroundColor: purple[700],
  },
}));

export default function UserPage() {
  const router = useRouter();
  const [weather, setWeather] = React.useState<any>(null);

  React.useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch('/api/climate');
        const data = await response.json();
        setWeather(data.public_data.current);
      } catch (error) {
        console.error('날씨 데이터를 불러오는 중 오류 발생:', error);
      }
    };

    fetchWeather();
  }, []);

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'sunny':
        return <Brightness5Icon style={{ fontSize: 48, color: '#FFD700' }} />;
      case 'cloudy':
        return <CloudIcon style={{ fontSize: 48, color: '#B0C4DE' }} />;
      case 'snow':
        return <AcUnitIcon style={{ fontSize: 48, color: '#ADD8E6' }} />;
      default:
        return <Brightness5Icon style={{ fontSize: 48, color: '#FFD700' }} />; // 기본 아이콘
    }
  };

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
      {weather && (
        <Box sx={{ position: 'absolute', top: '-24px', right: '-24px' }}>
          {getWeatherIcon(weather.condition.text)}
        </Box>
      )}     
        <Stack direction="column" spacing={3} justifyContent="center" alignItems="center">
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '16px', textAlign: 'center' }}>물품 보관 서비스입니다.</h1>
          <Stack direction="row" spacing={2} justifyContent="center">
            <LargeButton variant="contained" onClick={() => handleNavigate('/contain')}>물품 보관</LargeButton>
            <LargeButton variant="contained" onClick={() => handleNavigate('/retrieve')}>물품 회수</LargeButton>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
}
