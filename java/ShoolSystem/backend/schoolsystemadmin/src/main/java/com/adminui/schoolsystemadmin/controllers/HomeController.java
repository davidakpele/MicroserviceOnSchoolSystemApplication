package com.adminui.schoolsystemadmin.controllers;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;


@RestController
public class HomeController {
    
    @GetMapping("/v1/home")
    public String getMethodName() {
        return "Welcome to the School System Admin API";
    }
    
}
