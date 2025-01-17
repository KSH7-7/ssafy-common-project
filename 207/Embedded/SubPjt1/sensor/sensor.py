import json
import time
from RPLCD.i2c import CharLCD

class SensorManager:

    lcd = CharLCD('PCF8574', 0x27, port=1)
    lcd.clear()

    def lcd_write(self, text, line, offset):
        
        self.lcd.cursor_pos = (line, offset)
        self.lcd.write_string(text)

    def get_sensor_data(self, data):
        #print(data)
        self.lcd.clear()
        self.lcd_write(data['location']['name'], 0, 0)
        self.lcd_write(str(data['current']['temp_c']), 0, len(data['location']['name']) + 1 )
        self.lcd_write(data['current']['condition']['text'], 1, 0)
        return 1
