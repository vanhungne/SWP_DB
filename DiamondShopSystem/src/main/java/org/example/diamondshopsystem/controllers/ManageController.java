package org.example.diamondshopsystem.controllers;


import org.example.diamondshopsystem.dto.UserDTO;
import org.example.diamondshopsystem.services.imp.UserServiceImp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/manage")
@CrossOrigin(origins = "*")
public class ManageController {

    @Autowired
    UserServiceImp userServiceImp;
    @GetMapping("/accounts")
    public ResponseEntity<List<UserDTO>> getAllUser() {
        List<UserDTO> users = userServiceImp.getAllUsers();
        return new ResponseEntity<>(users, HttpStatus.OK);
    }


    @GetMapping("/accounts/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable int id) {
        UserDTO user = userServiceImp.getUserById(id);
        if(user != null) {
            return new ResponseEntity<>(user, HttpStatus.OK);
        }else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    @PostMapping("/accounts")
    public ResponseEntity<UserDTO> createUser(@RequestBody UserDTO user) {
        UserDTO createdUser = userServiceImp.createUser(user);
        return new ResponseEntity<>(createdUser, HttpStatus.CREATED);
    }

    @PutMapping("accounts/{id}")
    public ResponseEntity<UserDTO> updateUser(@PathVariable int id, @RequestBody UserDTO user) {
        UserDTO updatedUser = userServiceImp.updateUser(id, user);
        if(updatedUser != null) {
            return new ResponseEntity<>(updatedUser, HttpStatus.OK);
        }else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/accounts/{id}")
    public ResponseEntity<UserDTO> deleteUser(@PathVariable int id) {
        userServiceImp.deleteUser(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
