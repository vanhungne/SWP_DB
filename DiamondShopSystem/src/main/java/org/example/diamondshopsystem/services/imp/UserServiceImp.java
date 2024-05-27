package org.example.diamondshopsystem.services.imp;

import org.example.diamondshopsystem.dto.UserDTO;
import org.example.diamondshopsystem.entities.User;

import java.util.List;

public interface UserServiceImp {
    List<UserDTO> getAllUsers();
    UserDTO getUserById(int id);
    UserDTO createUser(UserDTO userDTO);
    UserDTO updateUser(int id, UserDTO userDTO);
    void deleteUser(int id);
 }
