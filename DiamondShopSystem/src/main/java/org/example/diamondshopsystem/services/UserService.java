package org.example.diamondshopsystem.services;

import org.example.diamondshopsystem.dto.UserDTO;
import org.example.diamondshopsystem.entities.User;
import org.example.diamondshopsystem.repositories.UserRepository;
import org.example.diamondshopsystem.services.imp.UserServiceImp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class UserService implements UserServiceImp {

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder passwordEncoder;
    @Override
    public List<UserDTO> getAllUsers() {
        List<User> listUser =userRepository.findAll();
        List<UserDTO> userDTOList = new ArrayList<>();
        for (User user : listUser) {
            UserDTO userDTO = mapUserToDTO(user);
            userDTOList.add(userDTO);
        }
        return userDTOList;
    }

    @Override
    public UserDTO getUserById(int id) {
        Optional<User> userOptional = userRepository.findById(id);
        if(userOptional.isPresent()) {
            User user = userOptional.get();
             return mapUserToDTO(user);
        }
        return null;
    }

    @Override
    public UserDTO createUser(UserDTO userDTO) {
        User user = mapUserDTOToUser(userDTO);
        // Mã hóa mật khẩu trước khi lưu
        String encodedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(encodedPassword);
        User savedUser = userRepository.save(user);
        return mapUserToDTO(savedUser);
    }

    @Override
    public UserDTO updateUser(int id, UserDTO userDTO) {
        Optional<User> optionalUser = userRepository.findById(id);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            mapUserDTOtoUser(userDTO, user);
            // Kiểm tra null trước khi so sánh mật khẩu
            if (userDTO.getPassword() != null && !userDTO.getPassword().equals(user.getPassword())) {
                String encodedPassword = passwordEncoder.encode(userDTO.getPassword());
                user.setPassword(encodedPassword);
            }
            User updatedUser = userRepository.save(user);
            return mapUserToDTO(updatedUser);
        }
        return null;
    }

    @Override
    public void deleteUser(int id) {
        Optional<User> optionalUser = userRepository.findById(id);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            user.setStatus(false); // Set trạng thái người dùng thành false (không hoạt động)
            userRepository.save(user); // Lưu thay đổi trạng thái vào cơ sở dữ liệu
        }

    }
    private UserDTO mapUserToDTO(User user) {
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
        return userDTO;
    }
    private User mapUserDTOToUser(UserDTO userDTO) {
        User user = new User();
        user.setName(userDTO.getName());
        user.setPassword(userDTO.getPassword());
        user.setPhoneNumber(userDTO.getPhoneNumber());
        user.setEmail(userDTO.getEmail());
        user.setAddress(userDTO.getAddress());
        user.setAccumulatedPoints(userDTO.getAccumulatedPoints());
        user.setRole(userDTO.getRole());
        user.setStatus(userDTO.isStatus());
        return user;
    }
    private void mapUserDTOtoUser(UserDTO userDTO, User user) {
        user.setName(userDTO.getName());
        user.setPassword(userDTO.getPassword());
        user.setPhoneNumber(userDTO.getPhoneNumber());
        user.setEmail(userDTO.getEmail());
        user.setAddress(userDTO.getAddress());
        user.setAccumulatedPoints(userDTO.getAccumulatedPoints());
        user.setRole(userDTO.getRole());
        user.setStatus(userDTO.isStatus());
    }

}
