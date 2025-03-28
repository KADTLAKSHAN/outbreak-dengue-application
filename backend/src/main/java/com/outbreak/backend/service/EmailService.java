package com.outbreak.backend.service;

public interface EmailService {
    void sendEmail(String email, String subject, String body);
}
