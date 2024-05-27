package org.example.diamondshopsystem.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter

public class UserDTO {
    private int userid;
    private String name;
    private String password;
    private String phoneNumber;
    private String email;
    private String address;
    private int accumulatedPoints;
    private String role;
    private boolean status;

    private String verificationCode;
    private LocalDateTime expirationTime;
}
