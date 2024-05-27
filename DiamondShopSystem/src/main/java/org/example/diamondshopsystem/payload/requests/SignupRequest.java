package org.example.diamondshopsystem.payload.requests;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SignupRequest {
    private String name;
    private String password;
    private String phoneNumber;
    private String email;
    private String address;
    private String role ="customer";
    private boolean status = true;
}
