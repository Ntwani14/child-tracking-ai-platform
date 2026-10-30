package com.childtracking.service;

import com.childtracking.dto.AuthResponse;
import com.childtracking.dto.LoginRequest;
import com.childtracking.dto.RegisterRequest;
import com.childtracking.model.User;
import com.childtracking.repository.UserRepository;
import com.childtracking.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.security.SecureRandom;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final EmailService emailService;
    private static final SecureRandom RANDOM = new SecureRandom();

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtUtil jwtUtil,
                       EmailService emailService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.emailService = emailService;
    }

    public AuthResponse register(RegisterRequest request) {
        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("An account with this email address already exists");
        }

        // Create new user with hashed password
        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole("user");
        user.setLocation(request.getLocation());

        userRepository.save(user);

        // Generate JWT token
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole());

        return new AuthResponse(token, user.getEmail(), user.getFullName(), user.getRole());
    }

    public AuthResponse login(LoginRequest request) {
        // Find user by email
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        // Verify password
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Invalid email or password");
        }

        // Generate JWT token
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole());

        return new AuthResponse(token, user.getEmail(), user.getFullName(), user.getRole());
    }

    /**
     * Generates a 6-digit reset code, stores it with a 15-minute expiry, and emails it.
     * Always behaves the same whether or not the email exists (prevents account enumeration).
     */
    public void forgotPassword(String email) {
        userRepository.findByEmail(email).ifPresent(user -> {
            String code = String.format("%06d", RANDOM.nextInt(1_000_000));
            user.setResetCode(code);
            user.setResetCodeExpiry(LocalDateTime.now().plusMinutes(15));
            user.setResetAttempts(0);
            userRepository.save(user);
            emailService.sendPasswordResetEmail(user, code);
        });
    }

    /**
     * Verifies the reset code and sets a new password if the code is valid and not expired.
     */
    public void resetPassword(String code, String newPassword) {
        User user = userRepository.findByResetCode(code)
                .orElseThrow(() -> new RuntimeException("Invalid or expired reset code"));

        if (user.getResetCodeExpiry() == null || user.getResetCodeExpiry().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("This reset code has expired. Please request a new one.");
        }
        if (newPassword == null || newPassword.length() < 6) {
            throw new RuntimeException("Password must be at least 6 characters long");
        }

        user.setPasswordHash(passwordEncoder.encode(newPassword));
        user.setResetCode(null);
        user.setResetCodeExpiry(null);
        userRepository.save(user);
    }
}