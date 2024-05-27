package org.example.diamondshopsystem.services;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.example.diamondshopsystem.dto.UserDTO;
import org.example.diamondshopsystem.entities.User;
import org.example.diamondshopsystem.payload.requests.SignupRequest;
import org.example.diamondshopsystem.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

@Service
public class RegistrationService {


    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private final Map<String, UserDTO> temporaryUserStorage = new ConcurrentHashMap<>();
    public void sendVerificationCode(SignupRequest signupRequest) throws MessagingException {
        String verificationCode = generateVerificationCode();

        UserDTO userDTO = new UserDTO();
        userDTO.setEmail(signupRequest.getEmail());
        userDTO.setPassword(signupRequest.getPassword());
        userDTO.setName(signupRequest.getName());
        userDTO.setPhoneNumber(signupRequest.getPhoneNumber());
        userDTO.setAddress(signupRequest.getAddress());
        userDTO.setRole(signupRequest.getRole());

        userDTO.setVerificationCode(verificationCode);
        userDTO.setExpirationTime(LocalDateTime.now().plusMinutes(15));

        // Store UserDTO in temporary storage
        temporaryUserStorage.put(userDTO.getEmail(), userDTO);

        sendVerificationCodeToEmail(signupRequest.getEmail(), verificationCode);
    }
    public boolean verifyRegistration(String email, String verificationCode) {
        UserDTO userDTO = getUserDTOByEmail(email);

        if (userDTO == null || userDTO.getExpirationTime().isBefore(LocalDateTime.now())
                || !userDTO.getVerificationCode().equals(verificationCode)) {
            return false;
        }

        // Register the new user
        User user = new User();
        user.setEmail(userDTO.getEmail());
        user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        user.setName(userDTO.getName());
        user.setPhoneNumber(userDTO.getPhoneNumber());
        user.setAddress(userDTO.getAddress());
        user.setAccumulatedPoints(userDTO.getAccumulatedPoints());
        user.setRole(userDTO.getRole());
        user.setStatus(userDTO.isStatus());
        userRepository.save(user);

        // Remove UserDTO from temporary storage
        temporaryUserStorage.remove(email);

        return true;
    }


    private String generateVerificationCode() {
        return UUID.randomUUID().toString().substring(0, 6).toUpperCase();
    }
    public void sendVerificationCodeToEmail(String email, String verificationCode) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        helper.setTo(email);
        helper.setSubject("Verification Code");

        // Load the HTML template
        String htmlTemplate = readHtmlTemplate("sendEmail.html");

        // Replace the verification code placeholder with the actual code
        String emailContent = htmlTemplate.replace("${verificationCode}", verificationCode);

        helper.setText(emailContent, true); // true for HTML content

        mailSender.send(message);
    }
    private String readHtmlTemplate(String templateName) {
        try {
            return new String(this.getClass().getClassLoader().getResourceAsStream("templates/" + templateName).readAllBytes());
        } catch (IOException e) {
            e.printStackTrace();
            return "";
        }
    }
    private UserDTO getUserDTOByEmail(String email) {
        return temporaryUserStorage.get(email);
    }
    public void sendResetPasswordVerificationCode(String email) throws MessagingException {
        String verificationCode = generateVerificationCode();

        UserDTO userDTO = new UserDTO();
        userDTO.setEmail(email);

        userDTO.setVerificationCode(verificationCode);
        userDTO.setExpirationTime(LocalDateTime.now().plusMinutes(15));

        // Store UserDTO in temporary storage
        temporaryUserStorage.put(userDTO.getEmail(), userDTO);

        sendVerificationCodeToEmail(email, verificationCode);
    }

    public boolean verifyResetPassword(String email, String verificationCode, String password) {
        UserDTO userDTO = getUserDTOByEmail(email);

        if (userDTO == null || userDTO.getExpirationTime().isBefore(LocalDateTime.now())
                || !userDTO.getVerificationCode().equals(verificationCode)) {
            return false;
        }

        // Register the new user
        User user = userRepository.findByEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        userRepository.save(user);

        // Remove UserDTO from temporary storage
        temporaryUserStorage.remove(email);

        return true;
    }
    }