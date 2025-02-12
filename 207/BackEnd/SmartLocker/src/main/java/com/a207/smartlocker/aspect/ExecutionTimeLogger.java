//package com.a207.smartlocker.aspect;
//
//import org.aspectj.lang.ProceedingJoinPoint;
//import org.aspectj.lang.annotation.Around;
//import org.aspectj.lang.annotation.Aspect;
//import org.springframework.stereotype.Component;
//
//@Aspect // AOP 클래스 지정
//@Component // Spring 빈으로 자동 등록
//public class ExecutionTimeLogger {
//
//    @Around("execution(* com.a207.smartlocker.controller..*(..))") // 컨트롤러 메서드 전체 적용
//    public Object logExecutionTime(ProceedingJoinPoint joinPoint) throws Throwable {
//        long start = System.currentTimeMillis();
//
//        Object result = joinPoint.proceed(); // 실제 메서드 실행
//
//        long executionTime = System.currentTimeMillis() - start;
//        System.out.println(joinPoint.getSignature() + " 실행 시간: " + executionTime + "ms");
//
//        return result;
//    }
//}
