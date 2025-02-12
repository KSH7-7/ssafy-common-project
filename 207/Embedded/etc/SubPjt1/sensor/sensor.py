import json
from time import sleep
from RPLCD.i2c import CharLCD
import RPi.GPIO as GPIO

class SensorManager:

    lcd = CharLCD('PCF8574', 0x27, port=1)
    lcd.clear()
    GPIO.setmode(GPIO.BCM)
    GPIO.setup(17,GPIO.OUT)
    def lcd_write(self, text, line, offset):
        
        self.lcd.cursor_pos = (line, offset)
        self.lcd.write_string(text)

    def led_write(self, value):
        if (value > 0):
            GPIO.output(17, True)
        else:
            GPIO.output(17, False)

    def get_sensor_data(self, data):
        #print(data)
        self.lcd.clear()
        self.lcd_write(data['location']['name'], 0, 0)
        self.lcd_write(str(data['current']['temp_c']), 0, len(data['location']['name']) + 1 )
        self.lcd_write(data['current']['condition']['text'], 1, 0)
        self.led_write(data['current']['precip_mm'])
        
        return 1
