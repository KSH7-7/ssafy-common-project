from threading import Timer as ThreadTimer
import time

class Timer:
    def __init__(self, interval, function):
        self.interval = interval
        self.function = function
        self.timer = None
        self.is_running = False
        self.last_run = 0

    def start(self):
        if not self.is_running:
            self.is_running = True
            self.last_run = time.time()
            self.run()

    def stop(self):
        if self.timer:
            self.timer.cancel()
        self.is_running = False

    def run(self):
        if not self.is_running:
            return
            
        current_time = time.time()
        elapsed = current_time - self.last_run
        
        if elapsed >= self.interval:
            self.function()  # 실제 작업 실행
            self.last_run = current_time
            
        # 다음 실행 시간 계산
        next_run = max(0, self.interval - (time.time() - self.last_run))
        self.timer = ThreadTimer(next_run, self.run)
        self.timer.start()