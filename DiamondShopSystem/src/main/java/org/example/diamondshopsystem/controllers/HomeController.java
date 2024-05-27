package org.example.diamondshopsystem.controllers;

import org.example.diamondshopsystem.payload.ResponseData;
import org.example.diamondshopsystem.services.FileService;
import org.example.diamondshopsystem.services.imp.FileServiceImp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/homesther")
public class HomeController {
    @Autowired
    FileService fileService;

    @PostMapping()
    public ResponseEntity<?> upLoadHome(@RequestParam MultipartFile file) {
        ResponseData responseData = new ResponseData();
        boolean isSuccess = fileService.saveFile(file);
        responseData.setData(isSuccess);

        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }
}
