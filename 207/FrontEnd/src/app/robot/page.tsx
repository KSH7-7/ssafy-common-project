'use client';

import { useState } from 'react';
import Button from '@mui/material/Button';
import OpacityIcon from '@mui/icons-material/Opacity';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';

export default function Home() {
  const [humidityData, setHumidityData] = useState<any>(null);
  const [error, setError] = useState('');

  const fetchHumidity = async () => {
    try {
      const response = await fetch('/api/climate');
      if (!response.ok) throw new Error('Failed to fetch humidity data');
      const data = await response.json();
      setHumidityData(data); // JSON 데이터 전체 저장
      setError('');
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '10px' }}>
        <Card sx={{ maxWidth: 345 }}>
          <CardMedia
            component="img"
            alt="green iguana"
            height="140"
            image="/static/images/cards/contemplative-reptile.jpg"
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              Humidity Data
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Press the button below to fetch and display all humidity-related data from the server.
            </Typography>
          </CardContent>
          <CardActions>
            <Button onClick={fetchHumidity} variant="contained" startIcon={<OpacityIcon />}>
              습도 갱신
            </Button>
          </CardActions>
        </Card>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {humidityData && (
        <pre style={{ backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '5px', overflowX: 'auto' }}>
          {JSON.stringify(humidityData, null, 2)}
        </pre>
      )}
    </div>
  );
}
