package com.servesync.config;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Component
public class RequestLoggingFilter implements Filter {
    
    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
    
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        String timestamp = LocalDateTime.now().format(formatter);
        String method = httpRequest.getMethod();
        String path = httpRequest.getRequestURI();
        
        System.out.println(timestamp + " - " + method + " " + path);
        
        chain.doFilter(request, response);
    }
}
