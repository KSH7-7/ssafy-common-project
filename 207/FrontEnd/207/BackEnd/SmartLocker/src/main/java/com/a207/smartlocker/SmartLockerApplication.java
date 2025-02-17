package com.a207.smartlocker;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class SmartLockerApplication {

	public static void main(String[] args) {
		SpringApplication.run(SmartLockerApplication.class, args);

		System.out.println("실행 완료");
	}

}
