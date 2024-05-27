package org.example.diamondshopsystem.services;

import org.example.diamondshopsystem.dto.UserDTO;
import org.example.diamondshopsystem.entities.User;
import org.example.diamondshopsystem.payload.requests.SignupRequest;
import org.example.diamondshopsystem.repositories.UserRepository;
import org.example.diamondshopsystem.services.imp.LoginServiceImp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
@Service
public class LoginService implements LoginServiceImp {
    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Override
     public List<UserDTO> getAllUser(){
         List<User> listUser =userRepository.findAll();
         List<UserDTO> userDTOList = new ArrayList<>();
         for (User user : listUser) {
             UserDTO userDTO = new UserDTO();
             userDTO.setUserid(user.getUserid());
             userDTO.setName(user.getName());
             userDTO.setPassword(user.getPassword());
             userDTO.setPhoneNumber(user.getPhoneNumber());
             userDTO.setEmail(user.getEmail());
             userDTO.setAddress(user.getAddress());
             userDTO.setAccumulatedPoints(user.getAccumulatedPoints());
             userDTO.setRole(user.getRole());
             userDTO.setStatus(user.isStatus());
             System.out.println(user.getName());
             userDTOList.add(userDTO);
         }
         return userDTOList;
     }

    @Override
    public boolean checkLogin(String email, String password) {

       User User = userRepository.findByEmail(email);
     return  passwordEncoder.matches(password, User.getPassword()); //Compare pass giữa mã hóa và pass do người dung nhập vào chưa mã hóa
    }
}
