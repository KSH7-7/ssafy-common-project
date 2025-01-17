import React, { useState } from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

export default function Dropdown() {
  const [city, setCity] = useState('');
  const [climateData, setClimateData] = useState<{ temp_c: number; icon: string } | null>(null);
  const [error, setError] = useState('');

  const handleChange = async (event: SelectChangeEvent) => {
    const selectedCity = event.target.value;
    setCity(selectedCity);

    const fetchClimate = async () => {
      try {
        const response = await fetch(`http://70.12.246.128:8000/climate?city=${selectedCity}`);
        if (!response.ok) throw new Error('Failed to fetch climate data');
        
        const data = await response.json();
        // 필요한 데이터만 추출
        const { temp_c, condition } = data.public_data.current;
        setClimateData({ temp_c, icon: condition.icon });
        setError('');
      } catch (err) {
        setError((err as Error).message);
        setClimateData(null); // 에러 발생 시 데이터 초기화
      }
    };

    await fetchClimate();
  };

  return (
    <div>
      <FormControl sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="dropdown-label">City</InputLabel>
        <Select
          labelId="dropdown-label"
          id="dropdown"
          value={city}
          onChange={handleChange}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value="Seoul">서울</MenuItem>
          <MenuItem value="Beijing">베이징</MenuItem>
          <MenuItem value="Paris">파리</MenuItem>
          <MenuItem value="London">런던</MenuItem>
        </Select>
      </FormControl>

      {/* 데이터 출력 */}
      {error && <p style={{ color: 'purple' }}>Error: {error}</p>}
      {climateData ? (
        <div>
          <p>Temperature: {climateData.temp_c}°C</p>
          <img
            src={`https:${climateData.icon}`}
            alt="Weather Condition"
            style={{ width: 50, height: 50 }}
          />
        </div>
      ) : (
        !error && city && <p>날씨 확인 중......</p>
      )}
    </div>
  );
}
