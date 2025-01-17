from server.server import FlaskServer
from sensor.sensor import SensorManager


class Main:
    def __init__(self):
        self.sensor_manager = SensorManager()
        self.server = FlaskServer(sensor_callback=self.sensor_manager.get_sensor_data)
    def run(self):
        print("Starting server...")
        self.server.run()

if __name__ == "__main__":
    app = Main()
    app.run()