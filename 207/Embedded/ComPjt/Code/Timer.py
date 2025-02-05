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
        self.is_running = False 
        if self.timer:
            self.timer.cancel()
            self.timer = None

    def run(self):
        if not self.is_running:
            return
            
        try:
            current_time = time.time()
            elapsed = current_time - self.last_run
            
            if elapsed >= self.interval:
                self.function()  # 실제 작업 실행
                self.last_run = current_time
                
            # is_running이 여전히 True인 경우에만 다음 타이머 설정
            if self.is_running:
                next_run = max(0, self.interval - (time.time() - self.last_run))
                self.timer = ThreadTimer(next_run, self.run)
                self.timer.start()
        except:
            self.stop() 