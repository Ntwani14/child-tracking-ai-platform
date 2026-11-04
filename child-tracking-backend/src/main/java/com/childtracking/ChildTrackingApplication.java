package com.childtracking;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class ChildTrackingApplication {
    public static void main(String[] args) {
        SpringApplication.run(ChildTrackingApplication.class, args);
    }
}
